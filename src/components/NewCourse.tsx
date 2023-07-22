import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';

type FormValues = {
  name: string;
  description: string;
  creation_at: string;
};

const NewCourse = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const navigate = useNavigate();
  const coursesList = collection(db, 'courses');

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addDoc(coursesList, data);
    reset();
    navigate('/courses');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Course's Name" {...register('name')} />
      <input type="text" placeholder="Course's description" {...register('description')} />
      <input type="date" {...register('creation_at')} data-date-format="DD-MMM-YYYY" />
      <input type="submit" />
    </form>
  );
};

export default NewCourse;
