import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, limit, orderBy, query,
} from 'firebase/firestore';
import { Link, Navigate } from 'react-router-dom';
import {
  Container, Col, Table, Row,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

type Course = {
  id: string;
  name: string;
  description: string;
  creation_at: string;
}

type Student = {
  id: string;
  name: string;
  age: number;
  email: string;
  creation_at: string;
}

const Home: React.FC = (): JSX.Element => {
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

  useEffect((): any => {
    const getData = async (): Promise<void> => {
      try {
        const courseData = await getDocs(qCourses);
        const studentData = await getDocs(qStudents);

        const dataCourse = courseData.docs.map((doc): object => ({
          id: doc.id, ...doc.data(),
        }));
        setCourses(dataCourse as any);

        const dataStudents = studentData.docs.map((doc): object => ({
          id: doc.id, ...doc.data(),
        }));
        setStudents(dataStudents as any);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  });

  return (
    <div>
      {(sessionStorage.getItem('email'))
        ? (
          <Container>
            <Row>
              <Col>
                <Table className="border border-dark">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course): any => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>
                          {(course.description.length > 15)
                            ? `${course.description.substring(0, 15)}...`
                            : course.description}
                        </td>
                        <td>{course.creation_at}</td>
                        <td>
                          <Link
                            className="btn btn-outline-secondary mx-0"
                            to={`/courses/${course.id}`}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <Link
                    className="btn btn-outline-info my-1"
                    to="/courses"
                  >
                    More Courses
                  </Link>
                </Table>
              </Col>
              <Col>
                <Table className="border border-dark">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student Emaill</th>
                      <th>Joined Date</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) :any => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.creation_at}</td>
                        <td>
                          <Link
                            className="btn btn-outline-secondary"
                            to={`/students/${student.id}`}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <Link
                    className="btn btn-outline-info my-1"
                    to="/students"
                  >
                    More Student
                  </Link>
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
