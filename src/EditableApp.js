import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
import { EditableCell } from './EditableCell';
const originData = [];

for (let i = 0; i < 20; i++) {
  originData.push({
    key: i.toString(),
    task: `Edrward ${i}`,
    description: `London Park no. ${i}`,
    created_at: new Date().toLocaleString('UTC'),
    due_date: 34,
    //tag: 'hello',
    status: 'OPEN'
  });
}

function EditableTable() {
    const [form] = Form.useForm();
    console.log(form)
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    function edit(record) {
        form.setFieldsValue({
            task: '',
            description: '',
            due_date: '',
            status: 'OPEN',
        });
        setEditingKey(record.key);
    }

    function cancel() {
        setEditingKey('');
    }

    async function save(key) {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                console.log(row)
                newData.splice(index, 1, {row});
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    function onInputChange(key, index) {
        return (e) => {
            const newData = [...data];
            newData[index][key] = Number(e.target.value);
            setData(newData);
        };
    }

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
            render: (text, index) => (
            <Input value={text} onChange={onInputChange('task', index)} />
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
        title: 'Created At',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date', 
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
                return data.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={
                    () => {
                        setData(
                data.filter((item) => item.key !== record.key));
                }}>
                    <a>Delete</a>
                </Popconfirm>
                ) : null;
            },
        },
        {
        title: 'operation',
        dataIndex: 'operation',
        render: (_, record) => {
        const editable = isEditing(record);
            return editable ? (
                <span>
                <Typography.Link
                onClick={async () => {
                try {
                    const row = await form.validateFields();
                    const newData = [...data];
                    const index = newData.findIndex((item) => item.key === record.key);

                    if (index > -1) {
                        const item = newData[index];
                        console.log(row)
                        newData.splice(index, 1, {row});
                        setData(newData);
                        setEditingKey('');
                    } else {
                        newData.push(row);
                            setData(newData);
                            setEditingKey('');
                    }
                    } catch (errInfo) {
                        console.log('Validate Failed:', errInfo);
                        }
                    }}
                    style={{marginRight: 8, }}>
                    Save
                    </Typography.Link>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                        <a>Cancel</a>
                    </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => {
                        form.setFieldsValue({
                            task: '',
                            description: '',
                            due_date: '',
                            status: 'OPEN',
                            });
                        setEditingKey(record.key);
                        }
                    }>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'string',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component = {false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }} />
        </Form>
    );
}

export {EditableTable}