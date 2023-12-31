import * as React from 'react';
import { Avatar, Button, Descriptions, Form, Image, Steps, Timeline, Typography, message } from 'antd';
import moment from 'moment';
import { CaretRightOutlined, CloseOutlined, MoreOutlined } from '@ant-design/icons';
import { GetFormDataOracle, GetFormDataSharedEmail, GetFormDataUSB, GetFormDataDMS, GetFormDataPhone, GetFormDataSoftwareLic, GetFormDataNewAccount, GetFormDataGLAccount, GetFormDataCreateGroupemail, GetFormDataAddUserstoAGroup, GetFormDataChangeLineManager, GetFormDataChangeJobTitle, GetFormDataMASAR, GetFormDataNewEmailAccount, GetFormDataInstallProgramTool, GetFormDataBackupRestore, GetFormDataGlobalAdminAccess, GetFormDataVPNAccess, GetFormDataResendESignInvitation, GetFormDataRemoveUsersFromAGroup } from './utils/RequestTabels';
import { Reply } from '../../components/Reply';
import { ToggleButton } from '../../components/ToggleButton';
import { Section } from '../../components/Section';
import { FileIcon, useAppConfig } from '../../index';
import ReplyForm from './utils/ReplyForm';
import UpdateRequestForm from './utils/UpdateRequestForm';
import ActionsDropdown from './utils/ActionsDropdown';
import { Loader } from "../../index";
import "./styles.it.css";
import { HappyFace, NeutralFace, SadFace, SmilingFace, VeryHappyFace } from "./utils/faces-icons";


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
  const { apiUrl, filesUrl } = useAppConfig();

  return (
    <Avatar
      style={{marginRight: 8}}
      src={
        <Image
          src={`${apiUrl}/user/photo?id=${email}`}
          preview={{src: `${apiUrl}/user/photo?id=${email}`,}}
          onError={e => e.currentTarget.src = `${filesUrl}/7961d7c4-decf-42aa-8010-4a34d4178970.png`}
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
  organizationUsers?: { email: string, displayname: string }[];
  handleAfterDeleteRequest?: () => void;
}
type activeUploaderAreaTypes = "reply" | "close" | "bia" | "scr" | null;



export const PreviewItSRComponent = ({ TicketId, Email, IsAdmin, IssueTypes, organizationUsers, handleAfterDeleteRequest }: Props) => {
  const [requestData, setRequestData] = React.useState<any>({});
  const [loading, setLoading] = React.useState<any>(true);
  const [fileList, setFileList] = React.useState<any>([]);
  const [imageViewData, setImageViewData] = React.useState<any>({ src: null, visible: false });
  const [replyForm] = Form.useForm();
  const { apiUrl, filesUrl, tenantUrl } = useAppConfig();
  
  var requester = requestData?.Requester;
  var onbehalf = requestData?.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }

  // fetch ticket information
  async function GetRequest() {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/Tracking/GetById?Email=${Email}&Id=${TicketId}`);
      const data = await response.json();
      document.title = `.:: Gate | ${data.Data.Subject} ::.`;
      setRequestData(data.Data);
    } catch (error) {
      message.error('Failed load ticket');
    } finally {
      setLoading(false);
    }
  }
  
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
      await fetch(`${apiUrl}/tracking/AddComment`, {
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
    const replacedText = text.replace(/@{display: (.*?), id: (.*?)}/g, `<a target="_blank" href="${tenantUrl}/_layouts/15/me.aspx/?p=$2&v=work">@$1</a>`);
    return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
  }


  
  // disable on (one of ticket data is empty)
  const isFormIncompleted = !requestData?.Category || !requestData?.IssueType || !requestData?.Priority || !requestData?.RequestType;
  // Get Pending Assignee based on current user
  let pendingApprover: any = null;
  if(Object.keys(requestData).length > 0) {
    requestData?.referingHistory?.forEach((row: any) => {
      if(requestData?.Status !== "CLOSED" && row?.Action === "APPROVE" && row?.Response === "PENDING" && row?.ToUser?.Mail?.toLowerCase() === Email?.toLowerCase()) {
        pendingApprover = row;
      }
    })
  }
  // is allow user to reply (if form is incompleted => just allow requester and pending approver to reply)
  const isAllowReply = (requestData?.Status !== "CLOSED" && (!isFormIncompleted || pendingApprover?.ToUser?.Mail?.toLowerCase() === Email?.toLowerCase() || requestData?.Requester?.Mail?.toLowerCase() === Email?.toLowerCase()));
  // is allow user to (assign, close, cancel) based on form is incompleted
  const isAllowActions = !isFormIncompleted;


  let biafile;
  if(requestData?.BIA) {
    biafile=JSON.parse(requestData?.BIA?.Body)
  }
  let scrfile;
  if(requestData?.SCR) {
    scrfile=JSON.parse(requestData?.SCR?.Body)
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
  }, [requestData]);
  

  if (Object.keys(requestData)?.length === 0) {
    return <Loader />;
  }
  return (
    <div className='preview-request-container'>
      <div className="header">
        <Typography.Title>IT SR: [#{requestData?.Id || '###'}]</Typography.Title>
        {Object.keys(requestData).length > 0 && <div>
          <ActionsDropdown 
            Email={Email} 
            requestData={requestData} 
            GetRequest={GetRequest} 
            IsAdmin={IsAdmin} 
            IsAllowAssignCloseCancel={isAllowActions}
            handleAfterDeleteRequest={handleAfterDeleteRequest} />
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
                Title={requestData?.Subject}
                Description={<><Typography.Link href={`${tenantUrl}/_layouts/15/me.aspx/?p=${requester?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData?.Requester?.DisplayName}</Typography.Link> (Ext: {requestData.Requester?.Ext}) {requestData.OnBehalfOf && <><Typography.Text type="danger" strong>on behalf of</Typography.Text> <a href={`${tenantUrl}/_layouts/15/me.aspx/?p=${requestData?.OnBehalfOf?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData?.OnBehalfOf?.DisplayName}</a></>} @ {moment(requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}</>} 
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
                      : requestData.IssueType === "Remove Users from A Group"
                        ? <GetFormDataRemoveUsersFromAGroup request={requestData} />
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
                      : requestData.IssueType === "VPN Access"
                        ? <GetFormDataVPNAccess request={requestData} />
                      : requestData.IssueType === "Invite User To Sign Document"
                        ? <GetFormDataResendESignInvitation request={requestData} />
                        : null
                    ) : null
                  }
                </div>
                <div style={{fontSize: '1rem'}} dangerouslySetInnerHTML={{__html: requestData?.Description}}></div>
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
                      filePath: `${filesUrl}/${file?.File}`
                    })
                  })
                }
                const text = JSON.parse(reply.Body).Body;
                const processedText = processTextWithLink(text);
                const isCancelledReply = requestData?.Status === "CANCELLED" && i === requestData?.Conversation?.length-1;
                return (
                  <Timeline.Item 
                    key={i} 
                    dot={<UserImage email={reply.CreatedBy?.Mail} />} 
                    className={
                      isCancelledReply ? "danger-reply" :
                      (reply.CreatedBy?.Mail?.toLowerCase() === Email?.toLowerCase()) ? "my-reply" : ""
                    }
                  >
                    <Reply 
                      Title={<a href={`${tenantUrl}/_layouts/15/me.aspx/?p=${reply.CreatedBy?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{reply.CreatedBy?.DisplayName}</a>} 
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
              <Timeline.Item dot={<UserImage email={requestData.ClosedBy?.Mail} />} className={requestData?.referingHistory?.filter((action: any) => action.Action==="APPROVE"&&action.Response==="REJECTED")?.length>0 ? "danger-reply" : "close-reply"}>
                <Reply
                  Title={<a href={`${tenantUrl}/_layouts/15/me.aspx/?p=${requestData.ClosedBy?.Mail}`} target="_blank" style={{color:"var(--main-color)"}} rel="noreferrer">{requestData.ClosedBy?.DisplayName}</a>}
                  Description={`(Ext: ${requestData?.ClosedBy?.Ext}) ${moment(requestData?.UpdatedAt || requestData?.CreatedAt).format('MM/DD/YYYY hh:mm:ss')}`} 
                  Files={
                    (typeof JSON.parse(requestData.CloseReason).Attachment != 'undefined' && Object.keys(JSON.parse(requestData.CloseReason).Attachment).length != 0)
                    ? JSON.parse(requestData.CloseReason).Attachment.map((file: any) => ({
                        fileType: file.File.split(".")[file.File.split(".").length-1],
                        fileName: file.OriginalFile,
                        filePath: `${filesUrl}/${file.File}`
                      }))
                    : []
                  }
                >
                  <div dangerouslySetInnerHTML={{ __html: processTextWithLink(JSON.parse(requestData.CloseReason)?.Body) }} />
                  {
                    (JSON.parse(requestData.CloseReason).CRFiles && typeof JSON.parse(requestData.CloseReason).CRFiles != 'undefined' && Object.keys(JSON.parse(requestData.CloseReason).CRFiles).length != 0)
                    ? (
                      <Descriptions bordered size='small' style={{marginTop: 10}} column={{ xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }} >
                        {
                          biafile
                          &&
                          <Descriptions.Item label="BIA File">
                            <Typography.Link href={biafile?.Path} target='_blank'>{biafile?.OriginalName}</Typography.Link>
                          </Descriptions.Item>
                        }
                        {
                          scrfile
                          &&
                          <Descriptions.Item label="Signed Change File">
                            <Typography.Link href={scrfile?.Path} target='_blank'>{scrfile?.OriginalName}</Typography.Link>
                          </Descriptions.Item>
                        }
                        {
                          JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "conf_file")?.[0]?.Name
                          &&
                          <Descriptions.Item label="Configuration Document">
                            <Typography.Link
                              href={`${filesUrl}/${JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "conf_file")?.[0]?.Name}`}
                              target='_blank'
                              rel="noreferrer"
                            >
                              {JSON.parse(JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "conf_file")?.[0]?.File?.Body)?.OriginalName}
                            </Typography.Link>
                          </Descriptions.Item>
                        }
                        {
                          JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "uat_file")?.[0]?.Name
                          &&
                          <Descriptions.Item label="UAT File">
                            <Typography.Link
                              href={`${filesUrl}/${JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "uat_file")?.[0]?.Name}`}
                              target='_blank'
                              rel="noreferrer"
                            >
                              {JSON.parse(JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "uat_file")?.[0]?.File?.Body)?.OriginalName}
                            </Typography.Link>
                          </Descriptions.Item>
                        }
                        {
                          JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "user_guide_file")?.[0]?.Name
                          &&
                          <Descriptions.Item label="User Guide File">
                            <Typography.Link
                              href={`${filesUrl}/${JSON.parse(requestData.CloseReason)?.CRFiles.filter((file: any) => file.Type === "user_guide_file")?.[0]?.Name}`}
                              target='_blank'
                              rel="noreferrer"
                            >
                              {JSON.parse(JSON.parse(requestData.CloseReason || "{}")?.CRFiles?.filter((file: any) => file.Type === "user_guide_file")?.[0]?.File?.Body)?.OriginalName}
                            </Typography.Link>
                          </Descriptions.Item>
                        }
                      </Descriptions>
                    )
                    : null
                  }
                </Reply>
              </Timeline.Item>
            }
            {
              !["CLOSED", "CANCELLED"].includes(requestData?.Status) &&
              <Timeline.Item dot={<UserImage email={Email} />} className='add-reply'>
                <ReplyForm
                  // fileList={fileList}
                  setFileList={setFileList}
                  replyForm={replyForm}
                  btnLoader={loading}
                  onFinish={AddReply}
                  isDisable={!isAllowReply}
                  usersList={organizationUsers || []}
                />
              </Timeline.Item>
            }
            {
              requestData.Status === "CLOSED" && requestData?.Rate && (
                <Timeline.Item dot={<UserImage email={requester?.Mail} />} className="extra-card">
                  <Typography.Title level={4} style={{margin: 0, marginBottom: 15}}>Requester Feedback: {requestData?.Rate?.Rate || 5}/5</Typography.Title>
                  <div style={{ maxWidth: 500, display:"flex", gap: 12, flexWrap: "wrap", justifyContent: "center", margin: "10px auto" }}>
                    <span style={{fill: requestData?.Rate?.Rate === 1 ? "#D33535" : "#c5c5c5" }}>{SadFace}</span>
                    <span style={{fill: requestData?.Rate?.Rate === 2 ? "#DF7A11" : "#c5c5c5" }}>{NeutralFace}</span>
                    <span style={{fill: requestData?.Rate?.Rate === 3 ? "#F7B801" : "#c5c5c5" }}>{SmilingFace}</span>
                    <span style={{fill: requestData?.Rate?.Rate === 4 ? "#339BD6" : "#c5c5c5" }}>{HappyFace}</span>
                    <span style={{fill: requestData?.Rate?.Rate === 5 || !requestData?.Rate?.Rate ? "#2A7C62" : "#c5c5c5" }}>{VeryHappyFace}</span>
                  </div>
                  <Descriptions bordered size='small' layout='vertical'>
                    {
                      requestData?.Rate?.Comment
                      ? <Descriptions.Item label="Comment" span={24} style={{ whiteSpace: "break-spaces" }}>{requestData?.Rate?.Comment}</Descriptions.Item>
                      : null
                    }
                  </Descriptions>
                </Timeline.Item>
              )
            }
          </Timeline>
        </div>

        <div className='properties' ref={propertiesSectionRef}>
        <div className="mobile-overlay" onClick={handleShowDetails} />
          <div className="properties-container">
            <Button type="default" shape='circle' onClick={handleShowDetails} className="close-btn">
              <CloseOutlined />
            </Button>
            <UpdateRequestForm 
              IsAdmin={IsAdmin} 
              RequestData={requestData} 
              IssueTypes={IssueTypes || []} 
              onFinish={GetRequest}
            />
            <Section SectionTitle="Attached Files">
              <div className='attachments-container'>
                {requestData?.Files?.map((file:any, i:number) => (
                  <Typography.Link target='_blank' href={`${filesUrl}/${file.Guid}`} style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 5 }} rel="noreferrer">
                    <FileIcon
                      key={i} 
                      FileType={file.FileName.split(".")[file.FileName.split(".").length-1]}
                      FileName={file.FileName}
                      FilePath={`${filesUrl}/${file.Guid}`}
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
                    subTitle={requestData?.UpdatedAt ? `at ${new Date(requestData?.UpdatedAt).toLocaleString()}` : null} 
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



const PreviewItSRContext = React.createContext<any>(null);

export const PreviewItServiceRequest = (props: Props) => {
  // "activeUploaderArea" is used to know which uploader area is active (reply, close, bia, scr)
  const [activeUploaderArea, setActiveUploaderArea] = React.useState<activeUploaderAreaTypes>("reply");

  const updateActiveUploaderArea = (area: activeUploaderAreaTypes) => {
    setActiveUploaderArea(area || "reply"); // if area is null, set it to "reply"
  }

  const contextObj = {
    activeUploaderArea,
    updateActiveUploaderArea
  }
  return (
    <PreviewItSRContext.Provider value={contextObj}>
      <PreviewItSRComponent {...props} />
    </PreviewItSRContext.Provider>
  )
}

export const usePreviewItSRContext = () => React.useContext(PreviewItSRContext);
