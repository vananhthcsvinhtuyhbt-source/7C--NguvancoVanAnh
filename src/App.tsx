import React, { useState } from 'react';
import { ClassProvider, useClass } from './context/ClassContext';
import { Header } from './components/Header';
import { ParentView } from './components/ParentView';
import { TeacherView } from './components/TeacherView';
import { LoginModal } from './components/LoginModal';

function MainApp() {
  const { role } = useClass();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header onOpenLogin={() => setIsLoginOpen(true)} />

      {role === 'parent' ? <ParentView /> : <TeacherView />}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClassProvider>
      <MainApp />
    </ClassProvider>
  );
}
