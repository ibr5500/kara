import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoc, doc as document, deleteDoc, updateDoc, collection, getDocs, addDoc, orderBy, query,
} from 'firebase/firestore';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Container, Card, Row, Col, ButtonGroup, Button, Table, Modal, Form, FloatingLabel,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

type StudentData = {
  id: any;
  name: string;
  age: number;
  email: string;
  image: string;
  creation_at: string;
}

const Student: React.FC = (): JSX.Element => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentData>();
  const [courses, setCourses] = useState<any[]>([]);
  const [studentsCourses, setStudentsCourses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<StudentData>();

  const docRef = document(db, 'students', `${studentId}`);
  const coursesRef = collection(db, 'courses');
  const studentsCoursesRef = collection(db, 'students-courses');

  const qCourses = query(coursesRef, orderBy('creation_at', 'desc'));

  const getdata = useCallback(async (): Promise<void> => {
    try {
      const studentData = await getDoc(docRef);
      const coursesData = await getDocs(qCourses);
      const junctionData = await getDocs(studentsCoursesRef);

      const dataCourses = coursesData.docs.map((doc): object => ({
        id: doc.id, ...doc.data(),
      }));

      const dataJunction = junctionData.docs.map((doc): object => ({
        id: doc.id, ...doc.data(),
      }));

      setData(studentData.data() as any);
      setCourses(dataCourses as any);
      setStudentsCourses(dataJunction as any);
    } catch (err) {
      console.error(err);
    }
  }, [docRef, qCourses, studentsCoursesRef]);

  const stds = studentsCourses.map(
    (item): any => ((item.student_id === studentId) ? item : ''),
  );

  const deleteStudent = async (): Promise<void> => {
    navigate('/students');
    await deleteDoc(docRef);
    getdata();
  };

  const onSubmit: SubmitHandler<StudentData> = async (student: StudentData): Promise<void> => {
    await updateDoc(docRef, {
      ...student,
      name: student.name,
      age: student.age,
      email: student.email,
      image: student.image,
    });
    reset();
    setShowModal(false);
    getdata();
  };

  const handleClose = (): void => setShowModal(false);

  const assignCourse = async (courseID: any): Promise<void> => {
    await addDoc(studentsCoursesRef, {
      course_id: courseID,
      student_id: studentId,
    });
    getdata();
  };

  const unassignCourse = async (itemID: any): Promise<void> => {
    const delRef = document(db, 'students-courses', itemID);
    await deleteDoc(delRef);
    getdata();
  };

  useEffect((): void => {
    getdata();
  }, [getdata]);

  return (
    <Container>
      {data
        ? (
          <Card key={data?.id} className="py-3">
            <Card.Body className="text-secondary">
              <Row>
                <Col>
                  <Card.Img
                    className="rounded"
                    src={data?.image}
                    alt={`${data?.name}'s avatar`}
                  />
                </Col>
                <Col className="g-4">
                  <Card.Title className="fs-3 mb-4">
                    {data?.name as string}
                  </Card.Title>
                  <Card.Text className="fs-4">
                    {' '}
                    {data?.email as string}
                  </Card.Text>
                </Col>
                <Col className="g-4 fs-5">
                  <Card.Text className="mb-4">
                    Joind on:
                    {' '}
                    {data?.creation_at as string}
                  </Card.Text>
                  <Card.Text>
                    Age:
                    {' '}
                    {data?.age as number}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <ButtonGroup className="w-25 m-auto" aria-label="Basic example">
              <Button
                variant="outline-danger"
                onClick={(): any => deleteStudent()}
              >
                Delete Student
              </Button>
              <Button
                variant="outline-secondary"
                onClick={(): any => setShowModal(true)}
              >
                Edit Student
              </Button>
            </ButtonGroup>
          </Card>
        )
        : ''}
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stds.map((item): any => (
            (item !== '')
              ? (
                <tr key={item?.id}>
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(): any => unassignCourse(item?.id)}
                    />
                  </td>
                  <td>
                    {courses.find(
                      (course): boolean => course.id === item.course_id,
                    )?.name}
                  </td>
                  <td>
                    {courses.find(
                      (course): boolean => course.id === item.course_id,
                    )?.creation_at}
                  </td>
                </tr>
              )
              : ''
          ))}
          {courses.map((item): any => (
            (!stds.find((i): boolean => i.course_id === item.id))
              ? (
                <tr key={item?.id}>
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      onChange={(): any => assignCourse(item.id)}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.creation_at}</td>
                </tr>
              )
              : ''
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Col>
              <FloatingLabel label="Student's Name">
                <Form.Control
                  type="text"
                  defaultValue={data?.name}
                  {...register('name')}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Student's Age">
                <Form.Control
                  type="number"
                  min={18}
                  max={100}
                  defaultValue={data?.age}
                  {...register('age')}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Student's Email">
                <Form.Control
                  type="text"
                  defaultValue={data?.email}
                  {...register('email')}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Student's Image URL">
                <Form.Control
                  type="url"
                  defaultValue={data?.image}
                  {...register('image')}
                />
              </FloatingLabel>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={handleClose}>Cancel</Button>
            <Button variant="outline-success" type="submit">Save Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Student;
