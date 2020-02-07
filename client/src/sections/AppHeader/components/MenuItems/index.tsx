import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Icon, Menu } from 'antd';
import { LOG_OUT } from '../../../../lib/graphql/mutations/LogOut/index';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { Viewer } from '../../../../lib/types';
const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
}
export const MenuItems = ({ viewer }: Props) => {
  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Icon type="user" />
          Profile
        </Item>
        <Item key="/logout">
          <Icon type="logout" />
          Logout
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );
  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <Icon type="home" />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
