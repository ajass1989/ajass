'use client';
import {
  Alert,
  Breadcrumb,
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
} from 'antd';
import { addTeam } from '../../../../actions/team/addTeam';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TeamRequestDto } from '../teamRequestDto';

type FieldType = {
  key: string;
  fullname: string;
  shortname: string;
  eventId: string;
  orderMale: number;
  orderFemale: number;
};

export function AddTeamForm() {
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
    const team: TeamRequestDto = { ...values };
    const res = await addTeam(team);
    if (res.success) {
      localStorage.setItem('newTeam', JSON.stringify(res.result));
      router.push(`/prepare/teams`);
    } else {
      showAlert(res.error);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '準備',
          },
          {
            title: <a href="/prepare/teams">チーム</a>,
          },
          {
            title: '追加',
          },
        ]}
      />
      <h1>チーム追加</h1>
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
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="チーム名"
          name="fullname"
          rules={[{ required: true, message: 'チーム名は必須です。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="略称"
          name="shortname"
          rules={[{ required: true, message: '略称は必須です。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="男子滑走順"
          name="orderMale"
          rules={[{ required: true, message: '男子滑走順は必須です。' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<FieldType>
          label="女子滑走順"
          name="orderFemale"
          rules={[{ required: true, message: '女子滑走順は必須です。' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<FieldType>
          name="eventId"
          initialValue={'2023'}
          hidden={true}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
