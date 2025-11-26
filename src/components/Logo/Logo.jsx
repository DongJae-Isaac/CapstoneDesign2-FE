import { Link } from 'react-router';
import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <Link to={{ pathname: '/usermain' }} className={styles.logo}>
      EcoNutri
    </Link>
  );
};