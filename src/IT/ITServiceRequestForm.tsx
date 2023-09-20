import * as React from 'react';
import moment from 'moment';
import { Form, message, Button, Input, Divider, Radio, Space, Select, Typography, Image } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { PaperClipOutlined } from '@ant-design/icons';
import { FilesUploader } from '../components/CustomAntUploader';
import { AutoCompleteOrgUsers } from '../components/AutoCompleteOrgUsers';
import IssueTypeForms from './helpers/IssueTypes/IssueTypeForms/IssueTypeForms';
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
import { editorConfig, useAppConfig } from "../index";

export interface ITServiceRequestFormProps {
  listOfIssue: any[];
  Email: string;
  initialValues?: any;
  initialFiles?: any[];
  emailDescription?: string;
  Source?: "Web" | "ADD-IN" | string;
}
const initIssueProps = { category: "Hardware", type: "" };
const initIssueExtra = { guidLink: { src: null, visible: false }, pdfLink: null };
const approcla_icon = <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="20px" height="20px" x="0" y="0" viewBox="0 0 682.667 682.667"><g><defs><clipPath id="b" clipPathUnits="userSpaceOnUse"><path d="M0 512h512V0H0Z" fill="#1890ff"  ></path></clipPath></defs><mask id="a"><rect width="100%" height="100%" fill="#FFFFFF" data-original="#ffffff" ></rect><path d="M0 0c12.98-27.735 20.25-58.656 20.25-91.247 0-119.103-96.897-216-216-216s-216 96.897-216 216c0 119.102 96.897 216 216 216 15.74 0 31.086-1.708 45.877-4.92l32.685 32.684c-25.058 8.045-51.486 12.586-78.562 12.586-68.38 0-132.667-26.979-181.02-75.331-48.351-48.352-74.98-112.639-74.98-181.019 0-68.38 26.629-132.667 74.98-181.02 48.353-48.351 112.64-74.63 181.02-74.63 68.38 0 132.667 26.279 181.02 74.63 48.351 48.353 74.98 112.64 74.98 181.02 0 42.98-10.527 84.341-30.351 121.146z" transform="matrix(1.33333 0 0 -1.33333 602.333 220.137)" fill="#FFFFFF" data-original="#ffffff" ></path></mask><g mask="url(#a)"><g clip-path="url(#b)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)"><path d="M0 0c0 43.823 35.526 79.35 79.35 79.35 43.823 0 79.349-35.527 79.349-79.35 0-43.823-35.526-79.35-79.349-79.35C35.526-79.35 0-43.823 0 0Z" transform="translate(176.65 302.65)" fill="none" stroke="#1890ff" stroke-width="40px" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" ></path><path d="M0 0c0 80.8 65.501 146.301 146.301 146.301 80.8 0 146.301-65.501 146.301-146.301" transform="translate(109.7 77)" fill="none" stroke="#1890ff" stroke-width="40px" stroke-linecap="butt" stroke-linejoin="round" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" ></path><path d="m0 0-83-83-50 50" transform="translate(484 464)" fill="none" stroke="#1890ff" stroke-width="40px" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="none" stroke-opacity="" ></path><path d="M0 0c12.98-27.735 20.25-58.656 20.25-91.247 0-119.103-96.897-216-216-216s-216 96.897-216 216c0 119.102 96.897 216 216 216 15.74 0 31.086-1.708 45.877-4.92l32.685 32.684c-25.058 8.045-51.486 12.586-78.562 12.586-68.38 0-132.667-26.979-181.02-75.331-48.351-48.352-74.98-112.639-74.98-181.019 0-68.38 26.629-132.667 74.98-181.02 48.353-48.351 112.64-74.63 181.02-74.63 68.38 0 132.667 26.279 181.02 74.63 48.351 48.353 74.98 112.64 74.98 181.02 0 42.98-10.527 84.341-30.351 121.146z" transform="translate(451.75 346.897)" fill="#1890ff"  ></path></g></g></g></svg>;

