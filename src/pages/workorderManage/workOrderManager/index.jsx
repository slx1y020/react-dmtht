/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Form, Input, Button, Select, Table, Pagination, Modal } from 'antd'
import { req_findOrderType, req_findSpaceByFloor, req_allocationOrderList, req_findPcOrderList, req_allocationOrderUser, req_exportOrderExcel } from '../../../api/hdlApi'
import { findClassroomTypes } from '../../../api/api'
import './index.less'
import IP from './../../../config/config'
import moment from 'moment'

const { Option } = Select;

class Storage extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    data: [],
    visible: false,
    orderTypeData: [], // 工单类型
    spaceFloorData: [], //楼宇信息
    userData: {}, // 选择的用户信息
    orderUserData: [], // 选择的用户信息
    classroomType: [], // 教室类型
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findOrderType()
    this.findSpaceByFloor()
    this.fetchClassroomType()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { userName, floorId, areaName, classroomTypeId, orderStatus, repairType, typId, pageSize } = this.state
    const params = {
      userName,
      // classroomTypeId,
      floorId,
      areaName,
      orderStatus,
      repairType,
      typId,
      pageNum,
      pageSize
    }
    const res = await req_findPcOrderList(params)
    if (res.code === 20000) {
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 获取工单类型
  findOrderType = async () => {
    const res = await req_findOrderType({ pageNum: 1, pageSize: 99999 })
    if (res.code === 20000) {
      this.setState({
        orderTypeData: res.data.list
      })
    }
  }

  // 获取楼宇信息
  findSpaceByFloor = async () => {
    const res = await req_findSpaceByFloor()
    if (res.code === 20000) {
      this.setState({
        spaceFloorData: res.data
      })
    }
  }

  // 获取可分配的人员
  findOrderUser = async (orderId) => {
    const res = await req_allocationOrderUser({ orderId })
    if (res.code === 20000) {
      this.setState({
        orderUserData: res.data
      })
    }
  }

  // 查询教室类型
  fetchClassroomType = async () => {
    const res = await findClassroomTypes({ pageSize: 9999, pageNum: 1 })
    if (res.code === 20000) {
      this.setState({
        classroomType: res.data.list || []
      })
    }
  }

  // 查询
  handleQuery = () => {
    this.fetch(1)
  }

  // 编辑
  handleEdit = record => {
    // console.log(record,'aaaaaaaaaaaaaaaa')
    setTimeout(async () => {
      this.findOrderUser(record.order_id);
      record.orderId = record.order_id
      this.formRef.current.setFieldsValue(record);
    }, 10)
    this.setState({
      visible: true,
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      const res = await req_allocationOrderList(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
        })
        
        this.formRef.current.resetFields()
        this.fetch(1)
      }

    });
  }

  // 导出
  exportOrderExcel = async () => {
    const { userName, floorId, classroomTypeId, areaName, orderStatus, repairType, typId } = this.state
    const params = {
      userName,
      floorId,
      classroomTypeId,
      areaName,
      orderStatus,
      repairType,
      typId
    }
    await req_exportOrderExcel(params)
    Modal.success({ content: "导出成功" })
  }



  render() {
    const { pageSize, total, data, visible, spaceFloorData, orderUserData, classroomType } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '报修人',
        align: 'center',
        dataIndex: 'bx_name',
      },
      // {
      //   title: '教室类型',
      //   align: 'center',
      //   dataIndex: 'room_type',
      // },
      {
        title: '报修方式',
        align: 'center',
        dataIndex: 'repair_type',
        render: (repair_type) => {
          // 报修类型 1 填单报修 2 语音报修 3 电话报修 4 扫码报修'
          if (repair_type === 1) {
            return (<div>填单报修</div>)
          } else if (repair_type === 2) {
            return (<div>语音报修</div>)
          } else if (repair_type === 3) {
            return (<div>电话报修</div>)
          } else {
            return (<div>扫码报修</div>)
          }
        }
      },
      {
        title: '联系方式',
        align: 'center',
        dataIndex: 'bx_phone',
      },
      {
        title: '故障区域',
        align: 'center',
        dataIndex: 'area_name',
      },
      {
        title: '故障描述',
        align: 'center',
        dataIndex: 'order_desc',
        render: (order_desc) => (
          <div title={order_desc}>
            {
              order_desc && order_desc.length > 15 ? order_desc.substr(0, 15) + '...' : order_desc
            }
          </div>
        )
      },
      
      {
        title: '评价内容',
        align: 'center',
        dataIndex: 'comment_content',
        render: (comment_content) => (
          <div title={comment_content}>
            {
              comment_content && comment_content.length > 15 ? comment_content.substr(0, 15) + '...' : comment_content
            }
          </div>
        )
      },
      {
        title: '工单状态',
        align: 'center',
        dataIndex: 'order_status',
        render: (order_status) => {
          // 0待接单 1已接单,维修中 2已完工,待评价 3已评价  4已取消 5已拒接
          if (order_status === 0) {
            return (<div style={{ color: '#0FC26E' }}> ● 待接单</div>)
          } else if (order_status === 1) {
            return (<div style={{ color: '#FA8F1B' }}> ● 维修中</div>)
          } else if (order_status === 2) {
            return (<div style={{ color: '#74869C' }}> ● 已完工</div>)
          } else if (order_status === 3) {
            return (<div style={{ color: '#0a6ff3' }}> ● 已评价</div>)
          } else if (order_status === 4) {
            return (<div style={{ color: '#B2B2B2' }}> ● 已取消</div>)
          } else {
            return (<div style={{ color: '#FF5258' }}> ● 已拒接</div>)
          }
        }
      },
      {
        title: '拒接原因',
        align: 'center',
        dataIndex: 'refuse_reason',
        render: (refuse_reason) => (
          <div title={refuse_reason}>
            {
              refuse_reason && refuse_reason.length > 15 ? refuse_reason.substr(0, 15) + '...' : refuse_reason
            }
          </div>
        )
      },
      {
        title: '故障图片',
        align: 'center',
        dataIndex: 'urls',
        render: (urls) => (
          <div>
            {
              // eslint-disable-next-line react/jsx-no-target-blank
              urls ? ((urls.split(',')).map((item, index) => {
                return <a href={IP.host + item} target="_blank">
                  <img src={IP.host + item} style={{ height: '50px', marginRight: '5px' }} />
                </a>
              })) : ('')

            }
          </div>
        )
      },
      {
        title: '维修时长',
        align: 'center',
        dataIndex: 'duration',
      },
      {
        title: '接单人',
        align: 'center',
        dataIndex: 'worker_name',
      },
      {
        title: '接单时间',
        align: 'center',
        dataIndex: 'start_time',
        render(time) {
          return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
        }
      },
      {
        title: '完工时间',
        align: 'center',
        dataIndex: 'finish_time',
        render(time) {
          return time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
        }
      },
      {
        title: '操作',
        render: record => (
          <div>
            {
              record.order_status === 0 ? (<a href="#!" onClick={() => this.handleEdit(record)}>分配工单</a>) : ('')
            }

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
              <Form.Item label="报修人或者接单人 : ">
                <Input style={{ width: 160 }} placeholder="请输入报修人或者接单人" onChange={e => this.setState({ userName: e.target.value })} />
              </Form.Item>
              {/* <Form.Item label="教室类型 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择教室类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ classroomTypeId: e }) }}>
                  {
                    classroomType.map((val, key) => {
                      return (<Option value={val.classroom_type} key={key}>{val.classroom_type_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item> */}
              <Form.Item label="楼宇 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择楼宇' showSearch optionFilterProp="children" onChange={e => { this.setState({ floorId: e }) }}>
                  {
                    spaceFloorData.map((val, key) => {
                      return (<Option value={val.space_id} key={key}>{val.space_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="故障区域 : ">
                <Input style={{ width: 160 }} placeholder="请输入故障区域" onChange={e => this.setState({ areaName: e.target.value })} />
              </Form.Item>
              <Form.Item label="工单状态 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择工单状态' showSearch optionFilterProp="children" onChange={e => { this.setState({ orderStatus: e }) }}>
                  {/* 工单状态 0待接单 1已接单,维修中 2已完工,待评价 3已评价 4已取消 5已拒接 */}
                  <Option value={0}>待接单</Option>
                  <Option value={1}>维修中</Option>
                  <Option value={2}>已完工</Option>
                  <Option value={3}>已评价</Option>
                  <Option value={4}>已取消</Option>
                  <Option value={5}>已拒接</Option>
                </Select>
              </Form.Item>
              <Form.Item label="报修方式 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择报修方式' showSearch optionFilterProp="children" onChange={e => { this.setState({ repairType: e }) }}>
                  {/* 报修方式1 填单报修 2 语音报修 3 电话报修 */}
                  <Option value={1}>填单报修</Option>
                  <Option value={2}>语音报修</Option>
                  <Option value={3}>电话报修</Option>
                  <Option value={4}>扫码报修</Option>
                </Select>
              </Form.Item>
              {/* <Form.Item label="工单类型 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择工单类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ typId: e }) }}>
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
                <Button type="primary" onClick={() => this.exportOrderExcel()}>导出</Button>
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
            rowKey={record => record.order_id}
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
          title={'分配工单'}
          visible={visible}
          okText="保存"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false, userData: {} })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="orderId" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="维修人员" name="userId" rules={[{ required: true, message: '请选择分配维修人员!' }]}>
              <Select allowClear placeholder='请分配维修人员' showSearch optionFilterProp="children">
                {
                  orderUserData.map((val, key) => {
                    return (<Option value={val.user_id} key={key}>{val.user_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

          </Form>
        </Modal>
      </div>
    )
  }
}
export default Storage