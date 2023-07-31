import React from 'react';
import { Form, Select } from 'antd';
import { AutoCompleteOrgUsers } from '../../../../../components/AutoCompleteOrgUsers';
import { apiLink } from '../../../../../index';


const MASARFields = () => {
  const [departments, setDepartments] = React.useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${apiLink}/user/departments`);
      const data = await response.json();
      setDepartments(data.Data);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      {/* <Form.Item label="Email" required>
        <DropdownSelectUser 
          name="masar_email" 
          placeholder="Select User" 
          size="middle" 
          required
        />
      </Form.Item>

      <Form.Item label="Display Name" required>
        <DropdownSelectUser 
          name="masar_name" 
          placeholder="User Display Name" 
          size="middle" 
          required
          triggerDisplayName // to set value displayname not email
        />
      </Form.Item> */}


      <Form.Item name="masar_email" label="Email" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select User" />
      </Form.Item>
      <Form.Item name="masar_name" label="Display Name" rules={[{ required: true, message: "" }]}>
        <AutoCompleteOrgUsers valueRender='displayName' placeholder="Select User" />
      </Form.Item>

      <Form.Item name="masar_department" label="Department" rules={[{required: true, message: ''}]}>
        <Select placeholder="Select Department">
          {departments?.map((item, index) => <Select.Option key={index} value={item}>{item}</Select.Option>)}
        </Select>
      </Form.Item>
    </>
  )
}

export default MASARFields