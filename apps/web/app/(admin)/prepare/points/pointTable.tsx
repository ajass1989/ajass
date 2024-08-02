'use client';
import { EditOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, InputNumber, Table } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useContext, useState } from 'react';
import { updatePoint } from '../../../actions/point/updatePoint';
import { Point } from '@repo/database';
import {
  SKI_FEMALE,
  SKI_MALE,
  SNOWBOARD_FEMALE,
  SNOWBOARD_MALE,
} from '../../../common/constant';
import { CommonAlertList } from '../../../common/components/commonAlertList';
import { useAlertContext } from '../../../common/components/commonAlertProvider';

type Props = {
  points: Point[];
  updatePoint: (point: Point) => void;
};

const EditableContext = React.createContext<FormInstance<DataType> | null>(
  null,
);

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
  const { addAlert } = useAlertContext();

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
      title: SKI_MALE,
      dataIndex: 'pointSkiMale',
      editable: true,
    },
    {
      title: SKI_FEMALE,
      dataIndex: 'pointSkiFemale',
      editable: true,
    },
    {
      title: SNOWBOARD_MALE,
      dataIndex: 'pointSnowboardMale',
      editable: true,
    },
    {
      title: SNOWBOARD_FEMALE,
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
    const result = await updatePoint(row.id, {
      pointSkiMale: row.pointSkiMale,
      pointSkiFemale: row.pointSkiFemale,
      pointSnowboardMale: row.pointSnowboardMale,
      pointSnowboardFemale: row.pointSnowboardFemale,
    });
    if (!result.success) {
      addAlert({ message: result.error!, type: 'error' });
      return;
    }
    props.updatePoint(result.result!);
  };

  return (
    <>
      <CommonAlertList />
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
        sticky={true}
        rowHoverable={false}
      />
    </>
  );
}
