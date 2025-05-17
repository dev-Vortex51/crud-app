/* eslint-disable react/prop-types */
import styles from './Confirm.module.css';
function Confirm({ children }) {
  return (
    <div className={styles.confirmContainer}>
      <div className={styles.confirm}>{children}</div>
    </div>
  );
}

export default Confirm;
