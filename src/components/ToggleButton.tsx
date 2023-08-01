import * as React from 'react';
import { Button, Tooltip, ButtonProps } from 'antd';


type Props = {
  icon: any,
  title: string,
  btnType?: ButtonProps['type'],
  btnSize?: ButtonProps['size'],
  callback: (toggle: boolean) => void,
}

export const ToggleButton = (props: Props) => {
  const [toggle, setToggle] = React.useState<boolean>(false);

  const handleClick = () => {
    setToggle((prev: boolean) => !prev);
    props.callback(toggle)
  }
  return (
    <Tooltip title={props.title} mouseEnterDelay={0.5}>
      <Button
        type={props.btnType ? props.btnType : 'primary'} 
        size={props.btnSize ? props.btnSize : 'middle'}
        /* shape='circle' */
        onClick={handleClick}
      >
        {props.icon}
      </Button>
    </Tooltip>
  )
}
