import React from "react";
import { Form, Input, Select } from "antd";
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';

function SharedEmailFields() {

  return (
    <>
      {/* <Form.Item label="Business Owner">
        <DropdownSelectUser name="BusinessOwner" placeholder="Employee Name" required={true} isDisabled={false} />
      </Form.Item> */}
      <Form.Item name="BusinessOwner" label="Business Owner" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' /* mode='tags' */ placeholder="Employee Name" />
      </Form.Item>
      <Form.Item name="SenderName" label="Email Name" rules={[{ required: true, message: "" }]}>
        <Input placeholder="Sender Name" />
      </Form.Item>
      <Form.Item name="EmailAddress" label="Email Address" rules={[{ required: true, message: "" }]}>
        <Input placeholder="email@example.com" />
      </Form.Item>
      <Form.Item name="Members" label="Members" rules={[{ required: true, message: "" }]}>
        <Select mode="tags" style={{width: '100%',}} placeholder="email@sali..., email@sali..., email@sali..." />
      </Form.Item>
    </>
  );
}

export default SharedEmailFields;
