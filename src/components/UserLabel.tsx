import * as React from 'react';
import { Avatar, Image, Typography } from 'antd';
import { useAppConfig } from '../ConfigProvider';


export const UserLabel = (props: { Mail: string, DisplayName: string, NameDescription?: string }) => {
  const { apiUrl, filesUrl, tenantUrl } = useAppConfig();

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '7px', }}>
      {props.Mail && props.Mail.length > 0 && 
        <Avatar
          style={{minWidth: 32}}
          src={
            <Image
              src={`${apiUrl}/user/photo?id=${props.Mail}`}
              preview={{src: `${apiUrl}/user/photo?id=${props.Mail}`,}}
              onError={e => e.currentTarget.src = `${filesUrl}/7961d7c4-decf-42aa-8010-4a34d4178970.png`}
            />
          }
        />}
      {props.DisplayName && props.DisplayName.length > 0 && 
        <Typography.Link 
          href={`${tenantUrl}/_layouts/15/me.aspx/?p=${props.Mail}&v=work`} 
          target='_blank'
          style={{ lineHeight: "1.2" }}
        >
          {props.DisplayName || ' - '}
          {props.NameDescription && <div>{props.NameDescription}</div> }
        </Typography.Link>}
    </div>
  )
}
