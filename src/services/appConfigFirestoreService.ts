// src/services/appConfigFirestoreService.ts
// Dịch vụ đồng bộ Cấu hình Lớp học, Lịch học các tuần và Tùy chỉnh cột điểm với Firebase Cloud Firestore
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ClassInfo, WeekInfo, GradeColumnNames } from '../types';
import { CLASS_INFO, INITIAL_WEEKS } from '../data/mockData';
import { sanitizeForFirestore } from './studentsFirestoreService';

const COLLECTION_NAME = 'app_config';
const DOC_ID = 'settings';

export const DEFAULT_GRADE_COLUMNS: GradeColumnNames = {
  oral: 'Điểm miệng',
  test15m1: '15 phút (Đ1)',
  test15m2: '15 phút (Đ2)',
  periodTest: '1 tiết (Biểu cảm)',
  midterm: 'Giữa kỳ',
  finalExam: 'Cuối kỳ',
};

export interface SharedAppConfig {
  classInfo: ClassInfo;
  weeks: WeekInfo[];
  gradeColumnNames: GradeColumnNames;
}

/**
 * Lắng nghe cập nhật Cấu hình lớp, Lịch học các tuần và Tùy biến cột điểm từ Cloud Firestore.
 * Tự động đồng bộ ngay lập tức sang tất cả thiết bị của phụ huynh khi cô giáo sửa thông tin.
 */
export const subscribeToFirestoreAppConfig = (
  onData: (config: SharedAppConfig) => void,
  onEmpty?: () => void,
  onError?: (error: any) => void
) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          if (onEmpty) onEmpty();
          return;
        }

        const data = snapshot.data();
        const cleanClassInfo: ClassInfo = {
          ...CLASS_INFO,
          ...(data.classInfo || {}),
        };

        const cleanWeeks: WeekInfo[] = Array.isArray(data.weeks) && data.weeks.length > 0
          ? data.weeks
          : INITIAL_WEEKS;

        const cleanGradeColumns: GradeColumnNames = {
          ...DEFAULT_GRADE_COLUMNS,
          ...(data.gradeColumnNames || {}),
        };

        onData({
          classInfo: cleanClassInfo,
          weeks: cleanWeeks,
          gradeColumnNames: cleanGradeColumns,
        });
      },
      (error) => {
        console.warn('Firestore app config subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Không thể kết nối Firestore app config:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Lưu Cập nhật Thông tin lớp học lên Firestore
 */
export const saveClassInfoToFirestore = async (classInfo: ClassInfo): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(
    docRef,
    {
      classInfo: sanitizeForFirestore(classInfo),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Lưu Cập nhật Danh sách tuần học / lịch học lên Firestore
 */
export const saveWeeksToFirestore = async (weeks: WeekInfo[]): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(
    docRef,
    {
      weeks: sanitizeForFirestore(weeks),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Lưu Cập nhật Tên cột điểm tùy chỉnh lên Firestore
 */
export const saveGradeColumnNamesToFirestore = async (
  names: GradeColumnNames
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(
    docRef,
    {
      gradeColumnNames: sanitizeForFirestore(names),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Lưu toàn bộ cấu hình Lớp, Lịch học, Cột điểm lên Firestore
 */
export const saveFullAppConfigToFirestore = async (config: {
  classInfo: ClassInfo;
  weeks: WeekInfo[];
  gradeColumnNames: GradeColumnNames;
}): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  await setDoc(
    docRef,
    {
      classInfo: sanitizeForFirestore(config.classInfo),
      weeks: sanitizeForFirestore(config.weeks),
      gradeColumnNames: sanitizeForFirestore(config.gradeColumnNames),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Khởi tạo dữ liệu cấu hình ban đầu lên Cloud Firestore nếu chưa có
 */
export const seedInitialAppConfigToFirestore = async (): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        classInfo: sanitizeForFirestore(CLASS_INFO),
        weeks: sanitizeForFirestore(INITIAL_WEEKS),
        gradeColumnNames: sanitizeForFirestore(DEFAULT_GRADE_COLUMNS),
        updatedAt: serverTimestamp(),
      });
      console.log('Đã khởi tạo cấu hình Lớp 7C lên Cloud Firestore.');
    }
  } catch (err) {
    console.warn('Lỗi khởi tạo cấu hình lên Firestore:', err);
  }
};
