'use client';
import { Button, Form, InputNumber, Popconfirm, Table, TableProps } from 'antd';
import Link from 'next/link';
import { TeamsWithRacers, deleteTeam, updateTeamOrder } from './actions';
import React, { useEffect, useState } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Team } from '@repo/database';
// import { TeamResponseDto } from './teamResponseDto';

type Props = {
  dataSource: TeamsWithRacers;
};

interface RecordType {
  key: string;
  fullname: string; // チーム名
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
  // inputType: 'number';
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
  const [newTeam, setNewTeam] = useState<Team /*ResponseDto*/ | null>(null);

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    children,
    // inputType,
    ...restProps
  }) => {
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
            <InputNumber />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record: RecordType) => record.key === editingKey;

  const edit = (record: Partial<RecordType> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const handleCancel = () => {
    setEditingKey('');
  };

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as RecordType;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const result = await updateTeamOrder(
          key as string,
          row.orderFemale,
          row.orderMale,
        );
        if (!result.result) {
          // TODO 保存に失敗した場合
        }
        const item = newData[index];
        item.orderFemale = row.orderFemale;
        item.orderMale = row.orderMale;
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const teamData = localStorage.getItem('newTeam');
    if (teamData) {
      setNewTeam(JSON.parse(teamData));
      // eslint-disable-next-line no-undef
      localStorage.removeItem('newTeam'); // 読み込み後は削除
    }
  }, []);

  const data: RecordType[] = dataSource.map((d) => {
    return {
      key: d.id,
      fullname: d.fullname,
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

  const handleDelete = async (key: React.Key) => {
    const result = await deleteTeam(key as string);
    if (!result.success) {
      console.error(`deleteTeam failed`);
      return;
    }
    const newDataSource = dataSource.filter((item) => item.id != key);
    setDataSource(newDataSource);
  };

  const columns = [
    {
      title: 'チーム名',
      dataIndex: 'fullname',
      key: 'fullname',
      // inputType: 'text',
      render: (_: any, record: RecordType) => (
        <Link href={`/prepare/teams/${record.key}`}>{record.fullname}</Link>
      ),
      sorter: (a: RecordType, b: RecordType) =>
        a.fullname > b.fullname ? 1 : -1,
    },
    {
      title: '滑走順男子',
      dataIndex: 'orderMale',
      key: 'orderMale',
      // inputType: 'number',
      editable: true,
      sorter: (a: RecordType, b: RecordType) => a.orderMale - b.orderMale,
    },
    {
      title: '滑走順女子',
      dataIndex: 'orderFemale',
      key: 'orderFemale',
      // inputType: 'number',
      editable: true,
      sorter: (a: RecordType, b: RecordType) => a.orderFemale - b.orderFemale,
    },
    {
      title: '選手数',
      children: [
        {
          title: '合計',
          dataIndex: 'racerCount',
          key: 'racerCount',
          sorter: (a: RecordType, b: RecordType) => a.racerCount - b.racerCount,
        },
        {
          title: 'スノーボード',
          children: [
            {
              title: '男子',
              dataIndex: 'snowboardMaleCount',
              key: 'snowboardMaleCount',
              sorter: (a: RecordType, b: RecordType) =>
                a.snowboardMaleCount - b.snowboardMaleCount,
            },
            {
              title: '女子',
              dataIndex: 'snowboardFemaleCount',
              key: 'snowboardFemaleCount',
              sorter: (a: RecordType, b: RecordType) =>
                a.snowboardFemaleCount - b.snowboardFemaleCount,
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
              sorter: (a: RecordType, b: RecordType) =>
                a.skiMaleCount - b.skiMaleCount,
            },
            {
              title: '女子',
              dataIndex: 'skiFemaleCount',
              key: 'skiFemaleCount',
              sorter: (a: RecordType, b: RecordType) =>
                a.skiFemaleCount - b.skiFemaleCount,
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
              sorter: (a: RecordType, b: RecordType) =>
                a.seniorCount - b.seniorCount,
            },
            {
              title: 'ジュニア',
              dataIndex: 'juniorCount',
              key: 'juniorCount',
              sorter: (a: RecordType, b: RecordType) =>
                a.juniorCount - b.juniorCount,
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
            <Button
              icon={<SaveOutlined />}
              onClick={() => handleSave(record.key)}
              size="small"
              style={{ marginRight: 8 }}
              title="保存"
              type="primary"
            />
            <Button
              icon={<RollbackOutlined />}
              onClick={handleCancel}
              size="small"
              title="キャンセル"
            />
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ''}
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              size="small"
              style={{ marginRight: 8 }}
              title="編集"
              type="default"
            />
            <Popconfirm
              onConfirm={() => handleDelete(record.key)}
              title="削除します。よろしいですか？"
            >
              <Button
                danger
                disabled={editingKey !== ''}
                icon={<DeleteOutlined />}
                size="small"
                title="削除"
                type="default"
              />
            </Popconfirm>
          </span>
        );
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
        // inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h1>チーム</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/prepare/teams/add">追加</Link>
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          pagination={false}
        />
      </Form>
    </div>
  );
}
