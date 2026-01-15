
import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

const API_KEY = 'secret-api-key';

function checkAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(store.getCourses());
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id || !body.title || !body.lessons) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    store.addCourse(body);
    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
