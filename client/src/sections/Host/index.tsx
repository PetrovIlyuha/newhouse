import React from 'react';
import { Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Viewer } from '../../lib/types';
interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
export function Host({ viewer }: Props) {
  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            You need to be connected with Stripe to be able to host listings
          </Title>
          <Text type="secondary">
            It is only allowed for signed in users which are connected via
            Stripe to host listings. You can sign in{' '}
            <Link to="/login">here</Link>
          </Text>
        </div>
      </Content>
    );
  }
  return (
    <Content className="host-content">
      <div className="host__form-header">
        <Title level={3} className="host__form-title">
          Let's get Started creating your listings
        </Title>
        <Text type="secondary">
          This form was provided to you to present some typical and optional
          information about your listing
        </Text>
      </div>
    </Content>
  );
}
