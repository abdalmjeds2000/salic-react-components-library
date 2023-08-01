import * as React from 'react';
import { Button, Form, message, Radio, Select, Space } from 'antd';
import { Section } from '../../../components/Section';

type Props = {
  RequestData: any;
  IssueTypes?: any[];
  handleAfterUpdate: any;
  IsAdmin: boolean;
}
function UpdateRequestForm(props: Props) {
  const [form] = Form.useForm();
  const [categoryTypeField, setCategoryTypeField] = React.useState(props.RequestData?.Category);
  const [issueTypeField, setIssueTypeField] = React.useState(props.RequestData?.IssueType);

  const UpdateItServiceRequest = async (values: any) => {
    if(
      props.RequestData?.Category === values.CategoryType &&
      props.RequestData?.IssueType === values.IssueType &&
      props.RequestData?.Priority === values.Priority 
    ) {
      console.log("NO CHANGE ON UPDATE FORM");
    } else {
      try {
        values.Id = props.RequestData?.Id;
        await fetch(`https://salicapi.com/api/tracking/UpdateServiceRequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        message.success("IT Request has been Updated Successfully!");
        if(props.handleAfterUpdate) props.handleAfterUpdate();
      } catch (error) {
        message.error("Something went wrong, please try again later.");
      }
      
    }
  }

  const IsClosed = props.RequestData?.Status === "CLOSED";

  return (
    <Form
      form={form}
      name="update-it-request"
      onFinish={UpdateItServiceRequest}
      onFinishFailed={() => message.error("Please, fill out the form correctly.") }
      disabled={!props.IsAdmin || IsClosed}
    >
      <div>
        <Section SectionTitle="Issue Category" className="-mt-10">
          <Form.Item name="CategoryType" initialValue={props.RequestData?.Category} style={{marginBottom: 5}}>
            <Radio.Group size='large' value={categoryTypeField} onChange={({ target: { value } }) => {setCategoryTypeField(value); setIssueTypeField("")}}>
              <Space direction="vertical">
                <Radio value="Hardware">
                  <span>Hardware & Devices</span> <br />
                </Radio>
                <Radio value="Software">
                  <span>Software & Applications</span> <br />
                </Radio>
                <Radio value="Access">
                  <span>Access, Permissions, and Licenses</span> <br />
                </Radio>
                <Radio value="Security">
                  <span>Security Incident</span> <br />
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Section>
        <Section SectionTitle="Issue Type">
          <Form.Item name="IssueType" initialValue={props.RequestData?.IssueType}  style={{marginBottom: 5}}>
            <Select
              placeholder="Select Issue Type"
              size="large"
              value={issueTypeField}
              onChange={(value) => setIssueTypeField(value)}
            >
              {props.IssueTypes &&
              props.IssueTypes
                .filter((item: any) => item.Category === categoryTypeField)
                .map((option, i) => (
                  <Select.Option key={option.Id || i} value={option.IssueType}>{option.IssueType}</Select.Option>
                ))}
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Section>
        <Section SectionTitle="Priority">
          <Form.Item name="Priority" initialValue={props.RequestData?.Priority} style={{marginBottom: 5}}>
            <Select placeholder="Priority" size="large">
              <Select.Option value="1">Normal</Select.Option>
              <Select.Option value="2">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Section>

        {(props.IsAdmin && !IsClosed) && <Button type="primary" htmlType='submit' size='large' style={{width: '100%', marginTop: 10}}>
          Update Request Information
        </Button>}
      </div>
    </Form>
  )
}

export default UpdateRequestForm