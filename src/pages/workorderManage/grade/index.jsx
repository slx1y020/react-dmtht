/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Form, Button, Table, Pagination, Modal, Radio, DatePicker } from 'antd'
import { req_repairOrderCountScore, req_exportOrderScoreExcel, req_exportOrderExcel } from '../../../api/hdlApi'
import './index.less'
import moment from 'moment'
import IP from './../../../config/config'

const { RangePicker, WeekPicker } = DatePicker;

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
    flag: 1,
    date:[]
  }

  componentDidMount = () => {
    this.setState({
      date:[
        moment(),
        moment()
      ]
    },()=>{
      this.fetch(1)
    })
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { flag,date, pageSize } = this.state
    let startTime= ''
    let endTime= ''
    if(flag===1){
      startTime = date.length>0?moment(date[0]).format('YYYY-MM-DD 00:00:00'):''
      endTime = date.length>0?moment(date[1]).format('YYYY-MM-DD 23:59:59'):''
    }else if(flag===2){
      startTime = date?moment(date).day(1).format('YYYY-MM-DD'):''
      endTime = date?moment(date).day(7).format('YYYY-MM-DD'):''
      console.log(startTime,endTime)
    }else{
      startTime = date.length>0?moment(date[0]).format('YYYY-MM'):''
      endTime = date.length>0?moment(date[1]).format('YYYY-MM'):''
    }
    const params = {
      flag,
      startTime,
      endTime,
      pageNum,
      pageSize
    }
    const res = await req_repairOrderCountScore(params)
    if (res.code === 20000) {
      this.setState({
        data: flag === 2 ? res.data : res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 查询
  handleQuery = () => {
    this.fetch(1)
  }

  // 导出
  exportOrderExcel = async () => {
    const { flag,date } = this.state
    let startTime= ''
    let endTime= ''
    if(flag===1){
      startTime = date.length>0?moment(date[0]).format('YYYY-MM-DD 00:00:00'):''
      endTime = date.length>0?moment(date[1]).format('YYYY-MM-DD 23:59:59'):''
    }else if(flag===2){
      startTime = date?moment(date).day(1).format('YYYY-MM-DD'):''
      endTime = date?moment(date).day(7).format('YYYY-MM-DD'):''
      console.log(startTime,endTime)
    }else{
      startTime = date.length>0?moment(date[0]).format('YYYY-MM'):''
      endTime = date.length>0?moment(date[1]).format('YYYY-MM'):''
    }
    const params = {
      flag,
      startTime,
      endTime
    }
    await req_exportOrderScoreExcel(params)

    // const startTimes = date[0] ? ('&startTime=' + date[0]) : '';
    // const endTimes = date[1] ? ('&endTime=' + date[1]) : '';
    // const flags = flag ? ('&flag=' + flag) : '';
    // const x = `${IP.host}/order/exportOrderScoreExcel?${startTimes}${endTimes}${flags}`
    // window.location.href = x
    Modal.success({ content: "导出成功" })
  }



  render() {
    const { pageSize, total, data, flag } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'key',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '维修工',
        dataIndex: 'user_name',
        key: 'user_name',
        align: 'center',
      },
      {
        title: '周一',
        dataIndex: 'monday',
        key: 'monday',
        align: 'center',
      },
      {
        title: '周二',
        dataIndex: 'tuesday',
        key: 'tuesday',
        align: 'center',
      },
      {
        title: '周三',
        dataIndex: 'wednesday',
        key: 'wednesday',
        align: 'center',
      },
      {
        title: '周四',
        dataIndex: 'thursday',
        key: 'thursday',
        align: 'center',
      },
      {
        title: '周五',
        dataIndex: 'friday',
        key: 'friday',
        align: 'center',
      },
      {
        title: '周六',
        dataIndex: 'saturday',
        key: 'saturday',
        align: 'center',
      },
      {
        title: '周日',
        dataIndex: 'weekday',
        key: 'weekday',
        align: 'center',
      },
      {
        title: '总分数',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
      }
    ]

    return (
      <div className="classStorage">
        <div className="topForm">
          <div style={{ paddingBottom: '10px' }}>
            <Radio.Group defaultValue={flag} buttonStyle="solid" onChange={(e) => {
              let date = []
              if(e.target.value===1){
                date=[
                  moment(),
                  moment()
                ]
              }else if(e.target.value===2){
                date=moment()
                console.log(date)
              }else{
                date=[
                  moment(),
                  moment()
                ]
              }
              this.setState({
                flag: e.target.value,
                date
              }, () => {
                this.fetch(1);
              })
            }}>
              <Radio.Button value={1}>按天</Radio.Button>
              <Radio.Button value={2}>按周</Radio.Button>
              <Radio.Button value={3}>按月</Radio.Button>
            </Radio.Group>
          </div>
          <Form layout="inline">
            <div>
              {flag === 1 ? (<RangePicker style={{width:'370px'}} placeholder={['开始时间', '结束时间']} value={this.state.date} onChange={(date, dateString) => {
                this.setState({
                  date
                })
              }} />) : ('')}
              {
                flag === 2 ? (<WeekPicker style={{width:'200px'}} value={this.state.date} placeholder="请选择周" onChange={(date) => {
                  this.setState({
                    date
                  })
                }} />) : ('')
              }
              {
                flag === 3 ? (<RangePicker style={{width:'370px'}} value={this.state.date} picker="month" onChange={(date) => {
                  this.setState({
                    date
                  })
                }} />) : ('')
              }
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
            columns={flag===1 || flag===3?columns.filter(x=> x.key==='key' || x.key==='user_name' || x.key==='score'):columns}
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
      </div>
    )
  }
}
export default Storage