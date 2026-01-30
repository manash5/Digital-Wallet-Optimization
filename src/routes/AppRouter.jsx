import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import Mainpage from '../pages/mainpage'

const AppRouter = () => {
  return (
    <Routes>
         <Route path="/" element={<Mainpage />} />
    </Routes>
  )
}

export default AppRouter
