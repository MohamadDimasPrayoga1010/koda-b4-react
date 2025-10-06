import React from 'react'
import NavbarAdmin from '../components/NavbarAdmin'
import { Outlet } from 'react-router-dom'

const MainLayoutAdmin = () => {
  return (
    <div>
      <NavbarAdmin />
      <Outlet />
    </div>
  )
}

export default MainLayoutAdmin
