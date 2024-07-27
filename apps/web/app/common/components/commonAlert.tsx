import { Alert, Typography } from 'antd';
import { AlertType } from '../types';
import React from 'react';

export type AlertData = {
  message: string;
  type: AlertType;
};

export interface Props {
  message: string;
  type: AlertType;
}

export function CommonAlert(props: Props) {
  const m = props.message.split('\n').map((message) => {
    return <Typography>{message}</Typography>;
  });
  return (
    <Alert
      message={m}
      type={props.type}
      closable
      style={{ marginBottom: 16 }}
    />
  );
}
