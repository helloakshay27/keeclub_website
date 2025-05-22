import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Dashboard/Pages/Sidebar';
import DashHeader from '../../Dashboard/Pages/DashHeader';

export default function RootLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <DashHeader />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 h-[calc(100vh-9vh)] overflow-y-auto pb-8">
        <Outlet />
        </div>
      </div>
    </main>
  );
}