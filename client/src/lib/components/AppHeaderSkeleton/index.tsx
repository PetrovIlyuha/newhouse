import React from 'react';
import { Layout } from 'antd';
import logo from './assets/house.png';

const { Header } = Layout;

export const AppHeaderSkeleton = () => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <img src={logo} alt="FreshStart Logo" />
        </div>
      </div>
    </Header>
  );
};
