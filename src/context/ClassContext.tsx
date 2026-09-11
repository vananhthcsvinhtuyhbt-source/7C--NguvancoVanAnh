import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Announcement,
  WeeklyEvaluation,
  Badge,
  PortfolioItem,
  LiteratureLessonContent,
  LiteratureGradeRecord,
  WeekInfo,
  ClassInfo,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ANNOUNCEMENTS,
  CLASS_INFO,
  INITIAL_LESSON_CONTENTS,
  INITIAL_WEEKS,
} from '../data/mockData';

interface AddWeekParams {
  week: number;
  title: string;
  startDate?: string;
  endDate?: string;
  focusTheme?: string;
  copyFromPrevious?: boolean;
  setAsCurrent?: boolean;
}

interface ClassContextType {
  role: 'parent' | 'teacher';
  setRole: (role: 'parent' | 'teacher') => void;
  isTeacherAuthenticated: boolean;
  unlockTeacher: (password: string) => boolean;
  lockTeacher: () => void;
  students: Student[];
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  weeks: WeekInfo[];
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  addWeek: (params: AddWeekParams) => void;
  updateWeekInfo: (week: number, data: Partial<WeekInfo>) => void;
  deleteWeek: (week: number) => void;
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
  batchRecalculateLiteratureAverages: () => void;
  addParentMessage: (studentId: string, content: string) => void;
  replyParentMessage: (studentId: string, messageId: string, reply: string) => void;
  addBadge: (studentId: string, badge: Omit<Badge, 'id'>) => void;
  addPortfolioItem: (studentId: string, item: Omit<PortfolioItem, 'id'>) => void;
  updatePersonalGoal: (studentId: string, goal: string) => void;
  toggleNeedsAttention: (studentId: string, reason?: string) => void;
  updateStudentInfo: (studentId: string, data: Partial<Student>) => void;
  classInfo: ClassInfo;
  updateClassInfo: (data: Partial<ClassInfo>) => void;
  resetAllData: () => void;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_STUDENTS_KEY = 'so_lien_lac_7c_students_v1';
const STORAGE_ANNOUNCEMENTS_KEY = 'so_lien_lac_7c_announcements_v1';
const STORAGE_LESSONS_KEY = 'so_lien_lac_7c_lessons_v1';
const STORAGE_WEEKS_KEY = 'so_lien_lac_7c_weeks_v1';
const STORAGE_CLASS_INFO_KEY = 'so_lien_lac_7c_class_info_v1';
const STORAGE_STUDENT_ID_KEY = 'so_lien_lac_7c_current_id_v1';
const STORAGE_ROLE_KEY = 'so_lien_lac_7c_role_v1';
const STORAGE_TEACHER_AUTH_KEY = 'so_lien_lac_7c_teacher_auth_v1';

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_TEACHER_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [role, setRoleState] = useState<'parent' | 'teacher'>(() => {
    const savedRole = (localStorage.getItem(STORAGE_ROLE_KEY) as 'parent' | 'teacher') || 'parent';
    try {
      const isAuth = sessionStorage.getItem(STORAGE_TEACHER_AUTH_KEY) === 'true';
      if (savedRole === 'teacher' && !isAuth) {
        return 'parent';
      }
    } catch {
      return 'parent';
    }
    return savedRole;
  });

