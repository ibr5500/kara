import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDoc, doc as document, deleteDoc, updateDoc,
} from 'firebase/firestore';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Container, Card, Row, Col, ButtonGroup, Button, Table, Modal, Form, FloatingLabel,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

const Student: React.FC = (): JSX.Element => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm<any>();

  const docRef = document(db, 'students', `${studentId}`);

  const getdata = async (): Promise<void> => {
    try {
      const studentData = await getDoc(docRef);
      setData(studentData.data() as any);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (): Promise<void> => {
    navigate('/students');
    await deleteDoc(docRef);
    getdata();
  };

  const onSubmit: SubmitHandler<any> = async (student: any): Promise<void> => {
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

  useEffect((): void => {
    getdata();
  }, [getdata]);

  return (
    <Container>
      <Card key={data?.id} className="py-3">
        <Card.Body className="text-secondary">
          <Row>
            <Col>
              <Card.Title className="fs-3">
                Student Name:
                {' '}
                {data?.name as string}
              </Card.Title>
            </Col>
            <Col>
              <Card.Text className="fs-6 mt-1">
                Joind on Date:
                {' '}
                {data?.creation_at as string}
              </Card.Text>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Card.Text className="fs-4">
                Email:
                {' '}
                {data?.email as string}
              </Card.Text>
            </Col>
            <Col>
              <Card.Text className="fs-4">
                Age:
                {' '}
                {data?.age as number}
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
        <ButtonGroup className="w-25 m-auto" aria-label="Basic example">
          <Button variant="outline-danger" onClick={() => deleteStudent()}>Delete Student</Button>
          <Button variant="outline-secondary" onClick={() => setShowModal(true)}>Edit Student</Button>
        </ButtonGroup>
      </Card>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Created Date</th>
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
