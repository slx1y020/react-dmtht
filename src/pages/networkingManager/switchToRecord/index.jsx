import React, { Component } from 'react'
import { Form, Input, Button, Select, DatePicker, Divider, Tree, Popconfirm, Modal, Table, Pagination, message, Spin } from 'antd'
import QRCode from 'qrcode.react';
import moment from 'moment'
import { findAllHoutaiRecord, findAllSpaces, findAllSpaces4Shebei, req_findShebeiKaiguanDetail } from '../../../api/api'
import './index.less'
import * as Icon from '@ant-design/icons';
const { RangePicker } = DatePicker;
class ClassList extends Component {
  formRef = React.createRef();
  state = {
    pageSize: 15,
    total: 1,
    buildingData: [],
    data: [],//数据
    endTime: '',
    startTime: '',
    classroom_code: '',
    node: {},
    selectedKeys: [],
    loadings: false,
    visible: false,
    datas:[],
    pageSizes: 15,
    totals: 1,
  }
  iconBC = (name) => {
    return (React.createElement(Icon && Icon[name], {
      style: { fontSize: 16 }
    }))
  }
  componentDidMount() {
    this.findAllSpaces()
    this.findAllHoutaiRecord(1)
  }
  findAllHoutaiRecord = (pageNum) => {
    setTimeout(async () => {
      this.setState({
        loadings: true
      })
      const { startTime, endTime, classroom_code, pageSize, node } = this.state
      const res = await findAllHoutaiRecord({ space_id: node.key || '', startTime: startTime ? startTime + ' 00:00:00' : null, endTime: endTime ? endTime + ' 23:59:59' : null, classroom_code, pageNum, pageSize })
      if (res.code === 20000) {
        this.setState({
          data: res.data && res.data.list ? res.data.list : [],
          total: res.data.total ? res.data.total : 1,
          loadings: false
        })
      }
    }, 0)
  }
  // 查询所有楼宇信息
  findAllSpaces = () => {
    findAllSpaces4Shebei().then(res => {
      let menuList = (res.data || []).map(item => {
        return {
          key: item.space_id,
          value: item.space_flag,
          title: item.space_name,
          parentId: item.parent_id,
        }
      })
      menuList = menuList.map(item => {
        item.children = menuList.filter(p => p.parentId === item.key);
        return item
      }).filter(p => p.parentId === 0)
      this.setState({
        buildingData: menuList,
      })
    })
  }
  //点击Tree查询
  findAllHoutaiRecord2 = (pageNum) => {
    setTimeout(() => {
      this.setState({
        loadings: true
      })
      const { node, pageSize } = this.state
      findAllHoutaiRecord({ pageNum, pageSize, space_id: node.key || '' }).then(res => {
        if (res.code === 20000) {
          this.setState({
            data: res.data && res.data.list ? res.data.list : [],
            total: res.data.total ? res.data.total : 1,
            loadings: false
          })
        }
      })
    }, 0)

  }
  //点击树节点
  // classroom_type空间节点id// status状态// classroom_name教室名称// space_id空间节点id
  handleSelect = (selectedKeys, info) => {
    this.setState({
      selectedKeys: selectedKeys.length ? selectedKeys : [],
      node: selectedKeys.length ? info.node : {},
    }, () => {
      this.findAllHoutaiRecord2(1)
    })
  };

  handleDetails = async (kg_record_id) => {
    const res = await req_findShebeiKaiguanDetail({ kg_record_id })
    if (res.code === 20000) {
      this.setState({
        datas: res.data && res.data.list ? res.data.list : [],
        totals: res.data.total ? res.data.total : 1,
        visible: true
      })
    }
  }


  render() {
    const { pageSize, total, data, buildingData, loadings, visible, datas } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '教室门牌号',
        dataIndex: 'classroom_code',
      },
      {
        title: '楼号',
        dataIndex: 'space_name',
      },
      {
        title: '用户操作',
        dataIndex: 'kaiguan_flag',
        render:flag=>(
          <div>
            <span style={{color:'green'}}>{flag===1?'开启':''}</span>
            <span style={{color:'red'}}>{flag===0?'关闭':''}</span>
          </div>
        )
      },
      {
        title: '开关操作人',
        dataIndex: 'user_name',
      },
      {
        title: '操作时间',
        dataIndex: 'create_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD HH:mm') : ''}</div>
        }
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href="#!" onClick={() => {
              this.handleDetails(record.kg_record_id)
            }}> 详情 </a>
          </div>
        )
      },
    ]

    const columnsDevice = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '设备名称',
        dataIndex: 'sb_name',
      },
      {
        title: '设备编号',
        dataIndex: 'sb_bianhao',
      },
      {
        title: '用户操作',
        dataIndex: 'sb_kaiguan_flag',
        render:flag=>(
          <div>
            <span style={{color:'green'}}>{flag===1?'开启':''}</span>
            <span style={{color:'red'}}>{flag===0?'关闭':''}</span>
            <span>{flag===3?'按一下':''}</span>
          </div>
        )
      },
      {
        title: '开关操作人',
        dataIndex: 'user_name',
      },
      {
        title: '操作时间',
        dataIndex: 'create_time',
        render: time => {
          return <div>{time ? moment(time).format('YYYY-MM-DD HH:mm') : ''}</div>
        }
      },
    ]
    return (
      <Spin spinning={loadings} tip='加载中...'>
        <div className="classroomList">
          <div className="topForm">
            <Form layout="inline" >
              <div>
                <Form.Item name="classroom_code" label="教室门牌号 : ">
                  <Input onChange={(e) => this.setState({ classroom_code: e.target.value })} style={{ width: 160 }} placeholder="请输入教室门牌号" />
                </Form.Item>
                <Form.Item name="admin_time">
                  <RangePicker onChange={(e) => this.setState({ startTime: e && e[0] ? moment(e[0]).format('YYYY-MM-DD') : '', endTime: e && e[1] ? moment(e[1]).format('YYYY-MM-DD') : '' })} />
                </Form.Item>
              </div>
              <div>
                <Form.Item>
                  <Button htmlType="submit" onClick={() => this.findAllHoutaiRecord(1)} style={{ marginRight: '10px' }}>查询</Button>
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className="content_center">
            <div className="content_center_left">
              <div style={{ width: '100%', paddingLeft: '10px', letterSpacing: '1px', lineHeight: '45px', height: '45px', backgroundColor: 'rgb(250,250,250)',color:'rgba(0, 0, 0, 0.85)' }}>分组导航栏</div>
              <div className="classroomListTree">
                <Tree
                  onSelect={this.handleSelect}
                  treeData={buildingData}
                  onRightClick={this.handleOnRight}
                  defaultExpandAll={true}
                  showLine />
              </div>
            </div>
            <div className="content_center_right">
              <div>
                <Table
                  scroll={{ x: true }}
                  columns={columns}
                  bordered
                  rowKey={(record) => record.kg_record_id}
                  dataSource={data}
                  pagination={false} />
              </div>
              <div className="pagination">
                <div >
                  {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div> */}
                </div>
                <div>
                  <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllHoutaiRecord(page)} style={{ textAlign: 'right', padding: 12 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title='设备开关记录'
          visible={visible}
          width={1200}
          footer={[]}
          onOk={() => this.windQRCode()}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <div>
            <div>
              <Table
                className="modTab"
                scroll={{ x: true }}
                columns={columnsDevice}
                bordered
                rowKey={(record) => record.kg_record_id}
                dataSource={datas}
                pagination={false} />
            </div>
          </div>
        </Modal>
      </Spin>
    )
  }
}
export default ClassList