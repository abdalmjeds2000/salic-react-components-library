import * as React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, message, Space, Upload } from 'antd';
import { Mention, MentionsInput } from 'react-mentions';
import mentionsInputStyle from './mentionsInputStyle';



const ReplyForm = ({ fileList, setFileList, btnLoader, onFinish, replyForm }: any) => {
  const [textboxVal, setTextboxVal] = React.useState('');

  const controller = new AbortController();
  const signal = controller.signal;
  var data = async function(query: any, callback: any) {
    if(query.length < 2) return;
    try {
      let response = await fetch(`https://salicapi.com/api/User/AutoComplete?term=${query}&_type=query&q=${query}&_=1667805757891`, { signal: signal });
      const data = await response.json();
      const _usrs = data.Data.value.map((item: any) => ({ id: item.mail, display: item.displayName }))
      callback(_usrs);
    } catch(err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    return () => controller.abort();
  }, [textboxVal]);
  
  return (
    <Form form={replyForm} layout="vertical" onFinish={onFinish} onFinishFailed={() => message.error("Write Content First!")}> 
      <Space direction='vertical' style={{width: '100%'}}>
        <Form.Item name="reply_body" rules={[{required: true, message: ""}]} style={{ margin: 0 }}>
          {/* <TextArea rows={4} placeholder="Add Reply" maxLength={500} /> */}
          <MentionsInput
            rows={4}
            placeholder="Write Your Reply. Use '@' for mention"
            value={textboxVal}
            onChange={(e: any) => setTextboxVal(e.target.value)}
            style={mentionsInputStyle}
            a11ySuggestionsListLabel='select user'
          >
            <Mention
              markup='@{display: __display__, id: __id__}' 
              style={{ backgroundColor: "#cfe6ff" }} 
              data={data}
              trigger={"@"}
              renderSuggestion={(entry:any, search:any, highlightedDisplay:any) => ( 
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img alt="" src={`https://salic.sharepoint.com/sites/Portal/_layouts/15/userphoto.aspx?size=s&username=${entry.id}`} width={20} style={{ borderRadius: 99 }} />
                  <span>{highlightedDisplay}</span>
                </div>
              )} 
            />
          </MentionsInput>
        </Form.Item>

        <Upload
          action="https://salicapi.com/api/uploader/up"
          fileList={fileList}
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        >
          <Button type='default' size='middle' icon={<UploadOutlined />}>Attach Files</Button>
        </Upload>


        <Button htmlType="submit" type='primary' loading={btnLoader}>
          Add Feedback
        </Button>

      </Space>
    </Form>
  )
}

export default ReplyForm