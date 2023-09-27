import * as React from 'react';
import { Tag } from 'antd';
import { FileIcon } from './FileIcon';

const contentStyle: any = {
  backgroundColor: '#fff',
  borderRadius: '5px',
  margin: '10px 0',
  fontWeight: 400,
  fontSize: '1.1rem',
  whiteSpace: "pre-line",
  overflowX: "auto",
};
const replyAttachmentContainer = {
  padding: "5px 10px",
  backgroundColor: "#f5f5f5",
  borderTop: "1px solid #e4e4e4",
  marginTop: "10px",
}

type Props = {
  Title?: string | React.ReactNode,
  Description?: string | React.ReactNode,
  IsReason?: boolean,
  RequestStatus?: "Approved" | "Rejected",
  children?: any,
  Files?: any | [] | null | undefined,
  Footer?: any
}

export const Reply = (props: Props) => {
  return (
    <div className="reply-container">
      <h3 style={{fontSize: '1.2rem'}}>{props.Title}</h3>
      <time style={{fontSize: '0.9rem'}}>{props.Description}</time>

      <div className="reply-content" style={contentStyle}>
        {
          props.IsReason && props.RequestStatus === "Rejected"
          ? <div style={{display: 'block'}}><Tag color="rgb(255, 39, 43)">Rejection Reason</Tag></div>
          : props.IsReason && props.RequestStatus === "Approved"
          ? <div style={{display: 'block'}}><Tag color="#277c62">Approved Note</Tag></div>
          : null
        }
        <div style={{padding: 15}}>
          {props.children}
        </div>
        {
          props.Files != undefined && props?.Files?.length > 0
          ? <div style={replyAttachmentContainer}>
              {props.Files.map((file: any, i: number) => (
                <FileIcon
                  key={i} 
                  FileName={file.fileName}
                  FilePath={file.filePath}
                  FileType={file.fileType}
                  IconWidth='30px'
                />
              ))}
            </div>
          : null
        }
      </div>

      {props.Footer ? <div style={{marginTop: '15px'}}>
        {props.Footer}
      </div> : null}
    </div>
  )
}
