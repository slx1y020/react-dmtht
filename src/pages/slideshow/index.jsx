/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm, Table, Pagination, Modal, Upload } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { req_findAllLunbo, req_uploadLunboImage, req_saveLunbo, req_delLunbo } from '../../api/hdlApi'
import cookie from 'react-cookies';
import IP from '../../config/config'
import './index.less'

const { TextArea } = Input;
class Slideshow extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    name: '', // 标题
    data: [],
    visible: false,
    keys:[],
    imageUrl:'', // 轮播图
  }

  componentDidMount = () => {
    this.fetch(1)
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { name, pageSize } = this.state;
    const res = await req_findAllLunbo({ name, pageNum, pageSize })
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
      keys:[0],
      visible: true,
      imageUrl:'',
      loading: false,
      title: '新增',
    })
  }

  // 编辑
  handleEdit = record => {
    setTimeout(async() => {
      this.setState({
        imageUrl:record.url
      })
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
      const { imageUrl } = this.state
      values.url = imageUrl
      const method=req_saveLunbo
      const res = await method(values)
      if (res.code === 20000) {
        Modal.success({ content: res.message })
        this.setState({
          visible: false,
          imageUrl:'',
          loading: false,
        })
        this.fetch(1)
      }
    });
  }

  // 删除
  handleDel = async record => {
    const res = await req_delLunbo({ lb_id: record.lb_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
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

  render() {
    const { pageSize, total, data, visible, title, imageUrl, loading } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '标题',
        dataIndex: 'name',
      },
      {
        title: '图片',
        dataIndex: 'url',
        render:url=>(
          <div style={{ height: 40, textAlign: 'center' }}>
            <a href={`${IP.host}` + url} target="_blank"><img height="40px" src={`${IP.host}` + url} alt="" /></a>
          </div>
        )
      },
      {
        title: '描述',
        dataIndex: 'lb_desc',
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
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div className="slideshow">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="标题 : ">
                <Input style={{ width: 160 }} placeholder="请输入标题名称" onChange={e => this.setState({ name: e.target.value })} />
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
            rowKey={record => record.lb_id}
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
            this.setState({ visible: false, imageUrl:'' })
          }}
        >
          <Form {...layout} ref={this.formRef}>
            <Form.Item name="lb_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="标题" name="name" rules={[{ required: true, message: '请输入标题!' }]}>
              <Input placeholder='请输入标题' />
            </Form.Item>

            <Form.Item label="图片" name="url" rules={[{ required: true, message: '请上传图片!' }]}>
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                headers={{'x-auth-token': cookie.load('token')}}
                action={req_uploadLunboImage()}
                beforeUpload={()=>{}}
                onChange={this.handleChange}
              >
                {imageUrl ? <img src={IP.host + imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item label="描述" name="lb_desc" rules={[{ required: false, message: '请输入描述!' }]}>
              <TextArea placeholder='请输入描述' rows={4} />
            </Form.Item>


          </Form>
        </Modal>
      </div>
    )
  }
}
export default Slideshow