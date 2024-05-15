'use client';
import { Alert, Button, Form, FormProps, Input, InputNumber } from 'antd';
import { updateTeam } from './actions';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { RacerTable } from './racerTable';
// import { RacerResponseDto } from '../racerResponseDto';
// import { TeamResponseDto } from '../teamResponseDto';
import { Racer, Team } from '@repo/database';

type Props = {
  team: Team /*ResponseDto*/ & {
    racers: Racer /*ResponseDto*/[];
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

export interface RacerType {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  seed: number;
  age: number | null;
  isFirstTime: boolean;
  bib: number | null;
  gender: string; // f, m
}

export function EditTeamForm(props: Props) {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [edited, setEdited] = useState<boolean>(false);

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
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
      orderMale: values.orderMale,
      orderFemale: values.orderFemale,
    };
    const res = await updateTeam(values.key, team);
    if (res.success) {
      // eslint-disable-next-line no-undef
      localStorage.setItem('newTeam', JSON.stringify(res.result));
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

  const team = props.team;
  const originRacers = props.team.racers.map((racer) => {
    return {
      key: racer.id,
      name: racer.name,
      kana: racer.kana,
      gender: racer.gender,
      category: racer.category,
      seed: racer.seed,
      age: racer.age,
      special: racer.special,
      isFirstTime: racer.isFirstTime,
      bib: racer.bib,
    };
  });

  const snowboardMaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'm' &&
        racer.category == 'snowboard' &&
        racer.special == 'normal'
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const snowboardFemaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'f' &&
        racer.category == 'snowboard' &&
        racer.special == 'normal'
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const skiMaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'm' &&
        racer.category == 'ski' &&
        racer.special == 'normal'
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const skiFemaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'f' &&
        racer.category == 'ski' &&
        racer.special == 'normal'
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const juniorRacers: RacerType[] = originRacers
    .filter((racer) => {
      return racer.special == 'junior';
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const seniorRacers: RacerType[] = originRacers
    .filter((racer) => {
      return racer.special == 'senior';
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });

  const handleChange = () => {
    setEdited(true);
  };

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
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="略称"
          name="shortname"
          rules={[{ required: true, message: '略称は必須です。' }]}
          initialValue={team.shortname}
        >
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="男子滑走順"
          name="orderMale"
          initialValue={team.orderMale}
        >
          <InputNumber onChange={handleChange} />
        </Form.Item>

        <Form.Item<FieldType>
          label="女子滑走順"
          name="orderFemale"
          initialValue={team.orderFemale}
        >
          <InputNumber onChange={handleChange} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={!edited}>
            保存
          </Button>
        </Form.Item>
      </Form>

      <RacerTable
        dataSource={snowboardMaleRacers}
        teamId={props.team.id}
        title="スノーボード男子"
        special="normal"
        gender="m"
        category="snowboard"
      />
      <RacerTable
        dataSource={snowboardFemaleRacers}
        teamId={props.team.id}
        title="スノーボード女子"
        special="normal"
        gender="f"
        category="snowboard"
      />
      <RacerTable
        dataSource={skiMaleRacers}
        teamId={props.team.id}
        title="スキー男子"
        special="normal"
        gender="m"
        category="ski"
      />
      <RacerTable
        dataSource={skiFemaleRacers}
        teamId={props.team.id}
        title="スキー女子"
        special="normal"
        gender="f"
        category="ski"
      />
      <RacerTable
        dataSource={juniorRacers}
        teamId={props.team.id}
        title="ジュニア"
        special="junior"
      />
      <RacerTable
        dataSource={seniorRacers}
        teamId={props.team.id}
        title="シニア"
        special="senior"
      />
    </div>
  );
}
