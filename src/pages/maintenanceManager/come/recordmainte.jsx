import React, { Component } from 'react'
import { Form, Input, Button, Select, Tooltip, Table, Pagination, DatePicker ,Modal} from 'antd'
import { req_findRepairRepertoryName, req_findRepairGoodsByName, req_findRepairGoodsType, req_findRepairGoodsProducerAll, req_findRepairGoodsExportAll, req_findRepairGoodsRepertoryTypeAll,req_findRepairGoodsRepertoryName } from '../../../api/hdlApi'
import {req_findAllSpaceFloorRoom, req_searchWarehouse, req_searchWarehouseType, req_searchThingType, req_goodsProducer, req_goodsName, req_out } from '../../../api/api'
import moment from 'moment'
import './index.less'

const { Option } = Select;
const { RangePicker } = DatePicker;

class Record extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    total1: 0,
    exportRoleName: '', // 姓名
    roleIsActive: '', // 状态
    data: [],
    visible: false,
    goodNameData:[], // 物料名称
    goodTypeData:[], // 物料分类
    producerAllData:[], // 所属厂家
    repertoryData:[], // 库名称
    goodsRepertoryData:[], //库类型
    downloadVisible: false, // 判断是否导出数据
    visibleAdd:false,
    warehouse:[],
    libraryName:[],
    materialClass:[],
    manufacturer:[],
    goodsDate:[],
    goodsnum:null,
    FloorRoomData:[],
    roomData:[]
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findGoodsName()
    this.findGoodsType()
    this.findProudcer()
    this.findRepertory()
    this.findGoodsRepertory()
    this.findFloorRoom()
    this.searchWarehouse()
  }
  componentWillReceiveProps(prevProps){
    if(prevProps.msg==='3'){
      this.fetch(1)
    }
  }  
  // 查询维修区域
  findFloorRoom = async () => {
    const res = await req_findAllSpaceFloorRoom()
    if (res.code === 20000) {
      this.setState({
        FloorRoomData:res.data?res.data:[]
      })
    }
  }

  // 查看所管理的库
  searchWarehouse = () => {
    req_findRepairGoodsRepertoryName({pageNum:1,pageSize:999999}).then(res=>{
      if(res.code===20000){
        this.setState({
          warehouse:res.data&&res.data.list?res.data.list:[]
        })
      }
    })
  }
  // 查询角色信息
  fetch = async pageNum => {
    const { pageSize, goods_name,user_name, downloadVisible, startTime, endTime, total, goods_type_id, producer_id, repertory_name_id, repertory_type_id } = this.state
    const params= {
      flag: 0,
      goods_name,
      goods_type_id,
      user_name,
      producer_id,
      repertory_name_id,
      repertory_type_id,
      pageNum,
      pageSize: downloadVisible ? total : pageSize,
      startTime: startTime && (startTime.concat(" 00:00:00")),
      endTime: endTime && (endTime.concat(" 23:59:59")),
    }
    const res = await req_findRepairGoodsExportAll(params)
    if (res.code === 20000) {
      // console.log(res.data.list,'ssssssssssssssssssss')
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1,
        total1: res.data.total ,
      })
    }
  }
  
  // 获取所有物料名称
  findGoodsName=async()=>{
    const res = await req_findRepairGoodsByName()
    if(res.code===20000){
      this.setState({
        goodNameData:res.data
      })
    }
  }

  // 获取所有物料分类
  findGoodsType=async()=>{
    const res = await req_findRepairGoodsType({ pageNum:1, pageSize:1000 })
    if(res.code === 20000){
      this.setState({
        goodTypeData:res.data.list
      })
    }
  }

  // 获取所有所属厂家
  findProudcer=async()=>{
    const res = await req_findRepairGoodsProducerAll({ pageNum:1, pageSize:1000 })
    if(res.code === 20000){
      this.setState({
        producerAllData:res.data.list
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
  //添加出库提交
  outAdd=()=>{
    const {roomData,FloorRoomData,manufacturer,goodsDate,materialClass,repertoryData,libraryName}=this.state
    this.formRef.current.validateFields().then(async values => {
      // console.log(values,'sssssssssssssssssssssss')
      var promes={
        area_id:values.area_id,
        area_name:FloorRoomData.find(item=>item.space_id===values.space_id).space_name+" "+roomData.find(item=>item.classroom_id===values.area_id).classroom_code,
        flag:values.flag,
        producer_id:values.producer_id,
        producer_name:manufacturer.find(item=>item.producer_id===values.producer_id).producer_name,
        goods_id:values.goods_id,
        goods_name:goodsDate.find(item=>item.id===values.goods_id).goods_name,
        goods_type_id:values.goods_type_id,
        goods_type_name:materialClass.find(item=>item.goods_type_id===values.goods_type_id).goods_type_name,
        repair_reason:values.repair_reason,
        repertory_name_id:values.repertory_name_id,
        repertory_name:repertoryData.find(item=>item.repertory_name_id===values.repertory_name_id).repertory_name,
        repertory_type_id:values.repertory_type_id,
        repertory_type_name:libraryName.find(item=>item.repertory_type_id===values.repertory_type_id).repertory_type_name,
        repair_money:values.repair_money
      }
      // console.log(promes)
      // return
      req_out(JSON.stringify(promes)).then(res=>{
        if(res.code===20000){
          this.formRef.current.resetFields()
          this.setState({
            visibleAdd:false,
          })
          this.fetch(1)
          Modal.success({ content: '操作成功！' })
        }
      })
    })
  }
  render() {
    const { pageSize, total,total1, data, goodTypeData, producerAllData, repertoryData, goodsRepertoryData,warehouse,libraryName,materialClass,manufacturer,goodsDate,FloorRoomData,goodsnum,roomData } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '出库单号',
        align: 'center',
        dataIndex: 'export_no',
      }, {
        title: '物料名称',
        align: 'center',
        dataIndex: 'goods_name',
      }, {
        title: '物料分类',
        align: 'center',
        dataIndex: 'goods_type_name',
      }, {
        title: '所属厂家',
        align: 'center',
        dataIndex: 'producer_name',
      }, {
        title: '库名称',
        align: 'center',
        dataIndex: 'repertory_name',
      }, {
        title: '库类型',
        align: 'center',
        dataIndex: 'repertory_type_name',
      }, 
      // {
      //   title: '维修数量',
      //   align: 'center',
      //   dataIndex: 'goods_num',
      // },
       {
        title: '维修地址',
        align: 'center',
        dataIndex: 'area_name',
      }, {
        title: '出库人',
        align: 'center',
        dataIndex: 'user_name',
      }, {
        title: '维修原因',
        align: 'center',
        dataIndex: 'repair_reason',
        render: (content) =>
          <Tooltip title={content}>
            <span>{String(content).length <= 10 ? content : content.slice(0, 10).concat("...")}</span>
          </Tooltip>,
      }, {
        title: '维修费用',
        align: 'center',
        dataIndex: 'repair_money',
      }, {
        title: '出库时间',
        align: 'center',
        dataIndex: 'export_time',
        // render: (time) => moment(time).format('YYYY-MM-DD HH:mm'),
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      }
    ]
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div className="classStorage">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="物料名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入物料名称" onChange={e => this.setState({ goods_name: e.target.value })} />
              </Form.Item>
              <Form.Item label="出库人 : ">
                <Input style={{ width: 160 }} placeholder="请输入出库人" onChange={e => this.setState({ user_name: e.target.value })} />
              </Form.Item>
              <Form.Item label="物料分类 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择物料分类' showSearch optionFilterProp="children" onChange={e => { this.setState({ goods_type_id: e }) }}>
                  {
                    goodTypeData.map((val,key)=>{
                    return (<Option value={val.goods_type_id} key={key}>{val.goods_type_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="所属厂家 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择所属厂家' showSearch optionFilterProp="children" onChange={e => { this.setState({ producer_id: e }) }}>
                  {
                    producerAllData.map((val,key)=>{
                    return (<Option value={val.producer_id} key={key}>{val.producer_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="库名称 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择库名称' showSearch optionFilterProp="children" onChange={e => { this.setState({ repertory_name_id: e }) }}>
                {
                  repertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_name_id} key={key}>{val.repertory_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="库类型 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择库类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ repertory_type_id: e }) }}>
                {
                  goodsRepertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_type_id} key={key}>{val.repertory_type_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="出库时间 : " style={{paddingTop:10}}>
              <RangePicker placeholder={['开始日期','结束日期']} style={{ width: 240 }} format={dateFormat} onChange={(e, f) => {
                  this.setState({ startTime: f[0] ? f[0] : undefined, endTime: f[1] ? f[1] : undefined })
                }} 
                />
            </Form.Item>
            <Form.Item style={{paddingTop:10}}>
              <span>共查询到<span style={{color:'red',fontSize:16}}>{total1}</span>条记录</span>
            </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button style={{ marginRight: 10 }} htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
                <Button  type="primary" onClick={() => {
                  this.setState({
                      visibleAdd:true
                    },()=>{
                      setTimeout(()=>{
                        this.formRef.current.setFieldsValue({flag:'0'})
                      },200)
                    })
                  }}>新增</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            className="record-table"
            rowKey={record => record.import_id}
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
          title="添加"
          visible={this.state.visibleAdd}
          onOk={() => this.outAdd()}
          onCancel={() => { this.formRef.current.resetFields();this.setState({ visibleAdd: false }) }}
          width={520}
        >
          <div>
            <Form ref={this.formRef}  {...formItemLayout}  >
              <Form.Item rules={[{ required: true, message: '请选择出库类型!' }]} name="flag" label="出库类型">
                <Select disabled value="0" placeholder="请选择出库类型" style={{ width: 250 }} allowClear>
                       <Select.Option value='0' key='0' >维修</Select.Option>
                       <Select.Option value='1' key='1' >换新</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择维修楼宇!' }]} name="space_id" label="维修楼宇">
                <Select onChange={(e)=>{
                  var data=FloorRoomData.find(item=>item.space_id===e)||{}
                  this.formRef.current.setFieldsValue({area_id:null})
                  this.setState({
                    roomData:data.classroomInfoEntities&&data.classroomInfoEntities.length?data.classroomInfoEntities:[]
                  })
                }} placeholder="请选择维修楼宇" style={{ width: 250 }} allowClear>
                      {
                         FloorRoomData.map((item,index)=>{
                         return <Select.Option value={item.space_id} key={item.space_id} >{item.space_name}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择维修教室!' }]} name="area_id" label="维修教室">
                <Select  placeholder="请选择维修教室" style={{ width: 250 }} allowClear>
                        {
                         roomData.map((item,index)=>{
                         return <Select.Option value={item.classroom_id} key={item.classroom_id} >{item.classroom_code}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择库名称!' }]} name="repertory_name_id" label="库名称">
                <Select placeholder="请选择库名称" onChange={(e)=>{
                  this.formRef.current.setFieldsValue({repertory_type_id:null})
                  // 物料分类
                  req_searchWarehouseType({pageNum:1,pageSize:999999,repertoryNameId:e}).then(res=>{
                    if(res.code===20000){
                      this.setState({
                        libraryName:res.data?res.data:[]
                      })
                    }
                  })
                }} style={{ width: 250 }} allowClear>
                        {
                         warehouse.map((item,index)=>{
                         return <Select.Option value={item.repertory_name_id} key={item.repertory_name_id} >{item.repertory_name}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择库类型!' }]} name="repertory_type_id" label="库类型">
                <Select placeholder="请选择库类型"  onChange={(e)=>{
                  this.formRef.current.setFieldsValue({goods_type_id:null})
                  req_searchThingType({repertoryNameId:this.formRef.current.getFieldValue('repertory_name_id'),repertoryTypeId:e}).then(res=>{
                    if(res.code===20000){
                      this.setState({
                        materialClass:res.data?res.data:[]
                      })
                    }
                  })
                }} style={{ width: 250 }} allowClear>
                      {
                        libraryName.map((item,index)=>{
                        return <Select.Option value={item.repertory_type_id} key={item.repertory_type_id} >{item.repertory_type_name}</Select.Option>
                        })
                      }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择物料类别!' }]} name="goods_type_id" label="物料分类">
                <Select placeholder="请选择物料类别"   onChange={(e)=>{
                  const rent=this.formRef.current
                  rent.setFieldsValue({producer_id:null})
                  this.setState({
                    goodsnum:null
                  })
                  // 查厂家
                  req_goodsProducer({repertoryNameId:rent.getFieldValue('repertory_name_id'),repertoryTypeId:rent.getFieldValue('repertory_type_id'),goodsTypeId:e}).then(res=>{
                    if(res.code===20000){
                      this.setState({
                        manufacturer:res.data?res.data:[]
                      })
                    }
                  })
                }}  style={{ width: 250 }} allowClear>
                       {
                         materialClass.map((item,index)=>{
                         return <Select.Option value={item.goods_type_id} key={item.goods_type_id} >{item.goods_type_name}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择生产厂家!' }]} name="producer_id" label="生产厂家">
                <Select placeholder="请选择生产厂家"  onChange={(e)=>{
                  const rent=this.formRef.current
                  rent.setFieldsValue({goods_id:null})
                  //查物料
                  req_goodsName({repertoryNameId:rent.getFieldValue('repertory_name_id'),repertoryTypeId:rent.getFieldValue('repertory_type_id'),goodsTypeId:rent.getFieldValue('goods_type_id'),producerId:e}).then(res=>{
                    if(res.code===20000){
                      this.setState({
                        goodsDate:res.data?res.data:[],
                        
                      })
                    }
                  })
                }}  style={{ width: 250 }} allowClear>
                       {
                         manufacturer.map((item,index)=>{
                         return <Select.Option value={item.producer_id} key={item.producer_id} >{item.producer_name}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择物料名称!' }]} name="goods_id" label="物料名称">
                <Select placeholder="请选择物料名称" onChange={(e)=>{
                  this.setState({
                    goodsnum:goodsDate.find(item=>item.id===e).num||0
                  })
                }} style={{ width: 250 }} allowClear>
                       {
                         goodsDate.map((item,index)=>{
                         return <Select.Option value={item.id} key={item.id} >{item.goods_name}</Select.Option>
                         })
                       }
                </Select>
              </Form.Item>
              <Form.Item  name="repair_money" label="维修费用">
                <Input placeholder="请输入维修费用" style={{ width: 250 }} type="number"></Input>
              </Form.Item>
              <Form.Item  name="repair_reason" label="维修原因">
                <Input.TextArea placeholder="请输入维修原因" style={{ width: 250,minHeight:'100px' }} type="number"></Input.TextArea>
              </Form.Item>
            </Form>
            {/* repair_reason */}
          </div>
        </Modal>
      </div>
    )
  }
}
export default Record