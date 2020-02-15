import React from 'react';
import { Avatar, Divider, Icon, Tag, Typography } from 'antd';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';

interface Props {
  listing: ListingData['listing'];
}

const { Paragraph, Title } = Typography;

export const ListingDetails = ({ listing }: Props) => {
  const {
    title,
    description,
    image,
    type,
    address,
    city,
    numOfGuests,
    host
  } = listing;
  return (
    <div className="listing-details">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="listing-details__image"
      />
      <div className="listing-details__information">
        <Paragraph
          type="secondary"
          ellipsis
          className="listing-details__city-address"
        >
          <Icon type="environment" /> {city}
          <Divider type="vertical" />
          {address}
        </Paragraph>
        <Title level={3} className="listing-details__title">
          {title}
        </Title>

        <div className="listing-details__section">
          <Avatar src={host.avatar} size={64} />
          <Title level={2} className="listing-details__host-name">
            {host.name}
          </Title>
        </div>

        <Divider />

        <div className="listing-details__section">
          <Title level={4}>About this Place</Title>
          <div className="listing-details__about-items">
            <Tag color="magenta">{type}</Tag>
            <Tag color="magenta">{numOfGuests} Guests</Tag>
          </div>
          <Paragraph ellipsis={{ rows: 3, expandable: true }}>
            {description}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};
