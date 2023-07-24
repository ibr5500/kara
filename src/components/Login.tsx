import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Form, Button, Col, Row, Container, FloatingLabel, Modal,
} from 'react-bootstrap';
import { auth } from '../config/firebase-config';

type UserData = {
  email: string;
  password: string;
}

const Login: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const { register, handleSubmit, reset } = useForm<UserData>();

  const handleClose = (): any => {
    setShow(false);
    setShowError(false);
    reset();
  };

  const handleShow = (): any => {
    setShow(true);
    setShowError(true);
  };

  const onSubmit: SubmitHandler<UserData> = async (elem): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, elem.email, elem.password);
      await sessionStorage.setItem('email', elem.email);
      console.log('Admin logged in - successfully');
      reset();
      navigate('/');
    } catch (err: any) {
      handleShow();
    }
  };

  return (
    <Container className="mt-5 w-auto d-flex justify-content-center">
      <Form className="w-50" onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-5 me-auto">
          <Col className="mt-5 me-auto">
            <FloatingLabel label="Admin&apos;s Email address" className="m-3">
              <Form.Control
                required
                type="text"
                defaultValue="admin@gmail.com"
                {...register('email')}
              />
            </FloatingLabel>
            <FloatingLabel label="Admin&apos;s Password" className="m-3">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                {...register('password')}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Button variant="success" type="submit">
          Login
        </Button>
      </Form>
      {showError && (
        <Modal
          className="popup"
          show={show}
          onHide={handleClose}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body className="popup-message">Wrong password. Please try this [1 2 3 4 5 6]</Modal.Body>
          <Button
            className="popup-close"
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
