import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Courses from './components/Courses';
import Students from './components/Students';
import Course from './components/Course';
import './App.css';
import NavBar from './components/Navbar';
import Login from './components/Login';
import NewCourse from './components/NewCourse';
import NewStudent from './components/NewStudent';
import Student from './components/Student';

function App(): JSX.Element {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<Course />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:studentId" element={<Student />} />
        <Route path="/course/new" element={<NewCourse />} />
        <Route path="/student/new" element={<NewStudent />} />
      </Routes>
    </div>
  );
}

export default App;
