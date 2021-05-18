import React, { Component } from 'react'
import { Form, Input, Button, Select, Popconfirm, Table, Pagination, Modal, Divider } from 'antd'
import { req_findOrderType, req_findAllUser, req_findSpaceByFloor, req_saveOrderUser, req_findOrderUser, req_deleteOrderUser,findOrderUserById } from '../../../api/hdlApi'
import './index.less'

const { Option } = Select;

class Storage extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    userName: '', // 姓名
    data: [],
    visible: false,
    orderTypeData:[], // 工单类型
    allUserData:[], // 用户信息
    spaceFloorData:[], //楼宇信息
    userData:{}, // 选择的用户信息
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findOrderType()
    this.findAllUser();
    this.findSpaceByFloor()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { userName, spaceId, orderTypeId, pageSize } = this.state
    const params= {
      userName,
      spaceId,
      orderTypeId,
      pageNum,
      pageSize
    }
    const res = await req_findOrderUser(params)
    if (res.code === 20000) {
      // console.log(res,'ssssssssssssssssssss')
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }
  
  // 获取工单类型
  findOrderType=async()=>{
    const res =await req_findOrderType({pageNum:1,pageSize:99999})
    if(res.code === 20000){
      this.setState({
        orderTypeData:res.data.list
      })
    }
  }

  // 获取用户信息
  findAllUser=async(userName)=>{
    const res = await req_findAllUser({userName,pageNum:1,pageSize:99999})
    if(res.code === 20000){
      this.setState({
        allUserData:res.data.list
      })
    }
  }

  // 获取楼宇信息
  findSpaceByFloor=async()=>{
    const res = await req_findSpaceByFloor()
    if(res.code === 20000){
      this.setState({
        spaceFloorData:res.data
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
      visible: true,
      title: '新增',
    })
  }

  // 编辑
  handleEdit = record => {
    findOrderUserById({userId:record.user_id}).then((res)=>{
      if(res.code===20000){
        setTimeout(async() => {
          let arr = {}
          arr.userId=res.data.user_id
          // console.log(res.data,'ssssssssssssssss')
          arr.spaceIds=res.data.spaceEntities?res.data.spaceEntities.map(x=>x.space_id):''
          // arr.orderTypeIds=record.orderTypeEntities.map(x=> x.type_id)
          this.formRef.current.setFieldsValue(arr);
          this.userIdClick(record.user_id)
        }, 100)
        this.setState({
          visible: true,
          title: '编辑',
        })
      }
      
    })
  }

  // 获取姓名信息
  userIdClick=(val)=>{
    const { allUserData } = this.state
    const userData=allUserData.find(x=>x.user_id===val)
    // console.log(userData,'ssssssssssssssss')
    this.setState({
      userData
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      // values.orderTypeIds=values.orderTypeIds.join(',')
      values.spaceIds=values.spaceIds.join(',')
      const res = await req_saveOrderUser(values)
        if(res.code === 20000){
          Modal.success({ content: res.message })
          this.setState({
            visible: false,
            title: '新增',
            userData:{}
          })
          this.fetch(1)
        }

    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_deleteOrderUser({ userId: record.user_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  render() {
    const { pageSize, total, data, visible, title, orderTypeData, allUserData, spaceFloorData, userData } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '姓名',
        align: 'center',
        dataIndex: 'user_name',
      },
       {
        title: '联系方式',
        align: 'center',
        dataIndex: 'user_phone',
      },
      //  {
      //   title: '维修数量',
      //   align: 'center',
      //   dataIndex: 'count_order',
      // },
       {
        title: '负责维修楼宇',
        align: 'center',
        dataIndex: 'space_name',
        render: space_name=>(
          <div className="space">
            {
                    <div className="table-item-work-blue">
                      <div>{space_name}</div>
                    </div>
            }
              
          </div>
        )
      }, 
      // {
      //   title: '负责维修类型',
      //   align: 'center',
      //   dataIndex: 'orderTypeEntities',
      //   render: orderTypeEntities=>(
      //     <div className="order">
      //       {
      //           orderTypeEntities.map((val,key)=>{
      //             return (
      //               <div className="table-item-work-green" key={key}>
      //                 <div>{val.type_name}</div>
      //                 {orderTypeEntities.length-1!==key?<div style={{color:'#000'}}>|</div>:''}
      //               </div>
      //             )
      //           })
      //       }
      //     </div>
      //   )
      // },
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
    return (
      <div className="classStorage">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="姓名 : ">
                <Input style={{ width: 160 }} placeholder="请输入姓名" onChange={e => this.setState({ userName: e.target.value })} />
              </Form.Item>
              <Form.Item label="楼宇 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择楼宇' showSearch optionFilterProp="children" onChange={e => { this.setState({ spaceId: e }) }}>
                  {
                    spaceFloorData.map((val,key)=>{
                    return (<Option value={val.space_id} key={key}>{val.space_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              {/* <Form.Item label="维修类型 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择维修类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ orderTypeId: e }) }}>
                  {
                    orderTypeData.map((val,key)=>{
                    return (<Option value={val.type_id} key={key}>{val.type_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item> */}
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
            className="work-table"
            rowKey={record => record.user_id}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div>
            {/* <div>维修人总数: {123}</div>
            <div>待接单: {20}</div>
            <div>维修中: {50}</div> */}
          </div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
        <Modal
          title={title}
          visible={visible}
          okText="保存"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false, userData:{} })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item label="姓名" name="userId" rules={[{ required: true, message: '请选择姓名!' }]}>
              <Select
                placeholder="请选择姓名"
                allowClear
                showSearch 
                optionFilterProp="children"
                onChange={(val)=>{
                  this.userIdClick(val)
                }}
              >
                {
                  allUserData.map((val,key)=>{
                    return (<Option value={val.user_id} key={key}>{val.user_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            {
              userData.user_phone?(<Form.Item label="联系方式">
              <Input value={userData.user_phone} style={{ width: '100%' }} disabled />
            </Form.Item>):('')
            }
            
            
            
              <Form.Item label="负责维修楼宇" name="spaceIds" rules={[{ required: true, message: '请选择负责维修楼宇!' }]}>
                <Select allowClear mode="multiple" placeholder='请选择负责维修楼宇' showSearch optionFilterProp="children">
                    {
                      spaceFloorData.map((val,key)=>{
                      return (<Option value={val.space_id} key={key}>{val.space_name}</Option>)
                      })
                    }
                </Select>
            </Form.Item>
              {/* <Form.Item label="负责维修类型" name="orderTypeIds" rules={[{ required: true, message: '请选择负责维修类型!' }]}>
                <Select allowClear mode="multiple" placeholder='请选择维修类型' showSearch optionFilterProp="children">
                  {
                    orderTypeData.map((val,key)=>{
                    return (<Option value={val.type_id} key={key}>{val.type_name}</Option>)
                    })
                  }
                </Select>
            </Form.Item> */}



          </Form>
        </Modal>
      </div>
    )
  }
}
export default Storage