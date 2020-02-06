import React from 'react';
import { Alert } from 'antd';

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner = ({
  message = 'Something is not right :(',
  description = 'Looks like we are having some problems...'
}) => {
  return (
    <Alert
      banner
      closable
      message={message}
      description={description}
      type="error"
      className="error-banner"
    />
  );
};
