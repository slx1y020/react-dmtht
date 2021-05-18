import React, { Component } from 'react';
import { Row, Col, Select, DatePicker,Button} from 'antd'
import { Column, Pie, GroupedColumn } from '@ant-design/charts';
import { req_findSpaceByFloor, countClassroomType, countClassroom, countWarn, countWarnType } from '../../../api/hdlApi'
import './index.less'

const { RangePicker } = DatePicker;

class DataStatistics extends Component {

  state = {
    buildData: [],
    typeBarData: [],
    typePieData: [],
    warnBarData: [],
    warnBarDatas:[],
    warnPieData: [],
    faultBarData: [],
    faultBarDatas:[],
    value1: 0,
    value2: 0,
    startTime: '',
    endTime: '',
    kaiguan:[],chuku:[],shouming:[],weiguan:[],indexNum1:1, indexNum2:1,indexPages:8
  }

  componentDidMount = () => {
    this.fetchBuild()
    this.fetchType()
  }

  // 查询所有楼信息
  fetchBuild = async () => {
    const res = await req_findSpaceByFloor()
    if (res.code === 20000) {
      this.setState({
        buildData: res.data,
        value1: res.data&&res.data.length?res.data[0].space_id:null,
        value2: res.data&&res.data.length?res.data[0].space_id:null
      })
      this.fetchFault(res.data&&res.data.length?res.data[0].space_id:null)
      this.fetchWarn(res.data&&res.data.length?res.data[0].space_id:null)
      this.fetchWarnType(res.data&&res.data.length?res.data[0].space_id:null)
    }
  }

  // 查询教室类型
  fetchType = async spaceId => {
    const res = await countClassroomType({ spaceId })
    if(res.code === 20000) {
      this.setState({
        typeBarData: (res.data || []).map(x => {
          return {
            '   ': x.classroom_code,
            '房间数': x.num,
          }
        }),
        typePieData: res.data || []
      })
    }
  }

  // 故障教室统计
  fetchFault = async spaceId => {
    const res = await countClassroom({ spaceId })
    if (res.code === 20000) {
      this.setState({
        faultBarDatas:(res.data || []).map(x => {
          return {
            '教室名称': x.classroom_code,
            '故障次数': x.num
          }
        })
      })
      this.setState({
        faultBarData: (res.data || []).map(x => {
          return {
            '教室名称': x.classroom_code,
            '故障次数': x.num
          }
        })
      }) 
    }
  }

  // 预警次数统计
  fetchWarn = async (spaceId, startTime, endTime) => {
    const res = await countWarn({ spaceId, startTime: startTime ? startTime + ' 00:00:00' : null, endTime: endTime ? endTime + ' 23:59:59' : null })
    if (res.code === 20000) {
      this.setState({
        kaiguan:res.data.kaiguan || [],
        chuku:res.data.chuku || [],
        shouming:res.data.shouming || [],
        weiguan:res.data.weiguan || []
      })
      const array1 = (res.data.kaiguan || []).map(x => {
        return {
          'name': '操作不当',
          '教室名称': x.classroom_code,
          '预警次数': x.num ? x.num : 0,
        }
      })
      const array2 = (res.data.chuku || []).map(y => {
        return {
          'name': '频繁出库',
          '教室名称': y.classroom_code,
          '预警次数': y.num ? y.num: 0,
        }
      })
      const array3 = (res.data.shouming || []).map(z => {
        return {
          'name': '投影仪寿命',
          '教室名称': z.classroom_code,
          '预警次数': z.num ? z.num : 0,
        }
      })
      const array4 = (res.data.weiguan || []).map(p => {
        return {
          'name': '未关设备',
          '教室名称': p.classroom_code,
          '预警次数': p.num ? p.num: 0,
        }
      })
      const newArray = array1.concat(array2).concat(array3).concat(array4)
      this.setState({
        warnBarData: newArray,
        warnBarDatas:newArray
      })
    }
  }

  // 预警类型占比
  fetchWarnType = async (spaceId, startTime, endTime) => {
    const res = await countWarnType({ spaceId:spaceId?spaceId:null, startTime: startTime ? startTime + ' 00:00:00' : null, endTime: endTime ? endTime + ' 23:59:59' : null })
    if (res.code === 20000 && res.data) {
      const array = [
        { type: '操作不当', num: res.data.kaiguan ? res.data.kaiguan : 0 },
        { type: '频繁出库', num: res.data.chuku ? res.data.chuku : 0 },
        { type: '投影仪寿命', num: res.data.shouming ? res.data.shouming : 0 },
        { type: '未关设备', num: res.data.weiguan ? res.data.weiguan : 0 },
      ]
      this.setState({
        warnPieData: array
      })
    }
  }

  // 教室类型选择楼宇
  handleChangeClassroom = e => {
    this.fetchType(e)
  }

