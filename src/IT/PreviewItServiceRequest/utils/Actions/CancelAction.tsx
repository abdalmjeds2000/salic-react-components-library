import * as React from 'react';
import { Button, message, Modal, Space, Typography, Upload } from 'antd';
import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

type Props = {
  Email: string,
  RequestId: number | string,
  onFinish: () => void,
  openModal: boolean,
  onCancel: () => void,
}

function CancelAction({ Email, RequestId, onFinish, openModal, onCancel }: Props) {
  const [cancelReason, setCancelReason] = React.useState("");
  const [fileList, setFileList] = React.useState([]);
  const [btnLoading, setBtnLoading] = React.useState(false);


  const cancelAction = async () => {
    // check if there files is uploading...
    let isFilesFinishUpload = true;
    const attachmentsList = fileList.map((file: any) => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    });
    if(!isFilesFinishUpload) return message.error("Wait For Uploading...");
    if(cancelReason.length === 0 || !cancelReason || cancelReason?.trim() === "") return message.error("Fill Field Correctly");

    try {
      setBtnLoading(true);
      const payload = {
        Email: Email,
        ServiceRequestId: RequestId,
        cancel_reason: cancelReason,
        Files: attachmentsList.join(), 
      }
      await fetch("https://salicapi.com/api/tracking/CancelServiceRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if(onFinish) onFinish();
      if(onCancel) onCancel();
      setCancelReason(""); setFileList([]); setBtnLoading(false);
      message.success("Service request has been canceled successfully");
    } catch (error) {
      message.error("Error while canceling service request");
    } finally {
      setBtnLoading(false);
    }
  }


  return (
    <Modal 
      title={<><SendOutlined /> Cancel Service Request</>}
      open={openModal} 
      onCancel={onCancel}
      footer={[
        <Button type='primary' loading={btnLoading} danger onClick={cancelAction}>
          Cancel Request
        </Button>,
      ]}
    >
      
      <Space direction='vertical' style={{width: '100%', gap: '25px'}}>
        <Typography.Text strong>Cancel Reason</Typography.Text>
        <TextArea rows={4} placeholder="HelpDesk Technical Feedback" value={cancelReason} onChange={e => setCancelReason(e.target.value)} />

        <Upload
          action="https://salicapi.com/api/uploader/up"
          fileList={fileList}
          onChange={({ fileList: newFileList }: any) => setFileList(newFileList)}
        >
          <Button type='dashed' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
        </Upload>
      </Space>
    </Modal>
  )
}

export default CancelAction