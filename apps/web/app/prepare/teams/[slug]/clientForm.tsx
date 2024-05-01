'use client';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  InputNumber,
  Table,
  TableProps,
} from 'antd';
import { updateTeam } from './actions';
import { useRouter } from 'next/navigation';
import { Racer, Team } from '@repo/database';
import { useState } from 'react';

type Props = {
  team: Team & {
    racers: Racer[];
  };
};

type FieldType = {
  key: string;
  fullname: string;
  shortname: string;
  eventId: string;
  orderMale: number;
  orderFemale: number;
};

interface RacerType {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  seed: number;
  age: number | null;
  isFirstTime: boolean;
}

export default function ClientForm(props: Props) {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const convertRacerType = (racer: Racer) => {
    return {
      key: racer.id,
      name: racer.name,
      kana: racer.kana,
      category: racer.category,
      seed: racer.seed,
      age: racer.age,
      isFirstTime: racer.isFirstTime,
    };
  };
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
      orderMale: values.orderMale,
      orderFemale: values.orderFemale,
    };
    const res = await updateTeam(team);
    if (res.success) {
      localStorage.setItem('newTeam', JSON.stringify(res.result)); // ローカルストレージに保存
      router.push(`/prepare/teams`);
    } else {
      showAlert(res.error);
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  const columns: TableProps<RacerType>['columns'] = [
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
      // inputType: 'text',
    },
    {
      title: 'かな',
      dataIndex: 'kana',
      key: 'kana',
    },
    {
      title: '競技',
      dataIndex: 'category',
      key: 'category',
      render: (_: any, record: RacerType) =>
        record.category == 'ski' ? (
          <span>スキー</span>
        ) : (
          <span>スノーボード</span>
        ),
    },
    {
      title: '年齢',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '初参加',
      dataIndex: 'isFirstTime',
      key: 'isFirstTime',
      render: (_: any, record: RacerType) => (
        <Checkbox disabled checked={record.isFirstTime} />
      ),
    },
  ];
  const team = props.team;
  const racers: RacerType[] = team.racers.map((racer) => {
    return {
      key: racer.id,
      name: racer.name,
      kana: racer.kana,
      category: racer.category,
      seed: racer.seed,
      age: racer.age,
      isFirstTime: racer.isFirstTime,
    };
  });
  const snowboardMaleRacers: RacerType[] = team.racers
    .filter((racer) => {
      return racer.gender == 'm' && racer.category == 'snowboard';
    })
    .map((racer) => {
      return convertRacerType(racer);
    });
  const snowboardFemaleRacers: RacerType[] = team.racers
    .filter((racer) => {
      return racer.gender == 'f' && racer.category == 'snowboard';
    })
    .map((racer) => {
      return convertRacerType(racer);
    });
  const skiMaleRacers: RacerType[] = team.racers
    .filter((racer) => {
      return racer.gender == 'm' && racer.category == 'ski';
    })
    .map((racer) => {
      return convertRacerType(racer);
    });
  const skiFemaleRacers: RacerType[] = team.racers
    .filter((racer) => {
      return racer.gender == 'f' && racer.category == 'ski';
    })
    .map((racer) => {
      return convertRacerType(racer);
    });

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
        <Form.Item<FieldType> name="key" initialValue={team.id} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          name="eventId"
          initialValue={team.eventId}
          hidden={true}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="チーム名"
          name="fullname"
          rules={[{ required: true, message: 'チーム名は必須です。' }]}
          initialValue={team.fullname}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="略称"
          name="shortname"
          rules={[{ required: true, message: '略称は必須です。' }]}
          initialValue={team.shortname}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="男子滑走順"
          name="orderMale"
          initialValue={team.orderMale}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<FieldType>
          label="女子滑走順"
          name="orderFemale"
          initialValue={team.orderFemale}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>

      <h2>スノーボード男子</h2>
      <Button type="primary">追加</Button>
      <Table columns={columns} dataSource={snowboardMaleRacers} />
      <h2>スノーボード女子</h2>
      <Button type="primary">追加</Button>
      <Table columns={columns} dataSource={snowboardFemaleRacers} />
      <h2>スキー男子</h2>
      <Button type="primary">追加</Button>
      <Table columns={columns} dataSource={skiMaleRacers} />
      <h2>スキー女子</h2>
      <Button type="primary">追加</Button>
      <Table columns={columns} dataSource={skiFemaleRacers} />
    </div>
  );
}
