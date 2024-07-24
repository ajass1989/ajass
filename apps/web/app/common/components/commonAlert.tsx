import { Alert } from 'antd';
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
  return (
    <Alert
      message={props.message}
      type={props.type}
      closable
      style={{ marginBottom: 16 }}
    />
  );
}
