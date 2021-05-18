/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal, Select, Switch, Tree } from 'antd'
import { req_findAllModule, req_findAllUserRole, req_addUserRole, req_updateUserRole, req_deleteUserRole, req_updateUserRoleByRoleId, req_authorizeModuleAndFunction, req_findUserRoleByRoleId } from '../../api/hdlApi'
import moment from 'moment'
import './index.less'

const { TextArea } = Input;
const { Option } = Select;

class Slideshow extends Component {

  formRef = React.createRef();
  formRefs = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    role_name: '', // 标题
    state:'', // 状态
    data: [],
    visible: false,
    keys:[],
    visibles:false,
    functionIds:[],
    moduleIds:[],
    treeDatas:[], 
    treeData:[
      {
        id:1,
        key:1,
        title:'报修'
      },
      {
        id:2,
        key:2,
        title:'接单'
      },
      {
        id:3,
        key:3,
        title:'完成'
      },
      {
        id:4,
        key:4,
        title:'评价'
      },
    ]
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findAllModule()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { role_name, state, pageSize } = this.state;
    const res = await req_findAllUserRole({ role_name, state, pageNum, pageSize })
    if (res.code === 20000) {
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 查询模块信息
  findAllModule=async()=>{
    const res = await req_findAllModule({pageNum:1, pageSize:100})
    if(res.code === 20000){
      this.setState({
        treeDatas:res.data.list.map(val=>{
          const item = {
            key:val.id,
            id:val.id,
            title:val.module_name
          }
          return item
        })
      })
    }
  }
  
  // 查询
  handleQuery = () => {
    this.fetch(1)
  }

  // 新增
  handleAdd = () => {
    setTimeout(() => {
      this.formRef.current.resetFields()
    }, 10)

    this.setState({
      keys:[0],
      visible: true,
      title: '新增',
    })
  }

  // 编辑
  handleEdit = record => {
    setTimeout(async() => {
      this.formRef.current.setFieldsValue(record);
    }, 10)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      const method=values.user_role_id?req_updateUserRole:req_addUserRole
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

  // 授权提交
  handleOks=()=>{
    this.formRefs.current.validateFields().then(async values => {
      const { functionIds, moduleIds } = this.state
      values.roleId=values.user_role_id
      values.functionIds=functionIds.join(',')
      values.moduleIds=moduleIds.join(',')
      const res = await req_authorizeModuleAndFunction(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visibles: false,
          functionIds:[],
          moduleIds:[]
        })
        this.fetch(1)
      }
    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_deleteUserRole({ role_id: record.user_role_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  // 设置默认角色
  handDefault=async(record)=>{
    const res = await req_updateUserRoleByRoleId({role_id:record.user_role_id})
    if(res.code === 20000){
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  render() {
    const { pageSize, total, data, visible, title, visibles, treeData,functionIds,moduleIds,treeDatas } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '角色名称',
        dataIndex: 'user_role_name',
      },
      {
        title: '角色描述',
        dataIndex: 'user_role_desc',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render:state=>(
          <div>{state===0?'禁用':'启用'}</div>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render:time=>(
        //   <div>{moment(time).format('YYYY-MM-DD hh:mm')}</div>
        // )
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      {
        title: '设置默认角色',
        render:record=>(
          <div>
            <Switch checked={record.is_default===1?true:false} onChange={()=>{
              this.handDefault(record)
            }} />
            </div>
        )
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href="#!" onClick={() => this.handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#!" onClick={async() => {
              const res = await req_findUserRoleByRoleId({roleId:record.user_role_id})
              if(res.code === 20000){
                this.setState({
                  moduleIds:res.data && res.data.appModuleEntities?res.data.appModuleEntities.map(x=>x.id):[],
                  functionIds:res.data && res.data.appRoleFunctionEntities?res.data.appRoleFunctionEntities.map(x=>x.function_id):[]
                })
              setTimeout(() => {
                if(this.formRefs.current.setFieldsValue(record)!==undefined){
                  this.formRefs.current.setFieldsValue(record);
                }
              }, 10)
              this.setState({ visibles: true })

              }
              
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
        ),
        width: '16%'
      }
    ]
    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <div className="slideshow">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="角色名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入角色名称" onChange={e => this.setState({ role_name: e.target.value })} />
              </Form.Item>
              <Form.Item label="状态 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择状态' showSearch optionFilterProp="children" onChange={e => { this.setState({ state: e }) }}>
                  <Option value={1}>启用</Option>
                  <Option value={0}>禁用</Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button style={{ marginRight: 10 }} htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
                <Button type="primary" onClick={() => this.handleAdd()}> + 新增</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.user_role_id}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div></div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
        <Modal
          title={title}
          okText="保存"
          cancelText="取消"
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false, imageUrl:'' })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="user_role_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="角色名称" name="user_role_name" rules={[{ required: true, message: '请输入角色名称!' }]}>
              <Input placeholder='请输入角色名称' />
            </Form.Item>

            <Form.Item label="角色描述" name="user_role_desc" rules={[{ required: false, message: '请输入角色描述!' }]}>
              <TextArea placeholder='请输入角色描述' rows={4} />
            </Form.Item>

            <Form.Item label="状态" name="state" rules={[{ required: true, message: '请选择状态!' }]}>
              <Select placeholder='请选择状态' allowClear>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>


          </Form>
        </Modal>
        <Modal
          title='角色授权'
          okText="保存"
          cancelText="取消"
          visible={visibles}
          onOk={this.handleOks}
          onCancel={() => {
            this.formRefs.current.resetFields()
            this.setState({ visibles: false})
          }}
        >
          <Form {...layout} ref={this.formRefs}>
            <Form.Item name="user_role_id" hidden>
              <Input />
            </Form.Item>

            <div className="mobileRoleItem">
              <div style={{ width: '50%' }}>
                <div style={{ paddingLeft: 26, paddingBottom: 10 }}>按钮</div>
                <Tree
                  checkable
                  treeData={treeData}
                  onCheck={(c, x) => {
                    this.setState({
                      functionIds: c,
                    });
                  }}
                  checkedKeys={functionIds}
                />
              </div>
              <div style={{ width: '50%' }}>
              <div  style={{ paddingLeft: 26, paddingBottom: 10 }}>模块</div>
                <Tree
                  checkable
                  treeData={treeDatas}
                  onCheck={(c, x) => {
                    this.setState({
                      moduleIds: c,
                    });
                  }}
                  checkedKeys={moduleIds}
                />
              </div>
            </div>
            

          </Form>
        </Modal>
      </div>
    )
  }
}
export default Slideshow