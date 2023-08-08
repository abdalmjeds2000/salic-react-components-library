import * as React from 'react';
import { Button, message, Modal, Select, Space, Table, Typography, Upload } from 'antd';
import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';


// FileUploderComponent
const CustomAntdFileUploder = ({ FileType, GetFilesList }: any) => {
  const [fileList, setFileList] = React.useState([]);
  
  return (
    <Upload
      action="https://salicapi.com/api/uploader/up"
      fileList={fileList}
      onChange={({ fileList: newFileList }: any) => {
        setFileList(newFileList);
        const FilesListWithTypes = newFileList.map((f: any) => {f.FileType = FileType; return {...f}})
        if(GetFilesList) GetFilesList(FilesListWithTypes)
      }}
    >
      <Button type='dashed' size='small' icon={<UploadOutlined />}>Attach Files</Button>
    </Upload>
  )
}


function CloseAction({ RequestData, Email, RequestId, handelAfterAction, openModal, onCancel }: any) {
  const [selectedType, setSelectedType] = React.useState(null);
  const [closeReason, setCloseReason] = React.useState("");
  const [fileList, setFileList] = React.useState([]);

  const [CONFFiles, setCONFFiles] = React.useState([]);
  const [UATiles, setUATiles] = React.useState([]);
  const [UGFiles, setUGFiles] = React.useState([]);

  const [btnLoading, setBtnLoading] = React.useState(false);
  const [isShowing, setIsShowing] = React.useState(true);


  const closeAction = async () => {
    setBtnLoading(true);
    // check if there files is uploading...
    let isFilesFinishUpload = true;
    const attachmentsList = fileList.map((file: any) => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    });
    // check if there files is uploading...
    let isCRFilesFinishUpload = true;
    const _CRFiles = [...CONFFiles, ...UATiles, ...UGFiles];
    const CRAttachmentsList = _CRFiles.map((file: any) => {
      if(file.status === "uploading") isCRFilesFinishUpload = false
      return {
        Type: file.FileType, 
        Name: file.response?.uploadedFiles[0]?.Name
      }
    });

    let isAllTypesHavAttachments = true;
    if(selectedType === "CR") {
      const _CRFilesLists = [CONFFiles, UATiles, UGFiles];
      _CRFilesLists.forEach(list => {
        if(list.length == 0) isAllTypesHavAttachments = false
      });
    }

    if(isFilesFinishUpload && isCRFilesFinishUpload) {
      if(closeReason.length !== 0 && selectedType) {
        if(isAllTypesHavAttachments) {
          const payload = {
            Email: Email,
            ServiceRequestId: RequestId,
            close_reason: closeReason,
            Files: attachmentsList.join(), 
            CRFiles: JSON.stringify(CRAttachmentsList),
            request_type: selectedType,
          }
          await fetch("https://salicapi.com/api/tracking/CloseServiceRequest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          });
          message.success("Service request has been closed");
          if(handelAfterAction) handelAfterAction();
          // reset modal fields
          setSelectedType(null); setCloseReason(""); setFileList([]); setCONFFiles([]); setUATiles([]); setUGFiles([]);
          setIsShowing(false);
        } else message.error("Please Attach files for all Documents");
      } else message.error("Fill Field Correctly");
    } else message.error("Wait For Uploading...");

    setBtnLoading(false);
  }


  return (
    <>
      {
        isShowing &&
          <Modal 
            title={<><SendOutlined /> Close Service Request</>}
            open={openModal} 
            onCancel={onCancel}
            footer={[
              <Button type='primary' disabled={btnLoading} danger onClick={closeAction}>
                Close
              </Button>,
              <Button onClick={onCancel}>
                Cancel
              </Button>,
            ]}
          >
            
            <Space direction='vertical' style={{width: '100%', gap: '25px'}}>
              <Typography.Text strong>HelpDesk Technical Feedback</Typography.Text>
              <TextArea rows={4} placeholder="HelpDesk Technical Feedback" value={closeReason} onChange={e => setCloseReason(e.target.value)} />


              <Typography.Text strong>Request Type</Typography.Text>
              <Select value={selectedType} size="large" placeholder="Select Request Type" onChange={value => setSelectedType(value)} style={{width: '100%'}}>
                <Select.Option value="CR">Change Request</Select.Option>
                <Select.Option value="ER">Enhancement Request</Select.Option>
                <Select.Option value="HelpDesk">Help Desk</Select.Option>
                <Select.Option value="BUG">Bugs Fixing</Select.Option>
                <Select.Option value="Permission">Permissions</Select.Option>
                <Select.Option value="Incident">Incident</Select.Option>
              </Select>


              {
                selectedType === "CR"
                ? (
                  <>
                    <Typography.Text strong>Classification</Typography.Text>
                    <Select defaultValue="Major" disabled value={RequestData?.ChangeClassification} size="large" placeholder="Select Classification Type" style={{width: '100%'}}>
                      <Select.Option value="Major">Major</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="Minor">Minor</Select.Option>
                    </Select>

                    <Typography.Text strong>Required Documents</Typography.Text>
                    <Table 
                      pagination={false}
                      bordered
                      columns={[
                        {title: 'Document Name', dataIndex: 'DocumentName'},
                        {title: 'File', dataIndex: 'File'}
                      ]}
                      dataSource={[
                        { 
                          key: '1', 
                          DocumentName: 'BIA', 
                          File: !["", "[]"].includes(RequestData?.BIA) ? <Typography.Link href={`https://salicapi.com/File/${RequestData?.BIA}`} target='_blank'>{RequestData?.BIA}</Typography.Link> : " - "
                        },
                        { 
                          key: '2', 
                          DocumentName: 'Signed Change request', 
                          File: !["", "[]"].includes(RequestData?.SCR) ? <Typography.Link href={`https://salicapi.com/File/${RequestData?.SCR}`} target='_blank'>{RequestData?.SCR}</Typography.Link> : " - "
                        },
                        { 
                          key: '3', 
                          DocumentName: 'configuration Document', 
                          File: <CustomAntdFileUploder FileType="conf_file" GetFilesList={(files: any) => setCONFFiles(files)} />
                        },
                        { 
                          key: '4', 
                          DocumentName: 'UAT', 
                          File: <CustomAntdFileUploder FileType="uat_file" GetFilesList={(files: any) => setUATiles(files)} />
                        },
                        { 
                          key: '5', 
                          DocumentName: 'User Guide', 
                          File: <CustomAntdFileUploder FileType="user_guide_file" GetFilesList={(files: any) => setUGFiles(files)} />
                        },
                      ]}
                    />
                  </>
                ) : null
              }


              <Upload
                action="https://salicapi.com/api/uploader/up"
                fileList={fileList}
                onChange={({ fileList: newFileList }: any) => setFileList(newFileList)}
              >
                <Button type='dashed' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
              </Upload>
            </Space>
          </Modal>
      }
    </>
  )
}

export default CloseAction