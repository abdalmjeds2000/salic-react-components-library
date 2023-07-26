import React from 'react';
import { Form, Input, Select } from 'antd';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const CreateGroupEmailFields = () => {

  return (
    <>
      <Form.Item name="GroupName" label="Group Name" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Name' />
      </Form.Item>

      <Form.Item name="GroupEmail" label="Email Address" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Email Address' />
      </Form.Item>

      <Form.Item name="GroupType" label="Group Type" initialValue="Microsoft 365" rules={[{required: true, message: ""}]}>
        <Select placeholder="Select Type">
          <Select.Option value="Microsoft 365">Microsoft 365</Select.Option>
          <Select.Option value="Distribution">Distribution</Select.Option>
        </Select>
      </Form.Item>

      {/* <Form.Item label="Owners">
        <AutoCompleteSelectUsers name="GroupOwners" isRequired={true} />
      </Form.Item>

      <Form.Item label="Members">
        <AutoCompleteSelectUsers name="GroupMembers" isRequired={true} />
      </Form.Item> */}

      <Form.Item name="GroupOwners" label="Owners" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' mode='tags' placeholder="Select Users" />
      </Form.Item>

      <Form.Item name="GroupMembers" label="Members" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' mode='tags' placeholder="Select Users" />
      </Form.Item>

      <Form.Item name="AllowOutside" label="Allow Outside to Send Email" initialValue="Yes" rules={[{ required: true, message: "" }]}>
        <Select placeholder="Select Value">
          <Select.Option value="Yes">Yes</Select.Option>
          <Select.Option value="No">No</Select.Option>
        </Select>
      </Form.Item>
    </>
  )
}

export default CreateGroupEmailFields