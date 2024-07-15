'use client';
import { Alert, Button, Form, FormProps, InputNumber } from 'antd';
import { useState } from 'react';
import { AlertType } from '../../../common/types';
import { SpecialPoint } from '@repo/database';
import {
  UpdateSpecialPointRequestDto,
  updateSpecialPoint,
} from '../../../actions/specialPoint/updateSpecialPoint';

type Props = {
  specialPoints: SpecialPoint[];
};

export type FieldType = {
  key: string;
  boobyPoint: number;
  boobyMakerPoint: number;
  // name: string;
  // date: Date;
  // location: string;
  // race: string;
  // setter: string;
  // management: string;
};

export function EditSpecialPointsForm(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setErrorMessage] = useState<string>('');
  const [edited, setEdited] = useState<boolean>(false);

  // Alert を表示する関数
  const showAlert = (alertType: AlertType, error?: string) => {
    setErrorMessage(error ?? '');
    setAlertVisible(true);
    setAlertType(alertType);
  };

  // Alert を非表示にする関数
  const closeAlert = () => {
    setErrorMessage('');
    setAlertVisible(false);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (
    values: FieldType,
  ) => {
    const dto: UpdateSpecialPointRequestDto = {
      boobyPoint: values.boobyPoint,
      boobyMakerPoint: values.boobyMakerPoint,
    };
    const res = await updateSpecialPoint(dto);
    if (res.success) {
      setEdited(false);
      showAlert('success', '保存しました。');
    } else {
      showAlert('error', res.error);
    }
  };

  const data = props.specialPoints;

  const handleChange = () => {
    setEdited(true);
  };

  return (
    <div>
      {alertVisible && (
        <Alert
          message={alertMessage}
          type={alertType}
          closable
          onClose={closeAlert}
        />
      )}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="ブービー"
          name="boobyPoint"
          rules={[{ required: true, message: 'ポイントは必須です。' }]}
          initialValue={data.find((p) => p.id === 'booby')?.point}
        >
          <InputNumber onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="ブービーメイカー"
          name="boobyMakerPoint"
          rules={[{ required: true, message: 'ポイントは必須です。' }]}
          initialValue={data.find((p) => p.id === 'booby_maker')?.point}
        >
          <InputNumber onChange={handleChange} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={!edited}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