  const [classInfo, setClassInfo] = useState<ClassInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CLASS_INFO_KEY);
      if (saved) {
        const parsed: ClassInfo = JSON.parse(saved);
        if (!parsed.academicYear || parsed.academicYear.includes('2024')) {
          parsed.academicYear = 'Năm học 2026 - 2027';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load class info:', e);
    }
    return CLASS_INFO;
  });

  const [weeks, setWeeks] = useState<WeekInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WEEKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load weeks:', e);
    }
    return INITIAL_WEEKS;
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

  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    return classInfo.currentWeek || 4;
  });

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WEEKS_KEY, JSON.stringify(weeks));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [weeks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLASS_INFO_KEY, JSON.stringify(classInfo));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [classInfo]);

  const unlockTeacher = (password: string): boolean => {
    if (password.trim() === '20182022') {
      try {
        sessionStorage.setItem(STORAGE_TEACHER_AUTH_KEY, 'true');
      } catch (e) {
        console.error(e);
      }
      setIsTeacherAuthenticated(true);
      setRoleState('teacher');
      localStorage.setItem(STORAGE_ROLE_KEY, 'teacher');
      return true;
    }
    return false;
  };

  const lockTeacher = () => {
    try {
      sessionStorage.removeItem(STORAGE_TEACHER_AUTH_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsTeacherAuthenticated(false);
    setRoleState('parent');
    localStorage.setItem(STORAGE_ROLE_KEY, 'parent');
  };

  const setRole = (newRole: 'parent' | 'teacher') => {
    if (newRole === 'teacher' && !isTeacherAuthenticated) {
      return;
    }
    setRoleState(newRole);
    localStorage.setItem(STORAGE_ROLE_KEY, newRole);
  };

  const setCurrentStudentId = (id: string) => {
    setCurrentStudentIdState(id);
    localStorage.setItem(STORAGE_STUDENT_ID_KEY, id);
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const updateClassInfo = (data: Partial<ClassInfo>) => {
    setClassInfo((prev) => ({ ...prev, ...data }));
  };

  const updateStudentInfo = (studentId: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...data } : s))
    );
  };

  const addWeek = (params: AddWeekParams) => {
    const {
      week: newWeekNum,
      title,
      startDate,
      endDate,
      focusTheme,
      copyFromPrevious = true,
      setAsCurrent = false,
    } = params;

    // Check if week already exists
    const existingIndex = weeks.findIndex((w) => w.week === newWeekNum);
    let updatedWeeks = [...weeks];

    const newWeekItem: WeekInfo = {
      week: newWeekNum,
      title: title || `Tuần ${newWeekNum}`,
      startDate,
      endDate,
      focusTheme,
      isCurrent: setAsCurrent,
    };

    if (existingIndex >= 0) {
      updatedWeeks[existingIndex] = { ...updatedWeeks[existingIndex], ...newWeekItem };
    } else {
      updatedWeeks.push(newWeekItem);
      updatedWeeks.sort((a, b) => a.week - b.week);
    }

    if (setAsCurrent) {
      updatedWeeks = updatedWeeks.map((w) => ({
        ...w,
        isCurrent: w.week === newWeekNum,
      }));
      setClassInfo((prev) => ({ ...prev, currentWeek: newWeekNum }));
    }

    setWeeks(updatedWeeks);

    // Initialize or update evaluation for all students for this week
    setStudents((prev) =>
      prev.map((student) => {
        // If already has this week, keep it
        if (student.weeklyEvaluations[newWeekNum]) {
          return {
            ...student,
            weeklyEvaluations: {
              ...student.weeklyEvaluations,
              [newWeekNum]: {
                ...student.weeklyEvaluations[newWeekNum],
                title: title || student.weeklyEvaluations[newWeekNum].title,
              },
            },
          };
        }

        // Get previous week data if requested
        const prevWeekEval =
          student.weeklyEvaluations[newWeekNum - 1] ||
          student.weeklyEvaluations[4] ||
          student.weeklyEvaluations[1];

        let initialEval: WeeklyEvaluation;

        if (copyFromPrevious && prevWeekEval) {
          initialEval = {
            ...prevWeekEval,
            week: newWeekNum,
            title: title || `Tuần ${newWeekNum}`,
            isApproved: false, // New week starts as pending review
            literatureWeekly: {
              lessonTitle: focusTheme || `Bài học Ngữ Văn tuần ${newWeekNum}`,
              score: prevWeekEval.literatureWeekly?.score || null,
              feedback: `Em ${student.name} tiếp tục phát huy tinh thần học tập tích cực trong tuần ${newWeekNum}.`,
              writingSkill: prevWeekEval.literatureWeekly?.writingSkill || 'Khá tốt',
              readingSkill: prevWeekEval.literatureWeekly?.readingSkill || 'Nắm được nội dung chính',
            },
          };
        } else {
          initialEval = {
            week: newWeekNum,
            title: title || `Tuần ${newWeekNum}`,
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
            strengths: 'Tích cực tham gia xây dựng bài',
            improvements: 'Cần tự tin hơn khi trình bày ý kiến',
            familyCoordination: 'Gia đình cùng theo sát và nhắc nhở con làm bài tập đầy đủ',
            teacherComment: `${student.name} có ý thức học tập tốt, ngoan ngoãn và chăm chỉ trong tuần.`,
            parentTip: 'Cha mẹ hãy dành 10 phút mỗi tối để cùng con đọc sách hoặc trò chuyện về bài học trên lớp.',
            isApproved: false,
            literatureWeekly: {
              lessonTitle: focusTheme || `Bài học Ngữ Văn tuần ${newWeekNum}`,
              score: null,
              feedback: 'Có cố gắng trong các tiết học Ngữ Văn.',
              writingSkill: 'Khá tốt',
              readingSkill: 'Nắm được nội dung chính',
            },
          };
        }

        return {
          ...student,
          weeklyEvaluations: {
            ...student.weeklyEvaluations,
            [newWeekNum]: initialEval,
          },
        };
      })
    );

    // If lesson content for this week doesn't exist, create a draft template
    const existingLesson = lessonContents.find((l) => l.week === newWeekNum);
    if (!existingLesson) {
      const nowStr = new Date().toLocaleDateString('vi-VN');
      const newLesson: LiteratureLessonContent = {
        id: `lit-w${newWeekNum}-${Date.now()}`,
        week: newWeekNum,
        title: focusTheme || `Chương trình Ngữ Văn tuần ${newWeekNum}`,
        topic: `Bài học theo kế hoạch tuần ${newWeekNum}`,
        keyKnowledge: 'Trọng tâm kiến thức đọc hiểu văn bản và thực hành Tiếng Việt tuần này...',
        homework: '1. Đọc kỹ văn bản bài học và soạn bài trước.\n2. Hoàn thành phiếu bài tập rèn kỹ năng viết.',
        sampleExcerpt: 'Đoạn văn tham khảo dành cho học sinh lớp 7C rèn luyện cách diễn đạt giàu cảm xúc...',
        updatedDate: nowStr,
        author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
      };
      setLessonContents((prev) => [newLesson, ...prev]);
    }

    // Switch view to this new week
    setSelectedWeek(newWeekNum);
  };

  const updateWeekInfo = (weekNum: number, data: Partial<WeekInfo>) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.week !== weekNum) {
          if (data.isCurrent) return { ...w, isCurrent: false };
          return w;
        }
        return { ...w, ...data };
      })
    );

    if (data.isCurrent) {
      setClassInfo((prev) => ({ ...prev, currentWeek: weekNum }));
    }

    if (data.title) {
      setStudents((prev) =>
        prev.map((s) => {
          const ev = s.weeklyEvaluations[weekNum];
          if (!ev) return s;
          return {
            ...s,
            weeklyEvaluations: {
              ...s.weeklyEvaluations,
              [weekNum]: { ...ev, title: data.title! },
            },
          };
        })
      );
    }
  };

  const deleteWeek = (weekNum: number) => {
    if (weeks.length <= 1) return;
    setWeeks((prev) => prev.filter((w) => w.week !== weekNum));

    setStudents((prev) =>
      prev.map((s) => {
        const newEvals = { ...s.weeklyEvaluations };
        delete newEvals[weekNum];
        return { ...s, weeklyEvaluations: newEvals };
      })
    );

    if (selectedWeek === weekNum) {
      const remaining = weeks.filter((w) => w.week !== weekNum);
      setSelectedWeek(remaining[remaining.length - 1]?.week || 1);
    }
  };

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
        const merged: LiteratureGradeRecord = { ...currentGrades, ...data };

        // Allow Teacher Van Anh to manually set or edit semesterAverage directly
        let finalAvg = merged.semesterAverage;
        if (data.isCustomAverage === false) {
          merged.isCustomAverage = false;
        }

        if (data.semesterAverage !== undefined) {
          finalAvg = data.semesterAverage;
          merged.isCustomAverage = true;
        } else if (!merged.isCustomAverage) {
          // Recalculate average automatically with standard weighting:
          // Oral(1), 15m1(1), 15m2(1), Period(2), Midterm(2), FinalExam(3)
          const weights: number[] = [];
          const scores: number[] = [];
          if (typeof merged.oral === 'number' && !isNaN(merged.oral)) { scores.push(merged.oral); weights.push(1); }
          if (typeof merged.test15m1 === 'number' && !isNaN(merged.test15m1)) { scores.push(merged.test15m1); weights.push(1); }
          if (typeof merged.test15m2 === 'number' && !isNaN(merged.test15m2)) { scores.push(merged.test15m2); weights.push(1); }
          if (typeof merged.periodTest === 'number' && !isNaN(merged.periodTest)) { scores.push(merged.periodTest); weights.push(2); }
          if (typeof merged.midterm === 'number' && !isNaN(merged.midterm)) { scores.push(merged.midterm); weights.push(2); }
          if (typeof merged.finalExam === 'number' && !isNaN(merged.finalExam)) { scores.push(merged.finalExam); weights.push(3); }

          if (scores.length > 0) {
            const totalScore = scores.reduce((sum, s, idx) => sum + s * weights[idx], 0);
            const totalWeight = weights.reduce((sum, w) => sum + w, 0);
            finalAvg = Math.round((totalScore / totalWeight) * 10) / 10;
          }
        }

        merged.semesterAverage = finalAvg;
        // Keep aliases synchronized for parent view:
        merged.averageScore = finalAvg;
        merged.oralScores = merged.oral !== null && merged.oral !== undefined ? [merged.oral] : [];
        merged.fifteenMinScores = [merged.test15m1, merged.test15m2].filter((v): v is number => typeof v === 'number');
        merged.onePeriodScores = merged.periodTest !== null && merged.periodTest !== undefined ? [merged.periodTest] : [];
        merged.midTermScore = merged.midterm;
        merged.finalTermScore = merged.finalExam !== null && merged.finalExam !== undefined ? merged.finalExam : 'Chưa thi';
        merged.teacherRemarks = merged.feedback;
        merged.readingCompetency = merged.readingSkill;
        merged.writingCompetency = merged.writingSkill;

        return {
          ...student,
          literatureGrades: merged,
        };
      })
    );
  };

  const batchRecalculateLiteratureAverages = () => {
    setStudents((prev) =>
      prev.map((student) => {
        const currentGrades = student.literatureGrades || {};
        const merged: LiteratureGradeRecord = { ...currentGrades, isCustomAverage: false };
        const weights: number[] = [];
        const scores: number[] = [];
        if (typeof merged.oral === 'number' && !isNaN(merged.oral)) { scores.push(merged.oral); weights.push(1); }
        if (typeof merged.test15m1 === 'number' && !isNaN(merged.test15m1)) { scores.push(merged.test15m1); weights.push(1); }
        if (typeof merged.test15m2 === 'number' && !isNaN(merged.test15m2)) { scores.push(merged.test15m2); weights.push(1); }
        if (typeof merged.periodTest === 'number' && !isNaN(merged.periodTest)) { scores.push(merged.periodTest); weights.push(2); }
        if (typeof merged.midterm === 'number' && !isNaN(merged.midterm)) { scores.push(merged.midterm); weights.push(2); }
        if (typeof merged.finalExam === 'number' && !isNaN(merged.finalExam)) { scores.push(merged.finalExam); weights.push(3); }

        let calculatedAvg = merged.semesterAverage;
        if (scores.length > 0) {
          const totalScore = scores.reduce((sum, s, idx) => sum + s * weights[idx], 0);
          const totalWeight = weights.reduce((sum, w) => sum + w, 0);
          calculatedAvg = Math.round((totalScore / totalWeight) * 10) / 10;
        }

        merged.semesterAverage = calculatedAvg;
        merged.averageScore = calculatedAvg;
        return {
          ...student,
          literatureGrades: merged,
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
        isTeacherAuthenticated,
        unlockTeacher,
        lockTeacher,
        students,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        weeks,
        selectedWeek,
        setSelectedWeek,
        addWeek,
        updateWeekInfo,
        deleteWeek,
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
        batchRecalculateLiteratureAverages,
        addParentMessage,
        replyParentMessage,
        addBadge,
        addPortfolioItem,
        updatePersonalGoal,
        toggleNeedsAttention,
        updateStudentInfo,
        classInfo,
        updateClassInfo,
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
