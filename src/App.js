//import {Form} from 'react-bootstrap/';
import React, {useState, useRef, useContext, useEffect} from 'react';
import { Table, Tag, Button, Space,Popconfirm, Switch, Menu, Dropdown, Input, Form} from 'antd';
import ProTable, {TableDropdown} from '@ant-design/pro-table'
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import { Header } from 'antd/lib/layout/layout';


const EditableContext = React.createContext(null);

function EditableRow({ index, ...props }) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

function EditableCell({
  title, editable, children, dataIndex, record, handleSave, ...restProps
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  async function save() {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  }

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}

class App extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    dataSource: [
      {
        key: '1',
        id: 1,
        task: 'Wake Up',
        description: 'Limit is 1000',
        created_at: new Date().toLocaleString('UTC'),
        due_date: 34,
        //tag: 'hello',
        status: 'OPEN'
      },
      {
        key: '2',
        id: 2,
        task: 'Eat Food',
        description: 'Testing Words',
        created_at: new Date().toLocaleString('UTC'),
        due_date: 90,
        status: 'OPEN'
      },
      {
        key: '3',
        id: 3,
        task: 'Drink Water',
        description: 'Rock Crouch', 
        created_at: new Date().toLocaleString('UTC'),
        due_date: 89,
        status: 'OPEN'
      },
      {
        key: '4',
        id: 4,
        task: 'Sleep',
        description: 'Real Mansion',
        created_at: new Date('August 19, 1975 23:15:30 GMT+00:00').toLocaleString('UTC'),
        due_date: 34,
        status: 'OPEN'
      },

    ],
    count: 5
  };
 

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'due_date',
      },
    });
  };
  
   handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      task: 'New Task',
      id: count,
      description: 'Describe task',
      created_at: new Date().toLocaleString('UTC'),
      due_date: 89,
      status: 'OPEN'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };


  render() {
    let { sortedInfo, filteredInfo, dataSource } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    console.log(components.body)
    const columns = [
      { 
        title: 'Task ID',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filteredInfo.task || null,
        onFilter: (value, record) => record.task.includes(value),
        sorter: (a, b) => a.task.length - b.task.length,
        sortOrder: sortedInfo.columnKey === 'task' && sortedInfo.order,
        ellipsis: true,
        editable: true
      },
      {
      title: 'Created At',
      dataIndex: 'created_at',
      valueType: 'dateRange',
      sorter: (a, b) => a.created_at - b.created_at,
      sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
      ellipsis: true
      },
      {
        title: 'Due Date',
        dataIndex: 'due_date',
        key: 'due_date',
        sorter: (a, b) => a.due_date - b.due_date,
        sortOrder: sortedInfo.columnKey === 'due_date' && sortedInfo.order,
        ellipsis: true,  
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status'
      },   
      {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      //render: () => <a href = '#'>Delete</a>,
      render: (_, record) =>
          {
            return this.state.dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null;
          },
      }
    ];
    let editable_columns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      console.log('in editable col')
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handlesave: this.handleSave,
        }),
      };
    });
    
    return (
      <>
        <Button 
          onClick={this.handleAdd}
          type="primary"
          style={{
            margin: 16,
          }}
        >
          Add a row
        </Button>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table
          columns={editable_columns}
          expandable={{
          expandedRowRender: record => 
          <p style={{ margin: 0 }}>{record.description}</p>,
          rowExpandable: record => record.name !== 'Not Expandable',
          }}
          components={this.components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource} 
          pagination={{pageSize: 10,}}
          dateFormatter="string"
          
          onChange={this.handleChange}
         />
      </>
    );
  }
}

export {App};
