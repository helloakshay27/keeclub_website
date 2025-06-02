import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Dashboard/Pages/Sidebar';
import DashHeader from '../../Dashboard/Pages/DashHeader';
import DashFooter from '../../Dashboard/Pages/DashFooter';

export default function RootLayout() {
  return (
    <main className="h-screen flex flex-col">
      <DashHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-[calc(100vh-9vh)] overflow-y-auto pb-4">
          <div className="flex flex-col min-h-full">
            <div className="flex-1">
              <Outlet />
            </div>
            {/* <footer className="bg-gray-800 text-white text-center py-4">
             <DashFooter/>
            </footer> */}
          </div>
        </div>
      </div>
    </main>
  );
}
