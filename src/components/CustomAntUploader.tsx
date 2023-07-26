import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


interface CustomAntUploaderProps {
  fileList: any[];
  GetFilesList: (fileList: any[]) => void;
  endpoint: string;
  buttonText?: string;
}

export const FilesUploader = (props: CustomAntUploaderProps) => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };


  return (
    <div>
      <Upload
        action={props.endpoint}
        listType="picture-card"
        fileList={props.fileList}
        onPreview={handlePreview}
        onChange={ ({ fileList }) => props.GetFilesList(fileList) }
      >
        {props.fileList?.length >= 15 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{props.buttonText || "Upload"}</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  )
}

