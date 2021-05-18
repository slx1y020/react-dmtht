import React, { Component } from 'react'
import { Row, Col, Select, Button, Radio } from 'antd'
import { Area, Donut, Column } from '@ant-design/charts';
import { req_repairOrderLineChart, req_repairOrderPieChart, req_repairOrderBarGraph } from '../../../api/api'
import { req_findWorkUser } from '../../../api/hdlApi'
import './index.less'

class WorkStatistics extends Component {
  state = {
    workUser: [], // 维修工
    orderData: [], // 工单量走势
    orderPieData: [], //维修类型占比
    barGraphData: [], // 维修工工单量排名
    flag: 0, // 统计类型 0按天统计 1按月统计
    workerName: '', // 维修工名称
    sort: 0, //排序
    serviceData: {}, // 维修工信息
    numMax: 0, // 最小
    numMin: 0, // 最大
  }

  componentDidMount = async () => {
    await this.fetchWork()
    await this.repairOrderLine();
    await this.repairOrderPie();
    await this.repairOrderBarGraph();
  }

  // 查询维修人员信息
  fetchWork = async () => {
    const res = await req_findWorkUser()
    if (res.code === 20000) {
      this.setState({
        workUser: res.data
      })
    }
  }

  // 工单量走势
  repairOrderLine = async () => {
    const { flag, workerName } = this.state;
    const res = await req_repairOrderLineChart({ flag, workerName })
    if (res.code === 20000) {
      const b = JSON.parse(JSON.stringify(res.data || []).replace(/num/g, '维修次数'));
      // console.log(b,'aaaaaaaaaaaaaaaaaaaaa')
      this.setState({
        orderData: b
      })
    }
  };

  // 维修类型占比
  repairOrderPie = async () => {
    const res = await req_repairOrderPieChart()
    if (res.code === 20000) {
      // console.log(res,'dddddddddddddddd')
      const data = [
        {
          item: '电话报修',
          count: res.data[0]['phone'],
        },
        {
          item: '填单报修',
          count: res.data[0]['tiandan'],
        },
        {
          item: '语音报修',
          count: res.data[0]['voice'],
        }
      ]
      this.setState({
        orderPieData: data,
      })
    }
  };

  // 维修工工单量排名
  repairOrderBarGraph = async () => {
    const { sort } = this.state;
    const res = await req_repairOrderBarGraph({ sort })
    if (res.code === 20000) {
      let num = res.data.finishOrderNum
      this.setState({
        serviceData: res.data.workerNum,
        barGraphData: num.map(x => {
          return {
            ' ': x.user_name,
            '工单数量': x.total,
          }
        }),
        numMax: num && num.length ? (sort === 0 ? num[num.length - 1].total : num[0].total) : 0,
        numMin: num && num.length ? (sort === 1 ? num[num.length - 1].total : num[0].total) : 0,
      },()=>{
        // console.log(this.state.barGraphData)
      })
    }
    // req_repairOrderBarGraph(param).then(res => {
    //   if (res.code === 20000) {
    //     const data = res.data.finishOrderNum.map(v => {
    //       const arr = {
    //         year: v.user_name,
    //         工单数量: v.total
    //       }
    //       return arr;
    //     })
    //     let num = res.data.finishOrderNum;
    //     console.log(num)
    //     this.setState({
    //       barGraphData: data,
    //       numMax: num && num.length ? (sort === 0 ? num[num.length - 1].total : num[0].total) : '',
    //       numMin: num && num.length ? (sort === 1 ? num[num.length - 1].total : num[0].total) : '',
    //       serviceData: res.data.workerNum,
    //     });
    //   }
    // });
  };

