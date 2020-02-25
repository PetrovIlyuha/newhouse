import React, { useState } from 'react';
import {
  Form,
  Input,
  Icon,
  Layout,
  Typography,
  InputNumber,
  Radio,
  Upload,
  Button
} from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { ListingType } from '../../lib/graphql/globalTypes';
import { Link } from 'react-router-dom';
import { Viewer } from '../../lib/types';
import { iconColor, displayErrorMessage } from '../../lib/utils';
interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;
export function Host({ viewer }: Props) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  console.log(imageBase64Value);
  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status === 'uploading') {
      setImageLoading(true);
      return;
    }

    if (file.status === 'done' && file.originFileObj) {
      getBase64Value(file.originFileObj, imageBase64Value => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

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
        <Item
          label="Image"
          extra="Images should be under 1Mb and of type JPG or PNG"
        >
          <div className="host__form-image-upload">
            <Upload
              name="image"
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt="listing" />
              ) : (
                <div>
                  <Icon type={imageLoading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>
        <Item label="Price" extra="Price in USD/day">
          <InputNumber min={0} placeholder="Your rental price" />
        </Item>

        <Item>
          <Button type="primary">Submit</Button>
        </Item>
      </Form>
    </Content>
  );
}
const beforeImageUpload = (file: File) => {
  const fileIsValidImage =
    file.type === 'image/jpeg' || file.type === 'image/png';
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage('You are only able to upload valid PNG or JPEG files');
    return false;
  }

  if (!fileIsValidSize) {
    displayErrorMessage('You are only able to upload files under 1Mb');
    return false;
  }

  return fileIsValidSize && fileIsValidImage;
};

const getBase64Value = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    callback(reader.result as string);
  };
};
