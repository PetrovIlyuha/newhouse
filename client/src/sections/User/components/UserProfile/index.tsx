import React from 'react';
import { Avatar, Card, Button, Divider, Typography, Tag } from 'antd';
import { formatListingPrice } from '../../../../lib/utils/index';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  user: UserData['user'];
  viewerIsUser: boolean;
}

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`;

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewerIsUser }: Props) => {
  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color="green">Stripe registered</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned:{' '}
        <Text strong>
          {user.income ? formatListingPrice(user.income) : `$0`}
        </Text>
      </Paragraph>
      <Button type="primary" className="user-user-profile__details-cta">
        Disconnect Stripe
      </Button>
      <Paragraph type="secondary">
        By disconnecting, you won't be able to receive{''}
        <Text strong> any further payments</Text>. This will prevent users from
        booking listings that you might have already created
      </Paragraph>
    </>
  ) : (
    <>
      {' '}
      <Paragraph>
        Interested in becoming FreshStart host? Register with your Stripe
        account!
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={redirectToStripe}
      >
        Connect With Stripe
      </Button>
      <Paragraph type="secondary">
        FreshStart uses{' '}
        <a
          href="https://stripe.com/en-US/connect"
          target="_blank"
          rel="noopener noreferre"
        >
          Stripe
        </a>{' '}
        to secure and transfer your payments and income
      </Paragraph>
    </>
  );
  const additionalDetailsSection = viewerIsUser ? (
    <>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        {additionalDetails}
      </div>
    </>
  ) : null;
  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
