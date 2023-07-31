import * as React from 'react';
import { Button, Form, Modal, message, notification } from 'antd';
import { FileSyncOutlined } from '@ant-design/icons';
import { AutoCompleteOrgUsers } from '../../../../components/AutoCompleteOrgUsers';


function ReAssignApprovalAction({ Email, RequestId, handelAfterAction, openModal, onCancel }: any) {
  const [form] = Form.useForm();
  const [btnLoading, setBtnLoading] = React.useState(false);
  
  
  const handleReAssign = async (form_data: any) => {
    setBtnLoading(true);
      const payload = { 
        ServiceRequestId: RequestId,
        Email: Email,
        ...form_data 
      };
      console.log(payload);
      // await axios.post('https://salicapi.com/api/tracking/ReAssignApproval', payload);
      if(handelAfterAction) handelAfterAction();
      notification.success({message: 'Done!'});
      form.resetFields();
      onCancel();
    setBtnLoading(false);
  }
  return (
      <Modal
        title={<><FileSyncOutlined /> Re-Assign Approval #{RequestId}</>}
        open={openModal} 
        onCancel={onCancel}
        footer={null}
      >
        <Form form={form} layout='vertical' onFinish={handleReAssign} onFinishFailed={() => message.error('Please, Fill all required fields!')}>
          <Form.Item label="Approver" name="ApproverEmail" rules={[{required: true}]}>
            <AutoCompleteOrgUsers  size="large" placeholder="Select Approver"/>
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" loading={btnLoading}>Submit</Button>
            <Button type="default" onClick={onCancel}>Cancel</Button>
          </div>
        </Form>
      </Modal>
  )
}

export default ReAssignApprovalAction