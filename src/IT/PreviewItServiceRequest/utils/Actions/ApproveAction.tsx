import * as React from 'react';
import { Button, Modal, Popconfirm, Typography, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useAppConfig } from '../../../../ConfigProvider';

export const ApproveAction = ({ children, ActionId, handelAfterAction }: any) => {
  const { apiUrl } = useAppConfig();

  const approveAction = async () => {
    await fetch(`${apiUrl}/tracking/Accept/${ActionId}`);
    notification.success({message: 'Service request has been accepted successfully'});
    if(handelAfterAction) handelAfterAction();
  }
  return (
    <Popconfirm
      placement="bottomRight"
      title="Are you sure to Approve this Request?"
      onConfirm={approveAction}
      okText="Approve"
      cancelText="Cancel"
    >
      {children}
    </Popconfirm>
  )
}

export const RejectAction = ({ openModal, onCancel, ActionId, handelAfterAction }: any) => {
  const [reason, setReason] = React.useState<string>('');
  const { apiUrl } = useAppConfig();

  const rejectAction = async () => {
    if(!reason || reason?.trim().length===0) return notification.error({message: 'Please enter the reason of rejection'});
    try {
      await fetch(`${apiUrl}/tracking/Reject/${ActionId}?Reason=${reason}`);
      notification.success({message: 'Service request has been rejected successfully'});
      setReason('');
      onCancel();
      if(handelAfterAction) handelAfterAction();
    } catch (error) {
      notification.error({message: 'Something went wrong'});
    }
  }
  return (
    <Modal
      title="Are you sure to Reject this Request?"
      open={openModal} 
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>
          Cancel
        </Button>,
        <Button type='primary' danger onClick={rejectAction}>
          Reject
        </Button>,
      ]}
    >
      <Typography.Text strong style={{lineHeight: 2}}>
        <Typography.Text type='danger'>* </Typography.Text>
        Write your rejection reason
      </Typography.Text>
      <TextArea
        placeholder="Enter the reason of rejection"
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
    </Modal>
  )
}