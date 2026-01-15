
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Save, ArrowLeft } from 'lucide-react';
import { QuizQuestion, Course, Lesson } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminPortal() {
  const [courseTitle, setCourseTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    Array(5).fill(null).map((_, i) => ({
      id: `q-${i}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }))
  );

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'option') {
      newQuestions[index].options[value.optIndex] = value.text;
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSaveCourse = async () => {
    if (!courseTitle || !lessonTitle || questions.some(q => !q.question || q.options.some(opt => !opt))) {
      toast.error('Please fill in all fields');
      return;
    }

    const courseId = `course-${Date.now()}`;
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: lessonTitle,
      quiz: questions
    };

    const newCourse: Course = {
      id: courseId,
      title: courseTitle,
      lessons: [lesson]
    };

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'secret-api-key'
        },
        body: JSON.stringify(newCourse)
      });

      if (res.ok) {
        toast.success('Course created successfully!');
        setCourseTitle('');
        setLessonTitle('');
        setQuestions(Array(5).fill(null).map((_, i) => ({
          id: `q-${i}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        })));
      } else {
        toast.error('Failed to create course');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <div className="w-24" /> {/* Spacer */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input 
                  id="courseTitle" 
                  placeholder="e.g. Advanced React Patterns" 
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lessonTitle">Lesson Title</Label>
                <Input 
                  id="lessonTitle" 
                  placeholder="e.g. Lesson 1: Introduction" 
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-8 pt-4">
              <h3 className="text-lg font-semibold border-b pb-2">Quiz Questions (5 required)</h3>
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Question {qIndex + 1}</span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Question Text</Label>
                    <Input 
                      placeholder="Enter question" 
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="grid gap-2">
                        <Label className="flex items-center gap-2">
                          Option {optIndex + 1}
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`} 
                            checked={q.correctAnswer === optIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', optIndex)}
                          />
                          <span className="text-xs text-zinc-500">Correct</span>
                        </Label>
                        <Input 
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => handleQuestionChange(qIndex, 'option', { optIndex, text: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t">
            <Button onClick={handleSaveCourse} className="gap-2">
              <Save className="w-4 h-4" /> Save Course & Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
