import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Modal, Button, Divider, Icon, Typography } from 'antd';
import moment, { Moment } from 'moment';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations/CreateBooking';
import { formatListingPrice } from '../../../../lib/utils';
const { Paragraph, Text, Title } = Typography;

interface Props {
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBookingModal = ({
  modalVisible,
  price,
  checkOutDate,
  checkInDate,
  setModalVisible
}: Props) => {
  let daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  let listingPrice = daysBooked * price;
  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <Icon type="key"></Icon>
          </Title>
          <Title level={3} className="listing-booking-modal__intro-title">
            Book your visitation
          </Title>
          <Paragraph>
            Enter your payment info to book the listing from the dates between{' '}
            <Text mark strong>
              {checkInDate && moment(checkInDate).format('MMMM DD YYYY')}
            </Text>{' '}
            and{' '}
            <Text mark strong>
              {checkOutDate && moment(checkOutDate).format('MMMM DD YYYY')}
            </Text>
          </Paragraph>
        </div>
        <Divider />
        {checkInDate && checkOutDate && (
          <div className="listing-booking-modal__charge-summary">
            <Paragraph>
              {formatListingPrice(price, false)} * {daysBooked} days ={' '}
              <Text strong>{formatListingPrice(listingPrice, false)}</Text>
            </Paragraph>
            <Paragraph className="listing-booking-modal__charge-summary-total">
              Total ={' '}
              <Text mark>{formatListingPrice(listingPrice, false)}</Text>
            </Paragraph>
          </div>
        )}

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal_cta"
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
