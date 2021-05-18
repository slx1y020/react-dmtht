import React, { Component } from 'react'
import { Form, Input, Button, Select, Divider, Popconfirm, Table, Pagination, Modal } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { req_findRepairRepertoryName, req_findRepairGoodsRepertoryTypeAll, req_findExportRoleByAdmin, req_saveExportRole, req_deleteExportRole, req_findExportRoleDetail, updateExportRole } from '../../../api/hdlApi'
import './index.less'

const { Option } = Select;
let id = 0;
class Rolesss extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    exportRoleName: '', // 姓名
    roleIsActive: '', // 状态
    data: [],
    visible: false,
    repertoryData:[], // 库名称
    goodsRepertoryData:[], //库类型
    keys:[],
    dataList:[],
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findRepertory()
    this.findGoodsRepertory()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { exportRoleName, roleIsActive, pageSize } = this.state;
    const res = await req_findExportRoleByAdmin({ exportRoleName: exportRoleName, roleIsActive, pageNum, pageSize })
    if (res.code === 20000) {
      this.setState({
        data: res.data,
        total: 15
      })
    }
  }
  
  // 获取所有库名称
  findRepertory=async()=>{
    const res = await req_findRepairRepertoryName()
    if(res.code===20000){
      this.setState({
        repertoryData:res.data
      })
    }
  }

  // 获取所有库类型
  findGoodsRepertory=async()=>{
    const res = await req_findRepairGoodsRepertoryTypeAll({pageNum:1, pageSize:99999})
    if(res.code===20000){
      this.setState({
        goodsRepertoryData:res.data.list
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
      const res = await req_findExportRoleDetail({roleId:record.export_role_id})
      if(res.code===20000){
        const key=[]
        for(var i=0;i<res.data.length;i++){
          key.push(i)
        }
        this.setState({
          keys:key
        })
        record.roleName=record.export_role_name
        record.roleId=record.export_role_id
        record.roleConfig=res.data
        this.formRef.current.setFieldsValue(record);
      }
    }, 10)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      values.roleConfig = JSON.stringify(values.roleConfig.filter(x=>x))
      const method=values.roleId?updateExportRole:req_saveExportRole
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

  // 删除
  handleDel = async record => {
    const res = await req_deleteExportRole({ roleId: record.export_role_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  // 添加一条库名称和类型
  add=()=>{
    const { keys } = this.state
    const nextKey=keys.concat(++id)
    this.setState({
      keys:nextKey
    })
  }
  
  // 删除当前库名称和类型
  remove=(k)=>{
    const { keys } = this.state
    if(keys.length === 1){
      return false;
    }
    this.setState({
      keys:keys.filter(x=>x !== k)
    })
  }
  selectDate=(e)=>{
    // const {repertoryData,dataList}=this.state
    // console.log(e,repertoryData)
  }
  
  render() {
    const { pageSize, total, data, visible, title, repertoryData, goodsRepertoryData, keys} = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '角色名称',
        dataIndex: 'export_role_name',
      },
      {
        title: '库名称',
        dataIndex: 'repertory_name',
      },
      {
        title: '库类型',
        dataIndex: 'repertory_type_name',
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href="#!" onClick={() => this.handleEdit(record)}>编辑</a>
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
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 6 },
      },
    };
    const formItems=keys.map((k,index)=>{
      return (
        <div key={k}>
          <Form.Item label="库名称" name={['roleConfig',k,'repertory_name_id']} rules={[{ required: true, message: '请选择库名称!' }]}>
              <Select onChange={(e)=>this.selectDate(e)} placeholder='请选择库名称' showSearch optionFilterProp="children">
                {
                  repertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_name_id} key={key}>{val.repertory_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="库类型" name={['roleConfig',k,'repertory_type_id']} rules={[{ required: true, message: '请选择库类型!' }]}>
              <Select placeholder='请选择库类型' showSearch optionFilterProp="children">
                {
                  goodsRepertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_type_id} key={key}>{val.repertory_type_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            {keys.length > 1 ? (
              <Form.Item {...formItemLayout} style={{marginTop:'-16px'}}>
                <MinusCircleOutlined
                  style={{fontSize:'18px'}}
                  onClick={() => this.remove(k)}
                />
              </Form.Item>
              ) : null}
            
        </div>
      )
    })
    return (
      <div className="rolesss">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="角色名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入角色名称" onChange={e => this.setState({ exportRoleName: e.target.value })} />
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
            rowKey={record => record.export_role_id}
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
            this.setState({ visible: false })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="roleId" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="角色名称" name="roleName" rules={[{ required: true, message: '请输入角色名称!' }]}>
              <Input placeholder='请输入角色名称' />
            </Form.Item>

            {
              formItems
            }

            <Form.Item {...formItemLayout}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <PlusOutlined/> 
                添加一条库名称和类型
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Rolesss