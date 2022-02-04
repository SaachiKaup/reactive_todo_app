import React from 'react';
import { Form } from 'antd';
import { EditableContext } from './App';
//Functional component that forms the rows of the table
export function EditableRow({ index, ...props }) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}
