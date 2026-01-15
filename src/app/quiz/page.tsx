
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/types';
import { BookOpen, GraduationCap, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuizPortal() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses', {
          headers: { 'x-api-key': 'secret-api-key' }
        });
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" />
            Quiz Taker Portal
          </h1>
          <div className="w-24" />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed">
                <p className="text-zinc-500">No courses available yet. Ask an admin to create one!</p>
              </div>
            ) : (
              courses.map(course => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-zinc-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons.length} Lesson{course.lessons.length !== 1 ? 's' : ''}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    {course.lessons.map(lesson => (
                      <Link key={lesson.id} href={`/quiz/${course.id}/${lesson.id}`} className="w-full">
                        <Button variant="outline" className="w-full justify-between group">
                          {lesson.title}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    ))}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
