import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal } from 'antd'
import { findFaculty, addFaculty, updateFaculty, deleteFaculty } from '../../api/api'
import moment from 'moment'

class DepManager extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    name: '', // 院系名称
    data: [],
    visible: false,
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询院系信息
  fetch = async pageNum => {
    const { name, pageSize } = this.state;
    const res = await findFaculty({ facultyName: name, pageNum, pageSize })
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
      const method = values.faculty_id ? updateFaculty : addFaculty;
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
    const res = await deleteFaculty({ facultyId: record.faculty_id })
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
        render: (text, record, index) => ++index
      },
      {
        title: '院系名称',
        dataIndex: 'faculty_name',
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
            <a href='#!' onClick={() => this.handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要删除吗?"
              onConfirm={() => this.handleDel(record)}
              okText="确定"
              cancelText="取消"
            >
              <a href='#!' style={{ color: 'red' }}>删除</a>
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
      <div className="depManager">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="院系名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入院系名称" onChange={e => this.setState({ name: e.target.value })} />
              </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button htmlType="submit" style={{ marginRight: 10 }} onClick={() => this.handleQuery()}>查询</Button>
                <Button type="primary" onClick={() => this.handleAdd()}> 新增</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.faculty_id}
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
            <Form.Item name="faculty_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="院系名称" name="faculty_name" rules={[{ required: true, message: '请输入院系名称!' }]}>
              <Input placeholder='请输入院系名称' />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default DepManager