  render() {
    const { orderData, orderPieData, barGraphData, sort, serviceData, numMax, numMin, workUser } = this.state
    const orderLineConfig = {
      forceFit: true,
      padding: 'auto',
      data: orderData,
      xField: 'create_time',
      yField: '维修次数',
    }
    const orderPieConfig = {
      forceFit: true,
      radius: 0.9,
      padding: 'auto',
      data: orderPieData,
      angleField: `count`,
      colorField: 'item',
      // statistic: { visible: true },
      meta: {
        item: {
          alias:'报修类型',
          range: [0, 1],
        },
        count: {
          alias: '报修数量',
          formatter:(v)=>{return `${v}`}
        }
      },
    }
    const orderBarConfig = {
      forceFit: true,
      padding: 'auto',
      data: barGraphData,
      xField: ' ',
      yField: '工单数量',
      label: {
        visible: true,
        position: 'top',
      },
    }

    return (
      <div style={{ height: "100%", background: "#F2F3F6" }}>
        <Row>
          <Col span={24} className="main-col">
            <div className="main-title">
              <div className="title-name">工单量走势图</div>
              <div>
                {/* <Input style={{ width: "200px", marginRight: "20px" }} placeholder="请输入维修工姓名" onChange={(e) => {
                  this.setState({
                    workerName: e.target.value
                  })
                }} /> */}
                <Select
                  allowClear
                  showSearch
                  style={{ width: 200, marginRight: 20 }}
                  placeholder="请选择维修工"
                  optionFilterProp="children"
                  onChange={e => this.setState({
                    workerName: e
                  })}
                >
                  
                  {
                    (workUser || []).map(item => <Select.Option key={item.user_id} value={item.user_name}>{item.user_name}</Select.Option>)
                  }
                </Select>
                <Button type="primary" onClick={() => {
                  this.repairOrderLine();
                }}>搜索</Button>
              </div>
            </div>
            <div className="main-chart-400">
              <div className="main-radio">
                <Radio.Group defaultValue={0} buttonStyle="solid" onChange={(e) => {
                  this.setState({
                    flag: e.target.value
                  }, () => {
                    this.repairOrderLine();
                  })
                }}>
                  <Radio.Button value={0}>按天统计</Radio.Button>
                  <Radio.Button value={1}>按月统计</Radio.Button>
                </Radio.Group>
              </div>
              {
                orderData&&orderData.length?<Area {...orderLineConfig} height={300} />:<div style={{fontSize:'20px',color:'rgba(124, 126, 128,0.8)',textAlign:'center',marginTop:'15px'}}>
                  暂无数据
                </div>
              }
              
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={10} className="main-col">
            <div className="main-title">
              <div className="title-name">维修类型占比</div>
            </div>
            <div className="main-chart-450">
              <Donut {...orderPieConfig} height={292} />
            </div>
          </Col>
          <Col span={13} className="main-col" style={{ marginLeft: "20px" }}>
            <div className="main-title">
              <div className="title-name">维修工完成工单量排名</div>
            </div>
            <div className="maintain">
              <div>
                <span className="main-count">
                  {serviceData.workernum || 0}
                </span>
                <span>维修工总数</span>
              </div>
              <div>
                <span className="main-count">
                  {serviceData.total && serviceData.workernum ? (serviceData.total / serviceData.workernum).toFixed(0) : 0}
                </span>
                <span>平均维修数</span>
              </div>
              <div>
                <span className="main-count">
                  {numMax || 0}
                </span>
                <span>最高维修数</span>
              </div>
              <div>
                <span className="main-count" style={{ color: "red" }}>
                  {numMin || 0}
                </span>
                <span>最低维修数</span>
              </div>
            </div>
            <div className="main-sort">
              <Radio.Group onChange={(e) => {
                this.setState({
                  sort: e.target.value
                }, () => {
                  this.repairOrderBarGraph();
                })
              }} value={sort}>
                <Radio value={0}>正序</Radio>
                <Radio value={1}>倒序</Radio>
              </Radio.Group>
            </div>
            <div className="main-chart-500">
              {
                barGraphData&&barGraphData.length?<Column {...orderBarConfig} height={292} />:<div style={{fontSize:'20px',color:'rgba(124, 126, 128,0.8)',textAlign:'center',marginTop:'15px'}}>
                暂无数据
              </div>
              }
              
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default WorkStatistics;