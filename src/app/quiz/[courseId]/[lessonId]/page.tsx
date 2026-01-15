
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuizComponent } from '@/components/QuizComponent';
import { Course, Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`, {
          headers: { 'x-api-key': 'secret-api-key' }
        });
        if (res.ok) {
          const data: Course = await res.json();
          setCourse(data);
          const foundLesson = data.lessons.find(l => l.id === lessonId);
          if (foundLesson) {
            setLesson(foundLesson);
          } else {
            toast.error('Lesson not found');
          }
        } else {
          toast.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course', error);
        toast.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId, lessonId]);

  const handleQuizComplete = async (score: number) => {
    try {
      // For demo, we use a static userId 'user-1'
      const userId = 'user-1';
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key'
        },
        body: JSON.stringify({
          userId,
          lessonId,
          score
        })
      });
      if (res.ok) {
        toast.success('Progress saved!');
      }
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link href="/quiz">
          <Button>Back to Portal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-zinc-500">{lesson.title}</p>
          </div>
        </div>

        <QuizComponent 
          questions={lesson.quiz} 
          courseId={courseId} 
          lessonId={lessonId} 
          onComplete={handleQuizComplete}
        />
      </div>
    </div>
  );
}
