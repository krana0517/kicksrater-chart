import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, country, info } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'kickstarter.csv');
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // 중복 제거: ID 기준으로 중복된 프로젝트 제거 (첫 번째만 유지)
    const uniqueRecords = records.filter((record: any, index: number, self: any[]) => 
      index === self.findIndex((r: any) => r.id === record.id)
    );

    // 정보 요청인 경우 날짜 범위 반환
    if (info === 'dateRange') {
      const timestamps = uniqueRecords
        .map((row: any) => parseInt(row.created_at))
        .filter((t: number) => !isNaN(t));
      
      const minDate = new Date(Math.min(...timestamps) * 1000);
      const maxDate = new Date(Math.max(...timestamps) * 1000);
      
      return res.status(200).json({
        totalProjects: uniqueRecords.length,
        originalProjects: records.length,
        removedDuplicates: records.length - uniqueRecords.length,
        dateRange: {
          earliest: minDate.toISOString(),
          latest: maxDate.toISOString(),
          earliestYear: minDate.getFullYear(),
          latestYear: maxDate.getFullYear(),
          years: maxDate.getFullYear() - minDate.getFullYear() + 1
        }
      });
    }

    let filtered = uniqueRecords;
    if (state) {
      filtered = filtered.filter((row: any) => row.state === state);
    }
    if (country) {
      filtered = filtered.filter((row: any) => row.country === country);
    }
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'CSV 파일을 읽을 수 없습니다.' });
  }
} 