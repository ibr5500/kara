import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Navbar, Button, Nav, Container, Form,
} from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const NavBar: React.FC = () => {
  const { register, handleSubmit } = useForm<any>();
  const navigate = useNavigate();

  // const LogOut = async () => {
  //   try {
  //     await signOut(auth);
  //     sessionStorage.removeItem('email');
  //     console.log('Logged out - successfully');
  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 3000);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const onSubmit: SubmitHandler<any> = async () => {
    await signOut(auth);
    await sessionStorage.removeItem('email');
    setTimeout(() => {
      console.log('Logged out - successfully');
      navigate('/login');
    }, 1500);
  };

  return (
    <Navbar expand="lg" className="p-3 bg-dark mb-3" sticky="top">
      <Container fluid>
        <Nav variant="underline" className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <Nav.Item>
              <Nav.Link className="text-white" href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-white" href="/courses">Courses</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="text-white" href="/students">Students</Nav.Link>
            </Nav.Item>
          </div>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Form className="me-auto" onSubmit={handleSubmit(onSubmit)}>
          <Button variant="outline-danger" className="" type="submit">
            LogOut
          </Button>
        </Form>
      </Container>
    </Navbar>
  );
};

export default NavBar;
