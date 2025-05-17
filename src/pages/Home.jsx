/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import styles from './Home.module.css';
import Button from '../components/Button';
import EmployeeList from '../components/EmployeeList';

function format(value) {
  const formattedCurrency = new Intl.NumberFormat('en-Us', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: null,
  }).format(value);
  return formattedCurrency;
}
function Home({ setTitle }) {
  const [lists, setList] = useState([]);
  const location = useLocation();
  const { alertType, alertMessage, alertTitle, alertLogin } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Home');
  });

  useEffect(() => {
    async function fetchList() {
      try {
        const res = await fetch('/api/employees');
        if (!res.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await res.json();
        setList(data);
      } catch (error) {
        swal.fire('Error', error.message, 'error');
      }
    }

    fetchList();

    if ((alertType && alertMessage) || alertLogin) {
      swal
        .fire({
          title: alertTitle || alertLogin,
          icon: alertType,
          text: alertMessage,
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'success-custom-popup',
          },
        })
        .then(() => {
          navigate(location.pathname, { replace: true });
        });
    }
  }, [alertType, alertMessage, alertTitle, location.pathname, navigate, alertLogin]);

  function handleAddEmployee() {
    navigate('/add');
  }

  function handleEdit(employee) {
    navigate('/add', { state: { employee } });
  }

  async function handleDelete(employeeId) {
    try {
      const employeeToDelete = lists.find(emp => emp.id === employeeId);
      if (employeeToDelete) {
        swal
          .fire({
            title: 'Are you sure?',
            text: "You won't be able to revert!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No Cancel',
            customClass: {
              popup: 'my-custom-popup',
            },
            didOpen: () => {
              const confirmButton = document.querySelector('.swal2-confirm');
              if (confirmButton) {
                confirmButton.focus();
              }
            },
          })
          .then(async result => {
            if (result.isConfirmed) {
              const response = await fetch(`/api/employees/${employeeId}`, {
                method: 'DELETE',
              });

              if (!response.ok) {
                throw new Error('Failed to delete employee');
              }

              setList(prevEmployees =>
                prevEmployees.filter(employee => employee.id !== employeeId),
              );
              swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: `${employeeToDelete.firstName} ${employeeToDelete.lastName}'s data  deleted.`,
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                  popup: 'success-custom-popup',
                },
              });
            }
          });
      }
    } catch (error) {
      swal.fire('Error', error.message, 'error');
    }
  }

  function handleLogout() {
    swal
      .fire({
        title: 'Logging out',
        text: 'Are you sure you want to log out?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'my-custom-popup', // Target the popup container
        },
      })
      .then(result => {
        if (result.value) {
          swal.fire({
            timer: 1500,
            showConfirmButton: false,
            willOpen: () => {
              swal.showLoading();
            },
            willClose: () => {
              navigate('/');
            },
          });
        }
      });
  }

  return (
    <main className={styles.home}>
      <h1>Employee Management Software</h1>
      <div className={styles.div}>
        <Button onClick={handleAddEmployee} type='Employee'>
          Add Employee
        </Button>
        <Button type='Logout' onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className={`${styles.row} ${styles.header}`}>
        <div>No.</div>
        <div>First Name</div>
        <div>Last Name</div>
        <div>Email</div>
        <div>Salary</div>
        <div>Date</div>
        <div>Actions</div>
      </div>
      <ul className={styles.listContainer}>
        {lists.length > 0 ? (
          lists.map((list, id) => (
            <EmployeeList key={list.id}>
              <span>{id + 1}</span>
              <span>{list.firstName}</span>
              <span>{list.lastName}</span>
              <span>{list.email}</span>
              <span>{format(list.salary)}</span>
              <span>{list.hireDate}</span>
              <div className={styles.actions}>
                <Button type='Edit' onClick={() => handleEdit(list)}>
                  Edit
                </Button>
                <Button type='Delete' onClick={() => handleDelete(list.id)}>
                  Delete
                </Button>
              </div>
            </EmployeeList>
          ))
        ) : (
          <p className={styles.empty}>No Employees</p>
        )}
      </ul>
    </main>
  );
}

export default Home;
