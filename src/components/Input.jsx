/* eslint-disable react/prop-types */
import styles from './Input.module.css';
function Input({ type, placeholder, value, onChange }) {
  console.log(value);
  return (
    <input
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
      className={styles.input}
    />
  );
}

export default Input;
