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

type CourseData = {
  id: any;
  name: string;
  creation_at: string;
  description: string;
}

const Course: React.FC = (): JSX.Element => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<CourseData>();
  const [students, setStudents] = useState<any[]>([]);
  const [studentsCourses, setStudentsCourses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<CourseData>();

  const docRef = document(db, 'courses', `${courseId}`);
  const studentsRef = collection(db, 'students');
  const studentsCoursesRef = collection(db, 'students-courses');

  const qStudents = query(studentsRef, orderBy('creation_at', 'desc'));

  const getdata = useCallback(async (): Promise<void> => {
    try {
      const courseData = await getDoc(docRef);
      const studentsData = await getDocs(qStudents);
      const junctionData = await getDocs(studentsCoursesRef);

      const dataStudents = studentsData.docs.map((doc): object => ({
        id: doc.id, ...doc.data(),
      }));

      const dataJunction = junctionData.docs.map((doc): object => ({
        id: doc.id, ...doc.data(),
      }));

      setData(courseData.data() as CourseData);
      setStudents(dataStudents as any);
      setStudentsCourses(dataJunction as any);
    } catch (err) {
      console.error(err);
    }
  }, [docRef, qStudents, studentsCoursesRef]);

  const courseList = studentsCourses.map(
    (item): any => ((item.course_id === courseId) ? item : ''),
  );

  const deleteCourse = async (): Promise<void> => {
    navigate('/courses');
    await deleteDoc(docRef);
    getdata();
  };

  const onSubmit: SubmitHandler<CourseData> = async (course: CourseData): Promise<void> => {
    await updateDoc(docRef, {
      ...course,
      name: course.name,
      description: course.description,
    });
    reset();
    setShowModal(false);
    getdata();
  };

  const handleClose = (): void => setShowModal(false);

  const assignStudent = async (stdID: any): Promise<void> => {
    await addDoc(studentsCoursesRef, {
      course_id: courseId,
      student_id: stdID,
    });
    getdata();
  };

  const unassignStudent = async (itemID: any): Promise<void> => {
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
                  <Card.Title className="fs-3">
                    Course:
                    {' '}
                    {data?.name as string}
                  </Card.Title>
                </Col>
                <Col>
                  <Card.Text className="fs-6 mt-1">
                    Created Date:
                    {' '}
                    {data?.creation_at as string}
                  </Card.Text>
                </Col>
              </Row>
              <hr />
              <Row>
                <Card.Text className="fs-4 my-5">
                  {' '}
                  {data?.description as string}
                </Card.Text>
              </Row>
            </Card.Body>
            <ButtonGroup className="w-25 m-auto" aria-label="Basic example">
              <Button
                variant="outline-danger"
                onClick={(): any => deleteCourse()}
              >
                Delete Course
              </Button>
              <Button
                variant="outline-secondary"
                onClick={(): any => setShowModal(true)}
              >
                Edit Course
              </Button>
            </ButtonGroup>
          </Card>
        )
        : ''}
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {courseList.map((item): any => (
            (item !== '')
              ? (
                <tr key={item?.id}>
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked
                      onChange={(): any => unassignStudent(item?.id)}
                    />
                  </td>
                  <td>
                    {students.find(
                      (student): boolean => student.id === item.student_id,
                    )?.name}
                  </td>
                  <td>
                    {students.find(
                      (student): boolean => student.id === item.student_id,
                    )?.creation_at}
                  </td>
                </tr>
              )
              : ''
          ))}
          {students.map((item): any => (
            (!courseList.find((i): boolean => i.student_id === item.id))
              ? (
                <tr key={item?.id}>
                  <td>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      onChange={(): any => assignStudent(item.id)}
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
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Col>
              <FloatingLabel label="Course Name">
                <Form.Control
                  type="text"
                  defaultValue={data?.name}
                  {...register('name')}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Course Description">
                <Form.Control
                  as="textarea"
                  className="mh-100"
                  rows={6}
                  defaultValue={data?.description}
                  {...register('description')}
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

export default Course;
