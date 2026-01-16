import { NextResponse } from 'next/server';
import { getProjects, saveProjects } from '@/lib/db';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  await saveProjects(body);
  return NextResponse.json({ success: true });
}

