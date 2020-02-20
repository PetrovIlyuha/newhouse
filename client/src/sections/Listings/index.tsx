import React, { useState } from 'react';
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
import { ListingsFilters, ListingsPagination } from './components';

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 8;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      location: match.params.location,
      filter,
      limit: PAGE_LIMIT,
      page
    }
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <ListingsPagination
          total={listings.total}
          page={page}
          limit={PAGE_LIMIT}
          setPage={setPage}
        />
        <ListingsFilters filter={filter} setFilter={setFilter} />
        <List
          grid={{ gutter: 8, sm: 2, lg: 4, xs: 1 }}
          dataSource={listings.result}
          renderItem={listing => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        ></List>
      </div>
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
