'use client';
import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormInstance, InputNumber, Table } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import { updatePoint } from './actions';
import { Point } from '@repo/database';
import { AlertType } from '../../common/types';

type Props = {
  points: Point[];
  // eslint-disable-next-line no-unused-vars
  updatePoint: (point: Point) => void;
};

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: number;
  id: number;
  pointSkiMale: number;
  pointSkiFemale: number;
  pointSnowboardMale: number;
  pointSnowboardFemale: number;
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
      inputRef.current!.focus();
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
  key: number;
  id: number;
  pointSkiMale: number;
  pointSkiFemale: number;
  pointSnowboardMale: number;
  pointSnowboardFemale: number;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function PointTable(props: Props) {
  const [alertType, setAlertType] = useState<AlertType>('error');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setErrorMessage] = useState('');

  const data: DataType[] = props.points.map((point: Point) => {
    return {
      key: point.id,
      id: point.id,
      pointSkiMale: point.pointSkiMale,
      pointSkiFemale: point.pointSkiFemale,
      pointSnowboardMale: point.pointSnowboardMale,
      pointSnowboardFemale: point.pointSnowboardFemale,
    };
  });

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: '順位',
      dataIndex: 'key',
    },
    {
      title: 'スキー男子',
      dataIndex: 'pointSkiMale',
      editable: true,
    },
    {
      title: 'スキー女子',
      dataIndex: 'pointSkiFemale',
      editable: true,
    },
    {
      title: 'スノボ男子',
      dataIndex: 'pointSnowboardMale',
      editable: true,
    },
    {
      title: 'スノボ女子',
      dataIndex: 'pointSnowboardFemale',
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
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleSave = async (row: DataType) => {
    const result = await updatePoint(row.id, { ...row });
    if (result.success) {
      props.updatePoint(result.result!);
    } else {
      showAlert('error', result.error);
    }
  };

  // Alert を表示する関数
  const showAlert = (alertType: AlertType, error?: string) => {
    setErrorMessage(error ?? '');
    setAlertVisible(true);
    setAlertType(alertType);
  };

  // Alert を非表示にする関数
  const closeAlert = () => {
    setErrorMessage('');
    setAlertVisible(false);
  };

  return (
    <>
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
        sticky={true}
      />
    </>
  );
}
