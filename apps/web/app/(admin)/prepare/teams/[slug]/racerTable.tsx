import React, { useContext, useId, useMemo, useState } from 'react';
import { Alert, TableProps } from 'antd';
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
import { updateSeed } from '../../../../actions/racer/updateSeed';
import { RacerType } from './editTeamForm';
import { ActionResult } from '../../../../common/actionResult';
import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  RollbackOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Racer } from '@repo/database';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { Rule } from 'antd/es/form';
import { getRowStyle } from '../../../../common/racerUtil';
import {
  AlertType,
  CategoryType,
  GenderType,
  SpecialType,
} from '../../../../common/types';
import { deleteRacer } from '../../../../actions/racer/deleteRacer';
import { addRacer } from '../../../../actions/racer/addRacer';
import {
  UpdateRacerRequestDto,
  updateRacer,
} from '../../../../actions/racer/updateRacer';

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
  special: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof Item;
  title: string;
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
  const rules: Rule[] = [
    {
      required: true,
      message: `${title}は入力必須です。`,
    },
  ];
  if (record && record.special === 'senior' && inputType == 'number') {
    rules.push({
      type: 'number',
      min: 60,
      message: `シニアは60歳以上です。`,
    });
  }
  if (record && record.special === 'junior' && inputType == 'number') {
    rules.push({
      type: 'number',
      max: 15,
      message: `ジュニアは15歳以下です。`,
    });
  }
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
            { value: 'snowboard', label: <span>スノボ</span> },
          ]}
        />
      );
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item style={{ margin: 0 }} name={dataIndex} rules={rules}>
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
  special?: string;
}

interface RowContextProps {
  setActivatorNodeRef?: (_: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

export function RacerTable(props: Props) {
  const [form] = Form.useForm();
  const _data: DataType[] = props.dataSource.map((item: RacerType) => ({
    ...item,
  }));
  const [dataSource, setDataSource] = useState<DataType[]>(_data);
  const [count, setCount] = useState<number>(_data.length);
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleDelete = async (key: React.Key) => {
    const result = await deleteRacer(key as string);
    if (!result.success) {
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
      category: props.category ?? '',
      age: null,
      isFirstTime: false,
      gender: props.gender ?? '', // TODO 上位からの引き回し
      special: props.special,
      seed: newCount,
    };
    form.setFieldsValue({ ...newData });
    setDataSource([...dataSource, newData]);
    setEditingKey(newData.key);
    setCount(count + 1);
  };

  const handleSave = async (key: React.Key) => {
    const row = (await form.validateFields()) as Item;
    const newDataSource = [...dataSource];
    const index = dataSource.findIndex((item) => key === item.key);
    let result: ActionResult<Racer>;
    const gender = props.special == 'normal' ? props.gender! : row.gender;
    const category = props.special == 'normal' ? props.category! : row.category;
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
      const dto: UpdateRacerRequestDto = {
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
    if (result.success) {
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
        special: props.special,
      };
      newDataSource.splice(index, 1, {
        ...r,
        ...row,
      });
      setDataSource(newDataSource);
      setEditingKey('');
    } else {
      showAlert('error', result.error);
    }
  };

  const columns = [
    {
      dataIndex: 'sort',
      visible: true,
      key: 'sort',
      // align: 'center',
      width: 80,
      render: () => <DragHandle />,
    },
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
      render: (_: DataType, record: Item) =>
        record.category == 'ski' ? <span>スキー</span> : <span>スノボ</span>,
    },
    {
      title: '性別',
      dataIndex: 'gender',
      key: 'gender',
      inputType: 'gender',
      editable: true,
      visible: props.special != 'normal',
      render: (_: DataType, record: Item) =>
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
      render: (_: DataType, record: Item) => (
        <Switch disabled defaultChecked={record.isFirstTime} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      visible: true,
      render: (_: DataType, record: Item) => {
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

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) {
      return;
    }
    setDataSource((prevState) => {
      const activeIndex = prevState.findIndex(
        (record) => record.key === active.id,
      );
      const overIndex = prevState.findIndex(
        (record) => record.key === over!.id,
      );
      return arrayMove(prevState, activeIndex, overIndex);
    });

    const result = await updateSeed(active.id as string, over!.id as string);
    if (!result.success) {
      // TODO エラー処理
      return;
    }
    const newDataSource = [...dataSource];
    result.result!.forEach((racer) => {
      const newIndex = newDataSource.findIndex((r) => r.key === racer.id);
      newDataSource.splice(newIndex, 1, { key: racer.id, ...racer });
    });
    newDataSource.sort((a, b) => a.seed - b.seed);
    setDataSource(newDataSource);
  };

  // https://github.com/clauderic/dnd-kit/issues/926#issuecomment-1640115665
  const id = useId();

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
      <h2>{props.title}</h2>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{ marginBottom: 16 }}
        disabled={editingKey !== ''}
      >
        追加
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
      <Form form={form} component={false}>
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
          id={id}
        >
          <SortableContext
            items={dataSource.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  cell: EditableCell,
                  row: Row,
                },
              }}
              rowClassName={() => 'editable-row'}
              dataSource={dataSource}
              columns={mergedColumns}
              onRow={(record: DataType) => {
                return {
                  style: getRowStyle(
                    record.gender as GenderType,
                    record.category as CategoryType,
                    record.special as SpecialType,
                  ),
                };
              }}
              pagination={false}
              bordered={true}
              rowHoverable={false}
            />
          </SortableContext>
        </DndContext>
      </Form>
    </div>
  );
}
