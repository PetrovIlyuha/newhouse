import React from 'react';
import { Divider, Skeleton, Alert } from 'antd';
import './styles.css';

interface Props {
  title: string;
  error?: boolean;
}
export const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert
      type="error"
      message="Something went Wrong! Try again later..."
      className="listings_skeleton__alert"
    />
  ) : null;
  return (
    <div className="listings-skeleton">
      {errorAlert}
      <h2>{title}</h2>
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  );
};
