import { Button, Form, Input } from 'antd';

type FieldType = {
  name: string;
};

export default async function InputPage() {
  // const users = await prisma.racer.findMany();
  // async function hoge() {
  //   'use server';
  //   console.log('hoge');
  // }

  return (
    <div>
      <h1>入力</h1>
      {/* <Button type="primary" onClick={hoge}>
        Button
      </Button>
      <form action={hoge}>
        <input type="text" name="name" />
        <input type="text" name="date" />
        <input type="text" name="location" />
        <input type="submit" />
      </form>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={hoge}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="大会名"
          name="name"
          rules={[{ required: true, message: '大会名は必須です。' }]}
        >
          <Input />
        </Form.Item>
      </Form> */}
    </div>
  );
}
