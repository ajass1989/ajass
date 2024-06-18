'use client';
import {
  Alert,
  Breadcrumb,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputRef,
  Popconfirm,
  PopconfirmProps,
  Select,
  Table,
} from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { EditOutlined, WarningFilled } from '@ant-design/icons';
import { Racer, Team } from '@repo/database';
import {
  UpdateBibRequestDto,
  updateBibs,
  updateStatus,
  updateTime,
} from './actions';
import {
  AlertType,
  CategoryType,
  GenderType,
  SpecialType,
  StatusType,
} from '../common/types';
import {
  bgColorDefault,
  bgColorJunior,
  bgColorSenior,
  bgColorSkiFemale,
  bgColorSkiMale,
  bgColorSnowboardFemale,
  bgColorSnowboardMale,
  fgColorWarn,
} from '../common/colors';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Rule } from 'antd/es/form';
import { parseTime, renderTime, summary } from '../common/racerUtil';

dayjs.extend(duration);

type Props = {
  teams: Team[];
  racers: Racer[];
};

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  id: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number | null;
  gender: string; // f, m
  seed: number;
  teamId: string | null;
  special: string;
  summary: string;
  formatTime1: string;
  status1: string;
  formatTime2: string;
  status2: string;
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
  handleChangeBib: (record: Item) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeStatus1: (record: Item) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeStatus2: (record: Item) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeTime1: (record: Item) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeTime2: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleChangeBib,
  handleChangeStatus1,
  handleChangeStatus2,
  handleChangeTime1,
  handleChangeTime2,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputNumberRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const [editButtonVisible, setEditButtonVisible] = useState(false);

  useEffect(() => {
    if (editing) {
      inputNumberRef.current?.focus();
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

  const changeValue = async () => {
    const values = await form.validateFields();
    toggleEdit();
    setEditButtonVisible(false);
    switch (dataIndex as string) {
      case 'bib':
        handleChangeBib({ ...record, ...values });
        break;
      case 'formatTime1':
        handleChangeTime1({ ...record, ...values });
        break;
      case 'formatTime2':
        handleChangeTime2({ ...record, ...values });
        break;
      case 'status1':
        handleChangeStatus1({ ...record, ...values });
        break;
      case 'status2':
        handleChangeStatus2({ ...record, ...values });
        break;
    }
  };

  let childNode = children;

  const statusData = ['', 'df', 'ds', 'dq'];
  const regTime = /^(?:[0-9]{1,2}:)?[0-5]?[0-9]\.[0-9]{1,3}$/;

  const childNodeEditing = (dataIndex: string) => {
    let child;
    let rules: Rule[] = [{}];
    switch (dataIndex) {
      case 'bib':
        child = (
          <InputNumber
            ref={inputNumberRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
            style={{ width: '72px' }}
          />
        );
        rules = [];
        break;
      case 'formatTime1':
        child = (
          <Input
            ref={inputRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
            placeholder={'00:00.00'}
            style={{ width: '84px' }}
          />
        );
        rules = [
          {
            pattern: regTime,
            message: '[00:00.00]の形式で入力してください。',
          },
        ];
        break;
      case 'formatTime2':
        child = (
          <Input
            ref={inputRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
            placeholder={'00:00.00'}
            style={{ width: '84px' }}
          />
        );
        rules = [
          {
            pattern: regTime,
            message: '[00:00.00]の形式で入力してください。',
          },
        ];
        break;
      case 'status1':
        child = (
          <Select
            onBlur={changeValue}
            onChange={changeValue}
            options={statusData.map((status) => ({
              label: status,
              value: status,
            }))}
            style={{ width: '64px' }}
          />
        );
        break;
      case 'status2':
        child = (
          <Select
            onBlur={changeValue}
            onChange={changeValue}
            options={statusData.map((status) => ({
              label: status,
              value: status,
            }))}
          />
        );
        break;
    }
    return (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={rules}>
        {child}
      </Form.Item>
    );
  };

  const childNodeView = (children: React.ReactNode) => {
    let warnIconVisible = false;
    switch (dataIndex) {
      case 'bib':
        warnIconVisible = (record[dataIndex] ?? '').toString().length == 0;
        break;
      case 'formatTime1':
        warnIconVisible =
          (record[dataIndex] ?? '').length == 0 &&
          (record['status1'] ?? '').length == 0;
        break;
      case 'formatTime2':
        warnIconVisible =
          (record[dataIndex] ?? '').length == 0 &&
          (record['status2'] ?? '').length == 0;
        break;
    }
    return (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 8 }}
        onClick={toggleEdit}
        onMouseOver={showEditButton}
        onMouseOut={hideEditButton}
      >
        <span style={{ marginRight: '4px' }}>{children}</span>
        <WarningFilled
          style={{
            visibility: warnIconVisible ? 'visible' : 'hidden',
            fontSize: '16px',
            color: fgColorWarn,
          }}
        />
        <Button
          icon={<EditOutlined />}
          size="small"
          style={{
            visibility: editButtonVisible ? 'visible' : 'hidden',
          }}
        />
      </div>
    );
  };

  if (editable) {
    childNode = editing
      ? childNodeEditing(dataIndex as string)
      : childNodeView(children);
  }
  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: string;
  id: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number | null;
  gender: string; // f, m
  seed: number;
  teamId: string | null;
  status1: string;
  formatTime1: string;
  status2: string;
  formatTime2: string;
  special: string;
  summary: string;
  formatBestTime: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function ResultTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dataSource, setDataSource] = useState<Racer[]>(props.racers);

  // ソート順を定義
  // eslint-disable-next-line no-unused-vars
  const sortOrderSummary: { [key in DataType['summary']]: number } = {
    ジュニア: 0,
    女子スノボ: 1,
    男子スノボ: 2,
    女子スキー: 3,
    シニア: 4,
    男子スキー: 5,
  };

  const data: DataType[] = dataSource
    .map((racer: Racer) => {
      return {
        key: racer.id,
        id: racer.id,
        name: racer.name,
        kana: racer.kana,
        category: racer.category,
        bib: racer.bib,
        gender: racer.gender,
        seed: racer.seed,
        teamId: racer.teamId,
        status1: racer.status1 ?? '',
        time1: racer.time1 ?? '',
        formatTime1: renderTime(racer.time1),
        status2: racer.status2 ?? '',
        formatTime2: renderTime(racer.time2),
        time2: racer.time2 ?? '',
        special: racer.special,
        summary: summary(
          racer.special as SpecialType,
          racer.gender as GenderType,
          racer.category as CategoryType,
        ),
        formatBestTime: renderTime(racer.bestTime),
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

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '滑走順',
      dataIndex: 'order',
      render: (_: any, record, index) => index + 1,
    },
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
          {props.teams.find((item: Team) => item.id == record.teamId)
            ?.fullname ?? ''}
        </span>
      ),
    },
    {
      title: '状態1',
      dataIndex: 'status1',
      editable: true,
    },
    {
      title: '記録1',
      dataIndex: 'formatTime1',
      editable: true,
    },
    {
      title: '状態2',
      dataIndex: 'status2',
      editable: true,
    },
    {
      title: '記録2',
      dataIndex: 'formatTime2',
      editable: true,
    },
    {
      title: 'ベスト',
      dataIndex: 'formatBestTime',
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record: record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleChangeBib,
        handleChangeStatus1,
        handleChangeStatus2,
        handleChangeTime1,
        handleChangeTime2,
      }),
    };
  });

  const setNewData = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleChangeBib = async (row: DataType) => {
    const result = await updateBibs([{ ...row }]);
    if (!result.success) {
      showAlert('error', result.error);
    }
    setNewData(row);
  };

  const handleChangeStatus1 = async (row: DataType) => {
    const result = await updateStatus(row.id, {
      status1: row.status1 === '' ? null : (row.status1 as StatusType),
      status2: undefined,
    });
    if (!result.success) {
      showAlert('error', result.error);
    }
    replaceRacers(result.result!);
  };

  const handleChangeStatus2 = async (row: DataType) => {
    const result = await updateStatus(row.id, {
      status1: undefined,
      status2: row.status2 === '' ? null : (row.status2 as StatusType),
    });
    if (!result.success) {
      showAlert('error', result.error);
    }
    replaceRacers(result.result!);
  };

  const handleChangeTime1 = async (row: DataType) => {
    const result = await updateTime(row.id, {
      time1: parseTime(row.formatTime1),
      time2: undefined,
    });
    if (!result.success) {
      showAlert('error', result.error);
    }
    replaceRacers(result.result!);
  };

  const handleChangeTime2 = async (row: DataType) => {
    const result = await updateTime(row.id, {
      time1: undefined,
      time2: parseTime(row.formatTime2),
    });
    if (!result.success) {
      showAlert('error', result.error);
    }
    replaceRacers(result.result!);
  };

  const replaceRacers = (racers: Racer[]) => {
    const newData = [...dataSource];
    racers.forEach((racer) => {
      const index = newData.findIndex((item) => racer.id === item.id);
      const newItem = newData[index];
      newItem.time1 = racer.time1;
      newItem.time2 = racer.time2;
      newItem.status1 = racer.status1;
      newItem.status2 = racer.status2;
      newItem.bestTime = racer.bestTime;
      newData.splice(index, 1, {
        ...newItem,
      });
    });
    setDataSource(newData);
  };

  /**
   * 行スタイルを取得
   * @param record
   * @returns
   */
  const getRowStyle = (record: DataType) => {
    switch (record.summary) {
      case 'ジュニア':
        return { backgroundColor: bgColorJunior };
      case '女子スノボ':
        return { backgroundColor: bgColorSnowboardFemale };
      case '男子スノボ':
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

  /**
   * ビブ一括付与処理
   */
  const handleUpdateBibs: PopconfirmProps['onConfirm'] = async () => {
    const params = data.map((data, index): UpdateBibRequestDto => {
      return { id: data.id, bib: index + 1 };
    });
    const result = await updateBibs(params);
    if (result.success) {
      const newDataSource: Racer[] = dataSource.map((data) => {
        data.bib = result.result!.find((item) => item.id == data.id)!.bib;
        return data;
      });
      setDataSource(newDataSource);
      showAlert('success', 'ビブを一括付与しました。');
    } else {
      showAlert('error', result.error);
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
    <>
      <Breadcrumb
        items={[
          {
            title: '入力',
          },
        ]}
      />
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
        // 背景色をスタイルで指定
        onRow={(record: any) => {
          return {
            style: getRowStyle(record),
          };
        }}
        sticky={true}
      />
    </>
  );
}
