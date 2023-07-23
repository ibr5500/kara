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
  email: string;
  age: number;
  creation_at: string;
  image: string;
};

const NewStudent: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const studentsList = collection(db, 'students');

  const onSubmit: SubmitHandler<FormValues> = async (data): Promise<void> => {
    await addDoc(studentsList, data);
    reset();
    navigate('/students');
  };

  return (
    <Container className="mt-2 w-auto d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column w-50 gap-3">
        <h2>Create New Student</h2>
        <Col>
          <FloatingLabel label="Student's Name">
            <Form.Control
              required
              type="text"
              placeholder="Full Name"
              {...register('name')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Student's Email">
            <Form.Control
              required
              type="email"
              placeholder="email@example.com"
              {...register('email')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Student's Age">
            <Form.Control
              required
              type="number"
              min={18}
              max={100}
              placeholder="Age"
              {...register('age')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Student's Image URL">
            <Form.Control
              required
              type="url"
              placeholder="Image's URL"
              {...register('image')}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel label="Join Date">
            <Form.Control
              required
              type="date"
              {...register('creation_at')}
            />
          </FloatingLabel>
        </Col>
        <Button type="submit" className="w-25 mx-5" variant="success">Add Student</Button>
      </Form>
    </Container>
  );
};

export default NewStudent;
