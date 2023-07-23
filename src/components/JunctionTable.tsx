import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const JunctionTable: React.FC = (): JSX.Element => {
  const [studentsCourses, setStudentsCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const studentsRef = collection(db, 'students');
  const coursesRef = collection(db, 'courses');
  const studentCoursesRef = collection(db, 'students_courses');

  const getStundetsData = async () => {
    try {
      const studentsData = await getDocs(studentsRef);
      const filterdStudents = studentsData.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
      }));
      setStudents(filterdStudents);
    } catch (err) {
      console.error(err);
    }
  };

  const getCoursesData = async () => {
    try {
      const coursesData = await getDocs(coursesRef);
      const filterdCourses = coursesData.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
      }));
      setCourses(filterdCourses);
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentCourseData = async () => {
    try {
      const studentCoursesData = await getDocs(studentCoursesRef);
      const filteredStudentCoursesData = studentCoursesData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsCourses(filteredStudentCoursesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStundetsData();
    getCoursesData();
    getStudentCourseData();
  }, []);

  return (
    <div>
      {studentsCourses.map((item) => (
        <div key={item.id}>
          <h2>{students.find((student) => student.id === item.student_id)?.name}</h2>
          <p>{courses.find((course) => course.id === item.course_id)?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default JunctionTable;
