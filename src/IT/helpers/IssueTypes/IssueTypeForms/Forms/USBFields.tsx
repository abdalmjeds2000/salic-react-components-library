import React from "react";
import { DatePicker, Form, Radio } from "antd";

function USBFields() {

  return (
    <>
      <Form.Item name="USBAccessType" label="Access Type" initialValue="2" rules={[{ required: true, message: "" }]}>
        <Radio.Group>
            <Radio value="2">Temporary</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="USBAccessDates" label="Temporary Access" rules={[{ required: true, message: "" }]}>
        <DatePicker.RangePicker format="MM-DD-YYYY" style={{ width: "100%" }} />
      </Form.Item>
    </>
  );
}

export default USBFields;
