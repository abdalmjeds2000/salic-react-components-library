import React from "react";
import OracleFields from "./Forms/OracleFields";
import DMSFields from "./Forms/DMSFields";
import USBFields from "./Forms/USBFields";
import SoftwareFields from "./Forms/SoftwareFields";
import PhoneExtensionsFields from "./Forms/PhoneExtensionsFields";
import NewAccountFields from "./Forms/NewAccountFields";
import SharedEmailFields from "./Forms/SharedEmailFields";
import GLAccountFields from "./Forms/GLAccountFields";
import CreateGroupEmailFields from "./Forms/CreateGroupEmailFields";
import AddUserstoAGroupFields from "./Forms/AddUserstoAGroupFields";
import ChangeLineManagerFields from "./Forms/ChangeLineManagerFields";
import ChangeJobTitleFields from "./Forms/ChangeJobTitleFields";
import MASARFields from "./Forms/MASARFields";
import NewEmailAccountFields from "./Forms/NewEmailAccountFields";
import InstallProgramToolFields from "./Forms/InstallProgramToolFields";
import BackupRestoreFields from "./Forms/BackupRestoreFields";
import GlobalAdminAccessFields from "./Forms/GlobalAdminAccessFields";
import { Empty } from "antd";



function IssueTypeForms({ IssueType }: { IssueType: string }) {

  if (IssueType === "Oracle") {
    return <OracleFields />;
  } else if (IssueType === "DMS") {
    return <DMSFields />;
  } else if (IssueType === "Unlock USB") {
    return <USBFields />;
  } else if (IssueType === "Software Subscription & Licenses") {
    return <SoftwareFields />;
  } else if (IssueType === "Phone Extensions") {
    return <PhoneExtensionsFields />;
  } else if (IssueType === "New Account") {
    return <NewAccountFields />;
  } else if (IssueType === "Shared Email") {
    return <SharedEmailFields />;
  } else if (IssueType === "GL Account") {
    return <GLAccountFields />;
  } else if (IssueType === "Create Group email") {
    return <CreateGroupEmailFields />;
  } else if (IssueType === "Add Users to A Group") {
    return <AddUserstoAGroupFields />;
  } else if (IssueType === "Change Line Manager") {
    return <ChangeLineManagerFields />;
  } else if (IssueType === "Change Job Title") {
    return <ChangeJobTitleFields />;
  } else if (IssueType === "MASAR") {
    return <MASARFields />;
  } else if (IssueType === "New Email Account") {
    return <NewEmailAccountFields />;
  } else if (IssueType === "Install Program") {
    return <InstallProgramToolFields />;
  } else if (IssueType === "Backup Restore") {
    return <BackupRestoreFields />;
  } else if(IssueType === "Global Admin Access Request"){
    return <GlobalAdminAccessFields />;
  }
  return <div style={{textAlign: 'center'}}><Empty description="There is no form for this issue type yet." /></div>;
}

export default IssueTypeForms;
