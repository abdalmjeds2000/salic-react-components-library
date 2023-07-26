import React from 'react';
import { Form, Input } from 'antd';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const ChangeJobTitleFields = () => {
  
  return (
    <>
      {/* <Form.Item label="Employee">
        <DropdownSelectUser name="Employee" placeholder="Select Employee" size="middle" />
      </Form.Item> */}

      <Form.Item name="Employee" label="Employee">
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select Employee" />
      </Form.Item>

      <Form.Item name="NewTitle" label="New Title" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>
    </>
  )
}

export default ChangeJobTitleFields