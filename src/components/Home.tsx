import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, limit, orderBy, query,
} from 'firebase/firestore';
import { Link, Navigate } from 'react-router-dom';
import {
  Container, Col, Table, Row,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

interface Course {
  id: string;
  name: string;
  description: string;
  creation_at: string;
}

interface Student {
  id: string;
  name: string;
  age: number;
  email: string;
  creation_at: string;
}

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const courseRef = collection(db, 'courses');
  const studentRef = collection(db, 'students');

  const qCourses = query(
    courseRef,
    orderBy('creation_at', 'desc'),
    limit(10),
  );

  const qStudents = query(
    studentRef,
    orderBy('creation_at', 'desc'),
    limit(10),
  );

  const getCoursesData = async () => {
    try {
      const courseData = await getDocs(qCourses);
      const data = courseData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(data as any);
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentsData = async () => {
    try {
      const studentData = await getDocs(qStudents);
      const data = studentData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStudents(data as any);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getCoursesData();
    getStudentsData();
  }, [getCoursesData, getStudentsData]);

  return (
    <div>
      {(sessionStorage.getItem('email'))
        ? (
          <Container>
            <Row>
              <Col>
                <Table className="border border-dark p-3">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Description</th>
                      <th>Creation Date</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{(course.description.length > 20) ? `${course.description.substring(0, 20)}...` : course.description }</td>
                        <td>{course.creation_at}</td>
                        <td>
                          <Link className="btn btn-outline-secondary" to={`/courses/${course.id}`}>Details</Link>
                        </td>
                      </tr>
                    ))}
                    <Link className="btn btn-outline-info my-1" to="/courses">More Courses</Link>
                  </tbody>
                </Table>
              </Col>
              <Col>
                <Table className="border border-dark p-3">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student Emaill</th>
                      <th>Joined Date</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.creation_at}</td>
                        <td>
                          <Link className="btn btn-outline-secondary" to={`/students/${student.id}`}>Details</Link>
                        </td>
                      </tr>
                    ))}
                    <Link className="btn btn-outline-info my-1" to="/students">More Student</Link>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        )
        : <Navigate replace to="/login" />}
    </div>
  );
};

export default Home;
