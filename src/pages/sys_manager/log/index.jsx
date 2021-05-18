import React, { Component } from 'react';
import { Form, Input, Button, Table, Pagination } from 'antd'
import { findAllLog } from '../../../api/api'
import moment from 'moment'

class Log extends Component {

  state = {
    data: [],
    logUser: '', // 用户名
    logIp: '', // 请求地址
    pageSize: 15,
    total: 1,
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  fetch = async pageNum => {
    const { logUser, logIp, pageSize } = this.state;
    const res = await findAllLog({ log_user: logUser, log_ip: logIp, pageSize, pageNum })
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

  render() {
    const { data, total, pageSize } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '用户名',
        dataIndex: 'log_user',
      },
      {
        title: '请求模块',
        dataIndex: 'log_fun',
      },
      {
        title: '请求方法',
        dataIndex: 'log_method',
      },
      {
        title: '请求路径',
        dataIndex: 'log_request_url',
      },
      {
        title: '请求地址',
        dataIndex: 'log_ip',
      },
      {
        title: '执行时间',
        dataIndex: 'log_time',
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
    ]
    return (
      <div className='adminManger'>
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="用户名" style={{ marginRight: 16 }}>
                <Input placeholder="请输入用户名" style={{ width: 160 }} onChange={e => this.setState({ logUser: e.target.value })} />
              </Form.Item>
              <Form.Item label="请求地址">
                <Input placeholder="请输入请求地址" style={{ width: 160 }} onChange={e => this.setState({ logIp: e.target.value })} />
              </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className='contentbody'>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.log_id}
            dataSource={data}
            pagination={false} />
          <Pagination defaultCurrent={1} pageSize={pageSize} showSizeChanger={false} total={total} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
        </div>
      </div>
    );
  }
}

export default Log;