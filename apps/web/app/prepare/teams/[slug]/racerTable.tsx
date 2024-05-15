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
} from 'antd';
import { addRacer, deleteRacer, updateRacer } from './actions';
import { RacerType } from './editTeamForm';
import { ActionResult } from '../../../actionResult';
import { RacerRequestDto } from '../racerRequestDto';
import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Racer } from '@repo/database';

type Props = {
  title: string;
  teamId: string;
  special: string;
  gender?: string;
  category?: string;
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
  age: number | null;
  isFirstTime: boolean;
  gender: string;
  seed: number;
}

export function RacerTable(props: Props) {
  const [form] = Form.useForm();
  const _data: DataType[] = props.dataSource.map((item: RacerType) => ({
    ...item,
  }));
  const [dataSource, setDataSource] = useState<DataType[]>(_data);
  const [count, setCount] = useState<number>(_data.length);

  const handleDelete = async (key: React.Key) => {
    const result = await deleteRacer(
      key as string,
      props.teamId,
      props.special,
      props.category,
      props.gender,
    );
    if (!result.success) {
      console.error(`deleteRacer failed`);
      return;
    }
    const newData = result.result!.map((racer) => {
      const r: DataType = {
        key: racer.id as string,
        name: racer.name,
        kana: racer.kana,
        category: racer.category,
        gender: racer.gender,
        seed: racer.seed,
        isFirstTime: racer.isFirstTime,
        age: racer.age!,
      };
      return r;
    });
    setDataSource(newData);
  };

  const handleEdit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key as string);
  };

  const handleCancel = (key: React.Key) => {
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
      age: null,
      isFirstTime: false,
      gender: 'm', // TODO 上位からの引き回し
      seed: newCount,
    };
    form.setFieldsValue({ ...newData });
    setDataSource([...dataSource, newData]);
    setEditingKey(newData.key);
    setCount(count + 1);
  };

  const handleSave = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newDataSource = [...dataSource];
      const index = dataSource.findIndex((item) => key === item.key);
      let result: ActionResult<Racer>;
      const gender = props.special == 'normal' ? props.gender! : row.gender;
      const category =
        props.special == 'normal' ? props.category! : row.category;
      if (key === 'add') {
        result = await addRacer({
          name: row.name,
          kana: row.kana,
          category: category,
          gender: gender,
          seed: dataSource[index].seed, // seedはformから取得できない
          teamId: props.teamId,
          isFirstTime: row.isFirstTime,
          age: row.age,
          special: props.special,
        });
      } else {
        const dto: RacerRequestDto = {
          name: row.name,
          kana: row.kana,
          category: category,
          gender: gender,
          seed: dataSource[index].seed, // seedはformから取得できない
          teamId: props.teamId,
          isFirstTime: row.isFirstTime,
          age: row.age,
          special: props.special,
        };
        result = await updateRacer(dataSource[index].key, dto);
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
      visible: true,
    },
    {
      title: '選手名',
      dataIndex: 'name',
      width: '30%',
      inputType: 'text',
      editable: true,
      visible: true,
    },
    {
      title: 'かな',
      dataIndex: 'kana',
      inputType: 'text',
      editable: true,
      visible: true,
    },
    {
      title: '競技',
      dataIndex: 'category',
      editable: true,
      visible: props.special != 'normal',
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
      visible: props.special != 'normal',
      render: (_: any, record: Item) =>
        record.gender == 'f' ? <span>女性</span> : <span>男性</span>,
    },
    {
      title: '年齢',
      dataIndex: 'age',
      editable: true,
      inputType: 'number',
      visible: props.special != 'normal',
    },
    {
      title: '初参加',
      dataIndex: 'isFirstTime',
      editable: true,
      inputType: 'boolean',
      visible: true,
      render: (_: any, record: Item) => (
        <Switch disabled defaultChecked={record.isFirstTime} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      visible: true,
      render: (_: any, record: Item) => {
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
              onClick={() => handleCancel(record.key)}
              size="small"
              title="キャンセル"
            />
          </span>
        ) : (
          <span>
            <Button
              disabled={editingKey !== ''}
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
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
              />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const filteredColumns = columns.filter((col) => col.visible);

  const mergedColumns: TableProps['columns'] = filteredColumns.map((col) => {
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
          pagination={false}
        />
      </Form>
    </div>
  );
}
