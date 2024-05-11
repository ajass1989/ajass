'use client';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Point } from '@repo/database';
import { Alert, Button, Form, FormInstance, InputNumber, Table } from 'antd';
import React from 'react';
import { useContext, useState } from 'react';
import { updatePoint } from './actions';

type Props = {
  points: Point[];
};

const EditableContext = React.createContext<FormInstance<any> | null>(null);

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
  dataIndex: keyof DataType;
  record: DataType;
  // eslint-disable-next-line no-unused-vars
  handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  // title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext)!;

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
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
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
  key: number;
  pointSkiMale: number;
  pointSkiFemale: number;
  pointSnowboardMale: number;
  pointSnowboardFemale: number;
}
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function PointTable(props: Props) {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dataSource, setDataSource] = useState<Point[]>(props.points);
  const data: DataType[] = dataSource.map((point: Point) => {
    return {
      key: point.id,
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
      title: 'スノーボード男子',
      dataIndex: 'pointSnowboardMale',
      editable: true,
    },
    {
      title: 'スノーボード女子',
      dataIndex: 'pointSnowboardFemale',
      editable: true,
    },
  ];

  const handleSave = async (row: DataType) => {
    const result = await updatePoint({
      id: row.key,
      pointSkiMale: row.pointSkiMale,
      pointSkiFemale: row.pointSkiFemale,
      pointSnowboardMale: row.pointSnowboardMale,
      pointSnowboardFemale: row.pointSnowboardFemale,
    });
    if (result.success) {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.id);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    } else {
      showAlert(result.error);
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

  const showAlert = (error?: string) => {
    setErrorMessage(error ?? '');
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setErrorMessage('');
    setAlertVisible(false);
  };

  return (
    <>
      {alertVisible && (
        <Alert
          message={errorMessage}
          type="error"
          closable
          onClose={closeAlert}
        />
      )}
      <Table
        columns={columns as ColumnTypes}
        components={{ body: { row: EditableRow, cell: EditableCell } }}
        dataSource={data}
      />
    </>
  );
}
