/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import { Form, Input, Button, Table, Pagination, DatePicker, Select } from 'antd'
import { req_findAllMaintain } from '../../api/hdlApi'
import moment from 'moment'
import IP from './../../config/config'
import './index.less'
const { RangePicker } = DatePicker;
const { Option } = Select;

class Storage extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    userName: '', // 姓名
    startTime: '', // 开始时间
    endTime: '', // 结束时间
    data: [],
    visible: false,
    orderTypeData:[], // 工单类型
    allUserData:[], // 用户信息
    spaceRoomData:[], //房间信息
    userData:{}, // 选择的用户信息
    state:'', // 状态
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { user, room_message, startTime, endTime, pageSize, state } = this.state
    const params= {
      user,
      room_message,
      startTime:startTime?startTime+' 00:00:00':'',
      endTime:endTime?endTime+' 23:59:59':'',
      state,
      pageNum,
      pageSize
    }
    const res = await req_findAllMaintain(params)
    if (res.code === 20000) {
      // console.log(res,'sssssssssssssssssssss')
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 查询
  handleQuery = () => {
    this.fetch(1)
  }
  
  render() {
    const { pageSize, total, data } = this.state
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
        dataIndex: 'maintain_user',
      },
       {
        title: '维护房间',
        align: 'center',
        dataIndex: 'room_message',
        render: room_message=>(
          <div className="space">
            {
                room_message.split(',').map((val,key)=>{
                  return (
                    <div className="table-item-work-blue" key={key}>
                      <div>{val}</div>
                      {room_message.split(',').length-1!==key?<div style={{color:'#000'}}>|</div>:''}
                    </div>
                  )
                })
            } 
          </div>
        )
      },
      {
        title: '维护时间有效期',
        align: 'center',
        render:(record)=>(
          <div>
            {
              `${record.create_time?moment(record.create_time).format('YYYY-MM-DD HH:mm'):''} ~ ${record.end_time?moment(record.end_time).format('YYYY-MM-DD HH:mm'):''}`
            }
          </div>
        )
      },
      {
        title: '维护前图片',
        align: 'center',
        dataIndex: 'proImagesEntity',
        render:(proImagesEntity)=>(
          <div>
            {
              proImagesEntity?(<a href={IP.host+proImagesEntity.image_before_url} target="_blank"><img src={IP.host+proImagesEntity.image_before_url} style={{height:'50px'}} alt="" /></a>):''
            }
          </div>
        )
      },
      {
        title: '维护后图片',
        align: 'center',
        dataIndex: 'proImagesEntity',
        render:(proImagesEntity)=>(
          <div>
            {
              proImagesEntity?(<a href={IP.host+proImagesEntity.image_after_url} target="_blank"><img src={IP.host+proImagesEntity.image_after_url} style={{height:'50px'}} alt="" /></a>):''
            }
          </div>
        )
      },
      {
        title: '维护状态',
        align: 'center',
        dataIndex: 'maintain_state',
        render:maintain_state=>(
          <>
          {/* 待保养 保养中 已完成 */}
            {maintain_state===0 && <span style={{color:'#ec4731'}}>待维护</span>}
            {maintain_state===1 && <span style={{color:' #ebc90a'}}>维护中</span>}
            {maintain_state===2 && <span style={{color:' rgb(64, 207, 64)'}}>已完成</span>}
          </>
        )
      },
      {
        title: '维护前图片上传时间',
        align: 'center',
        dataIndex: 'proImagesEntity',
        render:proImagesEntity=>(
          <>
            {
              proImagesEntity&&proImagesEntity.upload_before_time?moment(proImagesEntity.upload_before_time).format('YYYY-MM-DD HH:mm'):''
            }
          </>
        )
      },
      {
        title: '维护后图片上传时间',
        align: 'center',
        dataIndex: 'proImagesEntity',
        render:proImagesEntity=>(
          <>
            {
              proImagesEntity&&proImagesEntity.upload_after_time?moment(proImagesEntity.upload_after_time).format('YYYY-MM-DD HH:mm'):''
            }
          </>
        )
      },
      {
        title: '维护时长(分钟)',
        align: 'center',
        render:record=>(
          <>
            {
              record.proImagesEntity&&record.proImagesEntity.duration?record.proImagesEntity.duration:record.proImagesEntity&&record.proImagesEntity.duration===0? 0 : ''
            }
          </>
        )
      },
    ]
    return (
      <div className="classStorage">
        <div className="topForm">
          <Form layout="inline">
            <div>
            <Form.Item label="维护人姓名 : ">
                <Input style={{ width: 160 }} placeholder="请输入维护人姓名" onChange={e => this.setState({ user: e.target.value })} />
              </Form.Item>
              <Form.Item label="房间 : ">
                <Input style={{ width: 160 }} placeholder="请输入房间" onChange={e => this.setState({ room_message: e.target.value })} />
              </Form.Item>
              <Form.Item label="维护状态 : ">
                <Select placeholder="请选择维护状态" style={{ width: 160 }} allowClear onChange={(e)=>{
                  this.setState({
                    state:e
                  })
                }}>
                  <Option value="0">待维护</Option>
                  <Option value="1">维护中</Option>
                  <Option value="2">已完成</Option>
                </Select>
              </Form.Item>
              <Form.Item label="日期 : ">
                <RangePicker style={{ width: 320 }} onChange={(item,val)=>{
                  this.setState({
                    startTime:val[0],
                    endTime: val[1]
                  })
                }} />
              </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button style={{ marginRight: 10 }} htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
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
          </div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
      </div>
    )
  }
}
export default Storage