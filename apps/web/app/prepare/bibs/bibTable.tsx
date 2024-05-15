'use client';
import {
  Alert,
  Button,
  Form,
  GetRef,
  InputNumber,
  Popconfirm,
  PopconfirmProps,
  Table,
} from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { UpdateBibParams, updateBibs } from './actions';
import { EditOutlined } from '@ant-design/icons';
import { AlertType } from '../../components/alertType';
import {
  bgColorDefault,
  bgColorJunior,
  bgColorSenior,
  bgColorSkiFemale,
  bgColorSkiMale,
  bgColorSnowboardFemale,
  bgColorSnowboardMale,
} from '../../colors';
import { RacerResponseDto } from '../teams/racerResponseDto';
import { TeamResponseDto } from '../teams/teamResponseDto';

type Props = {
  racers: RacerResponseDto[];
  teams: TeamResponseDto[];
};

type FormInstance<T> = GetRef<typeof Form<T>>;

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

// eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
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
    try {
      const values = await form.validateFields();
      toggleEdit();
      setEditButtonVisible(false);
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // showAlert('error', '保存に失敗しました。');
      console.error('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    // console.log(`editable ${record['bib']} ${dataIndex}`);
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={record['bib']}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
        onMouseOver={showEditButton}
        onMouseOut={hideEditButton}
      >
        {editButtonVisible && <Button icon={<EditOutlined />} size="small" />}
        {children}
      </div>
    );
  } else {
    // console.log(`not editable`);
  }
  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib?: number;
  gender: string; // f, m
  seed: number;
  teamId?: string;
  special: string;
  summary: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function BibTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  // 種目の値構築
  const summary = (record: RacerResponseDto) => {
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
  // eslint-disable-next-line no-unused-vars
  const sortOrderSummary: { [key in DataType['summary']]: number } = {
    ジュニア: 0,
    女子スノーボード: 1,
    男子スノーボード: 2,
    女子スキー: 3,
    シニア: 4,
    男子スキー: 5,
  };

  const data: DataType[] = props.racers
    .map((racer: RacerResponseDto) => {
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
      const aTeam = props.teams.find(
        (item: TeamResponseDto) => item.id == a.teamId,
      );
      const bTeam = props.teams.find(
        (item: TeamResponseDto) => item.id == b.teamId,
      );
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

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '種目',
      dataIndex: 'summary',
    },
    {
      title: 'ビブ',
      dataIndex: 'bib',
      editable: true,
    },
    {
      title: 'シード',
      dataIndex: 'seed',
    },
    {
      title: '選手名',
      dataIndex: 'name',
    },
    {
      title: 'ふりがな',
      dataIndex: 'kana',
    },
    {
      title: '所属',
      dataIndex: 'team',
      render: (_: any, record) => (
        <span>
          {props.teams.find((item: TeamResponseDto) => item.id == record.teamId)
            ?.fullname ?? ''}
        </span>
      ),
    },
  ];

  const handleSave = async (row: DataType) => {
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
      showAlert('error', result.error);
    }
  };

  const columns = defaultColumns.map((col) => {
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

  const getRowStyle = (record: DataType) => {
    // インデックスに基づいて交互に色を変更する例
    switch (record.summary) {
      case 'ジュニア':
        return { backgroundColor: bgColorJunior };
      case '女子スノーボード':
        return { backgroundColor: bgColorSnowboardFemale };
      case '男子スノーボード':
        return { backgroundColor: bgColorSnowboardMale };
      case '女子スキー':
        return { backgroundColor: bgColorSkiFemale };
      case 'シニア':
        return { backgroundColor: bgColorSenior };
      case '男子スキー':
        return { backgroundColor: bgColorSkiMale };
    }
    return { backgroundColor: bgColorDefault };
  };

  const handleUpdateBibs: PopconfirmProps['onConfirm'] = async () => {
    const params = dataSource.map((data, index): UpdateBibParams => {
      return { id: data.key, bib: index + 1 };
    });
    const result = await updateBibs(params);
    if (result.success) {
      const newDataSource: DataType[] = dataSource.map((data) => {
        return {
          ...data,
          bib:
            result.result!.find((item) => item.id == data.key)?.bib ??
            undefined,
        };
      });
      setDataSource(newDataSource);
      showAlert('success', 'ビブを一括付与しました。');
    } else {
      showAlert('error', 'ビブの一括付与に失敗しました。');
    }
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
    <div>
      <h1>ビブ管理</h1>
      <Popconfirm
        title="ビブを一括付与します。"
        description="現在付与されているビブは消えてしまいますがよろしいですか？"
        onConfirm={handleUpdateBibs}
        okText="はい"
        cancelText="キャンセル"
      >
        <Button style={{ marginBottom: 16, marginRight: 16 }} type="primary">
          ビブ一括付与
        </Button>
      </Popconfirm>
      {alertVisible && (
        <Alert
          message={alertMessage}
          type={alertType}
          closable
          onClose={closeAlert}
        />
      )}
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        onRow={(record: any) => {
          return {
            style: getRowStyle(record), // 背景色をスタイルで指定
          };
        }}
      />
    </div>
  );
}
