import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { LISTINGS } from '../../../lib/graphql/queries';
import { HomeListings } from './HomeListings';
import { HomeListingsSkeleton } from '../index';
import {
  Listings as ListingsData,
  ListingsVariables
} from '../../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../../lib/graphql/globalTypes';
import { displayErrorMessage } from '../../../lib/utils/index';
import { HomeHero } from './HomeHero';
import { Col, Row, Layout, Typography } from 'antd';

import londonImage from '../assets/business_london.jpg';
import greeceWeekend from '../assets/weekend.png';
import ny_bg from '../assets/NY_illustration.jpg';

const { Paragraph, Title } = Typography;
const { Content } = Layout;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER
      }
    }
  );

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage(`Please enter a valid search!`);
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }
  };
  return (
    <Content
      className="home"
      style={{
        backgroundImage: `url(${ny_bg})`,
        backgroundSize: 'cover'
      }}
    >
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide to all the hosted accomodations...
        </Title>
        <Paragraph>
          Helping you choose from the Selection of housing tested for quality
          and design.
        </Paragraph>
        <Link
          to="/listings/europe"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular Listings in Europe
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Multiple Listings to satisfy your travel needs
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/london">
              <div className="home__listings-img-cover">
                <img
                  src={londonImage}
                  alt="London Business Trips"
                  className="home__listings"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/greece">
              <div className="home__listings-img-cover">
                <img
                  src={greeceWeekend}
                  alt="Amazing week-ends"
                  className="home__listings"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
