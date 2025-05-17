/* eslint-disable react/prop-types */
import styles from './EmployeeList.module.css';
function EmployeeList({ children }) {
  return <li className={styles.list}>{children}</li>;
}

export default EmployeeList;
