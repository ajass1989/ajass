'use client';
import { Team } from '@repo/database';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  TableProps,
  Typography,
} from 'antd';
import Link from 'next/link';
import { deleteTeam } from './actions';
import React, { useEffect, useState } from 'react';
import { TeamDto } from './teamDto';
import { TeamsWithRacers } from './page';

type Props = {
  dataSource: TeamsWithRacers;
};

interface RecordType {
  key: string;
  fullname: string; // チーム名
  //shortname: string; // 略称
  orderMale: number;
  orderFemale: number;
  racerCount: number;
  snowboardMaleCount: number;
  snowboardFemaleCount: number;
  skiMaleCount: number;
  skiFemaleCount: number;
  seniorCount: number;
  juniorCount: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  index: number;
  record: RecordType;
  children: React.ReactNode;
}

export function TeamTable(props: Props) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [dataSource, setDataSource] = useState<TeamsWithRacers>(
    props.dataSource,
  );
  const [newTeam, setNewTeam] = useState<TeamDto | null>(null);

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // 入力ノードの切り替え
    let inputNode;
    switch (inputType) {
      case 'number':
        inputNode = <InputNumber />;
        break;
      case 'text':
        inputNode = <Input />;
        break;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `${title}を入力してください。`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const originTeam = props.dataSource.map((d: Team) => ({
    key: d.id,
    fullname: d.fullname,
    // shortname: d.shortname,
    orderMale: d.orderMale,
    orderFemale: d.orderFemale,
  }));
  const [team, setTeam] = useState(originTeam);

  const isEditing = (record: RecordType) => record.key === editingKey;

  const edit = (record: Partial<RecordType> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setTeam(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setTeam(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  useEffect(() => {
    const teamData = localStorage.getItem('newTeam');
    if (teamData) {
      setNewTeam(JSON.parse(teamData));
      localStorage.removeItem('newTeam'); // 読み込み後は削除
    }
  }, []);

  const data: RecordType[] = dataSource.map((d) => {
    // const hoge = 1;
    // d.racers.
    return {
      key: d.id,
      fullname: d.fullname,
      // shortname: d.shortname,
      orderMale: d.orderMale,
      orderFemale: d.orderFemale,
      racerCount: d.racers.length,
      snowboardMaleCount: d.racers.filter(
        (racer) =>
          racer.category == 'snowboard' &&
          racer.gender == 'm' &&
          racer.special == 'normal',
      ).length,
      snowboardFemaleCount: d.racers.filter(
        (racer) =>
          racer.category == 'snowboard' &&
          racer.gender == 'f' &&
          racer.special == 'normal',
      ).length,
      skiMaleCount: d.racers.filter(
        (racer) =>
          racer.category == 'ski' &&
          racer.gender == 'm' &&
          racer.special == 'normal',
      ).length,
      skiFemaleCount: d.racers.filter(
        (racer) =>
          racer.category == 'ski' &&
          racer.gender == 'f' &&
          racer.special == 'normal',
      ).length,
      seniorCount: d.racers.filter((racer) => racer.special == 'senior').length,
      juniorCount: d.racers.filter((racer) => racer.special == 'junior').length,
    };
  });
  if (newTeam) {
    const index = data.findIndex((item) => item.key === newTeam.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...newTeam };
    } else {
      data.push({
        key: newTeam.id!,
        fullname: newTeam.fullname,
        // shortname: newTeam.shortname,
        orderMale: newTeam.orderMale,
        orderFemale: newTeam.orderFemale,
        racerCount: 0,
        snowboardMaleCount: 0,
        snowboardFemaleCount: 0,
        skiMaleCount: 0,
        skiFemaleCount: 0,
        seniorCount: 0,
        juniorCount: 0,
      });
    }
  }

  const onDelete = async (key: React.Key) => {
    await deleteTeam(key as string);
    const newDataSource = dataSource.filter((item) => item.id != key);
    setDataSource(newDataSource);
  };

  const columns = [
    {
      title: 'チーム名',
      dataIndex: 'fullname',
      key: 'fullname',
      inputType: 'text',
      render: (_: any, record: RecordType) => (
        <Link href={`/prepare/teams/${record.key}`}>{record.fullname}</Link>
      ),
    },
    {
      title: '滑走順男子',
      dataIndex: 'orderMale',
      key: 'orderMale',
      inputType: 'number',
      editable: true,
    },
    {
      title: '滑走順女子',
      dataIndex: 'orderFemale',
      key: 'orderFemale',
      inputType: 'number',
      editable: true,
    },
    {
      title: '選手数',
      children: [
        {
          title: '合計',
          dataIndex: 'racerCount',
          key: 'racerCount',
        },
        {
          title: 'スノーボード',
          children: [
            {
              title: '男子',
              dataIndex: 'snowboardMaleCount',
              key: 'snowboardMaleCount',
            },
            {
              title: '女子',
              dataIndex: 'snowboardFemaleCount',
              key: 'snowboardFemaleCount',
            },
          ],
        },
        {
          title: 'スキー',
          children: [
            {
              title: '男子',
              dataIndex: 'skiMaleCount',
              key: 'skiMaleCount',
            },
            {
              title: '女子',
              dataIndex: 'skiFemaleCount',
              key: 'skiFemaleCount',
            },
          ],
        },
        {
          title: '特別枠',
          children: [
            {
              title: 'シニア',
              dataIndex: 'seniorCount',
              key: 'seniorCount',
            },
            {
              title: 'ジュニア',
              dataIndex: 'juniorCount',
              key: 'juniorCount',
            },
          ],
        },
      ],
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RecordType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              保存
            </Typography.Link>
            <Typography.Link onClick={cancel}>キャンセル</Typography.Link>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              編集
            </Typography.Link>
            <Popconfirm title="削除します。よろしいですか？" onConfirm={cancel}>
              <a>削除</a>
            </Popconfirm>
          </span>
        );
        // data.length >= 1 ? (
        //   <Popconfirm
        //     title="削除します。よろしいですか？"
        //     onConfirm={() => onDelete(record.key)}
        //   >
        //     <a>削除</a>
        //   </Popconfirm>
        // ) : null,
      },
    },
  ];

  const mergedColumns: TableProps['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RecordType) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h1>チーム</h1>
      <Button type="primary">
        <Link href="/prepare/teams/add">追加</Link>
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={data}
          columns={mergedColumns}
          pagination={{ onChange: cancel, defaultPageSize: 200 }}
          bordered
        />
      </Form>
    </div>
  );
}
