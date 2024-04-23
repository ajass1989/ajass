'use client';
import { Team, Racer } from '@repo/database';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  TableProps,
  Typography,
} from 'antd';
import Link from 'next/link';
// import { deleteTeam } from './actions';
import { useEffect, useState } from 'react';
// import { RacerDto } from './racerDto';

type Props = {
  dataSource: Racer[];
  teams: Team[];
};

interface Item {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number;
  gender: string; // f, m
  seed: number;
  teamId: string | null;
  isFirstTime: boolean;
  age: number | null;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'gender' | 'category' | 'boolean' | 'team';
  record: Item;
  index: number;
  children: React.ReactNode;
}

export default function ClientTable(props: Props) {
  const [form] = Form.useForm();
  // const [dataSource, setDataSource] = useState<Racer[]>(props.dataSource);
  const [editingKey, setEditingKey] = useState('');

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
    // 編集時の所属ドロップダウンの中身構築
    const teamOptions = props.teams.map((team) => {
      return { value: team.id, label: <span>{team.fullname}</span> };
    });
    // 入力ノードの切り替え
    let inputNode;
    switch (inputType) {
      case 'number':
        inputNode = <InputNumber />;
        break;
      case 'text':
        inputNode = <Input />;
        break;
      case 'boolean':
        inputNode = <Checkbox checked={record.isFirstTime} />;
        break;
      case 'gender':
        inputNode = (
          <Select
            options={[
              { value: 'f', label: <span>女性</span> },
              { value: 'm', label: <span>男性</span> },
            ]}
          />
        );
        break;
      case 'category':
        inputNode = (
          <Select
            options={[
              { value: 'ski', label: <span>スキー</span> },
              { value: 'snowboard', label: <span>スノーボード</span> },
            ]}
          />
        );
        break;
      case 'team':
        inputNode = (
          <Select defaultValue={record.teamId} options={teamOptions} />
        );
        break;
    }
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
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

  const originData = props.dataSource.map((d: Racer) => ({
    key: d.id,
    name: d.name,
    kana: d.kana,
    category: d.category,
    bib: d.bib,
    gender: d.gender,
    seed: d.seed,
    teamId: d.teamId,
    isFirstTime: d.isFirstTime,
    age: d.age,
  }));

  const [data, setData] = useState(originData);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      /*bib: 0, name: '', age: '', address: '',*/ ...record,
    });
    setEditingKey(record.key as string);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  // const [newRacer, setNewRacer] = useState<RacerDto | null>(null);

  // useEffect(() => {
  //   const teamData = localStorage.getItem('newTeam');
  //   if (teamData) {
  //     setNewRacer(JSON.parse(teamData));
  //     localStorage.removeItem('newTeam'); // 読み込み後は削除
  //   }
  // }, []);

  // const data: DataType[] = dataSource.map((d: Racer) => ({
  //   key: d.id,
  //   name: d.name,
  //   kana: d.kana,
  //   category: d.category,
  //   bib: d.bib,
  //   gender: d.gender,
  //   seed: d.seed,
  //   teamId: d.teamId,
  //   isFirstTime: d.isFirstTime,
  //   age: d.age,
  // }));
  // if (newTeam) {
  //   const index = data.findIndex((item) => item.key === newTeam.id);
  //   if (index !== -1) {
  //     data[index] = { ...data[index], ...newTeam };
  //   } else {
  //     data.push({
  //       key: newTeam.id!,
  //       fullname: newTeam.fullname,
  //       shortname: newTeam.shortname,
  //     });
  //   }
  // }

  const onDelete = async (key: React.Key) => {
    //   await deleteTeam(key as string);
    //   const newDataSource = dataSource.filter((item) => item.id != key);
    //   setDataSource(newDataSource);
  };

  const columns = [
    {
      title: 'ビブ',
      dataIndex: 'bib',
      key: 'bib',
      inputType: 'number',
      editable: true,
    },
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
      inputType: 'number',
      editable: true,
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'ふりがな',
      dataIndex: 'kana',
      key: 'kana',
      inputType: 'text',
      editable: true,
    },
    {
      title: '性別',
      dataIndex: 'gender',
      key: 'gender',
      inputType: 'gender',
      editable: true,
      render: (_: any, record: Item) =>
        record.gender == 'f' ? <span>女性</span> : <span>男性</span>,
    },
    {
      title: '競技',
      dataIndex: 'category',
      key: 'category',
      inputType: 'category',
      editable: true,
      render: (_: any, record: Item) =>
        record.category == 'ski' ? (
          <span>スキー</span>
        ) : (
          <span>スノーボード</span>
        ),
    },
    {
      title: '所属',
      dataIndex: 'team',
      key: 'team',
      inputType: 'team',
      editable: true,
      render: (_: any, record: Item) => (
        <span>
          {props.teams.find((item) => item.id == record.teamId)?.fullname ?? ''}
        </span>
      ),
    },
    {
      title: '初参加',
      dataIndex: 'isFirstTime',
      key: 'isFirstTime',
      inputType: 'boolean',
      editable: true,
      render: (_: any, record: Item) => (
        <Checkbox disabled checked={record.isFirstTime} />
      ),
    },
    {
      title: '年齢',
      dataIndex: 'age',
      key: 'age',
      inputType: 'number',
      editable: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Item) => {
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
            >
              編集
            </Typography.Link>
            <Popconfirm title="削除します。よろしいですか？" onConfirm={cancel}>
              削除
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
    console.log(`col: ${col.dataIndex}`);
    let inputType = 'text';
    switch (col.dataIndex) {
      case 'bib':
      case 'seed':
      case 'age':
        inputType = 'number';
        break;
      case 'gender': // m, f
      case 'category': // ski, snowboard
      case 'team':
        inputType = col.dataIndex;
        break;
      case 'isFirstTime':
        inputType = 'boolean';
        break;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <h1>選手</h1>
      <Button type="primary">
        <Link href="/prepare/racer/add">追加</Link>
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
        />
      </Form>
    </div>
  );
}
