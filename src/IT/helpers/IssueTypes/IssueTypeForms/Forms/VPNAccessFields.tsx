import React from "react";
import { DatePicker, Form } from "antd";

function VPNAccessFields() {

  return (
    <>
      <Form.Item name="VPNAccess_Duration" label="Duration" rules={[{ required: true, message: "" }]}>
        <DatePicker.RangePicker format="MM/DD/YYYY" style={{ width: "100%" }} />
      </Form.Item>
    </>
  );
}

export default VPNAccessFields;
