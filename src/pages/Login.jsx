/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Login.module.css';

function Login({ setTitle }) {
  const [username, setUsername] = useState('admin@example.com');
  const [password, setPassword] = useState('qwerty');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTitle('Login');
  });

  const handleLogin = () => {
    if (!username || !password || !username.includes('@') || !username.includes('.')) {
      return swal.fire({
        title: 'Error!',
        text: 'Invalid email or password!',
        icon: 'error',
        customClass: {
          popup: 'my-custom-popup',
        },
      });
    }

    if (username && password)
      swal.fire({
        showConfirmButton: false,
        timer: 1500,
        willOpen: () => {
          swal.showLoading();
          setLoading(true);
        },
        willClose: () => {
          navigate('/app', {
            state: {
              alertType: 'success',
              alertLogin: 'Logged in successfully!',
            },
          });
          setLoading(false);
        },
      });
  };

  return (
    <main className={styles.login}>
      <h1>Admin Login</h1>
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <label>Email</label>
        <Input
          value={username}
          placeholder='admin@example.com'
          type='text'
          onChange={e => setUsername(e.target.value)}
        />
        <label>Password</label>
        <Input
          value={password}
          placeholder='qwerty'
          type='password'
          onChange={e => setPassword(e.target.value)}
        />
      </form>
      <Button type='Login' onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </main>
  );
}

export default Login;
