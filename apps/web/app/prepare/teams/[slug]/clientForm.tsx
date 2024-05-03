'use client';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormInstance,
  FormProps,
  GetRef,
  Input,
  InputNumber,
  InputRef,
  Popconfirm,
  Table,
  TableProps,
} from 'antd';
import { updateTeam } from './actions';
import { useRouter } from 'next/navigation';
import { Racer, Team } from '@repo/database';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ClientTable from './clientTable';

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

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof RacerType;
  record: RacerType;
  handleSave: (record: RacerType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed: ', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

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

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export default function ClientForm(props: Props) {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  // const [dataSource, setDataSource] = useState<Racer[]>(props.team.racers);

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

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'かな',
      dataIndex: 'kana',
      key: 'kana',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      // render: (_, record) => {},
      // dataSource.length >= 1 ? (
      //   <Popconfirm
      //     title="Sure to delete?"
      //     onConfirm={() => handleDelete(record.key)}
      //   >
      //     <a>Delete</a>
      //   </Popconfirm>
      // ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // const columns = defaultColumns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: DataType) => ({
  //       record,
  //       editable: col.editable,
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       handleSave,
  //     }),
  //   };
  // });

  const normalColumns: TableProps<RacerType>['columns'] = [
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'かな',
      dataIndex: 'kana',
      key: 'kana',
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

  const specialColumns: TableProps<RacerType>['columns'] = [
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
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
  const [racers, setRacers] = useState(originRacers);
  const isEditing = (record: RacerType) => record.key === editingKey;
  const edit = (record: Partial<RacerType> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const snowboardMaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'm' &&
        racer.category == 'snowboard' &&
        racer.special == null
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
        racer.special == null
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const skiMaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'm' && racer.category == 'ski' && racer.special == null
      );
    })
    .sort((a, b) => {
      return a.seed - b.seed;
    });
  const skiFemaleRacers: RacerType[] = originRacers
    .filter((racer) => {
      return (
        racer.gender == 'f' && racer.category == 'ski' && racer.special == null
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
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={snowboardMaleRacers}
        columns={normalColumns as ColumnTypes}
        pagination={{ position: [] }}
      />
      <h2>スノーボード女子</h2>
      <Button type="primary">追加</Button>
      <Table
        columns={normalColumns}
        dataSource={snowboardFemaleRacers}
        pagination={{ position: [] }}
      />
      <h2>スキー男子</h2>
      <Button type="primary">追加</Button>
      <Table
        columns={normalColumns}
        dataSource={skiMaleRacers}
        pagination={{ position: [] }}
      />
      <h2>スキー女子</h2>
      <Button type="primary">追加</Button>
      <Table
        columns={normalColumns}
        dataSource={skiFemaleRacers}
        pagination={{ position: [] }}
      />
      <h2>ジュニア</h2>
      <Button type="primary">追加</Button>
      <Table
        columns={specialColumns}
        dataSource={juniorRacers}
        pagination={{ position: [] }}
      />
      <h2>シニア</h2>
      <Button type="primary">追加</Button>
      <Table
        columns={specialColumns}
        dataSource={seniorRacers}
        pagination={{ position: [] }}
      />
      <ClientTable
        dataSource={seniorRacers}
        teamId={props.team.id}
        title="シニア"
        special="senior"
      />
    </div>
  );
}
