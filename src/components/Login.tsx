import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Form, Button, Col, Row, Container, FloatingLabel,
} from 'react-bootstrap';
import { auth } from '../config/firebase-config';

type UserData = {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<UserData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<UserData> = async (elem) => {
    await signInWithEmailAndPassword(auth, elem.email, elem.password);
    await sessionStorage.setItem('email', elem.email);
    setTimeout(() => {
      console.log('Admin logged in - successfully');
      reset();
      navigate('/');
    }, 2500);
  };

  // const LogOut = async () => {
  //   try {
  //     await signOut(auth);
  //     setTimeout(() => {
  //       sessionStorage.clear();
  //       console.log('Logged out - successfully');
  //       navigate('/login');
  //     }, 2500);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-5 me-auto">
          <Col className="mt-5 me-auto">
            <FloatingLabel label="Admin&apos;s Email address" className="m-3">
              <Form.Control type="text" defaultValue="admin@gmail.com" {...register('email')} />
            </FloatingLabel>
            <FloatingLabel label="Admin&apos;s Password" className="m-3">
              <Form.Control type="password" placeholder="Password" {...register('password')} />
            </FloatingLabel>
          </Col>
        </Row>
        <Button variant="success" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
