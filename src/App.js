import React from 'react';
import {Table, Input, Button, Space, Popconfirm, Select, message} from 'antd';
import 'antd/dist/antd.css';
import './index.css';
import './App.css';
import { EditableCell } from './EditableCell';
import { EditableRow } from './EditableRow';

const {Option} = Select;

class App extends React.Component {
  state = {
    //dataSource is maintained as a state so that it can be changed
    //filteredInfo allows for filtering data from each column
    filteredInfo: null,
    sortedInfo: null,
    dataSource: [
      {
        key: '1',
        id: 1,
        task: 'Wake Up',
        description: 'Medium length desc',
        created_at: new Date().toLocaleString('UTC'),
        due_date: 'yyyy-MM-dd',
        status: 'OPEN'
      },
      {
        key: '2',
        id: 2,
        task: 'Eat Food',
        description: 'Testing Words',
        created_at: new Date().toLocaleString('UTC'),
        due_date: 'yyyy-MM-dd',
        status:  'CLOSED'
      },
      {
        key: '3',
        id: 3,
        task: 'Drink Water',
        description: 'Description of greates size', 
        created_at: new Date().toLocaleString('UTC'),
        due_date: 'yyyy-MM-dd',
        status: 'WORKING'
      },
      {
        key: '4',
        id: 4,
        task: 'Sleep',
        description: 'Short desc',
        created_at: new Date('August 19, 1975 23:15:30 GMT+00:00').toLocaleString('UTC'),
        due_date: 'yyyy-MM-dd',
        status: 'PAST DUE'
      },

    ],
    count: 5,
  };

  onClick = ({ key }) => {  
    this.setState({})
  };

  handleChange = (pagination, filters, sorter) => {
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
      due_date: 'yyyy-MM-dd',
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

  //Function to handle changes to input forms
  onInputChange = (key, index, is_mandatory = false) => {
    return e => {
    const search_text = e.target.value
    const search_date = new Date(search_text).toLocaleString('UTC')
    //does not allow task field to have less than one character
    if (search_text === '') {
      message.info('Field cannot be empty')
    }
    else if (search_text.length !== '' || (search_text !== null && is_mandatory)) {
      const newData = [...this.state.dataSource];
      if (key === 'due_date') {
        const threshold = newData[index]['created_at']
        //checks if date is less than lower threshold
        if (search_date < new Date(threshold)) {
          message.info('Date is less than created date')
          return //cannot continue if true
        }
        if (search_date < new Date()) {
          newData[index]['status'] = 'PAST DUE' 
          //changes status when time exceeds
        }
      }
      newData[index][key] = String(search_text);
      this.setState({ dataSource: [...newData] })
      };
    };
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
    //columns described here
    const columns = [
      { 
        title: 'Task ID',
        dataIndex: 'key',
        key: 'key',
        width: '7%'
      },
      {
        title: 'Task',
        dataIndex: 'task',
        key: 'task',
        sorter: (a, b) => a.task.length - b.task.length,
        sortOrder: sortedInfo.columnKey === 'task' && sortedInfo.order,
        ellipsis: true,
        editable: true,
        render: (text, record, index) => (
        <Input maxLength = {100} value={text} onChange={this.onInputChange("task", index)}/>
       )
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '20%',
        sorter: (a, b) => a.description.length - b.description.length,
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
        onFilter: (value, record) => record.status.includes(value),
        ellipsis: true,
        render: (text, record, index) => (
          //description is mandatory: therefore true is passed as an argument
        <Input maxLength = {1000} value={text} onChange={this.onInputChange("description", index, true)} />
        )
      },
      {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      valueType: 'dateRange',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
      sortDirections: ['descend', 'ascend', 'descend'],
      ellipsis: true
      },
      {
        title: 'Due Date',
        dataIndex: 'due_date',
        key: 'due_date',
        sorter: (a, b) => { return new Date(a.due_date) - new Date(b.due_date)},
        sortOrder: sortedInfo.columnKey === 'due_date' && sortedInfo.order,
        sortDirections: ['descend', 'ascend', 'descend'],
        /*above code sorts in ascending or descending manner
        does not maintain a neutral value if it is sorted
        */
        ellipsis: true,  
        render: (text, record, index) => {
          return (
          <Input
                type="date"
                name="due_date"
                value={text}
                //due date is mandatory
                onChange={this.onInputChange('due_date', index, true)} 
              />
          )
      }
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        width: '10%',
        filters: [
          //possible options
          { text: 'OPEN', value: 'OPEN' },
          { text: 'CLOSED', value: 'CLOSED' },
          { text: 'WORKING', value: 'WORKING' },
          { text: 'PAST DUE', value: 'PAST DUE' },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
        render: (text) => {
          return (
          <Select defaultValue = {text}>text
          <Option value={"OPEN"}>OPEN</Option>
          <Option value = "CLOSED" key="2">CLOSED</Option>
          <Option value = "WORKING" key="3">WORKING</Option>
          <Option value = "PAST DUE" key="1">PAST DUE</Option>
          </Select>
          )
        }
      },   
      {
      title: 'Action',
      dataIndex: '',
      key: 'x',
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
    })
    
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
        <Space style={{ margin: 16 }}>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table
          columns={editable_columns}
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource} 
          pagination={{pageSize: 10,}}
          dateFormatter="string"
          scroll={{ x: 1450, y: 300 }} /*allow for scrolling to make it mobile friendly*/
          onChange={this.handleChange}
         />
      </>
    );
  }
}

export {App};
