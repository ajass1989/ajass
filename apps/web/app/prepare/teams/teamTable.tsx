'use client';
import {
  Alert,
  Breadcrumb,
  Button,
  Form,
  FormInstance,
  InputNumber,
  Popconfirm,
  Table,
  TableProps,
} from 'antd';
import Link from 'next/link';
import { TeamWithRacers, deleteTeam, updateTeamOrder } from './actions';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Team } from '@repo/database';
import { AlertType } from '../../common/types';
import { useRouter } from 'next/navigation';

type Props = {
  teams: TeamWithRacers[];
};

const EditableContext = React.createContext<FormInstance<DataType> | null>(
  null,
);

interface Item {
  key: string;
  id: string;
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

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  editing: boolean;
  index: number;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useContext(EditableContext)!;
  const [editButtonVisible, setEditButtonVisible] = useState(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const showEditButton = () => {
    setEditButtonVisible(true);
  };

  const hideEditButton = () => {
    setEditButtonVisible(false);
  };

  const save = async () => {
    const values = await form.validateFields();
    toggleEdit();
    setEditButtonVisible(false);
    handleSave({ ...record, ...values });
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 8 }}
        onClick={toggleEdit}
        onMouseOver={showEditButton}
        onMouseOut={hideEditButton}
      >
        <span style={{ marginRight: '4px' }}>{children}</span>
        <Button
          icon={<EditOutlined />}
          size="small"
          style={{ visibility: editButtonVisible ? 'visible' : 'hidden' }}
        />
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: string;
  id: string;
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

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function TeamTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [dataSource, setDataSource] = useState<TeamWithRacers[]>(props.teams);
  const [newTeam, setNewTeam] = useState<Team | null>(null);
  const router = useRouter();

  // 表示用データに一旦変換
  const data: DataType[] = dataSource.map((d) => {
    return {
      key: d.id,
      id: d.id,
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
        key: newTeam.id,
        id: newTeam.id,
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

  const defaultColumns = [
    {
      title: 'チーム名',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (_: DataType, record: DataType) => (
        <>
          <Button type="link" onClick={() => handleClick(record.key)}>
            {record.fullname}
          </Button>
        </>
      ),
      sorter: (a: DataType, b: DataType) => (a.fullname > b.fullname ? 1 : -1),
    },
    {
      title: '滑走順男子',
      dataIndex: 'orderMale',
      key: 'orderMale',
      editable: true,
      sorter: (a: DataType, b: DataType) => a.orderMale - b.orderMale,
    },
    {
      title: '滑走順女子',
      dataIndex: 'orderFemale',
      key: 'orderFemale',
      editable: true,
      sorter: (a: DataType, b: DataType) => a.orderFemale - b.orderFemale,
    },
    {
      title: '選手数',
      children: [
        {
          title: '合計',
          dataIndex: 'racerCount',
          key: 'racerCount',
          sorter: (a: DataType, b: DataType) => a.racerCount - b.racerCount,
        },
        {
          title: 'スノボ',
          children: [
            {
              title: '男子',
              dataIndex: 'snowboardMaleCount',
              key: 'snowboardMaleCount',
              sorter: (a: DataType, b: DataType) =>
                a.snowboardMaleCount - b.snowboardMaleCount,
            },
            {
              title: '女子',
              dataIndex: 'snowboardFemaleCount',
              key: 'snowboardFemaleCount',
              sorter: (a: DataType, b: DataType) =>
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
              sorter: (a: DataType, b: DataType) =>
                a.skiMaleCount - b.skiMaleCount,
            },
            {
              title: '女子',
              dataIndex: 'skiFemaleCount',
              key: 'skiFemaleCount',
              sorter: (a: DataType, b: DataType) =>
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
              sorter: (a: DataType, b: DataType) =>
                a.seniorCount - b.seniorCount,
            },
            {
              title: 'ジュニア',
              dataIndex: 'juniorCount',
              key: 'juniorCount',
              sorter: (a: DataType, b: DataType) =>
                a.juniorCount - b.juniorCount,
            },
          ],
        },
      ],
    },
    {
      title: '操作',
      key: 'action',
      render: (_: DataType, record: DataType) => {
        return (
          <Popconfirm
            onConfirm={() => handleDelete(record.key)}
            title="削除します。よろしいですか？"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              title="削除"
              type="default"
            />
          </Popconfirm>
        );
      },
    },
  ];

  const columns: TableProps['columns'] = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  /**
   * 追加または編集されたチーム情報があれば取得して表示用データを更新する
   */
  useEffect(() => {
    const teamData = localStorage.getItem('newTeam');
    if (teamData) {
      setNewTeam(JSON.parse(teamData));
      showAlert('success', '保存しました。');
      localStorage.removeItem('newTeam'); // 読み込み後は削除
    }
  }, []);

  const handleSave = async (row: DataType) => {
    const result = await updateTeamOrder(
      row.id,
      row.orderFemale,
      row.orderMale,
    );
    if (result.success) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.id === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    } else {
      showAlert('error', result.error);
    }
  };

  const handleDelete = async (key: React.Key) => {
    const result = await deleteTeam(key as string);
    if (!result.success) {
      showAlert('error', result.error);
      return;
    }
    const newDataSource = dataSource.filter((item) => item.id != key);
    setDataSource(newDataSource);
  };

  const handleClick = (key: React.Key) => {
    router.push(`/prepare/teams/${key}`, { scroll: true });
    router.refresh();
  };

  // Alert を表示する関数
  const showAlert = (alertType: AlertType, error?: string) => {
    setAlertMessage(error ?? '');
    setAlertVisible(true);
    setAlertType(alertType);
  };

  // Alert を非表示にする関数
  const closeAlert = () => {
    setAlertMessage('');
    setAlertVisible(false);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '準備',
          },
          {
            title: 'チーム',
          },
        ]}
      />
      <h1>チーム</h1>
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link href="/prepare/teams/add">追加</Link>
      </Button>
      {alertVisible && (
        <Alert
          message={alertMessage}
          type={alertType}
          closable
          onClose={closeAlert}
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={columns as ColumnTypes}
        pagination={false}
        bordered={true}
        rowHoverable={false}
      />
    </>
  );
}
