import React from 'react'
import NavbarAdmin from '../components/NavbarAdmin'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayoutAdmin = () => {
  return (
    <div className="flex h-screen bg-gray-50">
  <div className="w-64 h-full bg-white shadow-md">
    <Sidebar />
  </div>

  <div className="flex-1 flex flex-col h-full">
    <NavbarAdmin />
    <main className="flex-1 overflow-auto p-8 mt-20">
      <Outlet />
    </main>
  </div>
</div>

  );
}

export default MainLayoutAdmin
