
import { Course, UserProgress } from './types';

// In-memory store
class Store {
  private courses: Course[] = [
    {
      id: 'course-1',
      title: 'Introduction to Web Development',
      lessons: [
        {
          id: 'lesson-1',
          title: 'HTML Basics',
          quiz: [
            {
              id: 'q1',
              question: 'What does HTML stand for?',
              options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'None of the above'],
              correctAnswer: 0
            },
            {
              id: 'q2',
              question: 'Which tag is used for a large heading?',
              options: ['<h6>', '<p>', '<h1>', '<div>'],
              correctAnswer: 2
            },
            {
              id: 'q3',
              question: 'How do you create a link?',
              options: ['<link>', '<a>', '<href>', '<url>'],
              correctAnswer: 1
            },
            {
              id: 'q4',
              question: 'Which tag is used for an unordered list?',
              options: ['<ul>', '<ol>', '<li>', '<list>'],
              correctAnswer: 0
            },
            {
              id: 'q5',
              question: 'What is the correct tag for a line break?',
              options: ['<lb>', '<break>', '<br>', '<hr>'],
              correctAnswer: 2
            }
          ]
        }
      ]
    }
  ];

  private progress: UserProgress[] = [];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  updateProgress(userId: string, courseId: string, lessonId: string, score: number): void {
    let userProgress = this.progress.find(p => p.userId === userId && p.courseId === courseId);
    if (!userProgress) {
      userProgress = { userId, courseId, completedLessons: [], scores: {} };
      this.progress.push(userProgress);
    }
    if (!userProgress.completedLessons.includes(lessonId)) {
      userProgress.completedLessons.push(lessonId);
    }
    userProgress.scores[lessonId] = score;
  }

  getProgress(userId: string, courseId: string): UserProgress | undefined {
    return this.progress.find(p => p.userId === userId && p.courseId === courseId);
  }
}

// Global singleton for the store
const globalForStore = global as unknown as { store: Store };
export const store = globalForStore.store || new Store();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;
