import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Formulaire } from './component/formulaire/Formulaire';
import { Admin } from './component/page-admin/Admin'
import { AdminSup } from './component/page-admin/AdminSup'
import Log from './component/Log/Log';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Log />} />
        <Route path="/Formulaire" element={<Formulaire />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Admin/AdminSup" element={<AdminSup />} />




      </Routes>
    </>
  );
}

export default App;
