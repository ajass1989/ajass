'use client';
import {
  Alert,
  AutoComplete,
  Button,
  Flex,
  Form,
  FormInstance,
  InputNumber,
  Popconfirm,
  PopconfirmProps,
  Table,
} from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import { EditOutlined, WarningFilled } from '@ant-design/icons';
import { Racer, Team } from '@repo/database';
import {
  AlertType,
  CategoryType,
  GenderType,
  SpecialType,
  StatusType,
} from '../../common/types';
import { fgColorWarn } from '../../common/colors';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Rule } from 'antd/es/form';
import {
  getRowStyle,
  parseTime,
  renderResult,
  renderTime,
  summary,
} from '../../common/racerUtil';
import { ActionResult } from '../../common/actionResult';
import { updateBibs } from '../../actions/racer/updateBibs';
import { UpdateBibRequestDto } from '../../actions/racer/updateBib';
import { updatePoints } from '../../actions/racer/updatePoints';
import { updateResult } from '../../actions/racer/updateResult';
import { RacerWithTeam } from '../../actions/racer/listRacers';

dayjs.extend(duration);

type Props = {
  teams: Team[];
  racers: RacerWithTeam[];
};

const EditableContext = React.createContext<FormInstance<DataType> | null>(
  null,
);

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
  result1: string;
  result2: string;
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

interface EditableCellProps {
  title: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleChangeBib: (record: Item) => void;
  handleChangeResult1: (record: Item) => void;
  handleChangeResult2: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleChangeBib,
  handleChangeResult1,
  handleChangeResult2,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputNumberRef = useRef<HTMLInputElement>(null);
  const form = useContext(EditableContext)!;
  const [editButtonVisible, setEditButtonVisible] = useState(false);

  useEffect(() => {
    if (editing) {
      inputNumberRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    if (dataIndex === 'result1' || dataIndex === 'result2') {
      const match = record[dataIndex].match(/^(\d{2}):(\d{2})\.(\d{2})$/);
      if (match != null) {
        form.setFieldsValue({ [dataIndex]: match[1] + match[2] + match[3] });
        return;
      }
    }
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const showEditButton = () => {
    setEditButtonVisible(true);
  };

  const hideEditButton = () => {
    setEditButtonVisible(false);
  };

  // 各セルの保存ボタン選択時処理
  const changeValue = async () => {
    const values = await form.validateFields();
    toggleEdit();
    setEditButtonVisible(false);
    switch (dataIndex as string) {
      case 'bib':
        handleChangeBib({ ...record, ...values });
        break;
      case 'result1':
        handleChangeResult1({ ...record, ...values });
        break;
      case 'result2':
        handleChangeResult2({ ...record, ...values });
        break;
    }
  };

  let childNode = children;

  const options = [
    { value: '' },
    { value: 'ds' },
    { value: 'df' },
    { value: 'dq' },
  ];
  const regTime = /^([0-9]{6}|ds|df|dq)$/;

  // 編集状態のセルを返す
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
            style={{ width: '60px' }}
          />
        );
        rules = [];
        break;
      case 'result1':
      case 'result2':
        child = (
          <AutoComplete
            onSelect={changeValue}
            onBlur={changeValue}
            options={options}
            placeholder={'000000|ds|dq|df'}
            style={{ width: '84px' }}
          />
        );
        rules = [
          {
            pattern: regTime,
            message:
              '[000000]の形式（分、秒、100分の1秒）、または[ds|dq|df]いずれかで入力してください。',
          },
        ];
        break;
    }
    return (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={rules}>
        {child}
      </Form.Item>
    );
  };

