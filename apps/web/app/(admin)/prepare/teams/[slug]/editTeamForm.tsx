'use client';
import {
  Alert,
  Breadcrumb,
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  InputNumber,
  InputRef,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { RacerTable } from './racerTable';
import { Racer, Team } from '@repo/database';
import { updateTeam } from '../../../../actions/team/updateTeam';
import {
  JUNIOR,
  SENIOR,
  SKI_FEMALE,
  SKI_MALE,
  SNOWBOARD_FEMALE,
  SNOWBOARD_MALE,
} from '../../../../common/constant';
import {
  CsvRacerType,
  parseCSV,
  validateData,
} from '../../../../common/csvReader';
import { UpdateRacerRequestDto } from '../../../../actions/racer/updateRacer';
import { addRacer } from '../../../../actions/racer/addRacer';

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

export interface RacerType {
  key: string;
  id: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  seed: number;
  age: number | null;
  isFirstTime: boolean;
  bib: number | null;
  gender: string; // f, m
  special: string; // normal, junior, senior
}

export function EditTeamForm(props: Props) {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [edited, setEdited] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<Racer[]>(props.team.racers);

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
      localStorage.setItem('newTeam', JSON.stringify(res.result));
      router.push(`/prepare/teams`);
    } else {
      showAlert(res.error);
    }
  };

  const team = props.team;
  const originRacers = dataSource.map((racer) => {
    return {
      id: racer.id,
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

  const addFileRef = useRef<InputRef>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleUploadButtonClick = () => {
    if (addFileRef.current?.input) {
      addFileRef.current.input.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0) {
      const file = files[0];
      setFileName(file.name); // ファイル名を状態に設定
      const content = await readFileAsText(file);
      const parsedData = await parseCSV(content);
      const errors = validateData(parsedData); //	データのバリデーション
      if (errors.length > 0) {
        showAlert(errors.join('\n'));
      } else {
        onBulkAdd(parsedData, file.name);
      }
    }
  };

  // ファイルをテキストとして読み込む関数
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const onBulkAdd = async (data: CsvRacerType[], fileName: string) => {
    const errors = [];
    const racers = await Promise.all(
      data.map(async (racer) => {
        let category = '';
        if (racer.skiFemale || racer.skiMale) category = 'ski';
        if (racer.snowboardFemale || racer.snowboardMale)
          category = 'snowboard';
        let special = 'normal';
        if (racer.junior) special = 'junior';
        if (racer.senior) special = 'senior';
        const dto: UpdateRacerRequestDto = {
          name: racer.name,
          kana: racer.kana,
          category: category,
          gender: racer.gender,
          seed: racer.seed,
          teamId: props.team.id,
          isFirstTime: false,
          age: racer.age ? racer.age : null,
          special: special,
        };
        const result = await addRacer(dto);
        if (result.success) {
          return result.result!;
        } else {
          errors.push(result.error);
        }
      }),
    );
    const r2 = racers.filter((racer): racer is Racer => racer !== undefined);
    const r3 = r2.map((racer) => {
      return {
        key: racer.id,
        id: racer.id,
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
            title: team.fullname,
          },
        ]}
      />
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

      <Flex style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleUploadButtonClick}>
          選手一括追加
        </Button>
        <Input
          ref={addFileRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Typography>{dataSource.length}</Typography>
      </Flex>

      <RacerTable
        dataSource={snowboardMaleRacers}
        teamId={props.team.id}
        title={SNOWBOARD_MALE}
        special="normal"
        gender="m"
        category="snowboard"
      />
      <RacerTable
        dataSource={snowboardFemaleRacers}
        teamId={props.team.id}
        title={SNOWBOARD_FEMALE}
        special="normal"
        gender="f"
        category="snowboard"
      />
      <RacerTable
        dataSource={skiMaleRacers}
        teamId={props.team.id}
        title={SKI_MALE}
        special="normal"
        gender="m"
        category="ski"
      />
      <RacerTable
        dataSource={skiFemaleRacers}
        teamId={props.team.id}
        title={SKI_FEMALE}
        special="normal"
        gender="f"
        category="ski"
      />
      <RacerTable
        dataSource={juniorRacers}
        teamId={props.team.id}
        title={JUNIOR}
        special="junior"
      />
      <RacerTable
        dataSource={seniorRacers}
        teamId={props.team.id}
        title={SENIOR}
        special="senior"
      />
    </>
  );
}
