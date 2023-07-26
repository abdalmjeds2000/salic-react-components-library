import React from "react";
import { Form, Select } from "antd";

function BackupRestoreFields() {
  return (
    <>
      <Form.Item name="BackupRestore_DataSource" label="Data Source" rules={[{ required: true, message: '' }]}>
        <Select placeholder='select value'>
          <Select.Option value="Email">Email</Select.Option>
          <Select.Option value="One Drive">One Drive</Select.Option>
          <Select.Option value="SharePoint">SharePoint</Select.Option>
          <Select.Option value="DLO">DLO</Select.Option>
        </Select>
      </Form.Item>
    </>
  );
}

export default BackupRestoreFields;
