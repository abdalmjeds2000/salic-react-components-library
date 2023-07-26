import { Form, Input } from 'antd';
import React from 'react';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';


const ChangeLineManagerFields = () => {
  return (
    <>
      {/* <Form.Item label="Employee">
        <DropdownSelectUser name="Employee" placeholder="Select Employee" size="middle" />
      </Form.Item> */}
      
      <Form.Item name="Employee" label="Employee">
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select Employee" />
      </Form.Item>

      <Form.Item name="NewLine" label="New Line Manager" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>
    </>
  )
}

export default ChangeLineManagerFields