
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course, UserProgress } from '@/lib/types';
import { BarChart3, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressData, setProgressData] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const userId = 'user-1';

  useEffect(() => {
    async function fetchData() {
      try {
        const coursesRes = await fetch('/api/courses', {
          headers: { 'x-api-key': 'secret-api-key' }
        });
        if (coursesRes.ok) {
          const courses: Course[] = await coursesRes.json();
          setCourses(courses);

          const progressMap: Record<string, UserProgress> = {};
          for (const course of courses) {
            const progressRes = await fetch(`/api/courses/${course.id}/progress/${userId}`, {
              headers: { 'x-api-key': 'secret-api-key' }
            });
            if (progressRes.ok) {
              progressMap[course.id] = await progressRes.json();
            }
          }
          setProgressData(progressMap);
        }
      } catch (error) {
        console.error('Error fetching reports', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
            <BarChart3 className="w-8 h-8 text-primary" />
            Progress Reports
          </h1>
          <div className="w-24" />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading reports...</div>
        ) : (
          <div className="space-y-6">
            {courses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed">
                <p className="text-zinc-500">No data available.</p>
              </div>
            ) : (
              courses.map(course => {
                const progress = progressData[course.id];
                const completedCount = progress?.completedLessons.length || 0;
                const totalLessons = course.lessons.length;
                const percentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

                return (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl">{course.title}</CardTitle>
                        <span className="text-lg font-bold text-primary">{Math.round(percentage)}% Complete</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-zinc-500 uppercase text-xs tracking-wider">Lesson Progress</h4>
                        <div className="grid gap-3">
                          {course.lessons.map(lesson => {
                            const isCompleted = progress?.completedLessons.includes(lesson.id);
                            const score = progress?.scores[lesson.id];
                            return (
                              <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-zinc-300" />
                                  )}
                                  <span className={isCompleted ? 'font-medium' : 'text-zinc-500'}>{lesson.title}</span>
                                </div>
                                {isCompleted && (
                                  <span className="text-sm font-bold px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">
                                    Score: {score}/{lesson.quiz.length}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
