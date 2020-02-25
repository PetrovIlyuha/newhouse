import React from 'react';
import {
  Form,
  Input,
  Icon,
  Layout,
  Typography,
  InputNumber,
  Radio
} from 'antd';
import { ListingType } from '../../lib/graphql/globalTypes';
import { Link } from 'react-router-dom';
import { Viewer } from '../../lib/types';
import { iconColor } from '../../lib/utils';
interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;
export function Host({ viewer }: Props) {
  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={4} className="host__form-title">
            You need to be connected with Stripe to be able to host listings
          </Title>
          <Text type="secondary">
            It is only allowed for signed in users which are connected via
            Stripe to host listings. You can sign in{' '}
            <Link to="/login">here</Link> and connect your payment account with
            Stripe shortly after
          </Text>
        </div>
      </Content>
    );
  }
  return (
    <Content className="host-content">
      <Form layout="vertical">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            Let's get Started creating your listings
          </Title>
          <Text type="secondary">
            This form was provided to you to present some typical and optional
            information about your listing
          </Text>
        </div>

        <Item label="Home type">
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <Icon type="bank" style={{ color: iconColor }} />
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <Icon type="home" style={{ color: iconColor }} />
              <span>House</span>
            </Radio.Button>
          </Radio.Group>
        </Item>
        <Item label="Title" extra="Max character count of 45">
          <Input
            maxLength={45}
            placeholder="Stylish loft in the heart of BCN"
          />
        </Item>
        <Item label="Description" extra="Max character count of 500">
          <Input.TextArea
            rows={3}
            maxLength={500}
            placeholder="Provide your description for the place, for example: Spacious and comfortable room with four-poster bed, private bath, air conditioning and windows to the street"
          />
        </Item>
        <Item label="Address">
          <Input placeholder="San Marco avenue" />
        </Item>
        <Item label="City/Town">
          <Input placeholder="Barcelona" />
        </Item>
        <Item label="State/Province">
          <Input placeholder="Catalona" />
        </Item>
        <Item label="Zip/Postal Code">
          <Input placeholder="Please provide the ZIP code for your listing" />
        </Item>
        <Item label="Price" extra="Price in USD/day">
          <InputNumber min={0} placeholder="Your rental price" />
        </Item>
      </Form>
    </Content>
  );
}
