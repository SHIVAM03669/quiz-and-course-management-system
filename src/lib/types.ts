
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[]; // lesson IDs
  scores: Record<string, number>; // lessonId -> score
}
