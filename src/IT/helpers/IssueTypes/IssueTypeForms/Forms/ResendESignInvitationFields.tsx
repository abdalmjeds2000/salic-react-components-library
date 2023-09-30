import React from "react";
import { Form, Select, FormInstance, Input } from "antd";
import { useAppConfig } from "../../../../../ConfigProvider";

type stateType = {
  loading: boolean;
  data: any;
};


function ResendESignInvitationFields({ form, currentUserEmail }: { form: FormInstance, currentUserEmail: string }) {
  const { apiUrl } = useAppConfig();
  const [invitationState, setInvitationState] = React.useState<stateType>({ loading: true, data: [] });
  const [usersState, setUsersState] = React.useState<stateType>({ loading: false, data: [] });

  const fetchInvitations = async () => {
    if (!currentUserEmail) return;
    try {
      const response = await fetch(`${apiUrl}/Signaturev3/GetUserDocumentsByEmail?Email=${currentUserEmail}`);
      const data = await response.json();
      setInvitationState({ loading: false, data: data?.Data || [] });
    } catch (error) {
      console.log("failed to fetch invitations");
    }
  }
  const fetchInvitationUsers = async (id: number | null | undefined) => {
    try {
      setUsersState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`${apiUrl}/Signaturev3/DocumentPendingInvitations?documentId=${id}`);
      const data = await response.json();
      setUsersState({ loading: false, data: data?.Data || [] });
    } catch (error) {
      console.log("failed to fetch invitations");
    }
  }
  const handleInvitationChange = (value: any) => {
    form.setFieldsValue({ 
      resendEsignInvitation_Subject: invitationState.data.find((invitation: any) => invitation.documentId === value)?.subject,
      resendEsignInvitation_Users: []
    });
    fetchInvitationUsers(value);
  }
  const handleUsersChange = (value: any) => {
    const selectedUsers = usersState.data.filter((user: any) => value.includes(user.EmailAddress));
    form.setFieldsValue({ 
      resendEsignInvitation_UsersList: selectedUsers
    });
  }
  
  React.useEffect(() => {
    fetchInvitations();
  }, []);



  return (
    <>
      <Form.Item name="resendEsignInvitation_Subject" hidden>
        <Input />
      </Form.Item>

      <Form.Item name="resendEsignInvitation_Id" label="Invitation" rules={[{ required: true, message: '' }]}>
        <Select
          placeholder="Select Invitation"
          onChange={handleInvitationChange}
          loading={invitationState.loading}
          disabled={invitationState.loading}
        >
          {
            invitationState.data.map((invitation: any) => {
              return <Select.Option key={invitation.documentId} value={invitation.documentId}>{invitation.subject}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
      
      <Form.Item name="resendEsignInvitation_Users" label="Users to re-invite" rules={[{ required: true, message: '' }]}>
        <Select 
          mode="multiple" 
          placeholder="Select users"
          onChange={handleUsersChange}
          loading={usersState.loading}
          disabled={usersState.loading}
        >
          {
            usersState.data.map((user: any) => {
              return <Select.Option key={user.Key} value={user.EmailAddress}>
                {(user.InviteeName && user.InviteeName?.trim()!=="") ? user.InviteeName : user.EmailAddress}
              </Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item name="resendEsignInvitation_UsersList" hidden>
        <Select />
      </Form.Item>
    </>
  );
}

export default ResendESignInvitationFields;
