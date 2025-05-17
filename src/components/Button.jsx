/* eslint-disable react/prop-types */
import styles from './Button.module.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
function Button({ children, type, onClick }) {
  return (
    <Tippy
      content={children}
      placement={
        type === 'Login' || type === 'Cancel' || type === 'Logout' || type === 'Delete'
          ? 'right'
          : type === 'Add' || type === 'Edit'
          ? 'left'
          : 'top'
      }
      delay={[300, 100]}
      theme='custom'
      arrow={true}
      animation='scale'
      offset={[0, 15]}
    >
      <button onClick={onClick} className={styles[`btn${type}`]}>
        {children}
      </button>
    </Tippy>
  );
}

export default Button;
