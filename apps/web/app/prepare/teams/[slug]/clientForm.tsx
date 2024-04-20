'use client';
import { Alert, Button, Form, FormProps, Input } from 'antd';
import { updateTeam } from './actions';
import { useRouter } from 'next/navigation';
import { Team } from '@repo/database';
import { useState } from 'react';

type Props = {
  dataSource: Team;
};

type FieldType = {
  key: string;
  fullname: string;
  shortname: string;
  eventId: string;
};

export default function ClientForm(props: Props) {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Alert を表示する関数
  const showAlert = (error?: string) => {
    setErrorMessage(error ?? '');
    setAlertVisible(true);
  };

  // Alert を非表示にする関数
  const closeAlert = () => {
    setErrorMessage('');
    setAlertVisible(false);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (
    values: FieldType,
  ) => {
    const team = {
      id: values.key,
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
    };
    const res = await updateTeam(team);
    if (res.success) {
      router.push(`/prepare/teams?newTeam=${JSON.stringify(res.result)}`);
    } else {
      showAlert(res.error);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  const data = props.dataSource;
  return (
    <div>
      <h1>チーム編集</h1>
      {alertVisible && (
        <Alert
          message={errorMessage}
          type="error"
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
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType> name="key" initialValue={data.id}>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item<FieldType>
          label="チーム名"
          name="fullname"
          rules={[{ required: true, message: 'チーム名は必須です。' }]}
          initialValue={data.fullname}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="略称"
          name="shortname"
          rules={[{ required: true, message: '略称は必須です。' }]}
          initialValue={data.shortname}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType> name="eventId" initialValue={data.eventId}>
          <Input type="hidden" />
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
