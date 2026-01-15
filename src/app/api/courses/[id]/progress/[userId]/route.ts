
import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

const API_KEY = 'secret-api-key';

function checkAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === API_KEY;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id: courseId, userId } = await params;
  const progress = store.getProgress(userId, courseId);
  if (!progress) {
    return NextResponse.json({ 
      userId, 
      courseId, 
      completedLessons: [], 
      scores: {} 
    });
  }
  return NextResponse.json(progress);
}
