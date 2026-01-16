import { kv } from '@vercel/kv';
import { Project } from '@/types';

const STORAGE_KEY = 'user_projects_data';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await kv.get<Project[]>(STORAGE_KEY);
    return data || [];
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
};

export const saveProjects = async (projects: Project[]): Promise<void> => {
  await kv.set(STORAGE_KEY, projects);
};
