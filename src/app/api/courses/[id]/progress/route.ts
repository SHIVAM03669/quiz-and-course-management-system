
import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

const API_KEY = 'secret-api-key';

function checkAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id: courseId } = await params;
  try {
    const { userId, lessonId, score } = await req.json();
    if (!userId || !lessonId || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    store.updateProgress(userId, courseId, lessonId, score);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
