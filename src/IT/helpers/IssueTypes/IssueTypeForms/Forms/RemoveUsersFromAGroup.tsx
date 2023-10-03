import { Form, Input } from 'antd';
import React from 'react';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const RemoveUsersFromAGroup = () => {

  return (
    <>
      <Form.Item name="removeUsersFromAGroup_GroupName" label="Group Name" rules={[{required: true, message: ""}]}>
        <Input placeholder='Enter Group Name' />
      </Form.Item>

      <Form.Item name="removeUsersFromAGroup_GroupMembers" label="Members" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' mode='tags' placeholder="Select Employee" />
      </Form.Item>
    </>
  )
}

export default RemoveUsersFromAGroup