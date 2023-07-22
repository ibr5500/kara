import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { Button, Form } from 'react-bootstrap';
import { db } from '../config/firebase-config';

type FormValues = {
  name: string;
  email: string;
  age: number;
  creation_at: string;
  image: string;
};

const NewStudents = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const navigate = useNavigate();
  const studentsList = collection(db, 'students');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addDoc(studentsList, data);
    reset();
    navigate('/students');
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="gap-3">
      <Form.Control type="text" placeholder="Full Name" {...register('name')} />
      <Form.Control type="email" defaultValue="email@example.com" placeholder="email@example.com" {...register('email')} />
      <Form.Control type="number" placeholder="Age" {...register('age')} />
      <Form.Control type="url" placeholder="Image's URL" {...register('image')} />
      <Form.Control type="date" {...register('creation_at')} />
      <Button type="submit" variant="success">Add a Student</Button>
    </Form>
  );
};

export default NewStudents;
