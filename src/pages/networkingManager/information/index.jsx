/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import { Form, Input, DatePicker, Upload, Button, Select, Row, Col, Divider, Tree, Popconfirm, Modal, Table, Pagination, InputNumber, message, Spin } from 'antd'
import { findAllSpaces, findAllSpaces4Shebei } from '../../../api/api'
import { req_uploadBgImage, req_findAllOnlineShebei, req_delShebiebyId, req_saveShebie, req_updateShebei, req_findAllFeilei } from './../../../api/hdlApi'
import { findAllFactory } from '../../../api/api'
import { LoadingOutlined, PlusOutlined, MinusOutlined, SearchOutlined } from '@ant-design/icons';
import IP from '../../../config/config'
import './index.less'
import cookie from 'react-cookies';
import * as Icon from '@ant-design/icons';
import moment from 'moment'
import QRCode from 'qrcode.react';
const { RangePicker } = DatePicker;

class equipmentInformation extends Component {
  formRef = React.createRef();
  formRefAdd = React.createRef();
  formItemRef = React.createRef();
  state = {
    pageSize: 15,
    total: 1,
    buildingData: [],
    NodeTreeItem: null,
    data: [],//数据
    dataList: [],//楼宇数据
    title: '',
    visible: false,
    visible2: false,
    node: null,//右键点击的节点信息
    dataType: [],//节点类型
    selectedKeys: {},
    allFeileiTypeList: [],//设备类型列表
    showqrurl: '',//二维码图片
    classroominfor: {},
    sb_create_time: '',//创建时间
    sb_fl_id: '',//分类id
    sb_xinghao: '',//设备型号
    sb_bianhao: '',//设备编号
    space_id: 1,//节点id
    classroom_id: '',//房间id
    sb_name: '',//设备名称
    imageUrl: '',//是否有图片
    addFormItemList: [],//添加属性
    visible3: false,//添加属性框
    sb_start_time: '',
    sb_end_time: '',
    factory: [], // 厂家信息
    loadings: false,
    expanded: [],
    autoExpandParent: true,
    expandedKeys: []
  }

  iconBC = (name) => {
    return (React.createElement(Icon && Icon[name], {
      style: { fontSize: 16 }
    }))
  }

  componentDidMount = () => {
    this.findAllFeilei()
    this.findAllSpacesAndClassrooms()
    this.fetchFactory()
  }

  //查询设备属性
  findAllSpacesAndClassrooms = () => {
    findAllSpaces4Shebei().then(res => {
      if (res.code === 20000) {
        let menuList = (res.data || []).map(item => {
          return {
            key: item.space_id,
            space_flag: item.space_flag,
            title: item.space_name,
            parentId: item.parent_id,
            spaceDesc: item.space_desc,
            value: item.space_flag,
          }
        })
        menuList = menuList.map(item => {
          item.children = menuList.filter(p => p.parentId === item.key);
          return item
        }).filter(p => p.parentId === 0)
        this.setState({
          buildingData: menuList,
          expanded: menuList,
          dataList: res.data,
          space_id: menuList[0].key
        }, () => {
          if (menuList.length) {
            this.findAllShebei(1)
          }

        })
      }
    })
  }
  //查询设备类型
  findAllFeilei = () => {
    req_findAllFeilei({ pageSize: 9999, pageNum: 1 }).then(res => {
      if (res.code === 20000) {
        this.setState({
          allFeileiTypeList: res.data.list || []
        })
      }
    })
  }

