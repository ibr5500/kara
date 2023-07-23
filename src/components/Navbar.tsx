import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Navbar, Button, Nav, Container, Form,
} from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const NavBar: React.FC = (): JSX.Element => {
  const { handleSubmit } = useForm<any>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<any> = async (): Promise<void> => {
    await signOut(auth);
    await sessionStorage.removeItem('email');
    setTimeout((): any => {
      console.log('Logged out - successfully');
      navigate('/login');
    }, 1500);
  };

  return (
    <Navbar expand="lg" className="mb-3" sticky="top">
      <Container className="d-flex flex-row">
        <Navbar.Brand href="/">
          <img
            src="./kara_nbg.png"
            width="50"
            height="50"
            className="d-inline-block align-top border border-success rounded-circle"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        {(auth.currentUser || sessionStorage.getItem('email'))
          ? (
            <Nav className="d-flex flex-row g-3 justify-content-end">
              <Nav.Item className="mx-2">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-2">
                <Nav.Link href="/courses">Courses</Nav.Link>
              </Nav.Item>
              <Nav.Item className="mx-2">
                <Nav.Link href="/students">Students</Nav.Link>
              </Nav.Item>
              <Form className="me-auto" onSubmit={handleSubmit(onSubmit)}>
                <Button variant="outline-danger" className="logout" type="submit">
                  LogOut
                </Button>
              </Form>
            </Nav>
          )
          : ''}
      </Container>
    </Navbar>
  );
};

export default NavBar;
