import React from "react";
import { DatePicker, Form, Input } from "antd";

function GlobalAdminAccessFields() {
  return (
    <>
      <Form.Item
        name="GlobalAdminAccess_Date"
        label="Date"
        rules={[ {required: true, message: ''} ]}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="MM/DD/YYYY"
          placeholder="Select Date"
        />
      </Form.Item>
      <Form.Item
        name="GlobalAdminAccess_Duration"
        label="Duration"
        rules={[ {required: true, message: ''} ]}
      >
        <Input placeholder="Enter Duration" />
      </Form.Item>
      {/* <Form.Item
        name="GlobalAdminAccess_Reason"
        label="Reason"
        rules={[ {required: true, message: ''} ]}
      >
        <Input.TextArea rows={3} placeholder="Enter Reason" />
      </Form.Item> */}
    </>
  );
}

export default GlobalAdminAccessFields;
