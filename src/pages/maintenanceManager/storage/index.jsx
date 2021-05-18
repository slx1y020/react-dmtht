import React, { Component } from 'react'
import { Form, Input, Button, Select, InputNumber, Popconfirm, Table, Pagination, Modal, Divider, DatePicker ,Radio} from 'antd'
import { req_findRepairRepertoryName, req_findRepairGoodsByName, req_findRepairGoodsType, req_findRepairGoodsProducerAll, req_submitRepairGoodsImport, req_submitUpdateGoodsImport, req_findRepairGoodsImportAll, req_deleteRepairGoodsImport, req_findRepairGoodsRepertoryTypeAll } from '../../../api/hdlApi'
import moment from 'moment'
import './index.less'

const { Option } = Select;
const { RangePicker } = DatePicker;

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
    type:null,
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
    const { pageSize, goods_name,admin_name, downloadVisible, startTime, endTime, total, goods_type_id, producer_id, repertory_name_id, repertory_type_id,type } = this.state
    const params= {
      goods_name,
      goods_type_id,
      admin_name,
      producer_id,
      repertory_name_id,
      repertory_type_id,
      pageNum,
      pageSize: downloadVisible ? total : pageSize,
      startTime: startTime && (startTime.concat(" 00:00:00")),
      endTime: endTime && (endTime.concat(" 23:59:59")),
      type,
    }
    // downloadVisible && message.loading("数据整理中,请稍等", 0)
    const res = await req_findRepairGoodsImportAll(params)
    if (res.code === 20000) {
      // 导出
      // if (downloadVisible) {

      // }
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
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

  // 物料名称
  goodsName=(name)=>{
    const { goodNameData } = this.state
    if(name.length===1){
      let record={}
      if(goodNameData.find(x=>x.id===name[0])){
        record.goods_id=name[0]
        record.goods_name=goodNameData.find(x=>x.id===name[0]).goods_name
      }else{
        record.goods_name=name[0]
      }
      this.formRef.current.setFieldsValue(record);
    }else{
      let record={}
      if(goodNameData.find(x=>x.id===name[1])){
        record.goods_id=name[1]
        record.goods_name=goodNameData.find(x=>x.id===name[1]).goods_name
      }else{
        record.goods_name=name[1]
      }
      this.formRef.current.setFieldsValue(record);
    }
  }

  // 编辑
  handleEdit = record => {
    setTimeout(async() => {
      this.formRef.current.setFieldsValue(record);
    }, 10)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 保存
  handleOk = (type) => {
    this.formRef.current.validateFields().then(async values => {
      // 先判断ID，然后判断操作
      values.flag = type==='add'?0:1
      if(!values.import_id){
        const res = await req_submitRepairGoodsImport(values)
        if(res.code === 20000){
          Modal.success({ content: res.message })
          this.setState({
            visible: false,
            title: '新增',
          })
          this.fetch(1)
        }
      }else{
        const result = await req_submitUpdateGoodsImport(values)
        if(result.code === 20000){
          Modal.success({ content: result.message })
          this.setState({
            visible: false,
            title: '新增',
          })
          this.fetch(1)
        }
      }

    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_deleteRepairGoodsImport({ import_id: record.import_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  render() {
    const { pageSize, total, data, visible, title, goodNameData, goodTypeData, producerAllData, repertoryData, goodsRepertoryData } = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '入库单号',
        align: 'center',
        dataIndex: 'goods_no',
      }, {
        title: '物料名称',
        align: 'center',
        dataIndex: 'goods_name',
      }, {
        title: '物料分类',
        align: 'center',
        dataIndex: 'goods_type_name',
      },{
        title: '物料类型',
        align: 'center',
        dataIndex: 'type',
        render:type=>{
          return (
            <div>
              {type===1?'旧品':type===2?'新品':''}
            </div>
          )
        }
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
        title: '入库单价(元)',
        align: 'center',
        dataIndex: 'money',
      }, {
        title: '数量',
        align: 'center',
        dataIndex: 'goods_num',
      }, {
        title: '状态',
        align: 'center',
        dataIndex: 'state',
        render: (index) => { return index === 1 ? '已提交' : '待提交' }
      }, {
        title: '入库人',
        align: 'center',
        dataIndex: 'admin_name',
      }, {
        title: '入库时间',
        align: 'center',
        dataIndex: 'import_time',
        // render: time => moment(time).format('YYYY-MM-DD hh:mm'),
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      {
        title: '操作',
        render: record => (
          <div>
            {
            record.state !== 1 ?(<span><a href="#!" onClick={() => this.handleEdit(record)}>编辑</a>
              <Divider type="vertical" /></span>):''
            }
            {
              record.state !== 1?(<Popconfirm
                title="确定要删除吗?"
                onConfirm={() => this.handleDel(record)}
                okText="确定"
                cancelText="取消"
              >
                <a href="#!" style={{ color: 'red' }}>删除</a>
              </Popconfirm>):('')
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
    const dateFormat = 'YYYY-MM-DD';
    return (
      <div className="classStorage">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="物料名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入物料名称" onChange={e => this.setState({ goods_name: e.target.value })} />
              </Form.Item>
              <Form.Item label="入库人 : ">
                <Input style={{ width: 160 }} placeholder="请输入入库人" onChange={e => this.setState({ admin_name: e.target.value })} />
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
            <Form.Item label="入库时间 : " >
              <RangePicker placeholder={['开始日期','结束日期']} style={{ width: 240 }} format={dateFormat} onChange={(e, f) => {
                  this.setState({ startTime: f[0] ? f[0] : undefined, endTime: f[1] ? f[1] : undefined })
                }} 
                />
            </Form.Item>
            <Form.Item label="物料类型 : ">
              <Select allowClear style={{ width: 160 }} placeholder='请选择库类型' showSearch optionFilterProp="children" onChange={e => { this.setState({type:e}) }}>
                  <Option value={1} key={1}>旧品</Option>
                  <Option value={2} key={2}>新品</Option>
              </Select>
            </Form.Item>
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
            className="storage-table"
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
          title={title}
          visible={visible}
          footer={[
            <Button onClick={() => {
              this.formRef.current.resetFields()
              this.setState({ visible: false })
            }}>
              取消
            </Button>,
            <Button onClick={()=>{
              this.handleOk('add')
            }}>
              保存草稿
            </Button>,
            <Button type="primary" onClick={()=>{
              this.handleOk('submit')
            }}>
              提交
            </Button>
          ]}
          onOk={()=>{
            this.handleOk('')
          }}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="import_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="物料名称" name="goods_name" rules={[{ required: true, message: '请输入物料名称!' }]}>
              <Select
                mode="tags"
                placeholder="请输入物料名称"
                onChange={(val)=>{
                  this.goodsName(val)
                }}
              >
                {
                  goodNameData.map((val,key)=>{
                    return (<Option value={val.id} key={key}>{val.goods_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            
            <Form.Item label="物料分类" name="goods_type_id" rules={[{ required: true, message: '请选择物料分类!' }]}>
              <Select placeholder='请选择物料分类' showSearch optionFilterProp="children">
                {
                  goodTypeData.map((val,key)=>{
                  return (<Option value={val.goods_type_id} key={key}>{val.goods_type_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="所属厂家" name="producer_id" rules={[{ required: true, message: '请选择所属厂家!' }]}>
              <Select placeholder='请选择所属厂家' showSearch optionFilterProp="children">
                {
                  producerAllData.map((val,key)=>{
                  return (<Option value={val.producer_id} key={key}>{val.producer_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="入库单价(元)" name="money" rules={[{ required: true, message: '请输入入库单价!' }]}>
              <InputNumber defaultValue={0} min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="物料数量" name="goods_num" rules={[{ required: true, message: '请输入物料数量!' }]}>
              <InputNumber defaultValue={0} min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="库名称" name='repertory_name_id' rules={[{ required: true, message: '请选择库名称!' }]}>
              <Select placeholder='请选择库名称' showSearch optionFilterProp="children">
                {
                  repertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_name_id} key={key}>{val.repertory_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item label="库类型" name='repertory_type_id' rules={[{ required: true, message: '请选择库类型!' }]}>
              <Select placeholder='请选择库类型' showSearch optionFilterProp="children">
                {
                  goodsRepertoryData.map((val,key)=>{
                  return (<Option value={val.repertory_type_id} key={key}>{val.repertory_type_name}</Option>)
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item name="type" label="物料类型" rules={[{ required: true, message: '请选择物品类型!' }]}>
              <Radio.Group placeholder="请选择物品类型">
                <Radio value={2}>新品</Radio>
                <Radio value={1}>旧品</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Storage