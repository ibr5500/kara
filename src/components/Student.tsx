import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDoc, doc as document, deleteDoc, updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase-config';
import JunctionTable from './JunctionTable';

const Student: React.FC = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<any>([]);

  const docRef = document(db, 'students', `${studentId}`);

  const getdata = async () => {
    try {
      const studentData = await getDoc(docRef);
      setStudent(studentData.data() as any);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (id: string) => {
    const course = document(db, 'students', id);
    await deleteDoc(course);
    getdata();
  };

  const updateCourse = async (id: any, data: any) => {
    await updateDoc(document(db, 'students', id), { name: 'Updated Course', ...data });
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
            {student.name as string}
          </h2>
          <p>
            Date:
            {student.creation_at as string}
          </p>
        </div>
        <div>
          <p>
            Email:
            {student.email as string}
          </p>
          <p>
            Age:
            {student.age as number}
          </p>
          <div>
            <button
              type="button"
              onClick={() => deleteStudent(student.id as any)}
            >
              Delete Student
            </button>
          </div>
        </div>
      </div>
      <JunctionTable />
    </div>
  );
};

export default Student;
