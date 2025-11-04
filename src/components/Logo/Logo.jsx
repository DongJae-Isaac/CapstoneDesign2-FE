import { Link } from 'react-router';
import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <Link to={{ pathname: '/' }} className={styles.logo}>
      EcoNutri
    </Link>
  );
};