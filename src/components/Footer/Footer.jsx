import React from 'react';
import styles from './Footer.module.css'; // 또는 Link가 필요한 경우 둘 다
import { Link } from 'react-router';
import routes from '../../constants/routes';
import { HStack } from '../Stack/HStack';
import { VStack } from '../Stack/VStack';

import home from "../../assets/home.png";
import camera from "../../assets/prime_camera.png";
import setting from "../../assets/proicons_settings.png";

const Footer = () => {
    return (
    <nav className={styles.navigation}>
      <HStack around>
        <NavItem icon={home} label="홈" pathname={routes.main} />
        <NavItem icon={camera} label="바코드" pathname={routes.barcode} />
        <NavItem icon={setting} label="환경설정" pathname={routes.ecoweight} />
      </HStack>
    </nav>
  );
};

const NavItem = ({ icon, label, pathname }) => (
  <Link to={ pathname }>
    <VStack>
      <img src = {icon} alt = {label} className={styles.footericon}/>
      <div className={styles.footerlabel}>{label}</div>
    </VStack>
  </Link>
);

export default Footer;