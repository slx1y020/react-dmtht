import React, { Component } from 'react'
import { Form, Input, Button, Select, Popconfirm, Table, Pagination, Modal, Divider, InputNumber } from 'antd'
import { req_findOrderType, req_findAllUser, req_findSpaceByFloor, req_saveOrderUser, req_findOrderUser, req_deleteOrderUser, findOrderUserById, req_repairSaveOrderType, req_repairOrderBarGraph, req_deleteOrderTypeById } from '../../../api/hdlApi'
import moment from 'moment'
import './index.less'


class Storage extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    orderType: '', // 工单类型
    data: [],
    visible: false,
    orderTypeData: [], // 工单类型
    allUserData: [], // 用户信息
    spaceFloorData: [], //楼宇信息
    userData: {}, // 选择的用户信息
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { orderType,pageSize } = this.state
    const params = {
      orderType,
      pageNum,
      pageSize
    }
    const res = await req_repairOrderBarGraph(params)
    if (res.code === 20000) {
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

  // 编辑
  handleEdit = record => {
    console.log(record)
    setTimeout(async () => {
      this.formRef.current.setFieldsValue(record);
    }, 100)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      const res = await req_repairSaveOrderType(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
          title: '新增',
          userData: {}
        })
        this.fetch(1)
      }

    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_deleteOrderTypeById({ orderTypeId: record.order_type_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  render() {
    const { pageSize, total, data, visible, title} = this.state
    const columns = [
      {
        title: '序号',
        align: 'center',
        key: 'no',
        render: (no, record, index) => { return <span>{index + 1}</span> }
      },
      {
        title: '类型名称',
        align: 'center',
        dataIndex: 'type_name',
      },
      {
        title: '分数',
        align: 'center',
        dataIndex: 'score',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href="#!" onClick={() => this.handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.handleDel(record)}
              okText="确定"
              cancelText="取消"
            >
              <a href="#!" style={{ color: 'red' }}>删除</a>
            </Popconfirm>
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
              <Form.Item label="类型名称: ">
                <Input style={{ width: 160 }} placeholder="请输入类型名称" onChange={e => this.setState({ orderType: e.target.value })} />
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
        <Modal
          title={title}
          visible={visible}
          okText="保存"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false, userData: {} })
          }}
        >
          <Form  {...layout} ref={this.formRef}>
            <Form.Item hidden name="order_type_id">
              <Input hidden />
            </Form.Item>

            <Form.Item label="类型名称" name="type_name" rules={[{ required: true, message: '请输入类型名称' }]}>
              <Input placeholder="请输入类型名称" />
            </Form.Item>

            <Form.Item label="分数" name="score" rules={[{ required: true, message: '请输入分数' }]}>
              <InputNumber placeholder="请输入分数" style={{ width: "314px" }} />
            </Form.Item>
          </Form>


        </Modal>
      </div>
    )
  }
}
export default Storage