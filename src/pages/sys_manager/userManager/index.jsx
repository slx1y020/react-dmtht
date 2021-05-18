import React, { Component } from 'react'
import moment from 'moment'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal, Select } from 'antd'
import { findAllUser, authorizeRole, findUserRole, delUser } from '../../../api/api'
import { req_findExportRoleByAdmin } from '../../../api/hdlApi'
import './index.less'

export default class UserManager extends Component {
  formRef = React.createRef();
  state = {
    pageSize: 15,
    total: 1,
    pageNum: 1,
    data: [],
    userName: '',
    createTime: '',
    endTime: '',
    user_phone: '',
    visible: false,
    item: {},//user信息
    UserRole: [],//所有权限列表
    wuliaoData: [], // 物料角色
  }
  componentDidMount() {
    this.findAllUser(1)
    this.findUserRole()
    this.fetchWuliaoRole()
  }
  findAllUser = (pageNum) => {
    const { pageSize, userName } = this.state
    findAllUser({ pageNum, pageSize, userName }).then(res => {
      if (res.code === 20000) {
        // console.log(res.data.list,'aaaaaaaaaaaaaaaa')
        this.setState({
          data: res.data.list,
          total: res.data.total ? res.data.total : 1,
          pageNum
        })
      }
    })
  }

  // 查询物料角色信息
  fetchWuliaoRole = async () => {
    const res = await req_findExportRoleByAdmin()
    // console.log(res)
    if (res.code === 20000) {
      this.setState({
        wuliaoData: res.data || []
      })
    }
  }

  //删除
  handleDel = (item) => {
    delUser({ user_id: item.user_id }).then(res => {
      if (res.code === 20000) {
        Modal.success({
          content: '删除成功！'
        })
        this.findAllUser(1)
      }
    })
  }
  //查询所有权限
  findUserRole = () => {
    findUserRole().then(res => {
      if (res.code === 20000) {
        this.setState({ UserRole: res.data || [] })
      }
    })
  }
  //授权
  handleGetpower = () => {
    const { item, pageNum } = this.state
    this.formRef.current.validateFields().then(async values => {
      authorizeRole({ userId: item.user_id, roleId: values.user_role_id, export_role_id: values.export_role_id }).then(res => {
        if (res.code === 20000) {
          Modal.success({ content: '授权成功！' })
          this.setState({
            visible: false
          })
          this.findAllUser(pageNum)
        }
      })
    })
  }
  render() {
    const { pageSize, total, data, visible, UserRole, wuliaoData } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
      },
      {
        title: '用户角色',
        dataIndex: 'app_role_name',
      },
      {
        title: '物料角色',
        dataIndex: 'export_role_name',
      },
      {
        title: '手机号',
        dataIndex: 'user_phone',
      },
      {
        title: '注册时间',
        dataIndex: 'user_create_time',
        // render: time => (<div>{moment(time).format('YYYY-MM-DD hh:mm')}</div>)
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      {
        title: '头像',
        dataIndex: 'user_avatar',
        render: imgurl => (<div><img width="30px" src={imgurl} alt="" /></div>)
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a href="#!" onClick={() => {
              this.setState({ visible: true, item: record })
              setTimeout(async () => {
                this.formRef.current.setFieldsValue({ user_role_id: record.app_role_id, export_role_id: record.export_role_id });
                
              })
            }}>授权</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.handleDel(record)}
              okText="确定"
              cancelText="取消"
            >
              <a href="#!" style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </div>
        )
      }
    ]
    return (
      <div className="classroomType">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item name="Number" label="姓名 : ">
                <Input onChange={(e) => this.setState({ userName: e.target.value })} style={{ width: 160 }} placeholder="请输入姓名 " />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button htmlType="submit" onClick={() => this.findAllUser(1)} >查询</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.user_id}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div >

          </div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllUser(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
        <Modal
          title="授权"
          visible={visible}
          onOk={() => this.handleGetpower()}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          <div>
            <Form ref={this.formRef} {...formItemLayout} >
              <Form.Item rules={[{ required: true, message: '请选择用户角色!' }]} name="user_role_id" label="授权用户角色">
                <Select placeholder="请选择用户角色" style={{ width: 250 }} allowClear>
                  {
                    (UserRole || []).map((item, key) => {
                      return <Select.Option value={item.user_role_id} key={key} >{item.user_role_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>

              <Form.Item rules={[{ required: false, message: '请选择物料角色!' }]} name="export_role_id" label="授权物料角色">
                <Select placeholder="请选择物料角色" style={{ width: 250 }} allowClear>
                  {
                    (wuliaoData || []).map((item, key) => {
                      return <Select.Option value={item.export_role_id} key={key}>{item.export_role_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}