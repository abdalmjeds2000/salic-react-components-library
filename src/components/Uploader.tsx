import * as React from 'react';
import { Button, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

// Utility function to upload a file to a specified action URL
const uploadPastedImage = (action: string, clipboardData: any) => {
  const item = clipboardData.items[0];
  if (item.type.indexOf('image') === 0) {
    const blob = item.getAsFile();
    const formData = new FormData();
    formData.append('file', blob);
    return fetch(action, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        return {
          success: true,
          fileObj: {
            uid: data.uploadedFiles[0].Name,
            name: data.uploadedFiles[0].OriginalName,
            status: 'done',
            response: data,
            url: data.uploadedFiles[0].Path,
          },
        };
      })
      .catch((error) => {
        console.error('Upload error:', error);
        return { success: false, error };
      });
  } else {
    return Promise.resolve({ success: false, error: 'Not an image' });
  }
};


interface UploaderProps {
  onChange: (fileList: any[]) => void;
  action: string;
  allowPasteImages?: boolean;
  mode?: "button" | "card";
}

export const Uploader = ({ onChange, action, allowPasteImages, mode="button" }: UploaderProps) => {
  const [filesList, setFilesList] = React.useState<any[]>([]);
  
  const handlePaste = (pasteEvent: any) => {
    uploadPastedImage(action, pasteEvent.clipboardData)
      .then(({ success, fileObj, error }: any) => {
        if (success) {
          setFilesList((prev):any => {
            return [...prev, fileObj];
          });
        } else {
          console.error('Upload error:', error);
        }
      });
  };

  React.useEffect(() => {
    if (allowPasteImages) {
      document.addEventListener('paste', handlePaste);
      return () => {
        document.removeEventListener('paste', handlePaste);
      };
    }
  }, [allowPasteImages]);

  React.useEffect(() => {
    onChange(filesList);
  }, [filesList]);


  return (
    <div>
      <Upload
        listType={mode==="card" ? "picture-card" : "text"}
        fileList={filesList}
        onChange={({ fileList }) => {
          setFilesList(fileList);
        }}
        action={action}
      >
        {mode==="card" ? uploadButton : <Button icon={<UploadOutlined />}>Attach Files</Button>}
      </Upload>
    </div>
  )
}

