import React, { Component } from 'react'
import { Form, Input, Button, DatePicker, Tabs, Table, Pagination, Modal, Row, Col, InputNumber, message } from 'antd'
import moment from 'moment'
import { warn4Chuku, warn4Kaiguan, warn4ChukuDetails, warn4KaiguanDetails, findWarnConfig, saveWarnConfig, findShebeiLifeRecord, findShebeiKaiguanRecord, req_warn4Touying, req_eidtZhaoduConf } from '../../api/api'
import './index.less'
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
class WarningManagement extends Component {
  formRef = React.createRef();
  state = {
    pageSize: 15,
    total1: 1,
    total2: 1,
    data1: [],//数据
    data2: [],//数据
    endTime1: '',
    startTime1: '',
    classroom_code1: '',
    endTime2: '',
    startTime2: '',
    classroom_code2: '',
    visible: false,
    visible1: false,
    title: '出库预警详情',
    title1: '设置操作不当预警次数',
    data3: [],
    data4: [],
    flag: 1,
    dataWarning: [],
    label: '预警次数',
    message1: '请输入预警次数!',
    shebeiName: '',
    data5: [],
    total5: 1,
    classroomCode: '',
    data6: [],
    total6: 1,
    visible2:false

  }
  componentDidMount() {
    // this.warn4Chuku(1)
    this.warn4Kaiguan(1)
    // this.findShebeiLifeRecord(1)
    // this.findShebeiKaiguanRecord(1)
    // this.findWarnConfig()
  }
  findShebeiKaiguanRecord = async (pageNum) => {
    const { classroomCode, pageSize } = this.state
    const res = await findShebeiKaiguanRecord({ classroomCode, pageSize, pageNum })
    if (res.code === 20000) {
      // console.log(res,'aaaaaaaaaaaaaaaaaaaaaaaaa')
      this.setState({
        data6: res.data && res.data.list ? res.data.list : [],
        total6: res.data.total ? res.data.total : 1
      })
    }
  }
  //查询设备寿命预警
  findShebeiLifeRecord = async (pageNum) => {
    const { shebeiName, pageSize } = this.state
    const res = await req_warn4Touying({ zhaodu_data:shebeiName, pageNum, pageSize })
    if (res.code === 20000) {
      const data = res.data.list.map(val => {
        const item = { ...val }
        const jsonData = JSON.parse(val.zhaodu_data)
        item.app_name = jsonData.app_name
        item.LUX_1 = jsonData.data.LUX_1
        item.group_name = jsonData.group_name
        item.name = jsonData.name
        item.onlineTime = jsonData.onlineTime
        item.lastTime = jsonData.lastTime
        item.states = jsonData.states
        return item
      })
      this.setState({
        data5: data ? data : [],
        total5: res.data.total ? res.data.total : 1
      })
    }
  }
  warn4Chuku = async (pageNum) => {
    const { endTime2, startTime2, classroom_code2, pageSize } = this.state
    const res = await warn4Chuku({ pageSize, pageNum, endTime: endTime2 ? endTime2 + ' 23:59:59' : null, startTime: startTime2 ? startTime2 + ' 00:00:00' : null, classroom_code: classroom_code2 })
    if (res.code === 20000) {
      this.setState({
        data2: res.data && res.data.list ? res.data.list : [],
        total2: res.data.total ? res.data.total : 1
      })
    }
  }
  warn4Kaiguan = async (pageNum) => {
    const { endTime1, startTime1, classroom_code1, pageSize } = this.state
    const res = await warn4Kaiguan({ pageSize, pageNum, endTime: endTime1 ? endTime1 + ' 23:59:59' : null, startTime: startTime1 ? startTime1 + ' 00:00:00' : null, classroom_code: classroom_code1 })
    if (res.code === 20000) {
      this.setState({
        data1: res.data && res.data.list ? res.data.list : [],
        total1: res.data.total ? res.data.total : 1
      })
    }
  }
  warn4ChukuDetails = async (item) => {
    // console.log(item)
    const res = await warn4ChukuDetails({ classroom_id: item.classroom_id, goods_name: item.goods_name, error_opt_time: moment(item.error_opt_time).format('YYYY-MM-DD') })
    if (res.code === 20000) {
      this.setState({
        visible: true,
        title: '出库预警详情',
        data4: res.data && res.data.list ? res.data.list : []
      })
      // console.log(res,1111111111111111111111)
    }
  }

