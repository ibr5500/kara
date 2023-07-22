import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDoc, doc as document, deleteDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import JunctionTable from './JunctionTable';

const Course: React.FC = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>([]);

  const docRef = document(db, 'courses', `${courseId}`);

  const getdata = async () => {
    try {
      const courseData = await getDoc(docRef);
      setCourse(courseData.data() as any);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id: string) => {
    const course = document(db, 'courses', id);
    await deleteDoc(course);
    getdata();
  };

  const updateCourse = async (id: any, data: any) => {
    await updateDoc(document(db, 'courses', id), { name: 'Updated Course', ...data });
    console.log('Course updated!!');
  };

  useEffect(() => {
    getdata();
  }, [getdata]);

  return (
    <div>
      <div>
        <div>
          <h2>
            Course Name:
            {course.name as string}
          </h2>
          <p>
            Date:
            {course.creation_at as string}
          </p>
        </div>
        <div>
          <p>
            Desc:
            {course.description as string}
          </p>
          <div>
            <button
              type="button"
              onClick={() => deleteCourse(course.id as any)}
            >
              Delete Course
            </button>
          </div>
        </div>
      </div>
      <JunctionTable />
    </div>
  );
};

export default Course;
