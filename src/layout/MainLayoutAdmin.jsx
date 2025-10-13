import React from 'react'
import NavbarAdmin from '../components/NavbarAdmin'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayoutAdmin = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 overflow-auto p-8 mt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayoutAdmin
