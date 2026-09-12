// firebaseConfig.js - Khởi tạo Firebase App và Cloud Firestore cho Sổ liên lạc Lớp 7C
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Hỗ trợ lấy cấu hình từ biến môi trường (Vite: VITE_FIREBASE_...) hoặc cấu hình tùy chỉnh
const getStoredCustomConfig = () => {
  try {
    const custom = localStorage.getItem('so_lien_lac_7c_firebase_custom_config');
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.warn('Không thể đọc cấu hình Firebase tùy chỉnh:', e);
  }
  return null;
};

const customConfig = getStoredCustomConfig();

export const firebaseConfig = customConfig || {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_SO_LIEN_LAC_LOP_7C_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "so-lien-lac-7c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "so-lien-lac-7c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "so-lien-lac-7c.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "373721379714",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:373721379714:web:so-lien-lac-7c-web-app",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

// 3. Khởi tạo Firebase App (tránh duplicate app)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 4. Khởi tạo Firestore
export const db = getFirestore(app);

// Hàm lưu cấu hình mới nếu người dùng muốn kết nối trực tiếp đến project console của mình
export const saveCustomFirebaseConfig = (newConfig) => {
  try {
    localStorage.setItem('so_lien_lac_7c_firebase_custom_config', JSON.stringify(newConfig));
    window.location.reload();
  } catch (e) {
    console.error('Lỗi khi lưu cấu hình Firebase:', e);
  }
};

export default { app, db, firebaseConfig };
