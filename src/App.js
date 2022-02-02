import './App.css';
import {Form} from 'react-bootstrap/';
import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Table, Tag, Button, Space, Switch} from 'antd';
const data = [
  {
    key: '1',
    task: 'Wake Up',
    timestamp: 32,
    description: 'Limit is 1000',
    due_date: 34,
    tag: 'hello',
    status: 'OPEN'
  },
  {
    key: '2',
    task: 'Eat Food',
    timestamp: 42,
    description: 'Testing Words',
  },
  {
    key: '3',
    task: 'Drink Water',
    timestamp: 32,
    description: 'Rock Crouch',
  },
  {
    key: '4',
    task: 'Sleep',
    timestamp: 32,
    description: 'Real Mansion',
  },

]
function AppFunc (){

  return (
    <div className="App">
      <header className="App-header">
        <Form.Group className = "mb-3">
          <Form.Control placeholder="Enter a task"/>
        </Form.Group>

      </header>
    </div>
  );
}

class App extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
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

  setTimeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'timestamp',
      },
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      { 
        title: 'Timestamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
        sorter: (a, b) => a.timestamp - b.timestamp,
        sortOrder: sortedInfo.columnKey === 'timestamp' && sortedInfo.order,
        ellipsis: true,
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
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        filters: [
          { text: 'London', value: 'London' },
          { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.description || null,
        onFilter: (value, record) => record.description.includes(value),
        sorter: (a, b) => a.description.length - b.description.length,
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Due Date',
        dataIndex: 'due_date',
        key: 'due_date',
        sorter: (a, b) => a.timestamp - b.timestamp,
        sortOrder: sortedInfo.columnKey === 'due_date' && sortedInfo.order,
        ellipsis: true,  
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status'

      }     
    ];
    return (
      <>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={this.setAgeSort}>Sort timestamp</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </Space>
        <Table 
          columns={columns} 
          dataSource={data} 
          onChange={this.handleChange}
         />
      </>
    );
  }
}

export {App};
