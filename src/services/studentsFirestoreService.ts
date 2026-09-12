// src/services/studentsFirestoreService.ts
// Dịch vụ đồng bộ dữ liệu Điểm số & Nhận xét của học sinh với Firebase Cloud Firestore
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Student, LiteratureGradeRecord, WeeklyEvaluation } from '../types';
import { INITIAL_STUDENTS } from '../data/mockData';

const COLLECTION_NAME = 'students';

/**
 * Tiện ích làm sạch dữ liệu trước khi gửi lên Cloud Firestore.
 * Firestore không chấp nhận giá trị `undefined` (sẽ báo lỗi `Unsupported field value: undefined`).
 * Hàm này loại bỏ toàn bộ `undefined` hoặc chuyển thành `null` hợp lệ.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeForFirestore) as unknown as T;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj as T;
}

/**
 * Chuẩn hóa đối tượng học sinh từ Firestore kết hợp với thông tin gốc (tên, ngày sinh, avatar...)
 * Đảm bảo không bao giờ mất thông tin học sinh và các trường luôn đúng kiểu dữ liệu.
 */
export function normalizeStudentFromFirestore(
  firestoreData: any,
  defaultStudent?: Student
): Student {
  const fallback = defaultStudent || INITIAL_STUDENTS.find((s) => s.id === firestoreData.id) || INITIAL_STUDENTS[0];

  // Chuẩn hóa điểm Ngữ Văn
  const litGrades: LiteratureGradeRecord = {
    ...fallback.literatureGrades,
    ...(firestoreData.literatureGrades || {}),
  };
  // Đồng bộ các thuộc tính hiển thị cho Phụ huynh
  if (litGrades.feedback && !litGrades.teacherRemarks) {
    litGrades.teacherRemarks = litGrades.feedback;
  }
  if (litGrades.semesterAverage !== undefined && (litGrades.averageScore === undefined || litGrades.averageScore === null)) {
    litGrades.averageScore = litGrades.semesterAverage;
  }

  // Chuẩn hóa nhận xét tuần (Firestore lưu key số dạng chuỗi "1", "2", "3", "4"...)
  const weeklyEvals: Record<number, WeeklyEvaluation> = { ...fallback.weeklyEvaluations };
  if (firestoreData.weeklyEvaluations && typeof firestoreData.weeklyEvaluations === 'object') {
    Object.entries(firestoreData.weeklyEvaluations).forEach(([wKey, val]) => {
      const wNum = Number(wKey);
      if (!isNaN(wNum) && val) {
        weeklyEvals[wNum] = {
          ...(fallback.weeklyEvaluations[wNum] || {}),
          ...(val as WeeklyEvaluation),
          week: wNum,
        };
      }
    });
  }

  return {
    ...fallback,
    ...firestoreData,
    id: firestoreData.id || fallback.id,
    name: firestoreData.name || fallback.name,
    code: firestoreData.code || fallback.code,
    literatureGrades: litGrades,
    weeklyEvaluations: weeklyEvals,
    badges: Array.isArray(firestoreData.badges) ? firestoreData.badges : fallback.badges,
    portfolio: Array.isArray(firestoreData.portfolio) ? firestoreData.portfolio : fallback.portfolio,
    parentMessages: Array.isArray(firestoreData.parentMessages) ? firestoreData.parentMessages : fallback.parentMessages,
    personalGoal: firestoreData.personalGoal !== undefined ? firestoreData.personalGoal : fallback.personalGoal,
    needsAttention: firestoreData.needsAttention !== undefined ? Boolean(firestoreData.needsAttention) : fallback.needsAttention,
    attentionReason: firestoreData.attentionReason || fallback.attentionReason,
  };
}

/**
 * Lắng nghe cập nhật Điểm & Nhận xét học sinh thời gian thực từ Cloud Firestore.
 * Tự động đồng bộ sang tất cả thiết bị của phụ huynh và giáo viên.
 */
