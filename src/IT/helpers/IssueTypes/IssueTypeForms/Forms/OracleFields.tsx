import React, { useEffect, useState } from "react";
import { DatePicker, Form, Radio, Select } from "antd";
import { apiLink } from '../../../../../index';

function OracleFields() {
  const [oracleFormData, setOracleFormData] = useState([] as any[]);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);

  let _data = oracleFormData.filter((r) => r.Process === "Oracle");
  const moduels = new Set();
  var uniqueModuels = _data.filter((m) => {
    if (moduels.has(m.Module)) {
      return false;
    }
    moduels.add(m.Module);
    return true;
  });
  var rules = oracleFormData.filter((r) => r.Module === selectedModule);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiLink}/Tracking/GetOracleFormData`);
      const data = await response.json();
      setOracleFormData(data?.Data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if(oracleFormData.length === 0) {
      fetchData();
    }
  }, [oracleFormData.length])


  return (
    <div style={{transition: '0.5s'}}>
      <Form.Item name="Enviroment" label="Environment" initialValue="1" rules={[{ required: true, message: "" }]}>
        <Radio.Group value="1">
          <Radio value="1">Production</Radio>
          <Radio value="2">Staging</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="NewAccount" label="New Account" initialValue="1" rules={[{ required: true, message: "" }]}>
        <Radio.Group value="1">
          <Radio value="1">Yes</Radio>
          <Radio value="2">No</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="TemporaryAccess" label="Temporary Access">
        <DatePicker.RangePicker format="MM/DD/YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="Module" label="Module" rules={[{ required: true, message: "" }]}>
        <Select
          value={selectedModule}
          onChange={(value) => setSelectedModule(value)}
          placeholder="Select the Module first"
          loading={loading}
          disabled={loading}
        >
          {uniqueModuels?.map((m) => (
            <Select.Option key={m} value={m.Module}>{m.Module}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="Rules" label="Roles" rules={[{ required: true, message: "" }]}>
        <Select
          mode="tags"
          placeholder="Select the Module first"
          options={rules.map((rule) => {
            return { value: rule.Rule, label: rule.Rule };
          })}
        />
      </Form.Item>
    </div>
  );
}

export default OracleFields;
