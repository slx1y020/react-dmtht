import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Modal, Form, Input } from 'antd';
import cookie from 'react-cookies'
import {req_logout,updatePassword ,DoLogout} from '../../api/api'
import { ExclamationCircleOutlined } from '@ant-design/icons';

class Logout extends Component {

  formRef = React.createRef();

  state = {
    visible: false
  }

  // 修改密码弹窗
  showModal = () => {
    setTimeout(() => {
      this.formRef.current.resetFields()
    }, 10)
    this.setState({
      visible: true
    })
  }

  // 退出登录
  logout = () => {
    if(cookie.load('app')==='app'){
        Modal.confirm({
          title: '提示',
          icon: <ExclamationCircleOutlined />,
          content: '您确定要退出当前系统吗？',
          okText: '确认',
          cancelText: '取消',
          onOk:()=>{
            req_logout().then(res=>{//
              if(res.code===20000){
                cookie.remove('user')
                cookie.remove('app')
                window.location.href="https://portal.huanghuai.edu.cn"
              }
            })
          }
        });
    }else{
      req_logout().then(res=>{//
        if(res.code===20000){
          cookie.remove('user')
          cookie.remove('app')
          window.location.href="/"
        }
      })
    }
    
  }

  // 修改密码保存
  handleOk = () => {
    this.formRef.current.validateFields().then( async values => {
      if (values.oldPwd !== cookie.load('user').admin_password) return Modal.warning({ content: '请输入正确的旧密码' })
      if (values.oldPwd === values.newPwd) return Modal.warning({ content: '新旧密码相同，请重新输入' })
      if (values.newPwd !== values.qrPwd) return Modal.warning({ content: '两次密码输入不一致，请重新输入' })
      const res = await updatePassword({ newPassword: values.newPwd })
      if (res.code === 20000) {
        Modal.success({ content:"修改成功,请重新登录！" })
        cookie.remove('user')
        cookie.remove('token')
        cookie.remove('data')
        setTimeout(()=>{
          this.setState({
            visible: false
          })
        },1500)
      }
    });
  }

  render() {
    const { visible } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <span className='logout-dropdown-content' onClick={() => this.showModal()}>修改密码</span>
        </Menu.Item>
        <Menu.Item>
          <span className='logout-dropdown-content' onClick={() => this.logout()}>退出</span>
        </Menu.Item>
      </Menu>
    )
    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div>
        <div style={{height:'100%',display:'flex',alignItems:'center'}}>
          {/* <span style={{display:'inline-block',marginRight:'15px',width:'30px',height:'30px',backgroundColor:'rgba(32,123,241,0.1)',lineHeight:'30px',textAlign:'center',borderRadius:'50%',color:'rgb(32,123,241)'}}><SolutionOutlined /></span> */}
          <span style={{marginRight:'10px'}}><UserOutlined /></span>
          <Dropdown overlay={menu}>
            <span style={{ marginLeft: 5, cursor: 'pointer' }}>{cookie.load('user') ? cookie.load('user').admin_name : window.location.reload()}</span>
          </Dropdown>
        </div>
        <Modal
          title="修改密码"
          okText="保存"
          cancelText="取消"
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields() 
            this.setState({ visible: false })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item label="旧密码" name="oldPwd" rules={[{ required: true, message: '请输入旧密码!' }]}>
              <Input.Password placeholder='请输入旧密码' />
            </Form.Item>

            <Form.Item label="新密码" name="newPwd" rules={[{ required: true, message: '请输入新密码!' }]}>
              <Input.Password placeholder='请输入新密码' />
            </Form.Item>

            <Form.Item label="新密码确认" name="qrPwd" rules={[{ required: true, message: '请输入确认密码!' }]}>
              <Input.Password placeholder='请输入确认密码' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Logout;