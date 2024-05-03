import React, { useState } from 'react';
import type { TableProps } from 'antd';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Switch,
  Table,
  Typography,
} from 'antd';
import { addRacer, deleteRacer, updateRacer } from './actions';
import { RacerType } from './clientForm';
import { ActionResult } from '../../../actionResult';
import { RacerDto } from '../racerDto';

type Props = {
  title: string;
  teamId: string;
  special: string;
  dataSource: RacerType[];
};

interface Item {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  age: number;
  isFirstTime: boolean;
  gender: string; // f, m
  seed: number;
  teamId: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof Item;
  title: any;
  inputType: 'number' | 'text' | 'boolean' | 'category' | 'gender';
  record: Item;
  index: number;
  children: React.ReactNode;
}

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
    case 'boolean':
      inputNode = <Switch defaultChecked={record.isFirstTime} />;
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
  }
  return (
    <td {...restProps}>
      {editing ? (
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface DataType {
  key: string;
  name: string;
  kana: string;
  category: string;
  age: number;
  isFirstTime: boolean;
  gender: string;
  seed: number;
}

export default function ClientTable(props: Props) {
  const [form] = Form.useForm();
  const _data: DataType[] = props.dataSource.map((item: RacerType) => ({
    key: item.key,
    name: item.name,
    kana: item.kana,
    category: item.category,
    age: item.age ?? 0,
    isFirstTime: item.isFirstTime,
    gender: item.gender,
    seed: item.seed,
  }));
  const [dataSource, setDataSource] = useState<DataType[]>(_data);
  const [count, setCount] = useState<number>(_data.length);

  const handleDelete = async (key: React.Key) => {
    const result = await deleteRacer(key as string);
    if (!result.success) {
      console.error(`deleteRacer failed`);
      return;
    }
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleEdit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key as string);
  };

  const handleCancel = (key: React.Key) => {
    console.log(`handleCancel: key: ${key}`);
    if ((key as string) == 'add') {
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
    }
    setEditingKey('');
  };

  const handleAdd = () => {
    const newCount = count + 1;
    const newData: DataType = {
      key: 'add',
      name: ``,
      kana: '',
      category: 'ski',
      age: 0,
      isFirstTime: false,
      gender: 'm', // TODO 上位からの引き回し
      seed: newCount,
    };
    form.setFieldsValue({
      ...newData,
    });
    setDataSource([...dataSource, newData]);
    setEditingKey(newData.key);
    setCount(count + 1);
  };

  const handleSave = async (key: React.Key) => {
    try {
      console.log(`handleSave: ${key}`);
      const row = (await form.validateFields()) as Item; // TODO調査 個々で取得したrowでgenderの値がundefinedになっている。画面から取得しようとしているのが原因
      const newDataSource = [...dataSource];
      const index = dataSource.findIndex((item) => key === item.key);
      console.log(`handleSave: index: ${index}`);
      console.log(`handleSave: seed: ${row.seed}`);
      let result: ActionResult<RacerDto>;
      if (key === 'add') {
        result = await addRacer({
          name: row.name,
          kana: row.kana,
          category: row.category,
          gender: row.gender,
          seed: dataSource[index].seed, // seedはformから取得できない
          teamId: props.teamId,
          isFirstTime: row.isFirstTime,
          age: row.age,
          special: props.special,
        });
      } else {
        result = await updateRacer({
          id: dataSource[index].key,
          name: row.name,
          kana: row.kana,
          category: row.category,
          gender: row.gender,
          seed: dataSource[index].seed, // seedはformから取得できない
          teamId: props.teamId,
          isFirstTime: row.isFirstTime,
          age: row.age,
          special: props.special,
        });
      }
      const r: Item = {
        key: result.result!.id as string,
        name: result.result!.name,
        kana: result.result!.kana,
        category: result.result!.category,
        gender: result.result!.gender,
        seed: result.result!.seed,
        teamId: props.teamId,
        isFirstTime: result.result!.isFirstTime,
        age: result.result!.age!,
      };
      newDataSource.splice(index, 1, {
        ...r,
        ...row,
      });
      setDataSource(newDataSource);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'シード',
      dataIndex: 'seed',
      inputType: 'number',
    },
    {
      title: '選手名',
      dataIndex: 'name',
      width: '30%',
      inputType: 'text',
      editable: true,
    },
    {
      title: 'かな',
      dataIndex: 'kana',
      inputType: 'text',
      editable: true,
    },
    {
      title: '競技',
      dataIndex: 'category',
      editable: true,
      inputType: 'category',
      render: (_: any, record: Item) =>
        record.category == 'ski' ? (
          <span>スキー</span>
        ) : (
          <span>スノーボード</span>
        ),
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
      title: '年齢',
      dataIndex: 'age',
      editable: true,
      inputType: 'number',
    },
    {
      title: '初参加',
      dataIndex: 'isFirstTime',
      editable: true,
      inputType: 'boolean',
      render: (_: any, record: Item) => (
        <Switch disabled defaultChecked={record.isFirstTime} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleSave(record.key)}
              style={{ marginRight: 8 }}
            >
              保存
            </Typography.Link>
            <Typography.Link onClick={() => handleCancel(record.key)}>
              キャンセル
            </Typography.Link>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ''}
              style={{ marginRight: 8 }}
              onClick={() => handleEdit(record)}
            >
              編集
            </Typography.Link>
            <Popconfirm
              title="削除します。よろしいですか？"
              onConfirm={() => handleDelete(record.key)}
            >
              <Typography.Link disabled={editingKey !== ''}>
                削除
              </Typography.Link>
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
      onCell: (record: Item) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record: DataType) => record.key === editingKey;

  return (
    <div>
      <h2>{props.title}</h2>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{ marginBottom: 16 }}
        disabled={editingKey !== ''}
      >
        追加
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          pagination={{ position: [] }}
        />
      </Form>
    </div>
  );
}
