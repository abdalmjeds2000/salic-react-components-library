import * as React from 'react';
import { Button, Form, Modal, message, notification } from 'antd';
import { PullRequestOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { AutoCompleteOrgUsers } from '../../../../components/AutoCompleteOrgUsers';


function AskForApprovalAction({ Email, RequestId, handelAfterAction, openModal, onCancel }: any) {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = React.useState(false);
  
  const handleAskForApproval = async (form_data: any) => {
    setBtnLoading(true);
      const payload = { 
        ServiceRequestId: RequestId,
        Email: Email,
        ...form_data 
      };
      console.log(payload);
      // await axios.post('https://salicapi.com/api/tracking/AskForApproval', payload);
      if(handelAfterAction) handelAfterAction();
      notification.success({message: 'Done!' });
      form.resetFields();
      onCancel();
    setBtnLoading(false);
  }
  return (
      <Modal
        title={<><PullRequestOutlined /> Ask For Approval #{RequestId}</>}
        open={openModal} 
        onCancel={onCancel}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleAskForApproval} onFinishFailed={() => message.error('Please, Fill all required fields!')}>
          <Form.Item label="Approver" name="ApproverEmail" rules={[{ required: true, message: "" }]}>
            <AutoCompleteOrgUsers size="large" valueRender='mail' placeholder="Select Approver" />
          </Form.Item>
          <Form.Item label="Notes" name="Notes" rules={[{ required: true, message: "" }]}>
            <TextArea placeholder="Enter a Notes" rows={4} size='large' />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" loading={btnLoading}>Submit</Button>
            <Button type="default" onClick={onCancel}>Cancel</Button>
          </div>
        </Form>
      </Modal>
  )
}

export default AskForApprovalAction