  //查询设备信息
  findAllShebei = (pageNum) => {
    setTimeout(() => {
      this.setState({
        loadings: true
      })
      const { pageSize, sb_start_time, sb_end_time, sb_fl_id, sb_xinghao, sb_bianhao, sb_name, space_id } = this.state
      let item = { pageNum, pageSize, sb_start_time, sb_end_time, sb_xinghao, sb_bianhao, sb_name, sb_fl_id }
      item = { ...item, space_id: space_id }
      req_findAllOnlineShebei({ ...item }).then(res => {
        if (res.code === 20000) {
          this.setState({
            total: res.data.total ? res.data.total : 1,
            data: res.data.list || [],
            loadings: false
          })
        }
      })
    }, 0)
  }
  //点击树查询设备信息
  findAllShebei2 = (pageNum) => {
    setTimeout(() => {
      this.setState({
        loadings: true
      })
      const { pageSize, space_id } = this.state
      let item = { pageNum, pageSize }
      item = { ...item, space_id: space_id }
      req_findAllOnlineShebei({ ...item }).then(res => {
        if (res.code === 20000) {
          this.setState({
            total: res.data.total ? res.data.total : 1,
            data: res.data.list || [],
            loadings: false
          })
        }
      })
    }, 0)
  }
  //点击树节点
  // classroom_type空间节点id// status状态// classroom_name教室名称// space_id空间节点id
  handleSelect = (selectedKeys, info) => {
    // console.log(selectedKeys)
    this.setState({
      selectedKeys: selectedKeys.length ? info.node : {},
      node: selectedKeys.length ? info.node : null,
      space_id: selectedKeys.length ? selectedKeys.join(',') : this.state.buildingData[0].key,
    }, () => {
      this.findAllShebei2(1)
    })
  };
  //编辑设备
  editor = (record) => {
    setTimeout(async () => {
      // record.addFormItemList = [{
      //   attribute_desc:'1',
      //   attribute_name:'2'

      // }]
      record.addFormItemList = record.shebeiShuxingEntities.map(val => {
        const item = {
          sb_id: val.sb_id,
          attribute_name: val.sx_key,
          attribute_desc: val.sx_value,
        }
        return item
      })
      this.setState({
        imageUrl: record.sb_image,
        addFormItemList: record.addFormItemList
      })
      this.formRef.current.setFieldsValue(record);
      // console.log(record.addFormItemList)
      // formItemRef
      // this.formItemRef.current.setFieldsValue(record);
    }, 10)
    this.setState({
      visible: true,
      classroominfor: record
    })
  }
  //删除教室
  delete = (record) => {
    req_delShebiebyId({ sb_id: record.sb_id }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '删除成功！' })
        this.findAllShebei(1)
      }
    })
  }
  //添加设备
  addClassroom = () => {
    const { selectedKeys } = this.state
    // if (selectedKeys.length) {
    //   this.setState({ visible: true, imageUrl: '', loading: false, addFormItemList: [] })

    // } else {
    //   Modal.warning({ content: '请选择一个位置子节点！' })
    // }
    // console.log(selectedKeys.value, 'sssssssssssssssss')
    if (selectedKeys.value !== undefined) {
      if (selectedKeys.value === 3) {
        this.setState({ visible: true, imageUrl: '', loading: false, addFormItemList: [] })
      } else {
        Modal.warning({ content: `当前选中的是${selectedKeys.value === 0 ? '学校' : selectedKeys.value === 1 ? '学区' : selectedKeys.value === 2 ? '教学楼' : ''},请选择一间教室！！` })
      }
    } else {
      Modal.warning({ content: `请选择一间教室！！` })
    }
  }

  // 提交
  handleAddClassroom = () => {
    const { allFeileiTypeList, imageUrl, selectedKeys } = this.state
    this.formRef.current.validateFields().then(async values => {
      values.sb_image = imageUrl
      values.addFormItemList = values.addFormItemList ? values.addFormItemList.filter(x => x) : []
      if (values.addFormItemList) {
        values.sb_shuxing = JSON.stringify(values.addFormItemList.map(val => {
          const item = {
            sx_key: val.attribute_name,
            sx_value: val.attribute_desc
          }
          return item
        }))
      }
      values.space_id = selectedKeys.key
      values.sb_fl_name = allFeileiTypeList.find(x => x.sb_fl_id === values.sb_fl_id).sb_fl_name
      const method = values.sb_id ? req_updateShebei : req_saveShebie
      this.setState({
        visible: false
      })
      message.loading('上传中', 0)
      // Modal.loading({content:'上传中...'})

      const res = await method(values)
      if (res.code === 20000) {
        message.destroy()
        Modal.success({ 'content': res.message })
        this.formRef.current.resetFields()
        this.findAllShebei()
        this.setState({ imageUrl: '', loading: false, addFormItemList: [] })
      } else {
        message.destroy()
      }

    })
  }
  //显示二维码
  showqr = async (record) => {
    this.setState({
      visible2: true,
      showqrurl: `http://dmt.huanghuai.edu.cn:7712/?state=0,2,` + record.sb_id
    })
  }
  //上传图片
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 20000) {
        this.setState({
          imageUrl: info.file.response.data
        })
      }

    }
  };
  beforeUpload = (file) => {
  }

  // 查询厂家信息
  fetchFactory = async () => {
    const res = await findAllFactory({ pageSize: 999, pageNum: 1 })
    if (res.code === 20000) {
      this.setState({
        factory: res.data.list
      })
    }
  }

  itemDel = (key) => {
    const { addFormItemList } = this.state
    const data = addFormItemList
    delete (addFormItemList[key])
    this.setState({
      addFormItemList: data
    })
  }
  windQRCode = () => {
    var img = document.getElementById("image"); /// get image element
    var canvas = document.getElementsByTagName("canvas")[0];  /// get canvas element
    img.src = canvas.toDataURL();
    setTimeout(() => {
      var printHtml = document.getElementById("windQRCode").innerHTML;
      var wind = window.open("", 'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
      wind.document.body.innerHTML = printHtml;
      //执行打印
      wind.print();
    }, 300)
  }

  findAllSpacesAndClassroomss = () => {
    findAllSpaces4Shebei().then(res => {
      if (res.code === 20000) {
        let menuList = (res.data || []).map(item => {
          return {
            key: item.space_id,
            space_flag: item.space_flag,
            title: item.space_name,
            parentId: item.parent_id,
            spaceDesc: item.space_desc,
            value: item.space_flag,
          }
        })
        menuList = menuList.map(item => {
          item.children = menuList.filter(p => p.parentId === item.key);
          return item
        }).filter(p => p.parentId === 0)
        this.setState({
          expanded: menuList,
        })
      }
    })
  }

  filter(nodes, query) {
    // 条件就是节点的title过滤关键字
    let predicate = function (node) {
      if (node.title.indexOf(query) > -1) {
        return true;
      } else {
        return false;
      }
    };
    if (!(nodes && nodes.length)) {
      return [];
    }
    let newChildren = [];
    for (let node of nodes) {
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      let subs = this.filter(node.children, query);
      if (predicate(node)) {
        newChildren.push(node);
      } else if (subs && subs.length) {
        node.children = subs;
        newChildren.push(node);
      }

      // 以下只需要考虑自身的节点满足条件即可,不用带上父节点
      // if (predicate(node)) {
      //   newChildren.push(node);
      //   node.children = this.filter(node.children, query);
      // } else {
      //   newChildren.push(...this.filter(node.children, query));
      // }
    }
    return newChildren.length ? newChildren : [];
  }

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 搜索
  search = (e) => {
    this.findAllSpacesAndClassroomss()
    this.setState({
      buildingData: []
    })
    const { value } = e.target;
    const { expanded, dataList } = this.state
    const data = this.filter(expanded, value)

    // 处理展开ID
    const expandedKeys = dataList.map(item => {
      if (item.space_name.indexOf(value) > -1) {
        return this.getParentKey(item.space_id, data);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      buildingData: data,
      autoExpandParent: true,
      expandedKeys: expandedKeys
    });
  }

  // 展开方法
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  render() {
    const { pageSize, total, showqrurl, visible2, allFeileiTypeList, data, buildingData, title, visible, imageUrl, addFormItemList, visible3, factory, loadings, autoExpandParent, loading, expandedKeys } = this.state

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    };
    const columns = [
      {
        title: '序号',
        render: (text, record, index) => ++index
      },

      {
        title: '所属区域',
        dataIndex: 'weizhi',
      },
      {
        title: '联网设备编号',
        dataIndex: 'sb_bianhao',
      },
      {
        title: '联网设备名称',
        dataIndex: 'sb_name',
      },
      {
        title: '联网设备数量',
        dataIndex: 'sb_num',
      },
      {
        title: '联网设备类型',
        dataIndex: 'sb_fl_name',
      },
      {
        title: '联网设备厂家',
        dataIndex: 'sb_changjia',
      },
      {
        title: '联网设备型号',
        dataIndex: 'sb_xinghao',
      },
      {
        title: '创建时间',
        dataIndex: 'sb_create_time',
        render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
      },
      // {
      //   title: '使用部门',
      //   dataIndex: 'sb_dep_name',
      // },
      // {
      //   title: '负责人',
      //   dataIndex: 'sb_fzr',
      // },
      {
        title: '联网设备图片',
        dataIndex: 'sb_image',
        render: url => (
          <div style={{ height: 40, textAlign: 'center' }}>
            <a href={`${IP.host}` + url} target="_blank"><img height="40px" src={`${IP.host}` + url} alt="" /></a>
          </div>
        )
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a href="#!" onClick={() => this.showqr(record)}> 二维码 </a>
            <Divider type="vertical" />
            <a href="#!" onClick={() => this.editor(record)}> 编辑 </a>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗" okText="确认" cancelText="取消" onConfirm={() => this.delete(record)}>
              <a href="#!" style={{ color: 'red' }}  > 删除 </a>
            </Popconfirm>
          </div>
        )
      }
    ]
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
    const formItems = addFormItemList.map((val, key) => {
      return (
        <Col span={8} key={key}>
          {/* <Form ref={this.formItemRef}> */}
          <Row>
            <Form.Item name={['addFormItemList', key, 'attribute_name']} rules={[{ required: true, message: '请输入属性值!' }]} label={val.attribute_name} hidden>
              <Input />
            </Form.Item>
            <Form.Item name={['addFormItemList', key, 'attribute_desc']} rules={[{ required: true, message: '请输入属性值!' }]} label={val.attribute_name}>
              <Input addonAfter={
                <MinusOutlined style={{ cursor: 'pointer' }} onClick={() => this.itemDel(key)} />
              } />
            </Form.Item>
          </Row>
          {/* </Form> */}
        </Col>
      )
    })
    return (
      <Spin spinning={loadings} tip='加载中...'>
        <div className="equipmentInformation" >
          <div className="topForm">
            <Form layout="inline" >
              <div>
                {/* sb_create_time,sb_fl_id,sb_xinghao,sb_bianhao,space_id,classroom_id */}
                <Form.Item name="sb_bianhao" label="联网设备编号 : ">
                  <Input onChange={(e) => this.setState({ sb_bianhao: e.target.value })} style={{ width: 160 }} placeholder="请输入联网设备编号 " />
                </Form.Item>
                <Form.Item name="sb_name" label="联网设备名称 : ">
                  <Input onChange={(e) => this.setState({ sb_name: e.target.value })} style={{ width: 160 }} placeholder="请输入联网设备名称 " />
                </Form.Item>
                {/* <Form.Item name="sb_xinghao" label="设备型号 : ">
                <Input onChange={(e) => this.setState({ sb_bianhao: e.target.value })} style={{ width: 160 }} placeholder="请输入教室编号 " />
              </Form.Item> */}
                <Form.Item name="sb_fl_id" label="联网设备类型 : ">
                  <Select placeholder="请选择联网设备类型" onChange={(e) => this.setState({ sb_fl_id: e })} style={{ width: 160 }} allowClear>
                    {
                      (allFeileiTypeList || []).map((item, key) => {
                        return <Select.Option key={key} value={item.sb_fl_id}>{item.sb_fl_name}</Select.Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="创建时间 : " name="sb_create_time">
                  <RangePicker onChange={(e) => this.setState({ sb_start_time: e && e[0] ? moment(e[0]).format('YYYY-MM-DD') : '', sb_end_time: e && e[1] ? moment(e[1]).format('YYYY-MM-DD') : '' })} />
                </Form.Item>
              </div>
              <div>
                <Form.Item>
                  <Button htmlType="submit" onClick={() => this.findAllShebei(1)} style={{ marginRight: '10px' }}>查询</Button>
                  <Button onClick={() => this.addClassroom()} type="primary">添加联网设备</Button>
                </Form.Item>
              </div>
            </Form>
          </div>
          <div className="content_center">
            <div className="content_center_left">
              <div style={{ width: '100%', letterSpacing: '2px', lineHeight: '45px', height: '45px', backgroundColor: 'rgb(250,250,250)' }}>
                {/* 分组导航栏 */}
                <Input style={{ marginBottom: 8 }} placeholder="搜索" prefix={<SearchOutlined />} onChange={(e) => {
                this.search(e)
              }} />
              </div>
              
              <div className="classroomListTree">
                <Tree
                  onSelect={this.handleSelect}
                  treeData={buildingData}
                  autoExpandParent={true}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  showLine />
              </div>
            </div>
            <div className="content_center_right">
              <div>
                <Table
                  scroll={{ x: true }}
                  columns={columns}
                  bordered
                  rowKey={record => record.sb_id}
                  dataSource={data}
                  pagination={false} />
              </div>
              <div className="pagination">
                <div >
                  {/* <div>总数: {123}</div>
                <div>空闲数: {20}</div>
                <div>预约中: {50}</div>*/}
                </div>
                <div>
                  <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllShebei(page)} style={{ textAlign: 'right', padding: 12 }} />
                </div>
              </div>
            </div>
          </div>
          <Modal
            className="equipmentModal"
            title={title}
            visible={visible}
            onOk={() => this.handleAddClassroom()}
            onCancel={() => {
              this.formRef.current.resetFields()
              this.setState({ visible: false, imageUrl: undefined })
            }}
          >
            <div className="equipmentModal_content">
              <Form ref={this.formRef} {...formItemLayout}>
                <Row>
                  <Form.Item name="sb_id" hidden>
                    <Input />
                  </Form.Item>
                  <Col span={8}>
                    <Form.Item rules={[{ required: true, message: '请输入联网设备编号!' }]} name="sb_bianhao" label="联网设备编号">
                      <Input placeholder="请输入联网设备编号" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item rules={[{ required: true, message: '请输入联网设备名称!' }]} name="sb_name" label="联网设备名称">
                      <Input placeholder="请输入联网设备名称" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item rules={[{ required: true, message: '请输入联网设备数量!' }]} name="sb_num" label="联网设备数量">
                      <InputNumber style={{ width: '202px' }} min={0} placeholder="请输入联网设备数量" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="sb_fl_id" label="联网设备类型" rules={[{ required: true, message: '请选择联网设备类型!' }]}>
                      <Select placeholder="请选择联网设备类型" allowClear>
                        {
                          (allFeileiTypeList || []).map((item, key) => {
                            return <Select.Option key={key} value={item.sb_fl_id}>{item.sb_fl_name}</Select.Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    {/* <Form.Item rules={[{ required: true, message: '请输入联网设备厂家!' }]} name="sb_changjia" label="联网设备厂家">
                    <Input placeholder="请输入联网设备厂家" />
                  </Form.Item> */}
                    <Form.Item rules={[{ required: true, message: '请选择联网设备厂家!' }]} name="factory_id" label="联网设备厂家">
                      <Select placeholder="请选择联网设备厂家" allowClear>
                        {
                          (factory || []).map((item, key) => {
                            return <Select.Option key={key} value={item.factory_id}>{item.factory_name}</Select.Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item rules={[{ required: true, message: '请输入联网设备型号!' }]} name="sb_xinghao" label="联网设备型号">
                      <Input placeholder="请输入联网设备型号" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="sb_image"
                      label="联网设备图片"
                    >
                      <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        headers={{ 'x-auth-token': cookie.load('token') }}
                        action={req_uploadBgImage()}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                      >
                        {imageUrl ? <img src={IP.host + '/' + imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item className="addFormItem">
                  <Col span={20}>
                    <Button
                      type="dashed"
                      style={{ height: '40px' }}
                      onClick={() => {
                        this.setState({
                          visible3: true
                        })
                      }}
                      block
                    >
                      <PlusOutlined /> 添加属性
                    </Button>
                  </Col>
                </Form.Item>
                <Row>
                  {
                    formItems
                  }
                </Row>
              </Form>
            </div>
            <Modal
              title='添加属性'
              visible={visible3}
              onOk={() => {
                this.formRefAdd.current.validateFields().then(async values => {
                  let record = {}
                  addFormItemList.push({
                    attribute_name: values.attribute_name,
                    attribute_desc: values.attribute_desc,
                  })
                  record.addFormItemList = addFormItemList
                  record.attribute_name = ''
                  record.attribute_desc = ''
                  this.formRef.current.setFieldsValue(record)
                  this.formRefAdd.current.resetFields()
                  this.setState({
                    addFormItemList,
                    visible3: false,
                  })
                })
              }}
              onCancel={() => { this.setState({ visible3: false }) }}
            >
              <div>
                <Form ref={this.formRefAdd}  {...formItemLayout}  >
                  <Form.Item rules={[{ required: true, message: '请输入属性名称!' }]} name="attribute_name" label="属性名称">
                    <Input placeholder="请输入属性名称" style={{ width: 250 }} />
                  </Form.Item>
                  <Form.Item rules={[{ required: true, message: '请输入属性值!' }]} name="attribute_desc" label="属性值">
                    <Input placeholder="请输入属性值" style={{ width: 250 }} />
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </Modal>
          <Modal
            title='二维码'
            visible={visible2}
            okText="打印二维码"
            cancelText="关闭"
            onOk={() => this.windQRCode()}
            onCancel={() => { this.setState({ visible2: false }) }}
          >
            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <QRCode size={200} value={showqrurl} />
            </div>
          </Modal>
          <div id="windQRCode" style={{ display: 'none' }}>
            {/* <div style={{width:'100%',display:'flex',justifyContent:'center',height:'100%',alignItems:'center',flexDirection:'column'}}>
              <img style={{width:'300px',height:'300px'}} src="" id="image" alt=""/>
              <div style={{textAlign:'center',fontSize:'35px',marginTop:'30px',letterSpacing:'5px'}}>扫码查看设备详情</div>
            </div> */}
            <div style={{ width: '1000px', display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
              <img style={{ width: '100%', height: 'auto' }} src="http://114.116.10.77:7711//carousel/202011/2020110464848.jpg" alt="" />
              <img style={{ width: '27%', position: 'absolute', top: '50%', bottom: '50%', transform: 'translateY(-46%)' }} src="" id="image" alt="" />
            </div>

          </div>
        </div>
      </Spin>
    )
  }
}
export default equipmentInformation