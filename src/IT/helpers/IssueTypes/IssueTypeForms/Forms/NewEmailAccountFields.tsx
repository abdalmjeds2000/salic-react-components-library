import { Form, Input } from 'antd';
import React from 'react';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const NewEmailAccountFields = () => {
  return (
    <>
      <Form.Item name="new_email_account_name" label="Name" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='displayName' placeholder="User Display Name" />
      </Form.Item>
      
      <Form.Item name="new_email_account_email" label="Email" rules={[{ required: true, message: "" }]}>
        {/* <AutoCompleteOrgUsers valueRender='mail' placeholder="Select User Email" /> */}
        <Input placeholder="User Email" />
      </Form.Item>

      <Form.Item name="new_email_account_owner" label="Owner" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select Owner Email" />
      </Form.Item>
    </>
  )
}

export default NewEmailAccountFields