import * as React from 'react';
import { Avatar, Button, Form, Image, Steps, Timeline, Typography, message } from 'antd';
import moment from 'moment';
import { CaretRightOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { GetFormDataOracle, GetFormDataSharedEmail, GetFormDataUSB, GetFormDataDMS, GetFormDataPhone, GetFormDataSoftwareLic, GetFormDataNewAccount, GetFormDataGLAccount, GetFormDataCreateGroupemail, GetFormDataAddUserstoAGroup, GetFormDataChangeLineManager, GetFormDataChangeJobTitle, GetFormDataMASAR, GetFormDataNewEmailAccount, GetFormDataInstallProgramTool, GetFormDataBackupRestore, GetFormDataGlobalAdminAccess } from './utils/RequestTabels';
import { Reply } from '../../components/Reply';
import { ToggleButton } from '../../components/ToggleButton';
import { Section } from '../../components/Section';
import { FileIcon } from '../../index';
import ReplyForm from './utils/ReplyForm';
import UpdateRequestForm from './utils/UpdateRequestForm';
import ActionsDropdown from './utils/ActionsDropdown';
import { Loader } from "../../index";
import "./styles.it.css";



const { Text } = Typography;
function isEmpty(obj: any) {
  for(var prop in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
      }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}
const UserImage = ({ email }: { email: string }) => {
  return (
    <Avatar
      style={{marginRight: 8}}
      src={
        <Image
          src={`https://salic.sharepoint.com/sites/Portal/_layouts/15/userphoto.aspx?size=s&username=${email}`}
          preview={{src: `https://salic.sharepoint.com/sites/Portal/_layouts/15/userphoto.aspx?size=L&username=${email}`,}}
          // src={`https://salicapi.com/File/7961d7c4-decf-42aa-8010-4a34d4178970.png`}
          title={email}
        />
      }
    />
  )
}
function processTextWithLink(text: string) {
  if (!text) return '';
  const linkRegex = /(https?:\/\/\S+)/g;
  const matches = text.match(linkRegex);
  if (matches) {
    matches.forEach((match: any) => {
      const link = `<a href="${match}" target="_blank">${match}</a>`;
      text = text.replace(match, link);
    });
  }
  return text;
}
function extractMentions(text: string) {
  const regex = /@{display:\s*(.*?),\s*id:\s*([^}\s]+)}/g;
  let match;
  const listOfMentions = [];
  while ((match = regex.exec(text)) !== null) {
    listOfMentions.push({ display: match[1], id: match[2] });
  }
  return listOfMentions.map(m => m.id);
}



type Props = {
  TicketId: string | number;
  Email: string;
  IsAdmin: boolean;
  IssueTypes: any[];
}

