'use client';
import { Button, Checkbox, Form, FormProps, Input } from 'antd';
import { hoge } from './actions';

type FieldType = {
  name: string;
  date?: Date;
  location?: string;
  race?: string;
  setter?: string;
  management?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (
  values: FieldType,
) => {
  console.log('Success:', values);
  hoge(values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

export default async function ClientForm() {
  return (
    <div>
      <h1>競技追加</h1>

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
        <Form.Item<FieldType>
          label="大会名"
          name="name"
          rules={[{ required: true, message: '大会名は必須です。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="開催日" name="date">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="開催地" name="location">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="競技" name="race">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="ポールセッター" name="setter">
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="幹事会社" name="management">
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
