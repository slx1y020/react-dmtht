import React, { Component } from 'react'
import { Form, Input, Button, Select,  Table, Pagination } from 'antd'
import { req_findRepairRepertoryName, req_findRepairGoodsByName, req_findRepairGoodsType, req_findRepairGoodsProducerAll, req_findRepairGoodsRepertoryTypeAll, req_countGoodsByAdmin, req_findAllGoodsByAdmin } from '../../../api/hdlApi'
import './index.less'

const { Option } = Select;

class Storage extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
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
    number:0, // 总数
  }

  componentDidMount = () => {
    this.fetch(1)
    this.findGoodsName()
    this.findGoodsType()
    this.findProudcer()
    this.findRepertory()
    this.findGoodsRepertory()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { pageSize, goodsName,goodsTypeId, producerId, repertoryNameId, repertoryTypeId } = this.state
    const params= {
      goodsName,
      goodsTypeId,
      producerId,
      repertoryNameId,
      repertoryTypeId,
      pageNum,
      pageSize
    }
    const result = await req_findAllGoodsByAdmin(params)
    if(result.code === 20000){
      this.setState({
        data: result.data.list,
        total: result.data.total ? result.data.total : 1
      })
      const res = await req_countGoodsByAdmin(params)
      if(res.code === 20000){
          this.setState({
            number: res.data
          })
      }
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

  render() {
    const { pageSize, total, data,  goodTypeData, producerAllData, repertoryData, goodsRepertoryData, number } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      }, {
        title: '物料名称',
        align: 'center',
        dataIndex: 'goods_name',
      }, {
        title: '物料类型',
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
      }, {
        title: '库存数量',
        align: 'center',
        dataIndex: 'num',
        render:(num)=>{
          return num?num:0
      }
    }
    ]
    return (
      <div className="classStorage">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="物料名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入物料名称" onChange={e => this.setState({ goodsName: e.target.value })} />
              </Form.Item>
              <Form.Item label="物料类型 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择物料类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ goodsTypeId: e }) }}>
                  {
                    goodTypeData.map((val,key)=>{
                    return (<Option value={val.goods_type_id} key={key}>{val.goods_type_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="所属厂家 : ">
                <Select allowClear style={{ width: 160 }} placeholder='请选择所属厂家' showSearch optionFilterProp="children" onChange={e => { this.setState({ producerId: e }) }}>
                  {
                    producerAllData.map((val,key)=>{
                    return (<Option value={val.producer_id} key={key}>{val.producer_name}</Option>)
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label="库名称 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择库名称' showSearch optionFilterProp="children" onChange={e => { this.setState({ repertoryNameId: e }) }}>
                {
                  repertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_name_id} key={key}>{val.repertory_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="库类型 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择库类型' showSearch optionFilterProp="children" onChange={e => { this.setState({ repertoryTypeId: e }) }}>
                {
                  goodsRepertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_type_id} key={key}>{val.repertory_type_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item label="物料总数量 : ">
                {number?number:0}
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
            className="material-manager-table"
            rowKey={record => record.id}
            dataSource={data}
            pagination={false} />
        </div>
        <div className="pagination">
          <div></div>
          <div>
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
      </div>
    )
  }
}
export default Storage