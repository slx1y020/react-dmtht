import React, { Component } from 'react';
import { Form, Input, Button, Divider, Popconfirm, Select, Table, Modal, Pagination, message } from 'antd'
import { deleteAdminById, findAllAdmin, saveAdmin, findAllAuthRole, resetPassword } from '../../../api/api'
import moment from 'moment'
import './index.less'
class AdminManager extends Component {
  formRef = React.createRef();
  state = {
    data: [],
    account: '', // 账号
    pageSize: 15,
    total: 1,
    visible: false, // 新增管理员
    visible2: false, // 重置弹窗
    resetVisible: false, // 重置密码
    role: [],//角色列表
    adminInformation: {},
    isShowPassword: false,
    title: '',
    newPassword: '',
    user_name: ''
  }

  componentDidMount = () => {
    this.findAllAdmin(1)
    this.findAllRole()
  }

  findAllAdmin = async (pageNum) => {
    const { pageSize, user_name } = this.state;
    const res = await findAllAdmin({ pageNum, user_name, pageSize })
    if (res.code === 20000) {
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }
  //删除
  deleteAdminById = (item) => {
    deleteAdminById({ adminId: item.admin_id }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '删除成功！' })
        this.findAllAdmin(1)
      }
    })
  }
  //查询角色
  findAllRole = () => {
    findAllAuthRole().then(res => {
      if (res.code === 20000) {
        this.setState({ role: res.data })
      }
    })
  }
  //显示框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  onFinish2 = () => {
    const { role, isShowPassword } = this.state
    //获取form表单所有数据
    this.formRef.current.validateFields().then(async values => {
      const role_name = role.filter(item => item.role_id === values.role_id)[0].role_name
      values = { ...values, role_name: role_name }
      saveAdmin({ adminJsonString: JSON.stringify(values) }).then(res => {
        if (res.code === 20000) {
          if (isShowPassword) {
            Modal.success({ content: '添加成功！' })
          } else {
            Modal.success({ content: '编辑成功！' })
          }
          this.setState({ visible: false })
          this.findAllAdmin(1)
        }
      })
    });
  }
  //重置密码
  onFinish3 = () => {
    const { newPassword, adminInformation } = this.state
    var regu = "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$";//手机号码验证regEx:第一位数字必须是1，11位数字
    var re = new RegExp(regu);
    if (re.test(newPassword)) {

    } else {
      message.warning("请输入8-12位的数字和大小写字母组合的密码")
      return false;
    }
    resetPassword({ adminId: adminInformation.admin_id, newPassword }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '修改成功！' })
        this.setState({
          adminInformation: {},
          visible2: false
        })
      }
    })
  }
  //重置密码
  resetPassword = (values) => {
    const { adminInformation } = this.state
    resetPassword({ adminId: adminInformation.admin_id, newPassword: values }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '修改成功！' })
        this.setState({
          adminInformation: {},
          visible2: false
        })
      }
    })
  }
  //编辑弹框
  editor = (record) => {
    setTimeout(() => {
      this.formRef.current.setFieldsValue(record);
    }, 100)
    this.setState({ visible: true, isShowPassword: false, title: '编辑管理员' })
  }
  //添加用户
  addAdmin = () => {
    setTimeout(() => {
      this.formRef.current.resetFields();
    }, 100)
    this.setState({ visible: true, isShowPassword: true, title: '新增管理员' })
  }

  //重置密码
  resetPassword = (record) => {
    setTimeout(() => {
      this.formRef.current.resetFields();
    }, 100)
    this.setState({ visible2: true, adminInformation: record })
  }

  checkPhoneNub = (rule, value, callback) => {
    var regu = "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,50}$";//手机号码验证regEx:第一位数字必须是1，11位数字
    var re = new RegExp(regu);
    if (re.test(value)) {
      callback();
    } else {
      callback('请输入8位以上的数字和大小写字母组合的密码！');
    }
  }

  render() {
    const { data, visible, role, visible2, isShowPassword, title, pageSize, total } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 13 },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '用户名',
        dataIndex: 'admin_name',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
      },
      {
        title: '邮箱',
        dataIndex: 'admin_mail',
      },
      {
        title: '电话',
        dataIndex: 'admin_phone',
      },
      {
        title: '创建人',
        dataIndex: 'admin_parent_name',
      },
      {
        title: '创建时间',
        dataIndex: 'admin_create_time',
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href='#!' onClick={() => this.editor(record)}>编辑</a>
            <Divider type="vertical" />
            <a href='#!' onClick={() => this.resetPassword(record)}>重置密码</a>
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.deleteAdminById(record)}
              okText="确定"
              cancelText="取消"
            >
              {
                record.admin_id !== 1 && <span><Divider type="vertical" /><a href="#!" style={{ color: 'red' }}>删除</a></span>
              }
            </Popconfirm>
          </div>
        ),
        width: '15%'
      }
    ]

    return (
      <div className='admib_manger'>
        <div className="topForm">
          <Form layout="inline" onFinish={this.onFinish} initialValues={{}}>
            <div>
              <Form.Item name="admin_cou" label="用户名">
                <Input onChange={(e) => this.setState({ user_name: e.target.value })} placeholder="请输入用户名" style={{ width: 160 }} />
              </Form.Item>
            </div>
            <div>
              <Form.Item >
                <Button htmlType="submit" onClick={() => this.findAllAdmin(1)} style={{ marginRight: '10px' }}>查询</Button>
                <Button type='primary' onClick={() => this.addAdmin()}>新增</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className='contentbody'>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.admin_account}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div></div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllAdmin(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.onFinish2}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <div>
            <Form ref={this.formRef}  {...formItemLayout}  >
              <Form.Item rules={[{ required: true, message: '请输入账号名称!' }]} name="admin_name" label="用户名">
                <Input disabled={isShowPassword ? false : true} placeholder="请输入用户名" style={{ width: 250 }} />
              </Form.Item>
              <Form.Item style={{ display: 'none' }} name="admin_id" label="管理员ID">
                <Input disabled placeholder="请输入管理员ID" style={{ width: 250 }} />
              </Form.Item>
              {
                isShowPassword ? <Form.Item rules={[{ required: true, message: '请输入密码!' }, { validator: this.checkPhoneNub }]} name="admin_password" label="密码">
                  <Input.Password placeholder="请输入密码" style={{ width: 250 }} />
                </Form.Item> : ''
              }
              <Form.Item rules={[{ required: true, message: '请选择角色！' }]} name="role_id" label=" 角色">
                <Select placeholder="请选择角色" style={{ width: 250 }} allowClear>
                  {
                    role.map((item, index) => {
                      return <Select.Option key={item.role_id} value={item.role_id}>{item.role_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item name="admin_mail" label=" 邮箱" rules={[{ type: 'email', message: '邮箱格式误!' }]}>
                <Input placeholder="请输入邮箱" style={{ width: 250 }} />
              </Form.Item>
              <Form.Item name="admin_phone" label=" 电话">
                <Input placeholder="请输入电话" style={{ width: 250 }} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          title="重置密码"
          visible={visible2}
          onOk={this.onFinish3}
          onCancel={() => { this.setState({ visible2: false }) }}
        >
          <div>
            <Form ref={this.formRef} >
              <Form.Item rules={[{ required: true, message: '请输入新密码!' }, { validator: this.checkPhoneNub }]} name="admin_password" label="新密码">
                <Input.Password onChange={(e) => this.setState({ newPassword: e.target.value })} placeholder="请输入新密码" style={{ width: 250 }} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AdminManager;