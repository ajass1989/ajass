'use client';
import { Alert, Typography } from 'antd';
import { AlertType } from '../types';
import React from 'react';
import { useAlertContext } from './commonAlertProvider';
import { v4 as uuidv4 } from 'uuid';

export interface AlertData {
  message: string;
  type: AlertType;
}

export function CommonAlertList() {
  const { alerts, removeAlert } = useAlertContext();
  return (
    <>
      {alerts.map((alert, index) => {
        const message = alert.message.split('\n').map((message) => {
          return <Typography key={uuidv4()}>{message}</Typography>;
        });
        const id = uuidv4();
        return (
          <Alert
            key={id}
            message={message}
            type={alert.type}
            closable
            style={{ marginBottom: 16 }}
            onClose={() => removeAlert(index)}
          />
        );
      })}
    </>
  );
}
