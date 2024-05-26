'use client';
import {
  Alert,
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
import { EditOutlined } from '@ant-design/icons';
import { Team } from '@repo/database';
import {
  RacerWithResults,
  UpdateBibRequestDto,
  updateBibs,
  updateResultStatus,
  updateResultTime,
} from '../prepare/bibs/actions';
import { AlertType } from '../components/alertType';
import {
  bgColorDefault,
  bgColorJunior,
  bgColorSenior,
  bgColorSkiFemale,
  bgColorSkiMale,
  bgColorSnowboardFemale,
  bgColorSnowboardMale,
} from '../colors';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Rule } from 'antd/es/form';

dayjs.extend(duration);

type Props = {
  teams: Team[];
  racers: RacerWithResults[];
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
    console.log(dataIndex);
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

  const childNodeView = (dataIndex: string) => {
    let c;
    let rules: Rule[] = [{}];
    switch (dataIndex) {
      case 'bib':
        c = (
          <InputNumber
            ref={inputNumberRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
          />
        );
        break;
      case 'formatTime1':
        c = (
          <Input
            ref={inputRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
            placeholder={'00:00.00'}
          />
        );
        rules = [
          {
            pattern: /^\d{2}:\d{2}\.\d{2}$/, // TODO 00:00.00のフォーマット指定
            message: '[00:00.00]の形式で入力してください。',
          },
        ];
        break;
      case 'formatTime2':
        c = (
          <Input
            ref={inputRef}
            onPressEnter={changeValue}
            onBlur={changeValue}
            placeholder={'00:00.00'}
          />
        );
        rules = [
          {
            pattern: /^\d{2}:\d{2}\.\d{2}$/, // TODO 00:00.00のフォーマット指定
            message: '[00:00.00]の形式で入力してください。',
          },
        ];
        break;
      case 'status1':
        c = (
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
      case 'status2':
        c = (
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
        {c}
      </Form.Item>
    );
  };

  if (editable) {
    childNode = editing ? (
      childNodeView(dataIndex as string)
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
          style={{
            visibility: editButtonVisible ? 'visible' : 'hidden',
          }}
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
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function ResultTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dataSource, setDataSource] = useState<RacerWithResults[]>(
    props.racers,
  );

  // 種目のフォーマット
  const summary = (record: RacerWithResults) => {
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

  const renderTime = (time: number | null) => {
    if (!time) {
      return '';
    }
    const timeDuration = dayjs.duration(time, 'milliseconds');
    const minutes = timeDuration.minutes().toString().padStart(2, '0');
    const seconds = timeDuration.seconds().toString().padStart(2, '0');
    const milliseconds = (timeDuration.milliseconds() / 10)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  const parseTime = (formatTime: string) => {
    const time = formatTime.split(':');
    const minutes = parseInt(time[0]);
    const seconds = parseInt(time[1].split('.')[0]);
    const milliseconds = parseInt(time[1].split('.')[1]);
    return minutes * 60000 + seconds * 1000 + milliseconds * 10;
  };

  const data: DataType[] = dataSource
    .map((racer: RacerWithResults) => {
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
        status1: racer.results.find((result) => result.set == 1)?.status ?? '',
        formatTime1: renderTime(
          racer.results.find((result) => result.set == 1)?.time ?? null,
        ),
        status2: racer.results.find((result) => result.set == 2)?.status ?? '',
        formatTime2: renderTime(
          racer.results.find((result) => result.set == 2)?.time ?? null,
        ),
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
    console.log('setNewData: 1');
    console.log(row);
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newData');
    console.log(newData);
    setDataSource(newData);
  };

  const handleChangeBib = async (row: DataType) => {
    const result = await updateBibs([{ ...row }]);
    if (result.success) {
      setNewData(row);
    } else {
      showAlert('error', result.error);
    }
  };

  const handleChangeStatus1 = async (row: DataType) => {
    try {
      await _handleChangeStatus(row.id, 1, row.status1);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };

  const handleChangeStatus2 = async (row: DataType) => {
    try {
      await _handleChangeStatus(row.id, 2, row.status2);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };

  async function _handleChangeStatus(
    racerId: string,
    set: number,
    status: string,
  ): Promise<void> {
    const result = await updateResultStatus({
      racerId: racerId,
      set: set,
      status: status,
    });
    if (!result.success) {
      throw new Error(result.error!);
    }
    const newData = [...dataSource];
    const index = newData.findIndex((item) => racerId === item.id);
    const newItem = newData[index];
    newItem.results.find((result) => result.set == set)!.time =
      result.result!.time;
    newItem.results.find((result) => result.set == set)!.status =
      result.result!.status;
    newData.splice(index, 1, {
      ...newItem,
    });
    setDataSource(newData);
  }

  const handleChangeTime1 = async (row: DataType) => {
    const result = await updateResultTime({
      racerId: row.id,
      set: 1,
      time: parseTime(row.formatTime1),
    });
    if (result.success) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.id === item.id);
      const item = newData[index];
      item.results.find((result) => result.set == 1)!.time =
        result.result!.time;
      item.results.find((result) => result.set == 1)!.status = null;
      newData.splice(index, 1, {
        ...item,
      });
      setDataSource(newData);
    } else {
      showAlert('error', result.error!);
    }
  };

  const handleChangeTime2 = async (row: DataType) => {
    const result = await updateResultTime({
      racerId: row.id,
      set: 2,
      time: parseTime(row.formatTime2),
    });
    if (result.success) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.id === item.id);
      const item = newData[index];
      item.results.find((result) => result.set == 2)!.time =
        result.result!.time;
      item.results.find((result) => result.set == 2)!.status = null;
      newData.splice(index, 1, {
        ...item,
      });
      setDataSource(newData);
    } else {
      showAlert('error', result.error!);
    }
  };

  const getRowStyle = (record: DataType) => {
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

  /**
   * ビブ一括付与処理
   */
  const handleUpdateBibs: PopconfirmProps['onConfirm'] = async () => {
    const params = data.map((data, index): UpdateBibRequestDto => {
      return { id: data.id, bib: index + 1 };
    });
    const result = await updateBibs(params);
    if (result.success) {
      const newDataSource: RacerWithResults[] = dataSource.map((data) => {
        data.bib = result.result!.find((item) => item.id == data.id)!.bib;
        return data;
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
    <>
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
      />
    </>
  );
}
