import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {
  Form, Col, Container, FloatingLabel, Row, Table,
} from 'react-bootstrap';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { db } from '../config/firebase-config';

type Course = {
  id: any;
  name: string;
  description: string;
  creation_at: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const coursesPerPage = 10;

  const courseRef = collection(db, 'courses');

  const q = query(
    courseRef,
    where('name', '>=', searchName),
    where('name', '<=', `${searchName}\uF7FF`),
    where('creation_at', '==', searchDate),
  );

  const q2 = query(courseRef, orderBy('creation_at', 'desc'));

  const elems = (searchName === '' || searchDate === '') ? q2 : q;

  const getdata = async () => {
    try {
      const courseData = await getDocs(elems);
      const data = courseData.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(data as any);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getdata();
  }, [searchName, searchDate]);

  const pageCount = Math.ceil(courses.length / coursesPerPage);
  const pageCourses = courses.slice(currentPage * coursesPerPage, (currentPage + 1) * coursesPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => setCurrentPage(selected);

  return (
    <Container>
      <Row className="mb-4">
        <Col className="mt-2 d-flex g-4">
          <FloatingLabel label="Search by name" className="me-2">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            />
          </FloatingLabel>
          <FloatingLabel label="Search by date (YYYY-MM-DD)">
            <Form.Control
              className="fs-5"
              type="text"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col>
          <Link className="btn btn-success" to="/student/new">New Student</Link>
        </Col>
      </Row>
      <Table className="border border-dark p-3">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Description</th>
            <th>Created Date</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          { pageCourses.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{(c.description.length > 50) ? `${c.description.substring(0, 50)}...` : c.description}</td>
              <td>{c.creation_at}</td>
              <td>
                <Link to={`/courses/${c.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row>
        <ReactPaginate
          previousLabel={<FcPrevious />}
          nextLabel={<FcNext />}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="pagination d-flex g-5 justify-content-center"
          activeClassName="active"
        />
      </Row>
    </Container>
  );
};

export default Courses;
