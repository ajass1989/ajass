'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { AlertData } from './commonAlertList';

// メッセージコンテキストのプロパティ
interface CommonAlertContextProps {
  alerts: AlertData[];
  addAlert: (alert: AlertData) => void;
  removeAlert: (index: number) => void;
}

const CommonAlertContext = createContext<CommonAlertContextProps | undefined>(
  undefined,
);

export const useAlertContext = () => {
  const context = useContext(CommonAlertContext);
  if (!context) {
    throw new Error(
      'useAlertContext must be used within a CommonAlertProvider',
    );
  }
  return context;
};

export const CommonAlertProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  /**
   * アラート追加
   * @param alert 追加するアラート
   */
  const addAlert = (alert: AlertData) => {
    setAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  /**
   * アラート削除
   * @param index 削除するアラートのインデックス
   */
  const removeAlert = (index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
  };

  return (
    <CommonAlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
      }}
    >
      {children}
    </CommonAlertContext.Provider>
  );
};
