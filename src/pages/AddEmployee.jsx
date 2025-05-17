/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import swal from 'sweetalert2';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './AddEmployee.module.css';

function AddEmployee({ setTitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state?.employee || null;

  const [firstName, setFirstName] = useState(employee?.firstName || '');
  const [lastName, setLastName] = useState(employee?.lastName || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [salary, setSalary] = useState(employee?.salary || '');
  const [date, setDate] = useState(employee?.hireDate || '');
  const [loading, setLoading] = useState(false);

  const isEdit = !!employee;

  useEffect(() => {
    setTitle(!isEdit ? 'Add Employee' : 'Update Employee');
  });

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !salary ||
      !date ||
      !email.includes('@') ||
      !email.includes('.')
    ) {
      return swal.fire('Error!', 'All fields are required.', 'error');
    }

    setLoading(true);

    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees.');
      }
      const employees = await response.json();
      const nextId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;

      const url = isEdit ? `/api/employees/${employee.id}` : '/api/employees';

      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        id: isEdit ? employee.id : String(nextId),
        firstName,
        lastName,
        email,
        salary,
        hireDate: date,
      };

      console.log('Request Body:', body);

      const saveResponse = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!saveResponse.ok) {
        throw new Error(isEdit ? 'Failed to update employee.' : 'Failed to add employee.');
      }

      navigate('/app', {
        state: {
          alertTitle: `${isEdit ? 'Updated' : 'Added'}`,
          alertType: 'success',
          alertMessage: `${firstName} ${lastName}'s data ${isEdit ? 'updated' : 'added'}!`,
        },
      });
    } catch (error) {
      console.error('Error occurred:', error);
      swal.fire('Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.body}>
      <h1>{isEdit ? 'Edit Employee' : 'Add Employee'}</h1>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <label>First Name</label>
        <Input value={firstName} type='text' onChange={e => setFirstName(e.target.value)} />
        <label>Last Name</label>
        <Input value={lastName} type='text' onChange={e => setLastName(e.target.value)} />
        <label>Email</label>
        <Input value={email} type='email' onChange={e => setEmail(e.target.value)} />
        <label>Salary</label>
        <Input value={salary} type='number' onChange={e => setSalary(e.target.value)} />
        <label>Date</label>
        <Input value={date} type='date' onChange={e => setDate(e.target.value)} />
      </form>
      <div className={styles.div}>
        <Button onClick={handleSubmit} type='Add' disabled={loading}>
          {loading ? (isEdit ? 'Saving Changes...' : 'Adding...') : isEdit ? 'Update' : 'Add'}
        </Button>
        <Button type='Cancel' onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </main>
  );
}

export default AddEmployee;
