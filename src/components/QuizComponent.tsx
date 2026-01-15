
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from '@/lib/types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizComponentProps {
  questions: QuizQuestion[];
  courseId: string;
  lessonId: string;
  onComplete: (score: number) => void;
}

export function QuizComponent({ questions, courseId, lessonId, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`quiz-progress-${courseId}-${lessonId}`);
    if (savedProgress) {
      const { index, answers, submitted, completed, finalScore } = JSON.parse(savedProgress);
      setCurrentQuestionIndex(index);
      setSelectedAnswers(answers);
      setSubmittedAnswers(submitted);
      setIsCompleted(completed);
      setScore(finalScore);
    }
  }, [courseId, lessonId]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(`quiz-progress-${courseId}-${lessonId}`, JSON.stringify({
      index: currentQuestionIndex,
      answers: selectedAnswers,
      submitted: submittedAnswers,
      completed: isCompleted,
      finalScore: score
    }));
  }, [currentQuestionIndex, selectedAnswers, submittedAnswers, isCompleted, score, courseId, lessonId]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progressValue = ((currentQuestionIndex) / totalQuestions) * 100;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const isQuestionSubmitted = submittedAnswers[currentQuestionIndex];

  const handleOptionChange = (value: string) => {
    if (isQuestionSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: parseInt(value)
    });
  };

  const handleSubmitQuestion = () => {
    const isCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setSubmittedAnswers({
      ...submittedAnswers,
      [currentQuestionIndex]: true
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = score + (selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? 0 : 0); // score already updated in handleSubmit
      setIsCompleted(true);
      onComplete(score);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmittedAnswers({});
    setIsCompleted(false);
    setScore(0);
    localStorage.removeItem(`quiz-progress-${courseId}-${lessonId}`);
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-zinc-100 dark:text-zinc-800"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * (score / totalQuestions))}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-4xl font-bold">{Math.round((score / totalQuestions) * 100)}%</span>
          </div>
          <p className="text-xl font-medium">
            You scored {score} out of {totalQuestions}
          </p>
          <div className="flex gap-4">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            <Button onClick={() => window.location.href = '/'} className="gap-2">
              Back to Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-zinc-500">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span className="text-sm font-medium text-zinc-500">{Math.round(progressValue)}% Complete</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-xl font-semibold leading-tight">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={handleOptionChange}
            className="flex flex-col gap-3"
          >
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              const isCorrect = currentQuestion.correctAnswer === index;
              const isSubmitted = submittedAnswers[currentQuestionIndex];
              
              let variantClasses = "border-zinc-200 dark:border-zinc-800";
              if (isSubmitted) {
                if (isCorrect) variantClasses = "border-green-500 bg-green-50 dark:bg-green-950/20";
                else if (isSelected) variantClasses = "border-red-500 bg-red-50 dark:bg-red-950/20";
              } else if (isSelected) {
                variantClasses = "border-primary bg-primary/5";
              }

              return (
                <div key={index} className="flex items-center">
                  <Label
                    htmlFor={`option-${index}`}
                    className={cn(
                      "flex items-center justify-between w-full p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900",
                      variantClasses
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isSubmitted} className="sr-only" />
                      <span className="font-medium text-base">{option}</span>
                    </div>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Button 
            variant="ghost" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {!isQuestionSubmitted ? (
            <Button 
              onClick={handleSubmitQuestion} 
              disabled={!hasAnswered}
              className="px-8"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              className="px-8 gap-2"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              {!isLastQuestion && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
