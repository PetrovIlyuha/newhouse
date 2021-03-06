import React, { useState, useEffect, useRef } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Layout, Typography, List, Affix } from 'antd';
import { ListingCard, ErrorBanner } from '../../lib/components';
import { LISTINGS } from '../../lib/graphql/queries';
import {
  Listings as ListingsData,
  ListingsVariables
} from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton
} from './components';

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const PAGE_LIMIT = 4;

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const locationRef = useRef(match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page
      }
    }
  );

  useEffect(() => {
    setPage(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content>
        <ErrorBanner description="We either couldn't find anything that would match your search query or error have occured. If your search is really unique and rare, please try to replace it with something more common for us to be able to help you find the desired location.." />
      </Content>
    );
  }
  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
        </Affix>
        <Affix>
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
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
