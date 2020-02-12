import React from 'react';
import { UserProfile } from './components/UserProfile';
import { useQuery } from '@apollo/react-hooks';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Layout, Row } from 'antd';
import { USER } from '../../lib/graphql/queries';
import {
  User as UserData,
  UserVariables
} from '../../lib/graphql/queries/User/__generated__/User';
import { Viewer } from '../../lib/types';
import { PageSkeleton, ErrorBanner } from '../../lib/components';

interface Props {
  viewer: Viewer;
}
interface MatchParams {
  id: string;
}

const { Content } = Layout;
export const User = ({
  viewer,
  match
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id
    }
  });

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;
  return (
    <Content className="user">
      <Row gutter={12} type="flex" justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
};
