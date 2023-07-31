import * as React from "react";
import { Divider } from "antd";


type Props = {
  SectionTitle?: string,
  children?: any,
  className?: string,
  [x:string]: any
}

const Section = (props: Props) => {
  const AssigneeRecordsStyle: any = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }
  return (
    <div>
      <Divider orientation="left" orientationMargin="0" className={props.className} {...props}>
        {props.SectionTitle}
      </Divider>
      <div style={AssigneeRecordsStyle}>
        {props.children}
      </div>
    </div>
  )
}

export default Section