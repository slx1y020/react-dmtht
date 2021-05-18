import React, { Component } from 'react'
import { Form, Input, Button, Table, Pagination, DatePicker, Popconfirm, Modal, Select, Tooltip } from 'antd'
import { findFeedback, deleteFeedback } from '../../api/api'
import './index.less'
import moment from 'moment'

const { RangePicker } = DatePicker;

class ClassList extends Component {

    state = {
        pageSize: 15,
        total: 1,
        data: [],
        feedbackName: '', // 反馈人
        state: '', // 反馈类型
        startTime: '', // 开始时间
        endTime: '', // 结束时间
    }

    componentDidMount = () => {
        this.fetch(1)
    }

    fetch = async pageNum => {
        const { feedbackName, startTime, endTime, pageSize, state } = this.state;
        const res = await findFeedback({ userName: feedbackName, state, startTime: startTime ? startTime + ' 00:00:00' : '', endTime: endTime ? endTime + ' 23:59:59' : '', pageNum, pageSize })
        if (res.code === 20000) {
            this.setState({
                data: res.data.list,
                total: res.data.total ? res.data.total : 1,
            })
        }
    }

    handleQuery = () => {
        this.fetch(1)
    }

    handleDel = async record => {
        const res = await deleteFeedback({ feedbackId: record.feedback_id })
        if (res.code === 20000) {
            Modal.success({ content: res.message })
            this.fetch(1)
        }
    }

    render() {
        const { pageSize, total, data } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'text',
                render: (text, record, index) => ++index
            },
            {
                title: '反馈人',
                dataIndex: 'feedback_user_name',
            },
            {
                title: '联系方式',
                dataIndex: 'feedback_user_phone',
            },
            {
                title: '反馈类型',
                dataIndex: 'state',
                render: state => state === 1 ? '软件问题' : state === 2 ? '报修工单' : state === 3 ? '联网设备' : '其他'
            },
            {
                title: '建议描述',
                dataIndex: 'feedback_content',
                render: content => content && content.length > 30 ? <Tooltip title={content}>
                    <span>{content.substr(0, 30) + '...'}</span>
                </Tooltip> : content
            },
            {
                title: '反馈时间',
                dataIndex: 'create_time',
                render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
            },
            {
                title: '操作',
                render: record => (
                    <div>
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
        return (
            <div className="adviceFeedback">
                <div className="topForm">
                    <Form layout="inline">
                        <div>
                            <Form.Item label="反馈人 : ">
                                <Input style={{ width: 160 }} placeholder="请输入反馈人" onChange={e => this.setState({ feedbackName: e.target.value })} />
                            </Form.Item>
                            <Form.Item label="反馈类型 : ">
                                <Select onChange={(e) => this.setState({ state: e })} style={{ width: 160 }} allowClear placeholder="请选择反馈类型 ">
                                    <Select.Option key={1} value={1}>软件问题</Select.Option>
                                    <Select.Option key={2} value={2}>报修工单</Select.Option>
                                    <Select.Option key={3} value={3}>联网设备</Select.Option>
                                    <Select.Option key={4} value={4}>其他</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <RangePicker onChange={(date, dateString) => { this.setState({ startTime: dateString[0], endTime: dateString[1] }) }} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item>
                                <Button htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div>
                    <Table
                        scroll={{ x: true }}
                        columns={columns}
                        bordered
                        rowKey={record => record.feedback_id}
                        dataSource={data}
                        pagination={false} />
                </div>
                <div className="pagination">
                    <div >
                        {/* <div>记录总数: {total}</div> */}
                    </div>
                    <div>
                        <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.fetch(page)} style={{ textAlign: 'right', padding: 12 }} />
                    </div>
                </div>
            </div>
        )
    }
}
export default ClassList