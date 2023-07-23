import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  getDoc, doc as document, deleteDoc, updateDoc,
} from 'firebase/firestore';
import {
  Modal, Form, Card, Button, ButtonGroup, Container, Row, Col, Table, FloatingLabel,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';
// import JunctionTable from './JunctionTable';

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
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<CourseData>();

  const docRef = document(db, 'courses', `${courseId}`);

  const getdata = async () => {
    try {
      const courseData = await getDoc(docRef);
      setData(courseData.data() as CourseData);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async () => {
    navigate('/courses');
    await deleteDoc(docRef);
    getdata();
  };

  const onSubmit: SubmitHandler<CourseData> = async (course: CourseData) => {
    await updateDoc(docRef, {
      ...course,
      name: course.name,
      description: course.description,
    });
    reset();
    setShowModal(false);
    getdata();
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    getdata();
  }, [getdata]);

  return (
    <Container>
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
          <Button variant="outline-danger" onClick={() => deleteCourse()}>Delete Course</Button>
          <Button variant="outline-secondary" onClick={() => setShowModal(true)}>Edit Course</Button>
        </ButtonGroup>
      </Card>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Form.Check />
            </td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
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