export const PreviewItServiceRequest = ({ TicketId, Email, IsAdmin, IssueTypes }: Props) => {
  const [requestData, setRequestData] = React.useState<any>({});
  const [loading, setLoading] = React.useState<any>(true);
  const [fileList, setFileList] = React.useState<any>([]);
  const [imageViewData, setImageViewData] = React.useState<any>({ src: null, visible: false });
  const [replyForm] = Form.useForm();
  
  var requester = requestData?.Requester;
  var onbehalf = requestData?.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }

  // fetch ticket information
  async function GetRequest() {
    try {
      setLoading(true);
      const response = await fetch(`https://salicapi.com/api/Tracking/GetById?Email=${Email}&Id=${TicketId}`);
      const data = await response.json();
      document.title = `.:: SALIC Gate | ${data.Data.Subject} ::.`;
      setRequestData(data.Data);
    } catch (error) {
      message.error('Failed load ticket');
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    if(TicketId) {
      GetRequest();
    }
  }, []);
  React.useEffect(() => {
    if(Object.keys(requestData).length > 0) {
      correctImgs();
    }
  }, [requestData])
  
  // post reply
  async function AddReply(formValues: any) {
    // check if there files is uploading...
    let isFilesFinishUpload = true;
    const attachmentsList = fileList.map((file: any) => {
      if(file?.status === "uploading") isFilesFinishUpload = false;
      return file?.response?.uploadedFiles[0]?.Name;
    });
    if(!isFilesFinishUpload) {
      message.error('Please wait until files finish uploading...');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        Email: Email,
        Files: attachmentsList?.join(','),
        ServiceRequestId: TicketId,
        ListOfMentions: extractMentions(formValues.reply_body),
        ...formValues
      };
      await fetch('https://salicapi.com/api/tracking/AddComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      replyForm.resetFields();
      setFileList([]);
      await GetRequest();
    } catch (error) {
      message.error('Failed to add reply');
    } finally {
      setLoading(false);
    }
  }

  // fix ticket images
  const correctImgs = () => {
    let imgs: any = document.getElementsByTagName("img");
    for (const element of imgs) {
      if(element.src.startsWith("cid")) {
        let name = element.src.split('@')[0].replace('cid:','');
        
        var deleteImgs: any = document.querySelectorAll('[data-originalName="'+name+'"]');
        let src: any = deleteImgs?.[0]?.getAttribute("data-guid");
        
        // delete parent of deleteImg
        for (const deleteImg of deleteImgs) {
          // deleteImg?.parentNode?.remove();
          const delEl = deleteImg?.parentNode as HTMLElement;
          delEl?.style.setProperty('display', 'none');
        }
        
        element.setAttribute('src', (src ?? ''));
        // on hover curser pointer
        element.style.cursor = "pointer";
        // scale image on hover
        element.style.transition = "transform 0.5s";
        element.onmouseover = function() {
          element.style.transform = "scale(1.03)";
        }
        element.onmouseout = function() {
          element.style.transform = "scale(1)";
        }
        // element on click to show image in Image Component
        element.onclick = function() {
          setImageViewData({ src: src, visible: true });
        }
      }
    }

    const x: any = document.getElementsByClassName("attachments-container")[0];
    let hideImages = 0;
    let imagesTotal = x.children.length;
    for (const element of x.children) {
      const el = element as HTMLElement;
      if(el.style.display === "none") {
        hideImages += 1;
      }
    }
    if(hideImages === imagesTotal) {
      x.innerHTML = "No attachments for this ticket"
    }
  }

  // Toggle Properties Section (show and hide in mobile size)
  const propertiesSectionRef = React.useRef<any>(null);
  const handleShowDetails = () => {
    if(propertiesSectionRef.current) {
      const el = propertiesSectionRef.current as HTMLElement;
      if(el.style.display === "block") {
        el.style.display = "none";
      } else {
        el.style.display = "block";
      }
    }
  }

  // to replace @mention with link
  function textComponent(text: string) {
    const replacedText = text.replace(/@{display: (.*?), id: (.*?)}/g, '<a target="_blank" href="https://salic.sharepoint.com/_layouts/15/me.aspx/?p=$2&v=work">@$1</a>');
    return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
  }

  if (Object.keys(requestData)?.length === 0) {
    return <Loader />;
  }
  return (
    <div className='preview-request-container'>
      <div className="header">
        <Typography.Title>IT RE: [#{requestData?.Id || '###'}]</Typography.Title>
        {Object.keys(requestData).length > 0 && <div>
          <ActionsDropdown Email={Email} requestData={requestData} GetRequest={GetRequest} IsAdmin={IsAdmin} />
          <span className='properties-toggle-btn'>
            <ToggleButton
              icon={<MoreOutlined />}
              title="more information"
              callback={handleShowDetails}
              btnType="default"
            />
          </span>
        </div>}
      </div>

      <div className='content'>
        <div className='timeline'>
          <Timeline>
            <Timeline.Item dot={<UserImage email={requester?.Mail} />} className='request-reply'>
              <Reply
                Title={<>RE: {requestData?.Subject}</>}
                Description={<><Typography.Link href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${requester?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData?.Requester?.DisplayName}</Typography.Link> (Ext: {requestData.Requester?.Ext}) {requestData.OnBehalfOf && <><Typography.Text type="danger" strong>on behalf of</Typography.Text> <a href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${requestData?.OnBehalfOf?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData?.OnBehalfOf?.DisplayName}</a></>} @ {moment(requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}</>} 
              >
                <div>
                  {
                    requestData.FormData != null && !isEmpty(requestData.FormData)
                    ? (
                      requestData.IssueType === "Oracle"
                        ? <GetFormDataOracle request={requestData} />
                      : requestData.IssueType === "Unlock USB"
                        ? <GetFormDataUSB request={requestData} />
                      : requestData.IssueType === "DMS"
                        ? <GetFormDataDMS request={requestData} />
                      : requestData.IssueType === "Phone Extensions"
                        ? <GetFormDataPhone request={requestData} />
                      : requestData.IssueType === "New Account"
                        ? <GetFormDataNewAccount request={requestData} />
                      : requestData.IssueType === "GL Account"
                        ? <GetFormDataGLAccount request={requestData} />
                      : requestData.IssueType === "Shared Email"
                        ? <GetFormDataSharedEmail request={requestData} />
                      : requestData.IssueType === "Software Subscription & Licenses"
                        ? <GetFormDataSoftwareLic request={requestData} />
                      : requestData.IssueType === "Create Group email"
                        ? <GetFormDataCreateGroupemail request={requestData} />
                      : requestData.IssueType === "Add Users to A Group"
                        ? <GetFormDataAddUserstoAGroup request={requestData} />
                      : requestData.IssueType === "Change Line Manager"
                        ? <GetFormDataChangeLineManager request={requestData} />
                      : requestData.IssueType === "Change Job Title"
                        ? <GetFormDataChangeJobTitle request={requestData} />
                      : requestData.IssueType === "MASAR"
                        ? <GetFormDataMASAR request={requestData} />
                      : requestData.IssueType === "New Email Account"
                        ? <GetFormDataNewEmailAccount request={requestData} />
                      : requestData.IssueType === "Install Program"
                        ? <GetFormDataInstallProgramTool request={requestData} />
                      : requestData.IssueType === "Backup Restore"
                        ? <GetFormDataBackupRestore request={requestData} />
                      : requestData.IssueType === "Global Admin Access Request"
                        ? <GetFormDataGlobalAdminAccess request={requestData} />
                        : null
                    ) : null
                  }
                </div>
                <div style={{fontSize: '1rem', padding: "0 10px 10px 10px"}} dangerouslySetInnerHTML={{__html: requestData?.Description}}></div>
              </Reply>
            </Timeline.Item>
            {
              requestData.Conversation?.map((reply:any, i:number) => {
                let files = JSON.parse(reply.Body).Attachment;
                let Attachments: any[] = [];
                if(typeof files != 'undefined' && Object.keys(files).length != 0) {
                  files?.forEach((file: any) => {
                    Attachments.push({
                      fileType: file?.File?.split(".")[(file?.File?.split(".")?.length||0)-1],
                      fileName: file.OriginalFile,
                      filePath: `https://salicapi.com/File/${file?.File}`
                    })
                  })
                }
                const text = JSON.parse(reply.Body).Body;
                const processedText = processTextWithLink(text);
                return (
                  <Timeline.Item key={i} dot={<UserImage email={reply.CreatedBy?.Mail} />} className={(reply.CreatedBy?.Mail?.toLowerCase() === Email?.toLowerCase()) ? "my-reply" : ""}>
                    <Reply 
                      Title={<a href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${reply.CreatedBy?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{reply.CreatedBy?.DisplayName}</a>} 
                      Description={`(Ext: ${reply.CreatedBy?.Ext}) ${new Date(reply.CreatedAt).toLocaleString()}`}
                      Files={Attachments}
                    >
                      {textComponent(processedText)}
                    </Reply>
                  </Timeline.Item>
                )
              })
            }
            {
              requestData.Status === "CLOSED" && requestData.CloseReason && 
              <Timeline.Item dot={<UserImage email={requestData.ClosedBy?.Mail} />} className='close-reply'>
                <Reply
                  Title={<a href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${requestData.ClosedBy?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData.ClosedBy?.DisplayName}</a>}
                  Description={`(Ext: ${requestData?.ClosedBy?.Ext}) ${moment(requestData?.UpdatedAt || requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}`} 
                  Files={
                    (typeof JSON.parse(requestData.CloseReason).Attachment != 'undefined' && Object.keys(JSON.parse(requestData.CloseReason).Attachment).length != 0)
                    ? JSON.parse(requestData.CloseReason).Attachment.map((file: any) => ({
                        fileType: file.File.split(".")[file.File.split(".").length-1],
                        fileName: file.OriginalFile,
                        filePath: `https://salicapi.com/File/${file.File}`
                      }))
                    : []
                  }
                >
                  {JSON.parse(requestData.CloseReason)?.Body}
                </Reply>
              </Timeline.Item>
            }
            {
              requestData?.Status != "CLOSED" &&
              <Timeline.Item dot={<UserImage email={Email} />} className='add-reply'>
                <ReplyForm
                  fileList={fileList}
                  setFileList={setFileList}
                  replyForm={replyForm}
                  btnLoader={loading}
                  onFinish={AddReply}
                />
              </Timeline.Item>
            }
          </Timeline>
        </div>

        <div className='properties' ref={propertiesSectionRef}>
        <div className="mobile-overlay" onClick={handleShowDetails} />
          <div className="properties-container">
            <Button type="default" shape='circle' onClick={handleShowDetails} className="close-btn">
              <CloseOutlined />
            </Button>
            <UpdateRequestForm IsAdmin={IsAdmin} RequestData={requestData} handleAfterUpdate={GetRequest} IssueTypes={IssueTypes || []} />
            <Section SectionTitle="Attached Files">
              <div className='attachments-container'>
                {requestData?.Files?.map((file:any, i:number) => (
                  <Typography.Link target='_blank' href={`https://salicapi.com/File/${file.Guid}`} style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 5 }} rel="noreferrer">
                    <FileIcon
                      key={i} 
                      FileType={file.FileName.split(".")[file.FileName.split(".").length-1]}
                      FileName={file.FileName}
                      FilePath={`https://salicapi.com/File/${file.Guid}`}
                      IconWidth='22px'
                    />
                    <Typography.Link style={{ color: '#555'}}>{file.FileName}</Typography.Link>
                  </Typography.Link>
                  )
                )}
                {
                  requestData?.Files?.length === 0
                  ? <Typography.Text>No attachments for this ticket</Typography.Text>
                  : null
                }
              </div>
            </Section>
            <Section SectionTitle="Assignee History">
              <Steps
                direction="vertical" size="small"  status="process" 
                current={requestData.Status == "CLOSED" ? requestData?.referingHistory.length+2 : requestData?.referingHistory.length}
              >
                <Steps.Step 
                  title={<><UserImage email={requestData?.Requester?.Mail} /> Submitted by <b>{requestData?.Requester?.DisplayName}</b></>} 
                  subTitle={`at ${new Date(requestData.CreatedAt).toLocaleString()}`} style={{paddingBottom: 15}}
                />
                {requestData?.referingHistory?.map((assignee:any, i:number) => {
                  let ruleName = '';
                  let waitApproveMsg = <></>;
                  if (assignee?.Rule && assignee?.Rule !== ''){
                    assignee.Rule = assignee?.Rule.replaceAll('\r\n', '');
                    ruleName = ` As "${JSON.parse(assignee?.Rule)?.Display}" `;
                  }
                  if (assignee?.Action === "APPROVE" && assignee?.Response === "PENDING"){
                    waitApproveMsg = <Typography.Text type='warning' strong>Waiting Approval</Typography.Text>;
                  }
                  return (
                    <Steps.Step 
                      key={i}
                      title={
                        <b>
                          <UserImage email={assignee.ToUser?.Mail} />
                          {assignee.ByUser?.DisplayName} 
                          <CaretRightOutlined />  
                          {assignee.ToUser?.DisplayName} 
                          {ruleName}
                          {waitApproveMsg}
                        </b>
                      } 
                      subTitle={<>at {new Date(assignee.CreatedAt).toLocaleString()}</>}
                      description={ 
                        assignee.Response === "APPROVED" 
                        ? <><Text strong type='success'>{assignee.Response}</Text> at {new Date(assignee.UpdatedAt).toLocaleString()}</> 
                        : assignee.Response === "REJECTED" 
                        ? <><Text strong type='danger'>{assignee.Response}</Text> at {new Date(assignee.UpdatedAt).toLocaleString()}</> 
                        : null
                      }
                      style={{paddingBottom: 15}}
                    />
                  )
                })}
                {requestData?.Status === "CLOSED" ? (
                  <Steps.Step 
                    title={<><UserImage email={requestData?.ClosedBy?.Mail} /> Closed By <b>{requestData?.ClosedBy?.DisplayName}</b></>} 
                    subTitle={`at ${new Date(requestData?.UpdatedAt).toLocaleString()}`} 
                    style={{paddingBottom: 15}}
                  /> ) : null}
              </Steps>
            </Section>
          </div>
        </div>
      </div>

      {/* Image Component for preview ticket images on click */}
      <Image
        width={200}
        style={{ display: 'none' }}
        src={imageViewData.src}
        preview={{
          visible: imageViewData.visible,
          scaleStep: 0.5,
          src: imageViewData.src,
          onVisibleChange: (value) => setImageViewData({ ...imageViewData, visible: value }),
        }}
      />
    </div>
  )
}
