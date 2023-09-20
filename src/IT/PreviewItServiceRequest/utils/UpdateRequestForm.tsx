import * as React from 'react';
import moment from 'moment';
import { Button, DatePicker, Form, Input, message, Radio, Select, Slider, Space, Upload } from 'antd';
import { Section } from '../../../components/Section';
import { UploadOutlined } from '@ant-design/icons';

type Props = {
  RequestData: any;
  IssueTypes?: any[];
  IsAdmin: boolean;
  onFinish?: () => void;
}
function UpdateRequestForm(props: Props) {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = React.useState(props.RequestData);
  const [BIAFiles, setBIAFiles] = React.useState<any[]>([]);
  const [SCRFiles, setSCRFiles] = React.useState<any[]>([]);

  // handle read BIA & SCR files
  React.useEffect(() => {
    try {
      if(props.RequestData?.BIA) {
        const file = JSON.parse(props.RequestData?.BIA?.Body);
        const uploaderFiles = [{ uid: props.RequestData?.BIA?.Id, name: file?.OriginalName, guidName: file?.Name, status: "done", url: file?.Path }];
        setBIAFiles(uploaderFiles);
      }
      if(props.RequestData?.SCR) {
        const file = JSON.parse(props.RequestData?.SCR?.Body);
        const uploaderFiles = [{ uid: props.RequestData?.SCR?.Id, name: file?.OriginalName, guidName: file?.Name, status: "done", url: file?.Path }];
        setSCRFiles(uploaderFiles);
      }
    } catch (error) {
      console.log(error);
    }
  }, [JSON.stringify(props.RequestData)])


  const UpdateItServiceRequest = async (values: any) => {
    let isUploaded1 = true;
    const attachmentsBIA = BIAFiles.map(file => {
      if(file.status === "uploading") isUploaded1 = false
      return file.response?.uploadedFiles[0]?.Name || file?.guidName
    });
    let isUploaded2 = true;
    const attachmentsSCR = SCRFiles.map(file => {
      if(file.status === "uploading") isUploaded2 = false
      return file.response?.uploadedFiles[0]?.Name || file?.guidName
    });
    if(values.RequestType === "CR" && (BIAFiles?.length === 0 || SCRFiles?.length === 0)) {
      message.error("Please, upload required files.");
      return;
    }
    if(!isUploaded1 || !isUploaded2) {
      message.error("Please, wait until files are uploaded.");
      return;
    }

    try {
      if(values.RequestType === "CR") {
        if(values?.StartDate) values.StartDate = values?.StartDate.format("MM/DD/YYYY");
        if(values?.ExpectedEndDate) values.ExpectedEndDate = values?.ExpectedEndDate.format("MM/DD/YYYY");
      }
      values.BIA = attachmentsBIA;
      values.SCR = attachmentsSCR;
      values.Id = props.RequestData?.Id;

      await fetch('https://salicapi.com/api/tracking/UpdateServiceRequest', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if(props.onFinish) props.onFinish();
      message.success("IT Request has been Updated Successfully!");
    } catch (error) {
      message.error("Something went wrong, please try again later!");
    }
  }

  const IsClosed = props.RequestData?.Status === "CLOSED";
  const IsCancelled = props.RequestData?.Status === "CANCELLED";

  return (
    <Form
      form={form}
      name="update-it-request"
      layout='vertical'
      onFinish={UpdateItServiceRequest}
      onFinishFailed={() => message.error("Please, fill out the form correctly.") }
      disabled={!props.IsAdmin || IsClosed || IsCancelled}
      onValuesChange={(changedValues, allValues) => { setFormValues(allValues); console.log(changedValues); }}
    >
      <div>
        <Section SectionTitle="Subject">
          <Form.Item name="Subject" initialValue={props.RequestData?.Subject} rules={[{required: true, message: ""}]}>
            <Input placeholder="Write Subject" size="large" />
          </Form.Item>
        </Section>
        <Section SectionTitle="Issue Category" className="-mt-10">
          <Form.Item name="CategoryType" initialValue={props.RequestData?.Category} rules={[{required: true, message: ""}]} style={{marginBottom: 5}}>
            <Radio.Group size='large'>
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
                  <span>Security</span> <br />
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Section>
        <Section SectionTitle="Issue Type">
          <Form.Item name="IssueType" initialValue={props.RequestData?.IssueType} rules={[{required: true, message: ""}]} style={{marginBottom: 5}}>
            <Select
              placeholder="Select Issue Type"
              size="large"
            >
            {props.IssueTypes &&
              props.IssueTypes
                .filter((item: any) => item.Category === (formValues.CategoryType || formValues.Category))
                .map((option, i) => (
                  <Select.Option key={option.Id || i} value={option.IssueType}>{option.IssueType}</Select.Option>
                ))}
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
        </Section>
        <Section SectionTitle="Priority">
          <Form.Item name="Priority" initialValue={props.RequestData?.Priority} rules={[{required: true, message: ""}]} style={{marginBottom: 5}}>
            <Select placeholder="Priority" size="large">
              <Select.Option value="1">Normal</Select.Option>
              <Select.Option value="2">Critical</Select.Option>
            </Select>
          </Form.Item>
        </Section>
        <Section SectionTitle="Request Type">
          <Form.Item name="RequestType" initialValue={props.RequestData?.RequestType} rules={[{required: true, message: ""}]} style={{marginBottom: 0}}>
            <Select placeholder="Select Request Type" size="large" /* disabled={!!props.RequestData?.RequestType} */>
              <Select.Option value="CR">Change Request</Select.Option>
              <Select.Option value="ER">Enhancement Request</Select.Option>
              <Select.Option value="HelpDesk">Help Desk</Select.Option>
              <Select.Option value="BUG">Bugs Fixing</Select.Option>
              <Select.Option value="Permission">Permissions</Select.Option>
              <Select.Option value="Incident">Security</Select.Option>
            </Select>
          </Form.Item>
        </Section>
        
        {(formValues.RequestType === "CR" || formValues.RequestType === "ER") ? (
          <div style={{padding:"8px 12px", backgroundColor: "#efefef"}}>
            <Form.Item name="change_classification" label="Classification" initialValue={props.RequestData?.ChangeClassification} style={{marginBottom: 7}} rules={[{required: true, message: ""}]}>
              <Select placeholder="Select Change Classification Type" disabled={!!props?.RequestData?.ChangeClassification || IsClosed || IsCancelled}>
                <Select.Option value="Major">Major</Select.Option>
                <Select.Option value="Medium">Medium</Select.Option>
                <Select.Option value="Minor">Minor</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="BIA" style={{marginBottom: 7}} required>
              <Upload 
                action="https://salicapi.com/api/uploader/up"
                fileList={BIAFiles}
                onChange={({ fileList: newFileList }: any) => setBIAFiles(newFileList)}
                disabled={props.RequestData?.BIA || !props.IsAdmin || IsClosed || IsCancelled}
              >
                <Button icon={<UploadOutlined />} disabled={BIAFiles.length > 0 || !props.IsAdmin || IsClosed || IsCancelled}>Upload</Button>
              </Upload>
            </Form.Item>
            {
              (formValues.RequestType === "CR") 
              && (
                <Form.Item label="Signed Change request" style={{marginBottom: 7}} required>
                  <Upload 
                    action="https://salicapi.com/api/uploader/up"
                    fileList={SCRFiles}
                    onChange={({ fileList: newFileList }: any) => setSCRFiles(newFileList)}
                    disabled={props.RequestData?.SCR || !props.IsAdmin || IsClosed || IsCancelled}
                  >
                    <Button icon={<UploadOutlined />} disabled={SCRFiles.length > 0 || !props.IsAdmin || IsClosed || IsCancelled}>Upload</Button>
                  </Upload>
                </Form.Item>
              )
            }

            <Form.Item name="StartDate" label="Start Date" initialValue={props?.RequestData?.StartDate ? moment(props?.RequestData?.StartDate) : null} style={{marginBottom: 7}} rules={[{required: true, message: ""}]}>
              <DatePicker format="MM/DD/YYYY" placeholder="Start Date" style={{ width: "100%" }} disabled={!!props?.RequestData?.StartDate || IsClosed || IsCancelled} />
            </Form.Item>
            <Form.Item name="ExpectedEndDate" label="Expected End Date" initialValue={props?.RequestData?.ExpectedEndDate ? moment(props?.RequestData?.ExpectedEndDate) : null} style={{marginBottom: 7}} rules={[{required: true, message: ""}]}>
              <DatePicker format="MM/DD/YYYY" placeholder="Expected End Date" style={{ width: "100%" }} disabled={!!props?.RequestData?.ExpectedEndDate || IsClosed || IsCancelled} />
            </Form.Item>
            <Form.Item name="Progress" label="Progress" style={{marginBottom:0}} initialValue={props?.RequestData?.Progress || 0} rules={[{required: true, message: ""}]}>
              <Slider marks={{ 0: '0%', 20: '20%', 40: '40%', 60: '60%', 80: '80%', 100: '100%' }} disabled={!props.IsAdmin || IsClosed || IsCancelled} />
            </Form.Item>
          </div>
        ) : null}

        {(props.IsAdmin && !IsClosed) && <Button type="primary" htmlType='submit' size='large' style={{width: '100%', marginTop: 10}}>
          Update Request Information
        </Button>}
      </div>
    </Form>
  )
}

export default UpdateRequestForm