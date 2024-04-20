'use client';
import { Button, DatePicker, Form, FormProps, Input } from 'antd';
import { EventType, updateEvent } from './actions';
import { Event } from '@repo/database';
import moment from 'moment';

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

const onFinish: FormProps<FieldType>['onFinish'] = async (
  values: FieldType,
) => {
  console.log('Success:', values);
  const event: EventType = {
    id: values.key,
    name: values.name,
    date: values.date.toISOString(),
    location: values.location,
    race: values.race,
    setter: values.setter,
    management: values.management,
  };
  updateEvent(event);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default async function ClientForm(props: Props) {
  const data = props.dataSource;
  return (
    <div>
      <h1>大会</h1>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="開催日"
          name="date"
          rules={[{ required: true, message: '開催日は必須です。' }]}
          initialValue={moment(data.date)}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item<FieldType>
          label="開催地"
          name="location"
          initialValue={data.location}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="競技" name="race" initialValue={data.race}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="ポールセッター"
          name="setter"
          initialValue={data.setter}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="幹事会社"
          name="management"
          initialValue={data.management}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
