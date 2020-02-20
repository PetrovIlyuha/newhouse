import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Layout, Typography, List } from 'antd';
import { ListingCard } from '../../lib/components';
import { LISTINGS } from '../../lib/graphql/queries';
import {
  Listings as ListingsData,
  ListingsVariables
} from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      location: match.params.location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1
    }
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <List
        grid={{ gutter: 8, sm: 2, lg: 4, xs: 1 }}
        dataSource={listings.result}
        renderItem={listing => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      ></List>
    ) : (
      <div>
        <Paragraph>
          "It appears to be no currently presented listings for this area"
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          "You have the opportunity to post <Link to="/host">listings</Link> for
          the area of"
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title>Results for "{listingsRegion}"</Title>
  ) : null;
  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
