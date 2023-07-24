import React, {
  useState, useEffect,
}
  from 'react';
import {
  collection, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  Form, Container, Row, Col, Card, FloatingLabel,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

type Student = {
  id: any;
  name: string;
  email: string;
  age: number;
  image: string;
  creation_at: string;
}

const Students: React.FC = (): JSX.Element => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');

  const studentRef = collection(db, 'students');

  const q = query(
    studentRef,
    where('name', '>=', searchName),
    where('name', '<=', `${searchName}\uF7FF`),
    where('creation_at', '==', searchDate),
  );

  const q2 = query(studentRef, orderBy('creation_at', 'desc'));

  const elems = (searchName === '' || searchDate === '') ? q2 : q;

  useEffect((): any => {
    const getdata = async (): Promise<void> => {
      try {
        const studentsData = await getDocs(elems);
        const data = studentsData.docs.map((doc): object => ({
          id: doc.id, ...doc.data(),
        }));
        setStudents(data as any);
      } catch (err) {
        console.error(err);
      }
    };
    getdata();
  });

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col className="mt-2 d-flex g-4 w-100">
          <FloatingLabel label="Search by name" className="w-50 me-2">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchName}
              onChange={
                (e): any => setSearchName(
                  e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
                )
}
            />
          </FloatingLabel>
          <FloatingLabel className="w-50" label="Search by date (YYYY-MM-DD)">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchDate}
              onChange={(e): any => setSearchDate(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <Link className="btn btn-success" to="/student/new">New Student</Link>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {students.map((student): any => (
          <Col key={student.id}>
            <Link className="text-decoration-none" to={`/students/${student.id}`}>
              <Card border="dark">
                <Card.Img
                  variant="top"
                  className="mh-50"
                  src={student.image}
                  alt={`${student.name}'s avatar`}
                />
                <Card.Body>
                  <Card.Title>{student.name}</Card.Title>
                  <Card.Text>
                    Joined on:
                    {' '}
                    {student.creation_at}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Students;
