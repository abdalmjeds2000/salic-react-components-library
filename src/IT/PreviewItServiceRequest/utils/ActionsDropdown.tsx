import * as React from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import { CheckOutlined, CloseCircleOutlined, CloseOutlined, DownOutlined, FileDoneOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons';
import { ApproveAction, RejectAction } from './Actions/ApproveAction';
import ReOpenAction from './Actions/ReOpenAction';
// import DeleteAction from './Actions/DeleteAction';
import AssignAction from './Actions/AssignAction';
import CloseAction from './Actions/CloseAction';
// import AskForApprovalAction from './Actions/AskForApprovalAction';
// import ReAssignApprovalAction from './Actions/ReAssignApprovalAction';
import CancelAction from './Actions/CancelAction';


type Props = {
  Email: string,
  requestData: any,
  GetRequest: () => void,
  IsAdmin: boolean,
  IsAllowAssignCloseCancel: boolean,
  handleAfterDeleteRequest?: () => void,
}



const initialmodalsStatuses = { reopen: false, delete: false, assign: false, close: false, askapproval: false, reassign: false, cancel: false, reject: false };

const ActionsDropdown = ({ Email, requestData, GetRequest, IsAdmin, IsAllowAssignCloseCancel/* , handleAfterDeleteRequest */ }: Props) => {
  const [modalsStatuses, setModalsStatuses] = React.useState<any>(initialmodalsStatuses);

  var requester = requestData.Requester;
  var onbehalf = requestData.OnBehalfOf;
  if (onbehalf != null){ requester = onbehalf; }
  let IfRequester = requester?.Mail?.toLowerCase() === Email?.toLowerCase();

  // Get Current Assignee for current user
  let pendingApprove: any = null;
  if(Object.keys(requestData).length > 0) {
    requestData?.referingHistory?.forEach((row: any) => {
      if(requestData?.Status !== "CLOSED" && row?.Action === "APPROVE" && row?.Response === "PENDING" && row?.ToUser?.Mail?.toLowerCase() === Email?.toLowerCase()) {
        pendingApprove = row;
      }
    })
  }

  let lastRefering: any = {};
  if(Object.keys(requestData).length > 0) {
    lastRefering = requestData?.referingHistory[requestData?.referingHistory?.length - 1];
  }

  const onClick = ({ key }: any) => {
    const newModalStatuses = { ...initialmodalsStatuses, [key]: true };
    setModalsStatuses(newModalStatuses);
  };
  const handleCloseModals = () => setModalsStatuses(initialmodalsStatuses);

  const items = [
    (pendingApprove !== null ? {
      key: 'approve',
      isModal: false,
      label: (
        <ApproveAction ActionId={pendingApprove?.Id} handelAfterAction={GetRequest}>
          <span>Approve</span>
        </ApproveAction>
      ),
      icon: <CheckOutlined />,
    } : null),
    (pendingApprove !== null ? {
      key: 'reject',
      danger: true,
      label: 'Reject',
      icon: <CloseCircleOutlined />,
    } : null),
    ((requestData.Status === "CLOSED" && IfRequester) ? {
      key: 'reopen',
      label: 'Re-Open',
      icon: <RetweetOutlined />,
    } : null),

    (IsAdmin && ((!["CLOSED", "Waiting For Approval", "CANCELLED"].includes(requestData?.Status)) || (requestData?.Status === "Waiting For Approval" && lastRefering?.Action === "APPROVE" && lastRefering?.Response === "APPROVED")) ? {
      key: 'assign',
      label: <Tooltip color="red" title={!IsAllowAssignCloseCancel ? 'Please Update Ticket Information' : null}>Assign</Tooltip>,
      icon: <SendOutlined />,
      disabled: !IsAllowAssignCloseCancel,
    } : null),
    (IsAdmin && (!["CLOSED", "Waiting For Approval", "CANCELLED"].includes(requestData?.Status)) ? {
      key: 'close',
      label: <Tooltip color="red" title={!IsAllowAssignCloseCancel ? 'Please Update Ticket Information' : null}>Close</Tooltip>,
      icon: <FileDoneOutlined />,
      danger: true,
      disabled: !IsAllowAssignCloseCancel,
    } : null),

    (Email === 'abdulmohsen.alaiban@salic.com' && !["CANCELLED", "CLOSED"].includes(requestData.Status) ? {
      key: 'cancel',
      label: <Tooltip color="red" title={!IsAllowAssignCloseCancel ? 'Please Update Ticket Information' : null}>Cancel</Tooltip>,
      danger: true,
      icon: <CloseOutlined />,
      disabled: !IsAllowAssignCloseCancel,
    } : null),

    // (Email === 'abdulmohsen.alaiban@salic.com' ? {
    //   key: 'delete',
    //   label: <Tooltip color="red" title={!IsAllowAssignCloseCancel ? 'Please Update Ticket Information' : null}>Delete</Tooltip>,
    //   danger: true,
    //   icon: <DeleteOutlined />,
    //   disabled: !IsAllowAssignCloseCancel,
    // } : null),

    
    // (IsAdmin && (!["CLOSED"].includes(requestData?.Status)) ? {
    //   key: 'askapproval',
    //   label: 'Ask For Approval',
    //   icon: <PullRequestOutlined />,
    // } : null),

    // (IsAdmin && ["Waiting For Approval"].includes(requestData?.Status) ? {
    //   key: 'reassign',
    //   label: 'Re-Assign Approval',
    //   icon: <FileSyncOutlined />,
    // } : null)
  ];

  return (
    <div>
      <Dropdown trigger={['click']} menu={{ items, onClick }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
        <Button>Actions <DownOutlined /></Button>
      </Dropdown>

      {
        pendingApprove !== null && (
          <RejectAction
            openModal={modalsStatuses.reject}
            onCancel={handleCloseModals} 
            ActionId={pendingApprove?.Id} 
            handelAfterAction={GetRequest} />
        )
      }

      {IsAdmin && ((!["CLOSED", "Waiting For Approval", "CANCELLED"].includes(requestData?.Status)) || (requestData?.Status === "Waiting For Approval" && lastRefering?.Action === "APPROVE" && lastRefering?.Response === "APPROVED")) &&
        <AssignAction
          Email={Email}
          openModal={modalsStatuses.assign}
          onCancel={handleCloseModals}
          EmployeesList={requestData.EmployeeList} 
          RequestId={requestData.Id} 
          handelAfterAction={GetRequest} 
        />
      }
      {IsAdmin && (!["CLOSED", "Waiting For Approval", "CANCELLED"].includes(requestData?.Status)) &&
        <CloseAction
          RequestData={requestData}
          Email={Email}
          openModal={modalsStatuses.close}
          onCancel={handleCloseModals}
          RequestId={requestData.Id} 
          handelAfterAction={GetRequest} 
        />
      }
      {/* {Email === 'abdulmohsen.alaiban@salic.com' ?
        <DeleteAction RequestId={requestData.Id} handelAfterAction={handleAfterDeleteRequest} openModal={modalsStatuses.delete} onCancel={handleCloseModals} /> : null}
       */}
      {Email === 'abdulmohsen.alaiban@salic.com' && !["CANCELLED", "CLOSED"].includes(requestData.Status) ?
        <CancelAction RequestId={requestData.Id} onFinish={GetRequest} Email={Email} openModal={modalsStatuses.cancel} onCancel={handleCloseModals} /> : null}

      {(requestData.Status === "CLOSED" && IfRequester) ? 
        <ReOpenAction Email={Email} RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.reopen} onCancel={handleCloseModals} /> : null}
      
      {/* {IsAdmin && (!["CLOSED"].includes(requestData?.Status)) ? 
        <AskForApprovalAction Email={Email} RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.askapproval} onCancel={handleCloseModals} /> : null}
      {IsAdmin && ["Waiting For Approval"].includes(requestData?.Status) ? 
        <ReAssignApprovalAction Email={Email} RequestId={requestData.Id} handelAfterAction={GetRequest} openModal={modalsStatuses.reassign} onCancel={handleCloseModals} /> : null} */}
    </div>
  )
}

export default ActionsDropdown