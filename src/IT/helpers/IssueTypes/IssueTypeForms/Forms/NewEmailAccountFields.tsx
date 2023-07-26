import { Form } from 'antd';
import React from 'react';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

const NewEmailAccountFields = () => {
  return (
    <>
      {/* <Form.Item label="Name" required>
        <DropdownSelectUser 
          name="new_email_account_name" 
          placeholder="User Display Name" 
          size="middle" 
          required
          triggerDisplayName // to set value displayname not email
        />
      </Form.Item> */}
      <Form.Item name="new_email_account_name" label="Name" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='displayName' placeholder="User Display Name" />
      </Form.Item>
      {/* <Form.Item label="Email" required>
        <DropdownSelectUser 
          name="new_email_account_email" 
          placeholder="Select User Email" 
          size="middle" 
          required
        />
      </Form.Item> */}
      <Form.Item name="new_email_account_email" label="Email" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select User Email" />
      </Form.Item>

      {/* <Form.Item label="Owner" required>
        <DropdownSelectUserNoLabel 
          name="new_email_account_owner" 
          placeholder="Select Owner Email" 
          size="middle" 
          required
        />
      </Form.Item> */}
      <Form.Item name="new_email_account_owner" label="Owner" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select Owner Email" />
      </Form.Item>
    </>
  )
}

export default NewEmailAccountFields