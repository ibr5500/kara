import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import {
  Container, Button, Form, Col, FloatingLabel,
} from 'react-bootstrap';
import { db } from '../config/firebase-config';

type FormValues = {
  name: string;
  description: string;
  creation_at: string;
};

const NewCourse: React.FC = (): JSX.Element => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const navigate = useNavigate();
  const coursesList = collection(db, 'courses');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addDoc(coursesList, data);
    reset();
    navigate('/courses');
  };

  return (
    <Container className="mt-2 w-auto d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-50 gap-3">
        <h2>Create New Course</h2>
        <Col>
          <FloatingLabel label="Course's Name">
            <Form.Control
              required
              type="text"
              placeholder="Course's Name"
              {...register('name')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Course's Description">
            <Form.Control
              required
              as="textarea"
              style={{ height: '100px' }}
              placeholder="Course's Description"
              {...register('description')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Creation Date">
            <Form.Control
              required
              type="date"
              {...register('creation_at')}
            />
          </FloatingLabel>
        </Col>
        <Button type="submit" className="w-25 mx-5" variant="success">Add Course</Button>
      </Form>
    </Container>
  );
};

export default NewCourse;
