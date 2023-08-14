import * as React from 'react';
import { message, Modal, notification, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';


function DeleteAction({ openModal, RequestId, handelAfterAction, onCancel }: any) {
  const [btnLoading, setBtnLoading] = React.useState<any>(false);
  const [reasonValue, setReasonValue] = React.useState<any>('');
  const [isShowing, setIsShowing] = React.useState<any>(true);
  
  const deleteAction = async () => {
    setBtnLoading(true);
    if(reasonValue.length >= 3) {
      await fetch(`https://salicapi.com/api/tracking/DeleteServiceRequest/${RequestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: reasonValue })
      });
      if(handelAfterAction) handelAfterAction();
      if(onCancel) onCancel();
      notification.success({message: 'Service request has been deleted successfully'});
      setReasonValue(false);
      setIsShowing(false);
    } else {
      message.error("Please, write reason of canceled");
    }
    setBtnLoading(false);
  }

  return (
    <>
      {isShowing && (
        <Modal
          title={<><DeleteOutlined /> Delete Request #{RequestId}</>}
          open={openModal} 
          onOk={deleteAction} 
          cancelButtonProps={{style: {display: 'none'}}}
          onCancel={onCancel}
          okButtonProps={{type: 'primary', danger: true, loading: btnLoading}} 
          okText="Delete Request"
          destroyOnClose
        >
          <div>
            <Typography.Text strong>Write Delete Reason</Typography.Text>
            <TextArea rows={4} placeholder="write here" value={reasonValue} onChange={e => setReasonValue(e.target.value)} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default DeleteAction