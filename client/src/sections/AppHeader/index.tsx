import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Input, Layout } from 'antd';
import { Viewer } from '../../lib/types';
import { MenuItems } from './components';
// import SvgIcon from './assets/SVGIcon';
import Logo from './assets/house.png';
import { displayErrorMessage } from '../../lib/utils';
const { Header } = Layout;

const { Search } = Input;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
export const AppHeader = withRouter(
  ({ viewer, setViewer, history }: Props & RouteComponentProps) => {
    const onSearch = (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage('Please Enter a valid search...');
      }
    };
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
                  width: '64px',
                  height: '64px',
                  borderBottom: '2px blue solid'
                }}
              />
              <span style={{ fontSize: '1.8rem' }}>FreshStart</span>
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search placeholder="Search 'Moscow'" onSearch={onSearch} />
          </div>
        </div>
        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
