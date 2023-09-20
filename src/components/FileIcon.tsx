import * as React from "react";
import { Tooltip } from "antd";
import { useAppConfig } from "../ConfigProvider";




type Props = {
  FileName: string,
  FilePath: string,
  FileType?: string,
  IconWidth: string,
}



export const FileIcon = (props: Props) => {
  const { filesUrl } = useAppConfig();

  const checkFileType = (fileType: string) => {
    if(['jpg', 'jpeg', 'tif', 'tiff', 'bmp', 'png', 'gif', 'raw'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/af81bb2a-ab3a-4148-92b7-aa26dbc25cae.png"
    } else if(['mp4', 'mp3', 'webm', 'mkv', 'avi', 'mpeg'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/528b54e2-f8b1-4049-aa35-ee0bc45035a4.png"
    } else if(['pdf'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/42834c8f-29e9-4253-a6cf-c5a7ef4bd36d.png"
    } else if(['txt'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/b53ef416-76bc-4617-9f9a-e487790baa98.png"
    } else if(['zip', 'rar'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/200d0fde-800e-41a0-8ea8-8cdd92e025dd.png"
    } else if(['docx', 'doc'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/fac2897f-435a-4009-b30f-d4a02bfce7b7.png"
    } else if(['pptx', 'ppt'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/8f72ee4f-c6e7-478b-b257-1c67d91a2ade.png"
    } else if(['xlsx', 'xls', 'sheet', 'csv'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/83186e27-19b4-4179-b46d-e89552fb292a.png"
    } else if(['php'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/075f9956-c5b2-4f32-bafb-3d6a190d54f2.png"
    } else if(['js', 'jsx'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/0a932b5a-8134-43bf-9f82-5437843ce2f9.png"
    } else if(['css'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/b8e3d88e-6028-4632-8154-3af390eb00be.png"
    } else if(['folder'].includes(fileType?.toLowerCase())) {
      return filesUrl+"/8f30b265-e369-4c06-b176-d93de7353c08.png"
    } else {
      return filesUrl+"/43561740-aa3c-4d59-a741-b82962cc862c.png"
    }
  }


  return (
    <Tooltip title={props.FileName}>
      <img 
        src={checkFileType(props.FileType ? props.FileType : '')}
        alt={props.FileName}
        data-originalName={props.FileName}
        data-guid={props.FilePath} 
        onClick={() => props.FilePath ? window.open(props.FilePath, "_blank") : null} 
        width={props.IconWidth}
        className='attachment-file-icon'
      />
    </Tooltip>
  )
}
