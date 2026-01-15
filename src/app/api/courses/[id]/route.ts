
import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

const API_KEY = 'secret-api-key';

function checkAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const course = store.getCourseById(id);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  return NextResponse.json(course);
}
