import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Announcement } from '../types';

const COLLECTION_NAME = 'announcements';

/**
 * Lắng nghe cập nhật thông báo/dặn dò thời gian thực từ Cloud Firestore.
 * Tất cả phụ huynh và giáo viên trên mọi thiết bị sẽ tự động đồng bộ ngay lập tức.
 */
export const subscribeToFirestoreAnnouncements = (
  onData: (announcements: Announcement[]) => void,
  onError?: (error: any) => void
) => {
  try {
    const announcementsRef = collection(db, COLLECTION_NAME);
    // Thử truy vấn có sắp xếp theo thời gian mới nhất
    const q = query(announcementsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Announcement[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            title: data.title || '',
            content: data.content || '',
            category: data.category || 'reminder',
            date: data.date || '',
            author: data.author || 'Cô Vân Anh - Giáo viên Ngữ Văn',
            pinned: Boolean(data.pinned),
          });
        });

        // Sắp xếp: bài ghim (pinned) lên đầu, sau đó sắp xếp theo ID/ngày
        items.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.id.localeCompare(a.id);
        });

        onData(items);
      },
      (error) => {
        console.warn('Firestore real-time subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Không thể kết nối Firestore:', err);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Thêm thông báo mới lên Cloud Firestore
 */
export const addAnnouncementToFirestore = async (
  ann: Omit<Announcement, 'id'>
): Promise<string> => {
  const customId = `ann-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, customId);

  await setDoc(docRef, {
    title: ann.title,
    content: ann.content,
    category: ann.category,
    date: ann.date,
    author: ann.author,
    pinned: Boolean(ann.pinned),
    createdAt: serverTimestamp(),
  });

  return customId;
};

/**
 * Xóa thông báo khỏi Cloud Firestore
 */
export const deleteAnnouncementFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
