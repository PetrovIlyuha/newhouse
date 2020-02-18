import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Viewer } from '../../lib/types';
import { MenuItems } from './components';
// import SvgIcon from './assets/SVGIcon';
import Logo from './assets/last_logo.png';
const { Header } = Layout;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img
              src={Logo}
              alt=""
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '170px',
                height: '64px',
                borderBottom: '2px blue solid'
              }}
            />
          </Link>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