export const subscribeToFirestoreStudents = (
  onData: (students: Student[]) => void,
  onEmpty?: () => void,
  onError?: (error: any) => void
) => {
  try {
    const studentsCol = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        if (snapshot.empty) {
          // Firestore chưa có tài liệu học sinh nào
          if (onEmpty) onEmpty();
          return;
        }

        const mapById = new Map<string, any>();
        snapshot.forEach((docSnap) => {
          mapById.set(docSnap.id, docSnap.data());
        });

        // Kết hợp với danh sách đầy đủ 44 học sinh của lớp 7C
        const mergedList = INITIAL_STUDENTS.map((defaultStudent) => {
          const remoteData = mapById.get(defaultStudent.id);
          if (remoteData) {
            return normalizeStudentFromFirestore(remoteData, defaultStudent);
          }
          return defaultStudent;
        });

        onData(mergedList);
      },
      (error) => {
        console.warn('Firestore students subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Không thể kết nối Firestore students:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Lưu/Cập nhật Điểm số môn Ngữ Văn của một học sinh lên Cloud Firestore.
 * Phụ huynh xem trên điện thoại sẽ đọc dữ liệu trực tiếp từ đây.
 */
export const updateStudentGradesInFirestore = async (
  studentId: string,
  grades: LiteratureGradeRecord
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, studentId);
  const cleanGrades = sanitizeForFirestore(grades);

  await setDoc(
    docRef,
    {
      id: studentId,
      literatureGrades: cleanGrades,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Lưu/Cập nhật Nhận xét & Đánh giá tuần của một học sinh lên Cloud Firestore.
 */
export const updateStudentEvaluationInFirestore = async (
  studentId: string,
  week: number,
  evaluation: WeeklyEvaluation
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, studentId);
  const cleanEvaluation = sanitizeForFirestore(evaluation);

  await setDoc(
    docRef,
    {
      id: studentId,
      weeklyEvaluations: {
        [week]: cleanEvaluation,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Cập nhật điểm số hàng loạt (ví dụ: Duyệt toàn bộ điểm, Tính lại ĐTB toàn lớp...)
 */
export const batchUpdateStudentsGradesInFirestore = async (
  updates: { studentId: string; grades: LiteratureGradeRecord }[]
): Promise<void> => {
  if (!updates.length) return;

  const batch = writeBatch(db);
  for (const item of updates) {
    const docRef = doc(db, COLLECTION_NAME, item.studentId);
    batch.set(
      docRef,
      {
        id: item.studentId,
        literatureGrades: sanitizeForFirestore(item.grades),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
  await batch.commit();
};

/**
 * Cập nhật nhận xét hàng loạt (ví dụ: Phê duyệt nhận xét cả lớp trong tuần)
 */
export const batchUpdateStudentsEvaluationsInFirestore = async (
  updates: { studentId: string; week: number; evaluation: WeeklyEvaluation }[]
): Promise<void> => {
  if (!updates.length) return;

  const batch = writeBatch(db);
  for (const item of updates) {
    const docRef = doc(db, COLLECTION_NAME, item.studentId);
    batch.set(
      docRef,
      {
        id: item.studentId,
        weeklyEvaluations: {
          [item.week]: sanitizeForFirestore(item.evaluation),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
  await batch.commit();
};

/**
 * Lưu toàn bộ thông tin của một học sinh lên Firestore (bao gồm tin nhắn, huy hiệu, mục tiêu...)
 */
export const saveStudentToFirestore = async (student: Student): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, student.id);
  const cleanData = sanitizeForFirestore(student);
  await setDoc(docRef, { ...cleanData, updatedAt: serverTimestamp() }, { merge: true });
};

/**
 * Khởi tạo dữ liệu học sinh ban đầu lên Firestore nếu cơ sở dữ liệu trên cloud còn trống.
 * Đảm bảo 44 học sinh của lớp 7C đều có bản ghi trên Firestore.
 */
export const seedInitialStudentsToFirestore = async (
  studentsToSeed: Student[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    for (const student of studentsToSeed) {
      const docRef = doc(db, COLLECTION_NAME, student.id);
      batch.set(
        docRef,
        {
          ...sanitizeForFirestore(student),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    await batch.commit();
    console.log(`Đã khởi tạo thành công ${studentsToSeed.length} học sinh lên Cloud Firestore.`);
  } catch (err) {
    console.warn('Lỗi khởi tạo học sinh lên Firestore:', err);
  }
};
