import React, {
  useState, useEffect,
}
  from 'react';
import {
  collection, doc as document, getDocs, deleteDoc, orderBy, query, where,
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

const Students = () => {
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

  const getdata = async () => {
    try {
      const studentsData = await getDocs(elems);
      const data = studentsData.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
      }));
      setStudents(data as any);
    } catch (err) {
      console.error(err);
    }
  };

  const deletStudent = async (id: string) => {
    const student = document(db, 'students', id);
    await deleteDoc(student);
    getdata();
  };

  useEffect(() => {
    getdata();
  }, [getdata]);

  return (
    <Container>
      <Row className="mb-4">
        <Col className="mt-2 d-flex g-4">
          <FloatingLabel label="Search by name" className="me-2">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            />
          </FloatingLabel>
          <FloatingLabel label="Search by date (YYYY-MM-DD)">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <Link className="btn btn-success" to="/student/new">New Student</Link>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {students.map((student) => (
          <Col key={student.id}>
            <Link className="text-decoration-none" to={`/students/${student.id}`}>
              <Card border="dark">
                <Card.Img variant="top" src={student.image} alt={student.name} />
                <Card.Body>
                  <Card.Title>{student.name}</Card.Title>
                  <Card.Text>
                    Joined on:
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