import React, { Component } from 'react'
import { Form, Input, Button, Row, Modal, Col, InputNumber } from 'antd'
import { req_findRepairTimeout, req_saveRepairTimeout } from '../../../api/hdlApi'
import './index.less'

class libraryType extends Component {

  formRef = React.createRef();

  state = {

  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const res = await req_findRepairTimeout()
    if (res.code === 20000) {
      const record={
        timeout_id:res.data ? res.data.timeout_id : null,
        timeout_time:res.data ? res.data.timeout_time : undefined,
      }
      if(this.formRef.current&&this.formRef.current.setFieldsValue(record)){
        this.formRef.current.setFieldsValue(record);
      }
    }
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      const method = req_saveRepairTimeout
      const res = await method(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
        })
        this.fetch(1)
      }
    });
  }

  render() {
    return (
      <div className="timeOutDiv">
        <Form ref={this.formRef}>
            <Form.Item name="timeout_id" hidden>
              <Input />
            </Form.Item>
          <Row>
            <Col span={12} style={{background:'#fff',padding:'50px 40px'}}>
              <Form.Item label="超时时间（分钟）" name="timeout_time" rules={[{ required: true, message: '请输入超时时间!' }]}>
                <InputNumber style={{width:'400px'}} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} style={{background:'#fff',height:'300px',padding:'0px 0px 100px 150px'}}>
              <Button type="primary" htmlType="submit" style={{width:'160px',height:'40px'}} onClick={()=>{
                this.handleOk()
              }}>保存</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default libraryType