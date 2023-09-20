import * as React from 'react';
import { Avatar, Image, Select, SelectProps } from 'antd';
import { useAppConfig } from '../index';



const OptionCard = ({ DisplayName, Email }: any) => {
  const { apiUrl, filesUrl } = useAppConfig();
  
  return(
    <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Avatar
        size='small'
        src={
          <Image
            src={`${apiUrl}/user/photo?id=${Email}`}
            preview={{src: `${apiUrl}/user/photo?id=${Email}`,}}
            onError={e => e.currentTarget.src = `${filesUrl}/7961d7c4-decf-42aa-8010-4a34d4178970.png`}
            title={Email}
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
  const { apiUrl } = useAppConfig();

  const fetchUsers = async (value: string) => {
    try {
      const response = await fetch(`${apiUrl}/User/AutoComplete?term=${value}&_type=query&q=${value}&_=1667805757891`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

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