const formItemsStyle: React.CSSProperties = {
  marginBottom: 10,
}
export const ITServiceRequestForm = (props: ITServiceRequestFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [issue, setIssue] = React.useState(initIssueProps);
  const [issueTypeExtra, setIssueTypeExtra] = React.useState(initIssueExtra);
  const [fileList, setFileList] = React.useState<any[]>(props.initialFiles || []);
  const { apiUrl, uploaderUrl } = useAppConfig();

  const onFinish = async (FormData: any) => {
    // Get Files Nemes Uploaded & check if all files finish uploading
    let isFilesFinishUpload = true;
    const files = fileList.map((file) => {
      if (file.status === "uploading") isFilesFinishUpload = false;
      return file.response?.uploadedFiles[0]?.Name;
    });
    if(!isFilesFinishUpload) {
      message.error("Wait for Uploading...");
      return;
    };
    if (FormData?.onbehalf?.toLowerCase() === props.Email?.toLowerCase()) {
      message.error("You can't submit a request on behalf of yourself.");
      return;
    }
    if (issue.category === "Access" ) {
      switch (FormData.IssueType) {
        case 'Oracle':
          var OracleFormDataProp:any = { Enviroment: FormData.Enviroment, NewAccount: FormData.NewAccount, Module: FormData.Module, Rules: FormData.Rules };
          if(FormData.TemporaryAccess && FormData.TemporaryAccess.length > 0) {
            OracleFormDataProp = { ...OracleFormDataProp, AccessFrom: moment(FormData.TemporaryAccess[0]).format('MM/DD/YYYY'), AccessTo: moment(FormData.TemporaryAccess[1]).format('MM/DD/YYYY') };
          }
          FormData.FormData = JSON.stringify(OracleFormDataProp);
          break;
        case 'DMS':
          var DMSFormDataProp = { PermissionType: FormData.PermissionType, MainFolder: FormData.MainFolder, };
          FormData.FormData = JSON.stringify(DMSFormDataProp);
          break;
        case 'Unlock USB':
          var USBFormDataProp = { USBAccessType: FormData.USBAccessType, USBAccessFrom: moment(new Date(FormData?.USBAccessDates[0])).format('MM/DD/YYYY'), USBAccessTo: moment(new Date(FormData?.USBAccessDates[1])).format('MM/DD/YYYY') };
          FormData.FormData = JSON.stringify(USBFormDataProp);
          break;
        case 'Software Subscription & Licenses':
          var SoftwareFormDataProp = { SoftwareName: FormData.SoftwareName };
          FormData.FormData = JSON.stringify(SoftwareFormDataProp);
          break;
        case 'Phone Extensions':
          var PhoneFormDataProp = { Extensions: FormData.Extensions, Scope: FormData.Scope };
          FormData.FormData = JSON.stringify(PhoneFormDataProp);
          break;
        case 'New Account':
          var NewAccountFormDataProp = { 
            FirstName: FormData.FirstName,
            LastName: FormData.LastName, 
            Company: FormData.Company, 
            JobTitle: FormData.JobTitle, 
            Nationality: FormData.Nationality, 
            departments: FormData.departments, 
            Mobile: FormData.Mobile, 
            Phone: FormData.Phone, 
            Manager: FormData.Manager, 
            DateOfEmployee: moment(FormData.DateOfEmployee).format('MM/DD/YYYY'), 
            Grade: FormData.Grade, 
            IQAMA: FormData.IQAMA, 
            NewUserStartDate: moment(FormData.StartEndDate[0]).format('MM/DD/YYYY'), 
            NewUserEndDate: moment(FormData.StartEndDate[1]).format('MM/DD/YYYY'), 
            WithLaptop: FormData.WithLaptop, 
            Gender: FormData.Gender,
            PrivateEmail: FormData.PrivateEmail,
          };
          FormData.FormData = JSON.stringify(NewAccountFormDataProp);
          break;
        case 'Shared Email':
          var SharedEmailFormDataProp = { SenderName: FormData.SenderName, EmailAddress: FormData.EmailAddress, BusinessOwner: FormData.BusinessOwner, Members: FormData.Members?.join() };
          FormData.FormData = JSON.stringify(SharedEmailFormDataProp);
          break;
        case 'GL Account':
          var GLAccountFormDataProp = { AccountCode: FormData.AccountCode, AccountDescription: FormData.AccountDescription, Summary: FormData.Summary, AllowPosting: FormData.AllowPosting, AllowBudgeting: FormData.AllowBudgeting, GLParentCode: FormData.GLParentCode, IntercompanyAccount: FormData.IntercompanyAccount, EliminationRequired: FormData.EliminationRequired, FinancialStatement: FormData.FinancialStatement, MappingUnderFSLI: FormData.MappingUnderFSLI, AccountType: FormData.AccountType };
          FormData.FormData = JSON.stringify(GLAccountFormDataProp);
          break;
        case 'Create Group email':
          FormData.GroupOwners = FormData.GroupOwners?.join(",");
          FormData.GroupMembers = FormData.GroupMembers?.join(",");
          var CreateGroupEmailFormDataProp = { GroupName: FormData.GroupName, GroupType: FormData.GroupType, GroupOwners: FormData.GroupOwners, GroupMembers: FormData.GroupMembers, GroupEmail: FormData.GroupEmail, AllowOutside: FormData.AllowOutside };
          FormData.FormData = JSON.stringify(CreateGroupEmailFormDataProp);
          break;
        case 'Add Users to A Group':
          FormData.GroupMembers = FormData.GroupMembers?.join(",");
          var AddUserstoAGroupFormDataProp = { GroupName: FormData.GroupName, EmailAddress: FormData.EmailAddress, GroupMembers: FormData.GroupMembers };
          FormData.FormData = JSON.stringify(AddUserstoAGroupFormDataProp);
          break;
        case 'Change Line Manager':
          var ChangeLineManagerFormDataProp = { Employee: FormData.Employee, NewLine: FormData.NewLine };
          FormData.FormData = JSON.stringify(ChangeLineManagerFormDataProp);
          break;
        case 'Change Job Title':
          var ChangeJobTitleFormDataProp = { Employee: FormData.Employee, NewTitle: FormData.NewTitle };
          FormData.FormData = JSON.stringify(ChangeJobTitleFormDataProp);
          break;
        case 'MASAR':
          var MASARFormDataProp = { Name: FormData.masar_name, Email: FormData.masar_email, Department: FormData.masar_department };
          FormData.FormData = JSON.stringify(MASARFormDataProp);
          break;
        case 'New Email Account':
          var NewEmailAccountFormDataProp = { Name: FormData.new_email_account_name, Email: FormData.new_email_account_email, Owner: FormData.new_email_account_owner };
          FormData.FormData = JSON.stringify(NewEmailAccountFormDataProp);
          break;
        case 'Install Program':
          var InstallProgramFormDataProp = { NewProgramsList: FormData.NewProgramsList };
          FormData.FormData = JSON.stringify(InstallProgramFormDataProp);
          break;
        case 'Backup Restore':
          var BackupRestoreFormDataProp = { DataSource: FormData.BackupRestore_DataSource };
          FormData.FormData = JSON.stringify(BackupRestoreFormDataProp);
          break;
        case 'Global Admin Access Request':
          var GlobalAdminAccess_FormDataProp = { Date: moment(FormData.GlobalAdminAccess_Date).format('MM/DD/YYYY'), Duration: FormData.GlobalAdminAccess_Duration, /* Reason: FormData.GlobalAdminAccess_Reason */ };
          FormData.FormData = JSON.stringify(GlobalAdminAccess_FormDataProp);
          break;
      }
    }
    const formData = { 
      AccountType: "AccountType",
      Email: props.Email,
      Source: props.Source || "Web",
      FileNames: files.join(","),
      ...FormData,
    };

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/tracking/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      
      message.success("Your request has been submitted successfully.");
      form.resetFields();
      setIssue(initIssueProps);
      setIssueTypeExtra(initIssueExtra);
      setFileList([]);
    } catch (error) {
      message.error("Something went wrong, please try again.");
    } finally {
      console.log('Received values of form: ', formData);
      setLoading(false);
    }
  };
  const handleFinishFailed = () => message.error("Please, fill out the form correctly.");

  return (
    <div className='new-it-request-form-container'>
      <Form 
        {...{ labelCol: { xs: {span:24}, md: 24, lg: 24, xl: 6, style: { lineHeight: 1, paddingBottom: 0 } }, wrapperCol: { xs: {span:24}, xl: 12 } }}
        form={form}
        labelWrap
        name="new-service-request-form"
        onFinish={onFinish}
        onFinishFailed={handleFinishFailed}
        initialValues={props.initialValues}
      >
        <Form.Item name="ReceivedDate" label="Date" hidden initialValue={moment().format("MM-DD-YYYY hh:mm")} style={formItemsStyle}>
          <Input placeholder="Date" size="large" disabled />
        </Form.Item>
        <Form.Item name="Subject" label="Subject" rules={[{ required: true }]} style={formItemsStyle}>
          <Input placeholder="write breif subject" size="large" />
        </Form.Item>
        <Form.Item name="onbehalf" label="On Behalf Of" style={formItemsStyle}>
          <AutoCompleteOrgUsers valueRender='mail' size="large" allowClear placeholder="Select User" />
        </Form.Item>

        <Divider />

        <Form.Item name="CategoryType" label="Issue Category" initialValue="Hardware" style={formItemsStyle}>
          <Radio.Group value={issue.category} onChange={({ target: { value } }) => setIssue({ category: value, type: "" })}>
            <Space direction="vertical">
              <Radio value="Hardware">
                <Typography.Text strong>Hardware & Devices</Typography.Text> <br />
                <Typography.Text type="secondary">Hardware problem such as laptop or screen broken</Typography.Text>
              </Radio>
              <Radio value="Software">
                <Typography.Text strong>Software</Typography.Text> <br />
                <Typography.Text type="secondary">Software problem such as application not working</Typography.Text>
              </Radio>
              <Radio value="Access">
                <Typography.Text strong>Access, Permissions, and Licenses</Typography.Text> <br />
                <Typography.Text type="secondary">Access Issues such as Permissions to access a resource</Typography.Text>
              </Radio>
              <Radio value="Security">
                <Typography.Text strong>Security</Typography.Text> <br />
                <Typography.Text type="secondary">Security such as email phishing.</Typography.Text>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="Priority" label="Priority" initialValue="1" style={formItemsStyle}>
          <Select placeholder="Priority" size="large">
            <Select.Option value="1">Normal</Select.Option>
            <Select.Option value="2">Critical</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item 
          name="IssueType" 
          label="Issue Type"
          style={{ marginBottom: 0 }}
          extra={
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <span>{(issue.category === "Access" && issueTypeExtra.pdfLink) ? <Button type="link" style={{ padding: 0 }}>
                  <Typography.Link href={issueTypeExtra.pdfLink || ''} target="_blank">
                    <PaperClipOutlined /> User Guide
                  </Typography.Link>
                </Button> : null}</span>
              <span>{issue.category === "Access" && issueTypeExtra.guidLink.src && 
                <Button type="link" onClick={() => setIssueTypeExtra(prev => ({ ...prev, guidLink: { ...prev.guidLink, visible: true } })) } style={{ fontSize: '0.5rem', float: "left", padding: 0 }}>
                  {approcla_icon}
                </Button>}</span>
            </div>
          }
        >
          <Select
            placeholder="Select Issue Type"
            size="large"
            value={issue.type}
            onChange={(value) => {
              form.setFieldsValue({ IssueType: value });
              /* get image src from issuetypes list by filter it using current value issueTypeField */
              // const imgsrc = props.listOfIssue?.filter((v) => v.IssueType === value && v.Category === "Access")[0]?.AttachmentFiles?.[0]?.ServerRelativePath?.DecodedUrl;
              const imgsrc = props.listOfIssue?.filter((v) => v.IssueType === value && v.Category === "Access")[0]?.FormModalImage;
              const pdfsrc = props.listOfIssue?.filter((v) => v.IssueType === value && v.Category === "Access")[0]?.UserGuideFile;
              setIssueTypeExtra(prev => ({ ...prev, guidLink: { ...prev.guidLink, src: imgsrc }, pdfLink: pdfsrc }));
              setIssue(prev => ({ ...prev, type: value }));
            }}
          >
            {props.listOfIssue
              ?.filter((i) => i.Category === issue.category)
              ?.map((option, i) => <Select.Option key={i} value={option.IssueType}>{option.IssueType}</Select.Option>)}
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        {
          issue.category === "Access" && issue.type !== "" &&
            <div style={{padding: '15px', borderRadius: '10px', backgroundColor: '#f5f5f5'}}>
              <IssueTypeForms IssueType={issue.type} />
            </div>
        }

        <Divider />

        <Form.Item name="Description" hidden><TextArea /></Form.Item>
        <Form.Item label="Descriptions / Justifications" required style={formItemsStyle}>
          <JoditEditor
            value={props.emailDescription || ""}
            config={editorConfig}
            onChange={value => form.setFieldsValue({ Description: value })}
          />
        </Form.Item>

        <Form.Item label="Documents" style={formItemsStyle}>
          <FilesUploader 
            endpoint={uploaderUrl}
            fileList={fileList}
            GetFilesList={(files: any[]) => setFileList(files)}
          />
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Submit
          </Button>
        </div>
      </Form>
      <Image
        width={200}
        style={{ display: 'none' }}
        src={issueTypeExtra.guidLink.src || ""}
        preview={{
          visible: issueTypeExtra.guidLink.visible,
          scaleStep: 0.5,
          src: issueTypeExtra.guidLink.src || "",
          onVisibleChange: (value) => setIssueTypeExtra(prev => ({ ...prev, guidLink: { ...prev.guidLink, visible: value } }))
        }}
      />
    </div>
  );
}