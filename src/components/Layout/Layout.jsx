import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import routes from '../../constants/routes';
import { Text } from '../Text/Text';
import { HStack } from '../Stack/HStack';

export const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인
  const checkLoginStatus = () => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  };

  useEffect(() => {
    checkLoginStatus();

    // storage 이벤트 리스너 추가 (다른 탭에서 변경 시)
    window.addEventListener('storage', checkLoginStatus);
    // 커스텀 이벤트 리스너 추가 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener('loginStatusChanged', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('loginId');
    setIsLoggedIn(false);
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('loginStatusChanged'));
    navigate(routes.login);
  };

  return (
    <div className={styles.layout}>
      <Header>
        {isLoggedIn ? (
          <div onClick={handleLogout} style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <HStack end>
              <Text fontSize="sm" color="var(--primary-fg)">
                로그아웃
              </Text>
            </HStack>
          </div>
        ) : (
          <Link to={routes.login} style={{ textDecoration: 'none' }}>
            <HStack end>
              <Text fontSize="sm" color="var(--primary-fg)">
                로그인
              </Text>
            </HStack>
          </Link>
        )}
      </Header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};