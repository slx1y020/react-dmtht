import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal } from 'antd'
import { req_saveRepairGoodsRepertoryName, req_updateRepairGoodsRepertoryName, req_findRepairGoodsRepertoryName, req_deleteRepairGoodsRepertoryName } from '../../../api/hdlApi'
import './index.less'

class libraryName extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    repertory_name: '', // 物料分类
    data: [],
    visible: false,
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { repertory_name, pageSize } = this.state;
    const res = await req_findRepairGoodsRepertoryName({ repertory_name: repertory_name, pageNum, pageSize })
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
      const method=values.repertory_name_id?req_updateRepairGoodsRepertoryName:req_saveRepairGoodsRepertoryName
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
    const res = await req_deleteRepairGoodsRepertoryName({ repertory_name_id: record.repertory_name_id })
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
        title: '库名称',
        width: '30%',
        dataIndex: 'repertory_name',
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
      <div className="libraryName">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="库名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入库名称" onChange={e => this.setState({ repertory_name: e.target.value })} />
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
            className="material-table"
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.repertory_name_id}
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
            <Form.Item name="repertory_name_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="库名称" name="repertory_name" rules={[{ required: true, message: '请输入库名称!' }]}>
              <Input placeholder='请输入库名称' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default libraryName