import { Outlet, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import routes from '../../constants/routes';
import { Text } from '../Text/Text';
import { HStack } from '../Stack/HStack';

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header>
        <Link to={routes.login} style={{ textDecoration: 'none' }}>
          <HStack end>
            <Text fontSize="sm" color="var(--primary-fg)">
              로그인
            </Text>
          </HStack>
        </Link>
      </Header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};