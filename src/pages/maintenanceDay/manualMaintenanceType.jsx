import React, { Component } from 'react'
import { Form, Input, Button, Tooltip,Select, Table, Pagination, Modal, Popconfirm, message, Radio } from 'antd'
import moment from 'moment'
import { req_findWorkUser, req_findSpaceFloorRoom, findAllTask, saveTask, deletetask, findClassroomsByUserId } from '../../api/hdlApi'
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
    orderTypeData: [], // 工单类型
    allUserData: [], // 用户信息
    spaceRoomData: [], //房间信息
    userData: {}, // 选择的用户信息
    user_name: '', // 维护人姓名
    task_schedule: '',
    userId: '',
    maintenanceModeId: 1,
    taskMethod: '',
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findAllUser();
    // this.findSpaceRoom()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { rooms, user_name, task_schedule, pageSize, taskMethod } = this.state
    const params = {
      rooms,
      user_name,
      pageNum,
      task_schedule,
      pageSize,
      task_method: taskMethod
    }
    const res = await findAllTask(params)
    if (res.code === 20000) {
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 获取用户信息
  findAllUser = async (userName) => {
    const res = await req_findWorkUser({ userName, pageNum: 1, pageSize: 99999 })
    if (res.code === 20000) {
      this.setState({
        allUserData: res.data
      })
    }
  }

  // 获取房间信息
  findSpaceRoom = async () => {
    const { userId } = this.state
    const res = await req_findSpaceFloorRoom({ userId })
    if (res.code === 20000) {
      this.setState({
        spaceRoomData: res.data?res.data:[]
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
      this.formRef.current.setFieldsValue({ task_method: 1,shengxiao:1 });
    }, 10)

    this.setState({
      visible: true,
      title: '新增',
      maintenanceModeId: 1,
    })
  }

  // 编辑
  handleEdit = record => {
    setTimeout(async () => {
      let arr = {}
      arr.userId = record.user_id
      arr.spaceIds = record.spaceEntities.map(x => x.space_id)
      arr.orderTypeIds = record.orderTypeEntities.map(x => x.type_id)
      this.formRef.current.setFieldsValue(arr);
      this.userIdClick(record.user_id)
    }, 10)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 获取姓名信息
  userIdClick = async (val) => {
    const { allUserData } = this.state
    if (val !== undefined) {
      const userData = allUserData.find(x => x.user_id === val)
      this.formRef.current.setFieldsValue({ maintain_user: userData.user_name ? userData.user_name : '' });
      this.formRef.current.setFieldsValue({ phone: userData.user_phone });
      this.setState({
        userData
      })
      const res = await findClassroomsByUserId({ userId: val })
      if (res.code === 20000) {
        this.setState({
          spaceRoomData: res.data || [],
        })
      }
    } else {
      this.formRef.current.setFieldsValue({ maintain_user: '' });
      this.formRef.current.setFieldsValue({ phone: '' });
      this.setState({
        userData: {}
      })
    }
  }

  // 保存
  handleOk = () => {
    const { maintenanceModeId,userData } = this.state;
    this.formRef.current.validateFields().then(async values => {
      // if (maintenanceModeId === 1) {
      //   values.crate_time = values.date[0]
      //   values.end_time = values.date[1]
      // }
      values.user_name = values.maintain_user
      values.room_ids = values.room_ids.join(',')
      values.user_id = values.maintain_id
      values.task_method = 2
      const res = await saveTask(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
          title: '新增',
          userData: {},
          maintenanceModeId: 1,
        })
        this.formRef.current.resetFields()
        this.fetch(1)
      }

    });
  }

  // 删除
  delete = async (id) => {
    const res = await deletetask({ conf_id:id })
    if (res.code === 20000) {
      message.success({ content: '删除成功！' })
      this.fetch(1)
    }
  }

  // 选择维护方式
  onChangeMaintenanceMode = e => {
    this.setState({
      maintenanceModeId: e.target.value
    })
  }

  render() {
    const { pageSize, total, data, visible, title, allUserData, spaceRoomData, userData, maintenanceModeId } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '维护人姓名',
        align: 'center',
        dataIndex: 'user_name',
      },
      //  {
      //   title: '联系方式',
      //   align: 'center',
      //   dataIndex: 'user_phone',
      // },
      {
        title: '房间',
        align: 'center',
        dataIndex: 'rooms',
        render: rooms => (
          <div>
            {
            rooms.split(',').length>5?<Tooltip title={rooms}>
              <div className="space">
              {
              rooms.split(',').map((val, key) => {
                if(key<3){
                  if(key===2){
                    return (
                      <div className="table-item-work-blue" key={key}>
                        <div>{val}</div>
                        {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000',paddingRight:'5px'}}> . . . </div> : ''}
                      </div>
                  )
                  }
                  return (
                    <div className="table-item-work-blue" key={key}>
                      <div>{val}</div>
                      {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000' }}>|</div> : ''}
                    </div>
                )
                }
                
              })
            }
            </div></Tooltip>:<div className="space">
            {
              rooms.length>30?(rooms.split(',').filter((x,y)=>y<3).map((val, key) => {
                return (
                  <div className="table-item-work-blue" key={key}>
                    <div>{val}</div>
                    {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000' }}>|</div> : ''}
                  </div>
                )
              })):rooms.split(',').map((val, key) => {
                return (
                  <div className="table-item-work-blue" key={key}>
                    <div>{val}</div>
                    {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000' }}>|</div> : ''}
                  </div>
                )
              })
            }
            {
              rooms.split(',').length>15?'......':''
            }
          </div>
          }
          </div>
          
          
        )
        // render: rooms => (
        //   <div className="space" title={rooms}>
        //     {
        //       rooms.length > 30 ? (rooms.split(',').filter((x, y) => y < 3).map((val, key) => {
        //         return (
        //           <div className="table-item-work-blue" key={key}>
        //             <div>{val}</div>
        //             {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000' }}>|</div> : ''}
        //           </div>
        //         )
        //       })) : rooms.split(',').map((val, key) => {
        //         return (
        //           <div className="table-item-work-blue" key={key}>
        //             <div>{val}</div>
        //             {rooms.split(',').length - 1 !== key ? <div style={{ color: '#000' }}>|</div> : ''}
        //           </div>
        //         )
        //       })
        //     }
        //     {
        //       rooms.split(',').length > 15 ? '......' : ''
        //     }
        //   </div>
        // )
      },
      // {
      //   title: '维护方式',
      //   align: 'center',
      //   dataIndex: 'task_method',
      //   // render: taskMethod => taskMethod === 1 ? '自动' : '手动'
      //   render: (taskMethod) => {
      //     if (taskMethod === 1) {
      //       return (<div style={{ color: '#FA8F1B' }}>自动</div>)
      //     } else {
      //       return (<div style={{ color: '#0FC26E' }}>手动</div>)
      //     }
      //   }
      // },
      // {
      //   title: '维护时间',
      //   align: 'center',
      //   render: record => (
      //     <>
      //       {
      //         (record.crate_time && record.end_time) ? moment(record.crate_time).format('YYYY-MM-DD HH:mm') + '－' + moment(record.end_time).format('YYYY-MM-DD HH:mm') : ''
      //       }
      //     </>
      //   )
      // },
      {
        title: '维护周期',
        align: 'center',
        dataIndex: 'task_schedule',
        render: taskSchedule => taskSchedule === 1 ? '日维护' : taskSchedule === 2 ? '周维护' : taskSchedule === 3 ? '月维护' : '一次'
      },
      {
        title: '是否立即生效',
        align: 'center',
        dataIndex: 'shengxiao',
        render: (state) => {
          if (state === 1) {
            return (<div style={{ color: '#FA8F1B' }}> 立即生效</div>)
          } else {
            return (<div style={{ color: '#B2B2B2' }}> 下期生效</div>)
          }
        }
      },
      {
        title: '维护描述',
        align: 'center',
        dataIndex: 'conf_desc',
        render:desc=> desc && desc.length > 15 ? <Tooltip title={desc}>
                    <span>{desc.substr(0, 15) + '...'}</span>
                </Tooltip> : desc
      },
      {
        title: '创建时间',
        align: 'center',
        dataIndex:'user_create_time',
        render:time=>(
          <div>
            {moment(time).format('YYYY-MM-DD HH:mm')}
          </div>
        )
      },
      {
        title: '操作',
        align: 'center',
        render: record => (
          <div>
            <Popconfirm title="确定要删除吗" okText="确认" cancelText="取消" onConfirm={() => this.delete(record.conf_id)}>
              <a href="#!" style={{ color: 'red' }}  > 删除 </a>
            </Popconfirm>
          </div>
        )
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
              <Form.Item label="维护人姓名	 : ">
                <Input style={{ width: 160 }} placeholder="请输入维护人姓名" onChange={e => this.setState({ user_name: e.target.value })} />
              </Form.Item>
              <Form.Item label="房间 : ">
                <Input style={{ width: 160 }} placeholder="请输入房间" onChange={e => this.setState({ rooms: e.target.value })} />
              </Form.Item>
              <Form.Item label="维护周期 : ">
                <Select placeholder="请选择维护周期" style={{ width: 160 }} allowClear onChange={(e) => {
                  this.setState({
                    task_schedule: e
                  })
                }}>
                  <Option value={1}>日维护</Option>
                  <Option value={2}>周维护</Option>
                  <Option value={3}>月维护</Option>
                </Select>
              </Form.Item>
              {/* <Form.Item label="维护方式 : ">
                <Select placeholder="请选择维护方式" style={{ width: 160 }} allowClear onChange={(e) => {
                  this.setState({
                    taskMethod: e
                  })
                }}>
                  <Option value={1}>自动</Option>
                  <Option value={2}>手动</Option>
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
            rowKey={record => record.id}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div>
            {/* <div>维护人总数: {123}</div>
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
            this.setState({ visible: false, userData: {}, maintenanceModeId: 1 })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item label="维护人姓名" name="maintain_id" rules={[{ required: true, message: '请选择姓名!' }]}>
              <Select
                placeholder="请选择姓名"
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={(val) => {
                  this.userIdClick(val)
                }}
              >
                {
                  allUserData.map((val, key) => {
                    return (<Option value={val.user_id} key={key}>{val.user_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item name="maintain_user" label="姓名" hidden>
              <Input style={{ width: '100%' }} />
            </Form.Item>
            {/* {
              userData.user_nick ? (<Form.Item label="昵称">
                <Input value={userData.user_nick} style={{ width: '100%' }} disabled />
              </Form.Item>) : ('')
            } */}

            {
              userData.user_number ? (<Form.Item label="联系方式" name="phone">
                <Input value={userData.user_number} style={{ width: '100%' }} disabled />
              </Form.Item>) : ('')
            }

            <Form.Item label="房间" name="room_ids" rules={[{ required: true, message: '请选择房间!' }]}>
              <Select allowClear mode="multiple" placeholder='请选择房间' showSearch optionFilterProp="children">
                {
                  spaceRoomData.map((val, key) => {
                    return (<Option value={val.classroom_id} key={key} disabled={!spaceRoomData.length}>{val.classroom_code ? val.space_name + val.classroom_code : val.space_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            {/* <Form.Item label="维护方式" name='task_method' rules={[{ required: true, message: '请选择维护方式!' }]}>
              <Radio.Group onChange={this.onChangeMaintenanceMode} value={maintenanceModeId}>
                <Radio key={1} value={1}>自动</Radio>
                <Radio key={2} value={2}>手动</Radio>
              </Radio.Group>
            </Form.Item> */}

            <Form.Item label="维护周期" name="task_schedule" rules={[{ required: true, message: '请选择维护时间!' }]}>
              <Radio.Group>
                <Radio key={1} value={1}>天</Radio>
                <Radio key={2} value={2}>周</Radio>
                <Radio key={3} value={3}>月</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="是否立即生效" name="shengxiao" rules={[{ required: true, message: '请选择是否立即生效!' }]}>
              <Radio.Group>
                <Radio key={1} value={1}>立即生效</Radio>
                <Radio key={2} value={2}>下期生效</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="维护描述" name="conf_desc" rules={[{ required: false, message: '请输入维护描述!' }]}>
              <Input.TextArea style={{ width: '100%' }} placeholder='请输入维护描述！' rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Storage