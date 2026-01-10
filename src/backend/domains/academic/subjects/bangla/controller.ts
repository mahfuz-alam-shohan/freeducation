import { contentKeys } from './data';
import type { ExamProvider } from '../../shared/exam-interface';

export const pickContentSlice = (content: Record<string, unknown>) =>
  Object.fromEntries(contentKeys.map((key) => [key, content[key]]));

export const applyContentSlice = (content: Record<string, unknown>, update: Record<string, unknown>) => {
  const next = { ...content };
  for (const key of contentKeys) {
    if (key in update) {
      next[key] = update[key];
    }
  }
  return next;
};

type BanglaLesson = {
  id: string;
  title: string;
  focus: string[];
};

export class BanglaExam implements ExamProvider {
  getLessons(): BanglaLesson[] {
    return [
      {
        id: 'bangla-prose-01',
        title: 'গদ্য: ভাষার ব্যবহার',
        focus: ['অনুচ্ছেদ বিশ্লেষণ', 'মূলভাব নির্ণয়', 'শব্দার্থ'],
      },
      {
        id: 'bangla-poetry-02',
        title: 'পদ্য: কাব্যরূপ',
        focus: ['চিত্রকল্প', 'কবির ভাব', 'অনুধাবন'],
      },
      {
        id: 'bangla-grammar-03',
        title: 'ব্যাকরণ: রচনা ও বাক্য',
        focus: ['বাক্যরূপান্তর', 'প্রয়োগ', 'পরিভাষা'],
      },
    ];
  }

  async generateQuestions(topicId: string): Promise<any> {
    return {
      topicId,
      format: 'creative',
      label: 'সৃজনশীল',
      questions: [
        {
          id: `${topicId}-cq-1`,
          stem: 'নিচের উদ্ধৃতাংশটি পড়ে প্রশ্নগুলোর উত্তর দাও।',
          passage:
            'মানুষের চিন্তা ও চর্চার মধ্য দিয়ে ভাষা পরিশীলিত হয়। ভাষার যথাযথ ব্যবহারই চিন্তার গভীরতাকে প্রকাশ করে।',
          parts: [
            { type: 'ক', prompt: 'উদ্ধৃতাংশের মূলভাব লিখ।' },
            { type: 'খ', prompt: 'ভাষার যথাযথ ব্যবহার কেন জরুরি?' },
            { type: 'গ', prompt: 'উদ্ধৃতাংশটি দৈনন্দিন জীবনের সঙ্গে কীভাবে সম্পর্কিত?' },
            { type: 'ঘ', prompt: 'নিজের অভিজ্ঞতার আলোকে একটি উদাহরণ দাও।' },
          ],
        },
        {
          id: `${topicId}-cq-2`,
          stem: 'একজন শিক্ষার্থী তার পাঠ থেকে যা শিখেছে তা প্রয়োগ করতে পারছে না।',
          parts: [
            { type: 'ক', prompt: 'সৃজনশীল প্রশ্নের উদ্দেশ্য কী?' },
            { type: 'খ', prompt: 'প্রয়োগের অভাবে কী সমস্যা হতে পারে?' },
            { type: 'গ', prompt: 'পাঠ্যজ্ঞান বাস্তবে প্রয়োগের একটি উপায় ব্যাখ্যা কর।' },
            { type: 'ঘ', prompt: 'এই পরিস্থিতি বদলাতে শিক্ষকের করণীয় উল্লেখ কর।' },
          ],
        },
      ],
    };
  }

  validateAnswer(_questionId: string, _answer: any): number {
    return 0;
  }

  renderExamUI(): string {
    return '<div data-exam="bangla"></div>';
  }
}
