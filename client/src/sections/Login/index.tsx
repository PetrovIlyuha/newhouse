import React, { useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Card, Layout, Spin, Typography } from 'antd';
import { ErrorBanner } from '../../lib/components/ErrorBanner/index';
import { LOG_IN } from '../../lib/graphql/mutations/LogIn/index';
import { AUTH_URL } from '../../lib/graphql/queries/AuthUrl/index';
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl';
import {
  LogIn as LogInData,
  LogInVariables
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn';
import { Viewer } from '../../lib/types';
import {
  displaySuccessNotification,
  displayErrorMessage
} from '../../lib/utils/index';
// Image assets
import googleLogo from './assets/google_logo.jpg';

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError }
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: data => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        displaySuccessNotification('You have successfully Logged In!');
      }
    }
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      logInRef.current({
        variables: {
          input: { code }
        }
      });
    }
  }, []);

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Loggin you In..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL
      });
      window.location.href = data.authUrl;
    } catch (err) {
      displayErrorMessage(
        'Sorry! We were unable to log you in..Try Again or contact client service!'
      );
    }
  };

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We were unable to log you in..Try Again or contact client service!" />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to FreshStart
          </Title>
          <Text>Sign in with Google to start booking rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign In with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google Account
        </Text>
      </Card>
    </Content>
  );
};
