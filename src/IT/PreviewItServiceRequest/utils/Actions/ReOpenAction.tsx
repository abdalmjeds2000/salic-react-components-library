import * as React from 'react';
import { message, Modal, Space, Typography } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';


function ReOpenAction({ Email, RequestId, handelAfterAction, openModal, onCancel }: any) {
  const [btnLoading, setBtnLoading] = React.useState<any>(false);
  const [isShowing, setIsShowing] = React.useState<any>(true);
  const [reOpenReason, setReOpenReason] = React.useState<any>("");

  const reOpenAction = async () => {
    setBtnLoading(true);
    const payload = {
      Email: Email,
      reopen_reason: reOpenReason,
      ServiceRequestId: RequestId,
    };
    if(reOpenReason.length > 0) {
      await fetch('https://salicapi.com/api/tracking/ReOpenServiceRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      message.success("Service request has been re-opened")
      if(handelAfterAction) handelAfterAction();
      onCancel();
      setIsShowing(false);
    } else {
      message.error("Write Re-Open Reason")
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && (
        <Modal 
          title={<><RedoOutlined /> Re Open Service Request</>}
          open={openModal} 
          onOk={reOpenAction} 
          onCancel={onCancel}
          okButtonProps={{type: 'primary', disabled: btnLoading}} 
          okText="Re-Open"
        >
          <Space direction='vertical' style={{width: '100%', gap: '25px'}}>
            <Typography.Text strong>HelpDesk Technical Feedback</Typography.Text>
            <TextArea rows={4} placeholder="HelpDesk Technical Feedback" value={reOpenReason} onChange={e => setReOpenReason(e.target.value)} />
          </Space>
        </Modal>
      )}
    </>
  )
}

export default ReOpenAction