  warn4KaiguanDetails = async (item) => {
    const res = await warn4KaiguanDetails({ classroom_id: item.classroom_id, user_name: item.user_name, error_opt_time: moment(item.error_opt_time).format('YYYY-MM-DD') })
    if (res.code === 20000) {
      this.setState({
        visible: true,
        title: '开关预警详情',
        data3: res.data && res.data.list ? res.data.list : []
      })

    }
  }
  callback = (key) => {
    // console.log(key);
    if (key === '1') {
      this.warn4Kaiguan(1)
    } else if (key === '2') {
      this.warn4Chuku(1)

    } else if (key === '3') {
      this.findShebeiLifeRecord(1)

    } else if (key === '4') {
      this.findShebeiKaiguanRecord(1)
    }
  }
  //findWarnConfig
  findWarnConfig = () => {
    findWarnConfig().then(res => {
      if (res.code === 20000) {
        // console.log(res,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
        this.setState({
          dataWarning: res.data ? res.data : []
        })
      }
    })
  }
  //saveWarnConfig
  //1，出库，2开关   
  setWarningTime = () => {
    const { flag } = this.state
    //proWarnConfigEntity
    //conf_id
    //conf_num
    //conf_flag
    this.formRef.current.validateFields().then(async values => {
      // console.log({...values,conf_flag:flag})
      saveWarnConfig({ ...values, conf_flag: flag }).then(res => {
        if (res.code === 20000) {
          // console.log(res,'aaaaaaaaaaaaaaaaaaaaa')
          this.setState({
            visible1: false
          })
          Modal.success({ content: res.message })
          if (flag === 1) {
            this.warn4Chuku(1)
          } else if (flag === 2) {
            this.warn4Kaiguan(1)
          } else if (flag === 3) {
            this.findShebeiLifeRecord(1)

          } else if (flag === 4) {
            this.findShebeiKaiguanRecord(1)
          }
        }
      })
    })

  }


  eidtZhaoduConf=async()=>{
    this.formRef.current.validateFields().then(async values => {
      const res = await req_eidtZhaoduConf(values)
      if(res.code === 20000){
        this.findShebeiLifeRecord(1)
        this.setState({
          visible2: false
        })
        Modal.success({ content: res.message })
      }
    })
  }


