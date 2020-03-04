import React from 'react';
import {
  CardElement,
  injectStripe,
  ReactStripeElements
} from 'react-stripe-elements';
import { useMutation } from '@apollo/react-hooks';
import { Modal, Button, Divider, Icon, Typography } from 'antd';
import moment, { Moment } from 'moment';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations/CreateBooking';
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables
} from '../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking';
import {
  formatListingPrice,
  displaySuccessNotification,
  displayErrorMessage
} from '../../../../lib/utils';
const { Paragraph, Text, Title } = Typography;

interface Props {
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  id: string;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

export const ListingCreateBookingModal = ({
  modalVisible,
  price,
  checkOutDate,
  checkInDate,
  setModalVisible,
  stripe,
  id,
  clearBookingData,
  handleListingRefetch
}: Props & ReactStripeElements.InjectedStripeProps) => {
  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've successfully booked the listing",
        'Booking history can always be found in your Profile page'
      );
      handleListingRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to successfully book the listing. Please, try again later..."
      );
    }
  });
  let daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  let listingPrice = daysBooked * price;

  const handleCreateBooking = async () => {
    if (!stripe) {
      return displayErrorMessage(
        "Sorry! We weren't able to connect with Stripe"
      );
    }
    let { token: stripeToken, error } = await stripe.createToken();
    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id: id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format('YYYY-MM-DD'),
            checkOut: moment(checkOutDate).format('YYYY-MM-DD')
          }
        }
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! We've encountered some problem during your booking. Please, try again later..."
      );
    }
  };
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
          <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          />
          <Button
            size="large"
            type="primary"
            loading={loading}
            className="listing-booking-modal_cta"
            onClick={handleCreateBooking}
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const WrappedListingCreateBookingModal = injectStripe(
  ListingCreateBookingModal
);
