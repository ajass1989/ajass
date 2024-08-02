'use client';
import { Button, Form, FormProps, InputNumber } from 'antd';
import { useState } from 'react';
import { SpecialPoint } from '@repo/database';
import {
  UpdateSpecialPointRequestDto,
  updateSpecialPoint,
} from '../../../actions/specialPoint/updateSpecialPoint';
import { CommonAlertList } from '../../../common/components/commonAlertList';
import { useAlertContext } from '../../../common/components/commonAlertProvider';

type Props = {
  specialPoints: SpecialPoint[];
};

export type FieldType = {
  key: string;
  boobyPoint: number;
  boobyMakerPoint: number;
};

export function EditSpecialPointsForm(props: Props) {
  const [edited, setEdited] = useState<boolean>(false);
  const { addAlert } = useAlertContext();

  const onFinish: FormProps<FieldType>['onFinish'] = async (
    values: FieldType,
  ) => {
    const dto: UpdateSpecialPointRequestDto = {
      boobyPoint: values.boobyPoint,
      boobyMakerPoint: values.boobyMakerPoint,
    };
    const result = await updateSpecialPoint(dto);
    if (!result.success) {
      addAlert({ message: result.error!, type: 'error' });
      return;
    }
    setEdited(false);
    addAlert({ message: '保存しました。', type: 'success' });
  };

  const data = props.specialPoints;

  const handleChange = () => {
    setEdited(true);
  };

  return (
    <div>
      <CommonAlertList />
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
