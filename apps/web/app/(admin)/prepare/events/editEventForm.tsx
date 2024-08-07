'use client';
import { Breadcrumb, Button, DatePicker, Form, FormProps, Input } from 'antd';
import {
  UpdateEventRequestDto,
  updateEvent,
} from '../../../actions/event/updateEvent';
import { useState } from 'react';
import { Event } from '@repo/database';
import dayjs from 'dayjs';
import { CommonAlertList } from '../../../common/components/commonAlertList';
import { useAlertContext } from '../../../common/components/commonAlertProvider';

type Props = {
  dataSource: Event;
};

export type FieldType = {
  key: string;
  name: string;
  date: Date;
  location: string;
  race: string;
  setter: string;
  management: string;
};

export function EditEventForm(props: Props) {
  const [edited, setEdited] = useState<boolean>(false);
  const { addAlert } = useAlertContext();

  const onFinish: FormProps<FieldType>['onFinish'] = async (
    values: FieldType,
  ) => {
    const event: UpdateEventRequestDto = {
      name: values.name,
      date: values.date.toISOString(),
      location: values.location,
      race: values.race,
      setter: values.setter,
      management: values.management,
    };
    const result = await updateEvent(values.key, event);
    if (!result.success) {
      addAlert({ message: result.error!, type: 'error' });
      return;
    }
    setEdited(false);
    addAlert({ message: '保存しました。', type: 'success' });
  };

  const data = props.dataSource;

  const handleChange = () => {
    setEdited(true);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: '準備',
          },
          {
            title: '大会',
          },
        ]}
      />
      <h1>大会</h1>
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
        <Form.Item<FieldType> name="key" initialValue={data.id}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item<FieldType>
          label="大会名"
          name="name"
          rules={[{ required: true, message: '大会名は必須です。' }]}
          initialValue={data.name}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="開催日"
          name="date"
          rules={[{ required: true, message: '開催日は必須です。' }]}
          initialValue={dayjs(data.date)}
        >
          <DatePicker onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="開催地"
          name="location"
          initialValue={data.location}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType> label="競技" name="race" initialValue={data.race}>
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="ポールセッター"
          name="setter"
          initialValue={data.setter}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="幹事会社"
          name="management"
          initialValue={data.management}
        >
          <Input onChange={handleChange} />
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
