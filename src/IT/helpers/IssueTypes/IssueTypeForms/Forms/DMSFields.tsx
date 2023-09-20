import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";
import { useAppConfig } from "../../../../../ConfigProvider";

function DMSFields() {
  const [oracleFormData, setOracleFormData] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const { apiUrl } = useAppConfig();

  let _dmsFolders = oracleFormData.filter((r) => r.Process === "DMS");
  const _dmsFoldersList = new Set();
  var uniqueDescription = _dmsFolders.filter((m) => {if (_dmsFoldersList.has(m.Description)) {return false;} _dmsFoldersList.add(m.Description); return true;});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/Tracking/GetOracleFormData`);
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
    <>
      <Form.Item name="PermissionType" label="Permission Type" rules={[{ required: true, message: '' }]}>
        <Select>
          <Select.Option value="Full Control">Full Control</Select.Option>
          <Select.Option value="Edit">Edit</Select.Option>
          <Select.Option value="Read Only">Read Only</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="MainFolder" label="Main Folder" rules={[{ required: true, message: "" }]}>
        <Select placeholder="Select Folder" loading={loading} disabled={loading}>
          {uniqueDescription?.map(d => <Select.Option value={d.Description}>{d.Description}</Select.Option>)}
        </Select>
      </Form.Item>
    </>
  );
}

export default DMSFields;
