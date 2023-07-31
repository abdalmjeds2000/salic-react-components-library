import * as React from 'react';
import { Popconfirm, notification } from 'antd';

export const ApproveAction = ({ children, ActionId, handelAfterAction }: any) => {

  const approveAction = async () => {
    await fetch(`https://salicapi.com/api/tracking/Accept/${ActionId}`);
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
export const RejectAction = ({ children, ActionId, handelAfterAction }: any) => {

  const rejectAction = async () => {
    await fetch(`https://salicapi.com/api/tracking/Reject/${ActionId}`);
    notification.success({message: 'Service request has been rejected successfully'});
    if(handelAfterAction) handelAfterAction();
  }
  return (
    <Popconfirm
      placement="bottomRight"
      title="Are you sure to Reject this Request?"
      onConfirm={rejectAction}
      okText="Reject"
      cancelText="Cancel"
    >
      {children}
    </Popconfirm>
  )
}