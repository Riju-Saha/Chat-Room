import React from 'react'
import LoginPage from './auth/login/page'
import Navbar from '@/components/navbar'

export default function home() {
  return (
    <div>
      <Navbar />
      <LoginPage />
    </div>
  )
}
