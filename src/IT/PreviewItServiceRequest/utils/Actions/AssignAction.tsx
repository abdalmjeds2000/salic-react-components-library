import * as React from 'react';
import { Button, message, Modal, Select, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';


function AssignAction({ Email, RequestId, EmployeesList, handelAfterAction, openModal, onCancel }: any) {
  const [selectedEmp, setSelectedEmp] = React.useState(null);
  const [isShowing, setIsShowing] = React.useState(true);

  const assignAction = async () => {
    if(selectedEmp) {
      const payload = {
        Email: Email,
        ToUser: selectedEmp,
        ByUser: Email,
        ServiceRequestId: RequestId
      };
      await fetch(`https://salicapi.com/api/tracking/Assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      message.success("Service request has assigned");
      if(handelAfterAction) handelAfterAction();
      setIsShowing(false);
      setSelectedEmp(null);
      onCancel();
    } else {
      message.error("Select Employee First!")
    }
  }

  return (
    <>
      {isShowing && 
        <Modal 
          title={<><SendOutlined /> Assign Service Request</>}
          open={openModal} 
          onCancel={onCancel}
          footer={[
            <Button type='primary' onClick={assignAction}>
              Assign
            </Button>,
            <Button onClick={onCancel}>
              Cancel
            </Button>,
          ]}
        >
          <Typography.Text strong>Select Employee</Typography.Text>
          <Select value={selectedEmp} size="large" placeholder="Select Employee" onChange={value => setSelectedEmp(value)} style={{width: '100%'}}>
            {
              EmployeesList?.map((emp:any, i:number) => {
                return <Select.Option value={emp.Mail} key={i}>{emp.DisplayName}</Select.Option>
              })
            }
          </Select>
        </Modal>
      }
    </>
  )
}

export default AssignAction