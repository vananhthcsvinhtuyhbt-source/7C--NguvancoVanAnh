import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Announcement, WeeklyEvaluation, Badge, PortfolioItem, LiteratureLessonContent, LiteratureGradeRecord } from '../types';
import { INITIAL_STUDENTS, INITIAL_ANNOUNCEMENTS, CLASS_INFO, INITIAL_LESSON_CONTENTS } from '../data/mockData';

interface ClassContextType {
  role: 'parent' | 'teacher';
  setRole: (role: 'parent' | 'teacher') => void;
  students: Student[];
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  updateEvaluation: (studentId: string, week: number, data: Partial<WeeklyEvaluation>) => void;
  batchApproveEvaluations: (week: number) => void;
  lessonContents: LiteratureLessonContent[];
  addLessonContent: (content: Omit<LiteratureLessonContent, 'id'>) => void;
  updateLessonContent: (id: string, content: Partial<LiteratureLessonContent>) => void;
  deleteLessonContent: (id: string) => void;
  updateLiteratureGrades: (studentId: string, data: Partial<LiteratureGradeRecord>) => void;
  addParentMessage: (studentId: string, content: string) => void;
  replyParentMessage: (studentId: string, messageId: string, reply: string) => void;
  addBadge: (studentId: string, badge: Omit<Badge, 'id'>) => void;
  addPortfolioItem: (studentId: string, item: Omit<PortfolioItem, 'id'>) => void;
  updatePersonalGoal: (studentId: string, goal: string) => void;
  toggleNeedsAttention: (studentId: string, reason?: string) => void;
  classInfo: typeof CLASS_INFO;
  resetAllData: () => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_STUDENTS_KEY = 'so_lien_lac_7c_students_v1';
const STORAGE_ANNOUNCEMENTS_KEY = 'so_lien_lac_7c_announcements_v1';
const STORAGE_LESSONS_KEY = 'so_lien_lac_7c_lessons_v1';
const STORAGE_STUDENT_ID_KEY = 'so_lien_lac_7c_current_id_v1';
const STORAGE_ROLE_KEY = 'so_lien_lac_7c_role_v1';

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<'parent' | 'teacher'>(() => {
    return (localStorage.getItem(STORAGE_ROLE_KEY) as 'parent' | 'teacher') || 'parent';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENTS_KEY);
      if (saved) {
        const parsed: Student[] = JSON.parse(saved);
        return parsed.map((s, idx) => {
          const init = INITIAL_STUDENTS[idx] || INITIAL_STUDENTS.find((i) => i.id === s.id);
          return {
            ...s,
            literatureGrades: s.literatureGrades || init?.literatureGrades || {
              oral: 8.5,
              test15m1: 8.0,
              test15m2: 8.5,
              periodTest: 8.0,
              midterm: null,
              semesterAverage: 8.2,
              feedback: 'Ngoan, có ý thức học tập tốt môn Ngữ Văn.',
              writingSkill: 'Tốt',
              readingSkill: 'Nắm chắc ý chính',
            },
          };
        });
      }
    } catch (e) {
      console.error('Failed to load saved students:', e);
    }
    return INITIAL_STUDENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANNOUNCEMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved announcements:', e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [lessonContents, setLessonContents] = useState<LiteratureLessonContent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LESSONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved lesson contents:', e);
    }
    return INITIAL_LESSON_CONTENTS;
  });

  const [currentStudentId, setCurrentStudentIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_STUDENT_ID_KEY);
    return saved || '7C09'; // Default to Nguyễn Ngọc Bảo Châu
  });

  const [selectedWeek, setSelectedWeek] = useState<number>(4);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LESSONS_KEY, JSON.stringify(lessonContents));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [lessonContents]);

  const setRole = (newRole: 'parent' | 'teacher') => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_ROLE_KEY, newRole);
  };

  const setCurrentStudentId = (id: string) => {
    setCurrentStudentIdState(id);
    localStorage.setItem(STORAGE_STUDENT_ID_KEY, id);
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const updateEvaluation = (studentId: string, week: number, data: Partial<WeeklyEvaluation>) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        const currentWeekEval = student.weeklyEvaluations[week] || {
          week,
          title: `Tuần ${week}`,
          academic: 'Tốt',
          academicScore: 4,
          discipline: 'Tốt',
          disciplineScore: 5,
          attitude: 'Tích cực',
          attitudeScore: 4,
          cooperation: 'Tốt',
          cooperationScore: 4,
          attendance: 'Tốt (Đúng giờ)',
          attendanceScore: 5,
          progressStars: 4,
          progressTrend: 'steady',
          strengths: '',
          improvements: '',
          familyCoordination: '',
          teacherComment: '',
          parentTip: '',
          isApproved: true,
        };
        return {
          ...student,
          weeklyEvaluations: {
            ...student.weeklyEvaluations,
            [week]: {
              ...currentWeekEval,
              ...data,
            },
          },
        };
      })
    );
  };

  const batchApproveEvaluations = (week: number) => {
    setStudents((prev) =>
      prev.map((student) => {
        const evalItem = student.weeklyEvaluations[week];
        if (!evalItem) return student;
        return {
          ...student,
          weeklyEvaluations: {
            ...student.weeklyEvaluations,
            [week]: {
              ...evalItem,
              isApproved: true,
            },
          },
        };
      })
    );
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id'>) => {
    const item: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
    };
    setAnnouncements((prev) => [item, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addParentMessage = (studentId: string, content: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const studentParent = s.parentName;
        const now = new Date();
        const dateStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        return {
          ...s,
          parentMessages: [
            ...s.parentMessages,
            {
              id: `msg-${Date.now()}`,
              sender: studentParent,
              date: dateStr,
              content,
            },
          ],
        };
      })
    );
  };

  const replyParentMessage = (studentId: string, messageId: string, reply: string) => {
    const now = new Date();
    const dateStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          parentMessages: s.parentMessages.map((msg) => {
            if (msg.id !== messageId) return msg;
            return {
              ...msg,
              reply,
              repliedAt: dateStr,
            };
          }),
        };
      })
    );
  };

  const addBadge = (studentId: string, badge: Omit<Badge, 'id'>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          badges: [
            ...s.badges,
            {
              ...badge,
              id: `badge-${Date.now()}`,
            },
          ],
        };
      })
    );
  };

  const addPortfolioItem = (studentId: string, item: Omit<PortfolioItem, 'id'>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          portfolio: [
            ...s.portfolio,
            {
              ...item,
              id: `port-${Date.now()}`,
            },
          ],
        };
      })
    );
  };

  const updatePersonalGoal = (studentId: string, goal: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, personalGoal: goal } : s))
    );
  };

  const toggleNeedsAttention = (studentId: string, reason?: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const willNeed = !s.needsAttention;
        return {
          ...s,
          needsAttention: willNeed,
          attentionReason: willNeed ? reason || 'Cần Cô Vân Anh và gia đình theo sát' : undefined,
        };
      })
    );
  };

  const updateLiteratureGrades = (studentId: string, data: Partial<LiteratureGradeRecord>) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        const currentGrades = student.literatureGrades || {};
        const merged = { ...currentGrades, ...data };

        // Recalculate average
        const weights: number[] = [];
        const scores: number[] = [];
        if (typeof merged.oral === 'number' && !isNaN(merged.oral)) { scores.push(merged.oral); weights.push(1); }
        if (typeof merged.test15m1 === 'number' && !isNaN(merged.test15m1)) { scores.push(merged.test15m1); weights.push(1); }
        if (typeof merged.test15m2 === 'number' && !isNaN(merged.test15m2)) { scores.push(merged.test15m2); weights.push(1); }
        if (typeof merged.periodTest === 'number' && !isNaN(merged.periodTest)) { scores.push(merged.periodTest); weights.push(2); }
        if (typeof merged.midterm === 'number' && !isNaN(merged.midterm)) { scores.push(merged.midterm); weights.push(2); }

        let calculatedAvg = merged.semesterAverage;
        if (scores.length > 0) {
          const totalScore = scores.reduce((sum, s, idx) => sum + s * weights[idx], 0);
          const totalWeight = weights.reduce((sum, w) => sum + w, 0);
          calculatedAvg = Math.round((totalScore / totalWeight) * 10) / 10;
        }

        return {
          ...student,
          literatureGrades: {
            ...merged,
            semesterAverage: calculatedAvg,
          },
        };
      })
    );
  };

  const addLessonContent = (content: Omit<LiteratureLessonContent, 'id'>) => {
    const item: LiteratureLessonContent = {
      ...content,
      id: `lit-${Date.now()}`,
    };
    setLessonContents((prev) => [item, ...prev]);
  };

  const updateLessonContent = (id: string, content: Partial<LiteratureLessonContent>) => {
    setLessonContents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...content, updatedDate: new Date().toLocaleDateString('vi-VN') }
          : item
      )
    );
  };

  const deleteLessonContent = (id: string) => {
    setLessonContents((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_STUDENTS_KEY);
    localStorage.removeItem(STORAGE_ANNOUNCEMENTS_KEY);
    localStorage.removeItem(STORAGE_LESSONS_KEY);
    setStudents(INITIAL_STUDENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setLessonContents(INITIAL_LESSON_CONTENTS);
    setCurrentStudentId('7C09');
  };

  return (
    <ClassContext.Provider
      value={{
        role,
        setRole,
        students,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        selectedWeek,
        setSelectedWeek,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        updateEvaluation,
        batchApproveEvaluations,
        lessonContents,
        addLessonContent,
        updateLessonContent,
        deleteLessonContent,
        updateLiteratureGrades,
        addParentMessage,
        replyParentMessage,
        addBadge,
        addPortfolioItem,
        updatePersonalGoal,
        toggleNeedsAttention,
        classInfo: CLASS_INFO,
        resetAllData,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error('useClass must be used within a ClassProvider');
  }
  return context;
};
