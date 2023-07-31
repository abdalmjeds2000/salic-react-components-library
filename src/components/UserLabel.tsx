import * as React from 'react';
import { Avatar, Image, Typography } from 'antd';


const UserLabel = (props: { Mail: string, DisplayName: string, NameDescription?: string }) => {

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '7px', }}>
      {props.Mail && props.Mail.length > 0 && 
        <Avatar
          style={{minWidth: 32}}
          src={
            <Image
              src={`https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=s&username=${props.Mail}`}
              preview={{src: `https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=L&username=${props.Mail}`,}}
            />
          }
        />}
      {props.DisplayName && props.DisplayName.length > 0 && 
        <Typography.Link 
          href={`https://salic.sharepoint.com/_layouts/15/me.aspx/?p=${props.Mail}&v=work`} 
          target='_blank'
          style={{ lineHeight: "1.2" }}
        >
          {props.DisplayName || ' - '}
          {props.NameDescription && <div>{props.NameDescription}</div> }
        </Typography.Link>}
    </div>
  )
}

export default UserLabel