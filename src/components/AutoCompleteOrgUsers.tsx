import * as React from 'react';
import { Avatar, Image, Select, SelectProps } from 'antd';
import { apiLink } from '../index';

const fetchUsers = async (value: string) => {
  try {
    const response = await fetch(`${apiLink}/User/AutoComplete?term=${value}&_type=query&q=${value}&_=1667805757891`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

const OptionCard = ({ DisplayName, Email }: any) => {

  return(
    <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Avatar
        size='small'
        src={
          <Image
            src={`https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=S&username=${Email}`}
            preview={{src: `https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=L&username=${Email}`,}}
          />
        }
      />
      <div>
        <span>{DisplayName}</span>
      </div>
    </div>
  )
}

type Props = {
  valueRender?: 'mail' | 'displayName';
} & SelectProps<any>;

export const AutoCompleteOrgUsers = (props: Props) => {
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState();

  const fetch = async (value: string) => {
    if(value.length >= 3) {
      const response: any = await fetchUsers(value);
      const values = response?.Data?.value;
      const selectOptions = values?.map((value: any) => ({
        value: props.valueRender === "mail" ? value.mail : props.valueRender === "displayName" ? value.displayName : value.mail, 
        label: <OptionCard DisplayName={value.displayName} Email={value.mail} />
      }));
      setOptions(selectOptions);
    }
  };

  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue);
    } else {
      setOptions([]);
    }
  };

  const debounce = (func: any, wait: number) => {
    let timeout: any;
    return function executedFunction(...args: any) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  const debounceOnSearch = debounce((value: string) => {
    handleSearch(value);
  }, 1000);


  return (
    <Select
      showSearch
      value={value}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={debounceOnSearch}
      onChange={newValue => {setValue(newValue); console.log(newValue);}}
      style={{ width: '100%' }}
      options={options}
      {...props}
    />
  )
}