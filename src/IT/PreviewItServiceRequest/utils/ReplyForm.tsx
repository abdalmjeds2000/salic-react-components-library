import * as React from 'react';
import { Button, Form, Image, message, Space, Tooltip } from 'antd';
import { Mention, MentionsInput } from 'react-mentions';
import mentionsInputStyle from './mentionsInputStyle';
import { apiLink, uploaderUrl, usePreviewItSRContext } from '../../../index';
import { Uploader } from '../../../components/Uploader';



type Porps = {
  isDisable?: boolean;
  // fileList?: any[];
  setFileList?: any;
  btnLoader?: boolean;
  onFinish?: (values: any) => void;
  replyForm?: any;
  usersList?: { email: string, displayname: string }[]
}

const ReplyForm = ({ usersList, isDisable, setFileList, btnLoader, onFinish, replyForm }: Porps) => {
  const [textboxVal, setTextboxVal] = React.useState('');
  const  { activeUploaderArea } = usePreviewItSRContext();

  // const controller = new AbortController();
  // const signal = controller.signal;

  var data = async function(query: any, callback: any) {
    if(query.length < 3) return;
    try {
      // let response = await fetch(`https://salicapi.com/api/User/AutoComplete?term=${query}&_type=query&q=${query}&_=1667805757891`, { signal: signal });
      // const data = await response.json();
      // const _usrs = data.Data.value.map((item: any) => ({ id: item.mail, display: item.displayName }))
      // callback(_usrs);

      // instead of fetching from api, we will use the usersList prop
      const _usrs = usersList?.filter((item: any) => item.displayname.toLowerCase().includes(query.toLowerCase())).map((item: any) => ({ id: item.email, display: item.displayname }))
      callback(_usrs);
    } catch(err) {
      console.log(err);
    }
  };

  // React.useEffect(() => {
    // return () => controller.abort();
  // }, [textboxVal]);


  
  return (
    <Tooltip color='red' title={isDisable ? "Please Update Ticket Information" : null}>
      <Form 
        form={replyForm} 
        layout="vertical" 
        onFinish={onFinish} 
        onFinishFailed={() => message.error("Write Content First!")}
        disabled={isDisable}> 
        <Space direction='vertical' style={{width: '100%'}}>
          <Form.Item name="reply_body" rules={[{required: true, message: ""}]} style={{ margin: 0 }}>
            <MentionsInput
              rows={4}
              placeholder="Write Your Reply. Use '@' for mention"
              value={textboxVal}
              onChange={(e: any) => setTextboxVal(e.target.value)}
              style={mentionsInputStyle}
              a11ySuggestionsListLabel='select user'
              disabled={isDisable}
            >
              <Mention
                markup='@{display: __display__, id: __id__}' 
                style={{ backgroundColor: "#cfe6ff" }} 
                data={data}
                trigger={"@"}
                renderSuggestion={(entry:any, search:any, highlightedDisplay:any) => {
                  console.log(entry, search, highlightedDisplay);
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Image
                        src={`${apiLink}/user/photo?id=${entry.id}`}
                        preview={{src: `${apiLink}/user/photo?id=${entry.id}`,}}
                        onError={e => e.currentTarget.src = "https://salicapi.com/File/7961d7c4-decf-42aa-8010-4a34d4178970.png"}
                        width={20} style={{ borderRadius: 99 }}
                      />
                      <span>{highlightedDisplay}</span>
                    </div>
                  )
                }} 
              />
            </MentionsInput>
          </Form.Item>

          {/* <Upload
            action="https://salicapi.com/api/uploader/up"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <Button type='default' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
          </Upload> */}
          <Uploader
            action={uploaderUrl}
            onChange={(fileList):any => setFileList(fileList)}
            // allowPasteImages={activeUploaderArea === "reply"}
            allowPasteImages={false}
            mode='button'
          />

          <Button htmlType="submit" type='primary' loading={btnLoader}>
            Add Feedback
          </Button>

        </Space>
      </Form>
    </Tooltip>
  )
}

export default ReplyForm