  // 教室故障率选择楼宇
  handleChangeFault = e => {
    this.setState({
      value2: e
    })
    this.fetchFault(e)
  }

  // 预警选择楼宇
  handleChangeWarn = e => {
    const { startTime, endTime } = this.state;
    this.setState({
      value1: e
    })
    this.fetchWarn(e, startTime, endTime)
    this.fetchWarnType(e, startTime, endTime)
  }

  // 预警选择时间段
  handleChangeRangePicker = (date, dateString) => {
    const { value1 } = this.state;
    // console.log(dateString)
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1]
    })
    this.fetchWarn(value1, dateString[0], dateString[1])
    this.fetchWarnType(value1, dateString[0], dateString[1])
  }
  //过滤
  dddd=(kaiguan,chuku,shouming,weiguan)=>{
    // const {kaiguan,chuku,shouming,weiguan}=this.state
    const array1 = (kaiguan || []).map(x => {
      return {
        'name': '操作不当',
        '教室名称': x.classroom_code,
        '预警次数': x.num ? x.num : 0,
      }
    })
    const array2 = (chuku || []).map(y => {
      return {
        'name': '频繁出库',
        '教室名称': y.classroom_code,
        '预警次数': y.num ? y.num: 0,
      }
    })
    const array3 = (shouming || []).map(z => {
      return {
        'name': '投影仪寿命',
        '教室名称': z.classroom_code,
        '预警次数': z.num ? z.num : 0,
      }
    })
    const array4 = (weiguan || []).map(p => {
      return {
        'name': '未关设备',
        '教室名称': p.classroom_code,
        '预警次数': p.num ? p.num: 0,
      }
    })
    const newArray = array1.concat(array2).concat(array3).concat(array4)
    this.setState({
      warnBarData: newArray
    })
  
  }
  clickLeft = (index) => {
    const { indexNum1, indexNum2,faultBarDatas, indexPages ,kaiguan,chuku,shouming,weiguan} = this.state
    //2表示第二个统计图
    if (index === 2) {
        this.setState({
            indexNum2: indexNum2 - 1,
        }, () => {
              this.setState({
                faultBarData:faultBarDatas.slice((this.state.indexNum2 - 1) * indexPages, this.state.indexNum2 * indexPages),
              })
        });
    } else {
        this.setState({
            indexNum1: indexNum1 - 1,
        }, () => {
          // kaiguan,chuku,shouming,weiguan
          this.dddd(kaiguan.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),chuku.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),shouming.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),weiguan.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages))
        });
    }
}
clickRight = (index) => {
    const { indexNum1, indexNum2,faultBarDatas, indexPages,kaiguan,chuku,shouming,weiguan} = this.state
    //2表示第二个统计图
    if (index === 2) {
        this.setState({
            indexNum2: indexNum2 + 1,
        }, () => {
          this.setState({
            faultBarData:faultBarDatas.slice((this.state.indexNum2 - 1) * indexPages, this.state.indexNum2 * indexPages),
          })
        });
    } else {
        this.setState({
            indexNum1: indexNum1 + 1,
        }, () => {
          this.dddd(kaiguan.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),chuku.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),shouming.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages),weiguan.slice((this.state.indexNum1 - 1) * indexPages, this.state.indexNum1 * indexPages) )
        });
    }
}
  render() {
    const { buildData, typeBarData, typePieData,warnBarDatas, warnBarData,faultBarDatas, faultBarData, warnPieData, value1, value2,indexNum1,indexNum2 } = this.state;
    const typeBarConfig = {
      forceFit: true,
      padding: 'auto',
      data: typeBarData,
      xField: '   ',
      yField: '房间数',
      label: {
        visible: true,
        position: 'top',
      },
      meta: {
        type: { alias: '类型' },
        sales: { alias: '房间数' },
      },
    }
    const typePieConfig = {
      forceFit: true,
      radius: 0.8,
      data: typePieData,
      angleField: 'num',
      colorField: 'classroom_code',
      label: {
        visible: true,
        type: 'spider',
      },
    }
    const warnBarConfig = {
      forceFit: true,
      // spacing:50,
      data: warnBarData,
      xField: '教室名称',
      yField: '预警次数',
      groupField: 'name',
      // columnSize :50,
      xAxis: {
        spacing:200,
      tickLine: {
        visible: true,
        },
        label: {
          visible: true,
          autoHide: true,
        },
      },
      yAxis: {
        visible: true,
        label: {
          visible: true,
          formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        }
      },
      interactions: [
        {
          type: 'scrollbar',
        },
      ],
    };
    const warnPieConfig = {
      forceFit: true,
      radius: 0.8,
      data: warnPieData,
      angleField: 'num',
      colorField: 'type',
      label: {
        visible: true,
        type: 'spider',
      },
    }
    const faultBarConfig = {
      forceFit: true,
      data: faultBarData,
      padding: 'auto',
      xField: '教室名称',
      yField: '故障次数',
      xAxis: {
        visible: true,
        tickLine: {
          visible: true,
          },
        label: {
          visible: true,
          autoHide: true,
        },
      },
      yAxis: {
        visible: true,
        label: {
          visible: true,
          formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        }
      },
      interactions: [
        {
          type: 'scrollbar',
        },
      ],
    };
    return (
      <div className='dataStatistics'>
        <Row gutter={16}>
          <Col className="gutter-row" span={14}>
            <div className='statistics-col'>
              <div className='statistics-title'>
                <div className='statistics-title-name'>教室类型统计</div>
                <div className='statistics-title-classroom'>
                  <Select style={{ width: 180 }} allowClear placeholder='请选择楼宇' onChange={e => this.handleChangeClassroom(e)}>
                    {
                      (buildData || []).map(item => <Select.Option key={item.space_id} value={item.space_id}>{item.space_name}</Select.Option>)
                    }
                  </Select>
                </div>
              </div>
              <div className='statistics-charts'>
                <Column {...typeBarConfig} height={280} />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={10}>
            <div className='statistics-col'>
              <div className='statistics-title'>
                <div className='statistics-title-name'>教室类型占比</div>
              </div>
              <div className='statistics-charts'>
                <Pie {...typePieConfig} height={280} />
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col className="gutter-row" span={14}>
            <div className='statistics-col'>
              <div className='statistics-title'>
                <div className='statistics-title-name'>预警次数统计</div>
                <div className='statistics-title-classroom'>
                  <RangePicker onChange={(date, dateString) => this.handleChangeRangePicker(date, dateString)} style={{ marginRight: 10 }} />
                  <Select style={{ width: 180 }} value={value1} placeholder='请选择楼宇' onChange={e => this.handleChangeWarn(e)}>
                    {
                      (buildData || []).map(item => <Select.Option key={item.space_id} value={item.space_id}>{item.space_name}</Select.Option>)
                    }
                  </Select>
                </div>
              </div>
              <div className='statistics-charts'>
                {
                  warnBarData&&warnBarData.length?<GroupedColumn {...warnBarConfig} height={270} />:<div style={{fontSize:'20px',color:'rgba(124, 126, 128,0.8)',textAlign:'center',marginTop:'15px'}}>
                  暂无数据
                </div>
                }
                
              </div>
              {/* <div className="pagination-my"> 
                <div><Button size="small" disabled={indexNum1 == 1 ? true : false} onClick={() => this.clickLeft(1)}>{'<'}</Button><span>{indexNum1}</span>/<span>{Math.ceil(warnBarDatas.length/4/8)}</span><Button onClick={() => this.clickRight(1)}  size="small"  disabled={indexNum1 == Math.ceil(warnBarDatas.length/4/8) ? true : false}>{">"}</Button></div>
              </div> */}
            </div>
          </Col>
          <Col className="gutter-row" span={10}>
            <div className='statistics-col'>
              <div className='statistics-title'>
                <div className='statistics-title-name'>预警类型占比</div>
              </div>
              <div className='statistics-charts'>
                <Pie {...warnPieConfig} height={280} />
              </div>
              {/* <div className="pagination-my"> 
                
                </div> */}
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col className="gutter-row" span={24}>
            <div className='statistics-col'>
              <div className='statistics-title'>
                <div className='statistics-title-name'>教室故障率统计</div>
                <div className='statistics-title-classroom'>
                  <Select style={{ width: 180 }} value={value2} placeholder='请选择楼宇' onChange={ e => this.handleChangeFault(e) }>
                    {
                      (buildData || []).map(item => <Select.Option key={item.space_id} value={item.space_id}>{item.space_name}</Select.Option>)
                    }
                  </Select>
                </div>
              </div>
              <div className='statistics-charts'>
                {
                  faultBarData&&faultBarData.length?<Column {...faultBarConfig} height={270} />:<div style={{fontSize:'20px',color:'rgba(124, 126, 128,0.8)',textAlign:'center',marginTop:'15px'}}>
                  暂无数据
                </div>
                }
                
              </div>
              {/* <div className="pagination-my"> 
                <div><Button size="small" disabled={indexNum2 == 1 ? true : false} onClick={() => this.clickLeft(2)}>{'<'}</Button><span>{indexNum2}</span>/<span>{Math.ceil(faultBarDatas.length / 8)}</span><Button onClick={() => this.clickRight(2)}  size="small"  disabled={indexNum2 == Math.ceil(faultBarDatas.length / 8) ? true : false}>{">"}</Button></div>
              </div> */}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataStatistics;