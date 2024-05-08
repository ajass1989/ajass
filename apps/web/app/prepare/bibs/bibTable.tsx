'use client';
import { Team, Racer } from '@repo/database';
import {
  Button,
  Form,
  FormInstance,
  InputNumber,
  InputRef,
  Popconfirm,
  PopconfirmProps,
  Table,
} from 'antd';
import Link from 'next/link';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { UpdateBibParams, updateBibs } from './actions';
import Search from 'antd/es/transfer/search';
import { EditOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';

type Props = {
  racers: Racer[];
  teams: Team[];
};

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number | null;
  gender: string; // f, m
  seed: number;
  teamId: string | null;
  special: string;
  summary: string;
}

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
  title: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
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
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <div style={{ display: 'flex' }}>
        <Button
          icon={<SaveOutlined />}
          size="small"
          style={{ marginRight: 8 }}
          onClick={save}
        />
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
          <InputNumber />
        </Form.Item>
      </div>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 8 }}>
        <Button
          icon={<EditOutlined />}
          size="small"
          style={{ marginRight: 8 }}
          onClick={toggleEdit}
        />
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number | null;
  gender: string; // f, m
  seed: number;
  teamId: string | null;
  special: string;
  summary: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function BibTable(props: Props) {
  // const [form] = Form.useForm();

  // 種目の値構築
  const summary = (record: Racer) => {
    let summary = '';
    switch (record.special) {
      case 'senior':
        summary += 'シニア';
        break;
      case 'junior':
        summary += 'ジュニア';
        break;
      case 'normal':
        summary += record.gender == 'f' ? '女子' : '男子';
        summary += record.category == 'ski' ? 'スキー' : 'スノーボード';
        break;
    }
    return summary;
  };

  // ソート順を定義
  const sortOrderSummary: { [key in Item['summary']]: number } = {
    ジュニア: 0,
    女子スノーボード: 1,
    男子スノーボード: 2,
    女子スキー: 3,
    シニア: 4,
    男子スキー: 5,
  };

  const data: DataType[] = props.racers
    .map((racer: Racer) => {
      return {
        key: racer.id,
        name: racer.name,
        kana: racer.kana,
        category: racer.category,
        bib: racer.bib,
        gender: racer.gender,
        seed: racer.seed,
        teamId: racer.teamId,
        special: racer.special,
        summary: summary(racer),
      };
    })
    .sort((a, b) => {
      // 種目でソート
      if (sortOrderSummary[a.summary] < sortOrderSummary[b.summary]) {
        return -1;
      }
      if (sortOrderSummary[a.summary] > sortOrderSummary[b.summary]) {
        return 1;
      }
      // シードでソート
      if (a.seed < b.seed) {
        return -1;
      }
      if (a.seed > b.seed) {
        return 1;
      }
      // 会社でソート
      const aTeam = props.teams.find((item: Team) => item.id == a.teamId);
      const bTeam = props.teams.find((item: Team) => item.id == b.teamId);
      if (!aTeam || !bTeam) {
        return -1;
      }
      switch (a.special) {
        case 'junior':
        case 'senior':
          if (aTeam!.orderMale < bTeam!.orderMale) {
            return -1;
          }
          if (aTeam!.orderMale > bTeam!.orderMale) {
            return 1;
          }
          break;
        case 'normal':
          if (a.gender == 'f') {
            if (aTeam!.orderFemale < bTeam!.orderFemale) {
              return -1;
            }
            if (aTeam!.orderFemale > bTeam!.orderFemale) {
              return 1;
            }
          }
          if (a.gender == 'm') {
            if (aTeam!.orderMale < bTeam!.orderMale) {
              return -1;
            }
            if (aTeam!.orderMale > bTeam!.orderMale) {
              return 1;
            }
          }
          break;
      }
      return 0;
    });

  const [dataSource, setDataSource] = useState<DataType[]>(data);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '種目',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: 'ビブ',
      dataIndex: 'bib',
      key: 'bib',
      editable: true,
    },
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
      title: 'ふりがな',
      dataIndex: 'kana',
      key: 'kana',
    },
    {
      title: '所属',
      dataIndex: 'team',
      key: 'team',
      render: (_: any, record) => (
        <span>
          {props.teams.find((item: Team) => item.id == record.teamId)
            ?.fullname ?? ''}
        </span>
      ),
    },
  ];

  const handleSave = async (row: DataType) => {
    console.log('handleSave()');
    const result = await updateBibs([{ id: row.key, bib: row.bib }]);
    if (result.success) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    } else {
      // TODO エラー表示
    }
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const getRowStyle = (record: DataType, index: number) => {
    // インデックスに基づいて交互に色を変更する例
    switch (record.summary) {
      case 'ジュニア':
        return { backgroundColor: '#fffbe6' };
      case '女子スノーボード':
        return { backgroundColor: '#fff0f6' };
      case '男子スノーボード':
        return { backgroundColor: '#f6ffed' };
      case '女子スキー':
        return { backgroundColor: '#fff1f0' };
      case 'シニア':
        return { backgroundColor: '#fff7e6' };
      case '男子スキー':
        return { backgroundColor: '#e6f4ff' };
    }
    return { backgroundColor: '#ffffff' };
  };

  const handleUpdateBibs: PopconfirmProps['onConfirm'] = async (e) => {
    console.log(`handleUpdateBibs()`);
    const params = dataSource.map((data, index): UpdateBibParams => {
      return { id: data.key, bib: index + 1 };
    });
    const result = await updateBibs(params);
    if (result) {
      const newDataSource: DataType[] = dataSource.map((data) => {
        return {
          ...data,
          bib: result.result!.find((item) => item.id == data.key)?.bib ?? null,
        };
      });
      setDataSource(newDataSource);
    } else {
      // TODO エラー表示
    }
    console.log(`result: ${result.success}`);
  };

  return (
    <div>
      <h1>ビブ管理</h1>
      <Popconfirm
        title="ビブを一括付与します。"
        description="現在付与されているビブは消えてしまいますがよろしいですか？"
        onConfirm={handleUpdateBibs}
        okText="はい"
        cancelText="キャンセル"
      >
        <Button type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
          ビブ一括付与
        </Button>
      </Popconfirm>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{ position: [], defaultPageSize: 200 }}
        onRow={(record: any, index: any) => {
          return {
            style: getRowStyle(record, index || 0), // 背景色をスタイルで指定
          };
        }}
      />
    </div>
  );
}