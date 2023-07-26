import { Form, Input } from 'antd';
import React from 'react';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const AddUserstoAGroupFields = () => {

  return (
    <>
      <Form.Item name="GroupName" label="Group Name" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>

      <Form.Item name="EmailAddress" label="Email Address" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Email Address' />
      </Form.Item>

      {/* <Form.Item label={<><Typography.Text type='danger' style={{padding: '0 2px'}}>*</Typography.Text> Members</>}>
        <AutoCompleteSelectUsers name="GroupMembers" isRequired={true} />
      </Form.Item> */}

      <Form.Item name="GroupMembers" label="Members" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' mode='tags' placeholder="Select Employee" />
      </Form.Item>
    </>
  )
}

export default AddUserstoAGroupFields