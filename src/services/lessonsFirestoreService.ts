// src/services/lessonsFirestoreService.ts
// Dịch vụ đồng bộ Nội dung học tập & Bài tập môn Ngữ Văn với Firebase Cloud Firestore
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { LiteratureLessonContent } from '../types';
import { INITIAL_LESSON_CONTENTS } from '../data/mockData';
import { sanitizeForFirestore } from './studentsFirestoreService';

const COLLECTION_NAME = 'lessons';

/**
 * Lắng nghe cập nhật Nội dung học tập & Bài tập môn Ngữ Văn từ Cloud Firestore thời gian thực.
 * Tự động đồng bộ sang tất cả máy của phụ huynh và học sinh ngay lập tức.
 */
export const subscribeToFirestoreLessons = (
  onData: (lessons: LiteratureLessonContent[]) => void,
  onEmpty?: () => void,
  onError?: (error: any) => void
) => {
  try {
    const lessonsCol = collection(db, COLLECTION_NAME);
    const q = query(lessonsCol);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          if (onEmpty) onEmpty();
          return;
        }

        const items: LiteratureLessonContent[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            week: typeof data.week === 'number' ? data.week : 1,
            title: data.title || '',
            topic: data.topic || '',
            keyKnowledge: data.keyKnowledge || '',
            homework: data.homework || '',
            sampleExcerpt: data.sampleExcerpt || '',
            updatedDate: data.updatedDate || '',
            author: data.author || 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
          });
        });

        // Sắp xếp theo thứ tự tuần giảm dần (tuần mới nhất lên đầu)
        items.sort((a, b) => b.week - a.week);
        onData(items);
      },
      (error) => {
        console.warn('Firestore lessons subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Không thể kết nối Firestore lessons:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Lưu hoặc cập nhật nội dung học tập lên Firestore
 */
export const saveLessonToFirestore = async (
  lesson: LiteratureLessonContent
): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, lesson.id);
  const cleanData = sanitizeForFirestore(lesson);
  await setDoc(
    docRef,
    {
      ...cleanData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/**
 * Xóa nội dung học tập khỏi Firestore
 */
export const deleteLessonFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

/**
 * Khởi tạo dữ liệu nội dung học tập ban đầu lên Firestore nếu còn trống
 */
export const seedInitialLessonsToFirestore = async (
  lessonsToSeed: LiteratureLessonContent[] = INITIAL_LESSON_CONTENTS
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    for (const lesson of lessonsToSeed) {
      const docRef = doc(db, COLLECTION_NAME, lesson.id);
      batch.set(
        docRef,
        {
          ...sanitizeForFirestore(lesson),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
    await batch.commit();
    console.log(`Đã khởi tạo ${lessonsToSeed.length} nội dung học tập lên Cloud Firestore.`);
  } catch (err) {
    console.warn('Lỗi khởi tạo nội dung học tập lên Firestore:', err);
  }
};
