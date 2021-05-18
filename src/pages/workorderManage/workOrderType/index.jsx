import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal } from 'antd'
import { req_saveOrderType, req_updateOrderType, req_findOrderType, req_deleteOrderType } from '../../../api/hdlApi'
import './index.less'

class libraryType extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    type_name: '', // 工单类型
    data: [],
    visible: false,
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { type_name, pageSize } = this.state;
    const res = await req_findOrderType({ type_name, pageNum, pageSize })
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
    setTimeout(() => {
      this.formRef.current.setFieldsValue(record);
    }, 10)
    this.setState({
      visible: true,
      title: '编辑',
    })
  }

  // 保存
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      const method=values.type_id?req_updateOrderType:req_saveOrderType
      const res = await method(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
        })
        this.fetch(1)
      }
    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_deleteOrderType({ id: record.type_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  render() {
    const { pageSize, total, data, visible, title } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        width: '20%',
        render: (text, record, index) => ++index
      },
      {
        title: '工单类型名称',
        width: '30%',
        dataIndex: 'type_name',
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
      <div className="classroomList">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="工单类型名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入工单类型名称" onChange={e => this.setState({ type_name: e.target.value })} />
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
            className="work-table"
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.type_id}
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
          okText="保存"
          cancelText="取消"
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.formRef.current.resetFields()
            this.setState({ visible: false })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="type_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="工单类型名称" name="type_name" rules={[{ required: true, message: '请输入工单类型名称!' }]}>
              <Input placeholder='请输入工单类型名称' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default libraryType