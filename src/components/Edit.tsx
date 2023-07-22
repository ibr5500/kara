import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase-config';

type FormValues = {
  name: string;
  description: string;
  creation_at: string;
};

const Edit = (id: any) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await updateDoc(doc(db, 'courses', id as string), { name: data.name, description: data.description, creation_at: data.creation_at });
    console.log('Course updated!!');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Course's Name" {...register('name')} />
      <input type="text" placeholder="Course's description" {...register('description')} />
      <input type="date" {...register('creation_at')} />
      <input type="submit" />
    </form>
  );
};

export default Edit;
