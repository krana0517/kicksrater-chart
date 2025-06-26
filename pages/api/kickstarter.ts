import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { 
    state, 
    country, 
    info, 
    limit = '20', 
    offset = '0',
    search = '',
    sortBy = 'date',
    sortOrder = 'desc',
    category = '',
    id = ''
  } = req.query;
  
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

    // 특정 ID 요청인 경우 해당 프로젝트만 반환
    if (id) {
      const project = uniqueRecords.find((record: any) => record.id.toString() === id.toString());
      if (project) {
        return res.status(200).json(project);
      } else {
        return res.status(404).json({ error: '프로젝트를 찾을 수 없습니다.' });
      }
    }

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

    // 서버에서 필터링 적용
    if (state) {
      filtered = filtered.filter((row: any) => row.state === state);
    }
    if (country) {
      filtered = filtered.filter((row: any) => row.country === country);
    }
    if (search) {
      filtered = filtered.filter((row: any) => 
        row.name && row.name.toLowerCase().includes((search as string).toLowerCase())
      );
    }
    if (category && category !== 'ALL') {
      filtered = filtered.filter((row: any) => {
        try {
          const catObj = JSON.parse(row.category);
          return catObj.parent_name === category;
        } catch {
          return false;
        }
      });
    }

    // 서버에서 정렬 적용
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'date':
          const dateA = parseInt(a.created_at) || 0;
          const dateB = parseInt(b.created_at) || 0;
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        case 'success':
          // 성공한 프로젝트를 우선적으로, 그 다음 날짜순
          if (a.state === 'successful' && b.state !== 'successful') return -1;
          if (a.state !== 'successful' && b.state === 'successful') return 1;
          const dateA2 = parseInt(a.created_at) || 0;
          const dateB2 = parseInt(b.created_at) || 0;
          return sortOrder === 'desc' ? dateB2 - dateA2 : dateA2 - dateB2;
        case 'pledged':
          const pledgedA = parseFloat(a.pledged) || 0;
          const pledgedB = parseFloat(b.pledged) || 0;
          return sortOrder === 'desc' ? pledgedB - pledgedA : pledgedA - pledgedB;
        case 'backers':
          const backersA = parseInt(a.backers_count) || 0;
          const backersB = parseInt(b.backers_count) || 0;
          return sortOrder === 'desc' ? backersB - backersA : backersA - backersB;
        default:
          return 0;
      }
    });

    // 서버 페이징 적용
    const limitNum = parseInt(limit as string) || 20;
    const offsetNum = parseInt(offset as string) || 0;
    const paginatedData = filtered.slice(offsetNum, offsetNum + limitNum);

    // 성능 최적화: 필요한 필드만 선택하여 응답 크기 줄이기
    const optimizedData = paginatedData.map((item: any) => ({
      id: item.id,
      name: item.name,
      blurb: item.blurb,
      state: item.state,
      pledged: item.pledged,
      goal: item.goal,
      backers_count: item.backers_count,
      category: item.category,
      photo: item.photo,
      launched_at: item.launched_at,
      deadline: item.deadline,
      country: item.country,
      created_at: item.created_at
    }));

    res.status(200).json({
      data: optimizedData,
      pagination: {
        currentOffset: offsetNum,
        totalItems: filtered.length,
        itemsPerPage: limitNum,
        hasNextPage: offsetNum + limitNum < filtered.length,
        hasPrevPage: offsetNum > 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'CSV 파일을 읽을 수 없습니다.' });
  }
} 