  render() {
    const { pageSize, total1, total2, message1, data5, total5, label, data1, data2, visible, title, title1, visible1, data3, data4, dataWarning, data6, total6, visible2 } = this.state
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const columns1 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '教室门牌号',
        dataIndex: 'classroom_code',
      },
      {
        title: '楼号',
        dataIndex: 'space_name',
      },
      {
        title: '操作不当时间',
        dataIndex: 'error_opt_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD') : ''}</div>
        }
      },
      {
        title: '操作',
        render: (record) => (
          <a href="#!" onClick={() => this.warn4KaiguanDetails(record)}> 详情 </a>
        )
      },
    ]
    const columns2 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '教室门牌号',
        dataIndex: 'classroom_code',
      },
      {
        title: '楼号',
        dataIndex: 'space_name',
      },
      {
        title: '频繁出库时间',
        dataIndex: 'error_opt_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD') : ''}</div>
        }
      },
      {
        title: '操作',
        render: (record) => (
          <a href="#!" onClick={() => this.warn4ChukuDetails(record)}> 详情 </a>
        )
      },
    ]
    const columns3 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '操作人',
        dataIndex: 'kaiguan_user_name',
      },
      {
        title: '开关次数',
        dataIndex: 'num',
      },
      {
        title: '预警时间',
        dataIndex: 'kaiguan_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD') : ''}</div>
        }
      },
    ]
    const columns4 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '出库设备',
        dataIndex: 'goods_name',
      },
      {
        title: '出库次数',
        dataIndex: 'num',
      },
      {
        title: '预警时间',
        dataIndex: 'chuku_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD') : ''}</div>
        }
      },
    ]
    const columns5 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '教室门牌号',
        dataIndex: 'group_name',
      },
      {
        title: '设备型号',
        dataIndex: 'sb_deviceid',
      },
      {
        title: '当前照度值(流明)',
        // dataIndex: 'LUX_1',
        render:record=>{
          return <div style={{color:`${record.LUX_1>=record.yujing_value?'green':'red'}`}}>
              {record.LUX_1}
          </div>
        }
      },
      {
        title: '最大照度值(流明)',
        dataIndex: 'zhaodu_conf',
      },
      {
        title: '预警阀域值(流明)',
        dataIndex: 'yujing_value',
      },
      // {
      //   title: '剩余寿命',
      //   render:record=>{
      //     return <div style={{color:`${(record.LUX_1/record.zhaodu_conf)*100>=record.yujing_value?'green':'red'}`}}>
      //       {((record.LUX_1/record.zhaodu_conf)*100).toFixed(2)}%


      //     </div>
      //   }
      // },
      {
        title: '最后一次上传时间',
        dataIndex: 'lastTime',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD HH:mm') : ''}</div>
        }
      },
      {
        title: '操作',
        render: (record) => (
            <a href="#!"  onClick={()=>{
              console.log(record)
              setTimeout(() => {
                this.formRef.current.setFieldsValue(record)
              }, 10)
              this.setState({
                visible2:true
              })
            }}> 设置 </a>
        )},
    ]
    const columns6 = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '教室门牌号',
        dataIndex: 'classroom_code',
      },
      {
        title: '楼号',
        dataIndex: 'space_name',
      },
      {
        title: '操作人',
        dataIndex: 'user_name',
      },
      {
        title: '设备开启时间',
        dataIndex: 'create_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''}</div>
        }
      },
      // {
      //   title: '操作',
      //   render: (record) => (
      //       <a href="#!"  onClick={()=>this.warn4ChukuDetails(record)}> 详情 </a>
      //   )},
    ]
    return (
      <div className="warningManagement">
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab="操作不当预警" key="1">
            <div className="topForm">
              <Form layout="inline" >
                <div>
                  <Form.Item name="classroom_code1" label="教室门牌号 : ">
                    <Input onChange={(e) => this.setState({ classroom_code1: e.target.value })} style={{ width: 160 }} placeholder="请输入教室门牌号" />
                  </Form.Item>
                  <Form.Item name="admin_time">
                    <RangePicker onChange={(e) => this.setState({ startTime1: e && e[0] ? moment(e[0]).format('YYYY-MM-DD') : '', endTime1: e && e[1] ? moment(e[1]).format('YYYY-MM-DD') : '' })} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item>
                    <Button htmlType="submit" onClick={() => this.warn4Kaiguan(1)} style={{ marginRight: '10px' }}>查询</Button>
                    <Button onClick={() => {
                      findWarnConfig().then(res => {
                        if (res.code === 20000) {
                          // console.log(res,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                          this.setState({
                            dataWarning: res.data ? res.data : []
                          }, () => {
                            this.setState({ visible1: true, title1: '设置每天设备频繁开关预警次数', flag: 2, label: '开关次数', message1: '请输入预警次数!' }, () => {
                              // console.log(dataWarning.filter(item=>item.conf_flag===2))
                              setTimeout(() => {
                                this.formRef.current.setFieldsValue(this.state.dataWarning.filter(item => item.conf_flag === 2)[0])
                              }, 100)
                            })
                          })
                        }
                      })
                    }
                    } type="primary">设置</Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="content_center">
              <div className="content_center_right">
                <div>
                  <Table
                    scroll={{ x: true }}
                    columns={columns1}
                    bordered
                    rowKey={(record) => Math.random()}
                    dataSource={data1}
                    pagination={false} />
                </div>
                <div className="pagination">
                  <div >
                    {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div> */}
                  </div>
                  <div>
                    <Pagination defaultCurrent={1} pageSize={pageSize} total={total1} showSizeChanger={false} onChange={page => this.warn4Kaiguan(page)} style={{ textAlign: 'right', padding: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="频繁出库预警" key="2">
            <div className="topForm">
              <Form layout="inline" >
                <div>
                  <Form.Item name="classroom_code2" label="教室门牌号 : ">
                    <Input onChange={(e) => this.setState({ classroom_code2: e.target.value })} style={{ width: 160 }} placeholder="请输入教室门牌号" />
                  </Form.Item>
                  <Form.Item name="admin_time">
                    <RangePicker onChange={(e) => this.setState({ startTime2: e && e[0] ? moment(e[0]).format('YYYY-MM-DD') : '', endTime2: e && e[1] ? moment(e[1]).format('YYYY-MM-DD') : '' })} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item>
                    <Button htmlType="submit" onClick={() => this.warn4Chuku(1)} style={{ marginRight: '10px' }}>查询</Button>
                    <Button onClick={() => {
                      findWarnConfig().then(res => {
                        if (res.code === 20000) {
                          // console.log(res,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                          this.setState({
                            dataWarning: res.data ? res.data : []
                          }, () => {
                            this.setState({ visible1: true, title1: '设置教室每天频繁更换设备次数预警', flag: 1, label: '出入库次数', message1: '请输入预警次数!' }, () => {
                              // console.log(dataWarning.filter(item=>item.conf_flag===2))
                              setTimeout(() => {
                                this.formRef.current.setFieldsValue(this.state.dataWarning.filter(item => item.conf_flag === 1)[0])
                              }, 100)
                            })
                          })
                        }
                      })
                    }} type="primary">设置</Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="content_center">
              <div className="content_center_right">
                <div>
                  <Table
                    scroll={{ x: true }}
                    columns={columns2}
                    bordered
                    rowKey={(record) => Math.random()}
                    dataSource={data2}
                    pagination={false} />
                </div>
                <div className="pagination">
                  <div >
                    {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div> */}
                  </div>
                  <div>
                    <Pagination defaultCurrent={1} pageSize={pageSize} total={total2} showSizeChanger={false} onChange={page => this.warn4Chuku(page)} style={{ textAlign: 'right', padding: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="投影仪寿命预警" key="3">
            <div className="topForm">
              <Form layout="inline" >
                <div>
                  <Form.Item name="shebeiName" label="组合搜索 : ">
                    <Input onChange={(e) => this.setState({ shebeiName: e.target.value })} style={{ width: 160 }} placeholder="" />
                  </Form.Item>
                  {/* <Form.Item name="admin_time">
                  <RangePicker  onChange={(e)=>this.setState({startTime2:e&&e[0]?moment(e[0]).format('YYYY-MM-DD'):'',endTime2:e&&e[1]?moment(e[1]).format('YYYY-MM-DD'):''})} />
              </Form.Item> */}
                </div>
                <div>
                  <Form.Item>
                    <Button htmlType="submit" onClick={() => this.findShebeiLifeRecord(1)} style={{ marginRight: '10px' }}>查询</Button>
                    {/* <Button onClick={() => {
                      findWarnConfig().then(res => {
                        if (res.code === 20000) {
                          console.log(res,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                          this.setState({
                            dataWarning: res.data ? res.data : []
                          }, () => {
                            this.setState({ visible1: true, title1: '设置投影仪使用寿命预警值', flag: 3, label: "投影仪预警寿命(小时)", message1: '请输入投影仪预警寿命!' }, () => {
                              // console.log(dataWarning.filter(item=>item.conf_flag===2))
                              setTimeout(() => {
                                this.formRef.current.setFieldsValue(this.state.dataWarning.filter(item => item.conf_flag === 3)[0])
                              }, 100)
                            })
                          })
                        }
                      })
                    }} type="primary">设置</Button> */}
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="content_center">
              <div className="content_center_right">
                <div>
                  <Table
                    scroll={{ x: true }}
                    columns={columns5}
                    bordered
                    rowKey={(record) => Math.random()}
                    dataSource={data5}
                    pagination={false} />
                </div>
                <div className="pagination">
                  <div >
                    {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div> */}
                  </div>
                  <div>
                    <Pagination defaultCurrent={1} pageSize={pageSize} total={total5} showSizeChanger={false} onChange={page => this.findShebeiLifeRecord(page)} style={{ textAlign: 'right', padding: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="未关设备预警" key="4">
            <div className="topForm">
              <Form layout="inline" >
                <div>
                  <Form.Item name="classroom_code2" label="教室门牌号 : ">
                    <Input onChange={(e) => this.setState({ classroomCode: e.target.value })} style={{ width: 160 }} placeholder="请输入教室门牌号" />
                  </Form.Item>
                  {/* <Form.Item name="admin_time">
                  <RangePicker  onChange={(e)=>this.setState({startTime2:e&&e[0]?moment(e[0]).format('YYYY-MM-DD'):'',endTime2:e&&e[1]?moment(e[1]).format('YYYY-MM-DD'):''})} />
              </Form.Item> */}
                </div>
                <div>
                  <Form.Item>
                    <Button htmlType="submit" onClick={() => this.findShebeiKaiguanRecord(1)} style={{ marginRight: '10px' }}>查询</Button>
                    <Button onClick={() => {
                      findWarnConfig().then(res => {
                        if (res.code === 20000) {
                          // console.log(res,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
                          this.setState({
                            dataWarning: res.data ? res.data : []
                          }, () => {
                            this.setState({ visible1: true, title1: '设置设备启动最长时间的预警值', flag: 4, label: "设备开关间隔时长(分钟)", message1: '请输入报警时间!' }, () => {
                              // console.log(dataWarning.filter(item=>item.conf_flag===2))
                              setTimeout(() => {
                                this.formRef.current.setFieldsValue(this.state.dataWarning.filter(item => item.conf_flag === 4)[0])
                              }, 100)
                            })
                          })
                        }
                      })
                    }} type="primary">设置</Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="content_center">
              <div className="content_center_right">
                <div>
                  <Table
                    scroll={{ x: true }}
                    columns={columns6}
                    bordered
                    rowKey={(record) => Math.random()}
                    dataSource={data6}
                    pagination={false} />
                </div>
                <div className="pagination">
                  <div >
                    {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div> */}
                  </div>
                  <div>
                    <Pagination defaultCurrent={1} pageSize={pageSize} total={total6} showSizeChanger={false} onChange={page => this.findShebeiKaiguanRecord(page)} style={{ textAlign: 'right', padding: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
        <Modal
          className="modaldetail_content"
          title={title}
          visible={visible}
          footer={false}
          onCancel={() => { this.setState({ visible: false, data3: [], data4: [] }) }}
        >
          <div className="modaldetail">
            {
              data3.length ? <Table
                scroll={{ x: true }}
                columns={columns3}
                bordered
                rowKey={(record) => Math.random()}
                dataSource={data3}
                pagination={false} /> : ''
            }
            {
              data4.length ? <Table
                scroll={{ x: true }}
                columns={columns4}
                bordered
                rowKey={(record) => Math.random()}
                dataSource={data4}
                pagination={false} /> : ''
            }
          </div>
        </Modal>
        <Modal
          className="modaldetail_content"
          title={title1}
          visible={visible1}
          onOk={() => this.setWarningTime()}
          onCancel={() => { this.setState({ visible1: false }) }}
        >
          <div className="setWarningTime">
            <Form ref={this.formRef} {...formItemLayout}>
              <Form.Item name="conf_id" hidden>
                <Input style={{ width: '300px' }} />
              </Form.Item>
              <Form.Item label={label} name="conf_num" rules={[{ required: true, message: message1 }]}>
                <InputNumber style={{ width: '300px' }} min={0} />
              </Form.Item>
            </Form>
            {/* <div style={{display:'flex'}}><span style={{color:'red',width:'115px',textAlign:'right',marginRight:'3px'}}>*</span><span style={{flex:'1'}}>{title1}</span></div> */}
          </div>
        </Modal>


        <Modal
          className="modaldetail_content"
          title='预警设置'
          visible={visible2}
          onOk={() => this.eidtZhaoduConf()}
          onCancel={() => { this.setState({ visible2: false }) }}
        >
          <div className="setWarningTime">
            <Form ref={this.formRef} {...formItemLayout}>
              <Form.Item name="sb_deviceid" hidden>
                <Input style={{ width: '300px' }} />
              </Form.Item>
              <Form.Item label="最大照度值(流明)" name="zhaodu_conf" rules={[{ required: true, message: '请输入最大照度值' }]}>
                <InputNumber style={{ width: '300px' }} min={0} />
              </Form.Item>
              <Form.Item label="预警阀域值(流明)" name="yujing_value" rules={[{ required: true, message: '请输入预警阀域值' }]}>
                <InputNumber style={{ width: '300px' }} min={0} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
export default WarningManagement