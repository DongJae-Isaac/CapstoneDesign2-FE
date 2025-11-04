import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import { Logo } from '../Logo/Logo';
import { HStack } from '../Stack/HStack';
import styles from './Header.module.css';

/**
 * @typedef {Object} Props
 * @property {boolean} back
 * @property {object} children
 *
 * @param {Props}
 * @returns
 */
const Header = ({ back, children }) => {
  return (
    <header className={styles.header}>
      <HStack between>
        <HStack gap={3}>
          {back && <ArrowLeft style={{ color: 'var(--econutri-fg)' }} />}
          <Logo />
        </HStack>
        <div style={{ width: '100%' }}>{children}</div>
      </HStack>
    </header>
  );
};

Header.propTypes = {
  back: PropTypes.bool,
  children: PropTypes.element,
};

export default Header;