  // 表示状態のセルを返す
  const childNodeView = (children: React.ReactNode) => {
    let warnIconVisible = false;
    switch (dataIndex) {
      case 'bib':
        warnIconVisible = (record[dataIndex] ?? '').toString().length == 0;
        break;
      case 'result1':
        warnIconVisible = (record['result1'] ?? '').length == 0;
        break;
      case 'result2':
        warnIconVisible = (record['result2'] ?? '').length == 0;
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

// テーブル表示用のデータ型
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
  team: { fullname: string };
  result1: string;
  result2: string;
  special: string;
  summary: string;
  formatBestTime: string;
  point: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function ResultEditTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dataSource, setDataSource] = useState<RacerWithTeam[]>(props.racers);

  // ソート順を定義
  const sortOrderSummary: { [key in DataType['summary']]: number } = {
    ジュニア: 0,
    スノボ女子: 1,
    スノボ男子: 2,
    スキー女子: 3,
    シニア: 4,
    スキー男子: 5,
  };

  const data: DataType[] = dataSource
    .map((racer: RacerWithTeam) => {
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
        team: { fullname: racer.team.fullname ?? '' },
        result1: renderResult(racer.status1, racer.time1),
        result2: renderResult(racer.status2, racer.time2),
        special: racer.special,
        summary: summary(
          racer.special as SpecialType,
          racer.gender as GenderType,
          racer.category as CategoryType,
        ),
        formatBestTime: renderTime(racer.bestTime),
        point: racer.point,
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
      render: (_: DataType, record, index) => index + 1,
      width: 80,
      responsive: ['lg'],
    },
    {
      title: '種目',
      dataIndex: 'summary',
      width: 104,
      responsive: ['lg'],
    },
    {
      title: 'ビブ',
      dataIndex: 'bib',
      editable: true,
      width: 96,
    },
    {
      title: 'シード',
      dataIndex: 'seed',
      width: 80,
      responsive: ['lg'],
    },
    {
      title: '選手名',
      dataIndex: 'name',
      width: 96,
    },
    {
      title: 'ふりがな',
      dataIndex: 'kana',
      responsive: ['lg'],
      width: 96,
    },
    {
      title: '所属',
      dataIndex: 'team',
      render: (_: DataType, record) => <span>{record.team.fullname}</span>,
      responsive: ['lg'],
      width: 128,
    },
    {
      title: '結果1',
      dataIndex: 'result1',
      editable: true,
      width: 128,
    },
    {
      title: '結果2',
      dataIndex: 'result2',
      editable: true,
      width: 128,
    },
    {
      title: 'ベスト',
      dataIndex: 'formatBestTime',
      width: 128,
    },
    {
      title: 'ポイント',
      dataIndex: 'point',
      width: 80,
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
        handleChangeResult1,
        handleChangeResult2,
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

  // 結果1の保存処理
  const handleChangeResult1 = async (row: DataType) => {
    let result: ActionResult<Racer[]> = { success: false };
    if (row.result1 === '') {
      // 結果が空の場合は状態と記録をクリア
      result = await updateResult(row.id, {
        status1: null,
        time1: null,
      });
    } else if (
      row.result1 === 'dq' ||
      row.result1 === 'df' ||
      row.result1 === 'ds'
    ) {
      // 結果が dq, df, ds の場合は状態を更新
      result = await updateResult(row.id, {
        status1: row.result1 as StatusType,
      });
    } else {
      // 結果が時間の場合は状態をnullにして時間を更新
      result = await updateResult(row.id, {
        status1: null,
        time1: parseTime(row.result1),
      });
    }
    if (!result.success) {
      showAlert('error', result.error);
    }
    replaceRacers(result.result!);
  };

  // 結果2の保存処理
  const handleChangeResult2 = async (row: DataType) => {
    let result: ActionResult<Racer[]> = { success: false };
    if (row.result2 === '') {
      // 結果が空の場合は状態と記録をクリア
      result = await updateResult(row.id, {
        status2: null,
        time2: null,
      });
    } else if (
      row.result2 === 'dq' ||
      row.result2 === 'df' ||
      row.result2 === 'ds'
    ) {
      // 結果が dq, df, ds の場合は状態を更新
      result = await updateResult(row.id, {
        status2: row.result2 as StatusType,
      });
    } else {
      // 結果が時間の場合は状態をnullにして時間を更新
      result = await updateResult(row.id, {
        status2: null,
        time2: parseTime(row.result2),
      });
    }
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
      newItem.point = racer.point;
      newItem.totalOrder = racer.totalOrder;
      newData.splice(index, 1, {
        ...newItem,
      });
    });
    setDataSource(newData);
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
      const newDataSource: RacerWithTeam[] = dataSource.map((data) => {
        data.bib = result.result!.find((item) => item.id == data.id)!.bib;
        return data;
      });
      setDataSource(newDataSource);
      showAlert('success', 'ビブを一括付与しました。');
    } else {
      showAlert('error', result.error);
    }
  };

  /**
   * ポイント更新処理
   */
  const handleUpdatePoints: PopconfirmProps['onConfirm'] = async () => {
    const result = await updatePoints();
    if (result.success) {
      const newDataSource: RacerWithTeam[] = dataSource.map((data) => {
        data.point = result.result!.find((item) => item.id == data.id)!.point;
        return data;
      });
      setDataSource(newDataSource);
      showAlert('success', 'ポイントを一括更新しました。');
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
      <Flex>
        <Popconfirm
          title="滑走順に従ってビブを一括付与します。"
          description="現在付与されているビブは消えてしまいますがよろしいですか？"
          onConfirm={handleUpdateBibs}
          okText="はい"
          cancelText="いいえ"
        >
          <Button style={{ marginBottom: 16, marginRight: 16 }}>
            ビブ一括付与
          </Button>
        </Popconfirm>
        <Popconfirm
          title="ベストタイムに従ってポイントを一括更新します。"
          description="現在のポイントは消えてしまいますがよろしいですか？"
          onConfirm={handleUpdatePoints}
          okText="はい"
          cancelText="いいえ"
        >
          <Button type="primary">ポイント更新</Button>
        </Popconfirm>
      </Flex>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRow={(record: any) => {
          return {
            style: getRowStyle(
              record.gender as GenderType,
              record.category as CategoryType,
              record.special as SpecialType,
            ),
          };
        }}
        sticky={true}
        rowHoverable={false}
      />
    </>
  );
}
