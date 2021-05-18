import React, { Component } from 'react'
import { Form, Input, Button, Divider, Popconfirm,Modal, Table, Pagination } from 'antd'
import { saveFenlei,findAllFeilei,deleteFenlei,updateFenlei} from '../../../api/api'
import './index.less'
const {TextArea}=Input
export default class EquipmentType extends Component {
  formRef = React.createRef();
    state = {
      pageSize: 15,
      total: 1,
      data: [],//
      sb_fl_name:'',//搜索设备名字
      title:"",
      visible:false,
      id:null,
    
  }
  componentDidMount() {
    this.findAllFeilei(1)
  }
  //查询所有设备类型
  findAllFeilei=(pageNum)=>{
    const {pageSize,sb_fl_name}=this.state
    findAllFeilei({pageNum,pageSize,sb_fl_name}).then(res=>{
      if(res.code===20000){
      this.setState({
        data:res.data.list,
        total:res.data.total ? res.data.total : 1
      })
      }
    })
  }
  //删除类型
  delete=(record)=>{
    deleteFenlei({sb_fl_id:record.sb_fl_id}).then(res=>{
      if(res.code===20000){
        Modal.success({content:'删除成功!'})
        this.findAllFeilei(1)
      }
    })
  }
  //编辑框
  editor=(record)=>{
    setTimeout(()=>{
      this.formRef.current.setFieldsValue({...record});
      }, 100)
    this.setState({
      visible:true,
      title:'编辑',
      sb_fl_id:record.sb_fl_id
    })
  }
  //添加框
  add=()=>{
    setTimeout(()=>{
      this.formRef.current.resetFields();
    }, 100)
    this.setState({visible:true,title:'新增'})
  }
  //添加类型
  saveFenlei=()=>{
    this.formRef.current.validateFields().then(async values => {
      saveFenlei({...values}).then(res=>{
        if(res.code===20000){
          this.setState({visible:false})
          Modal.success({content:'添加成功！'})
          this.findAllFeilei(1)
        }
      })
    })
  }
  //编辑类型
  updateFenlei=()=>{
    const {sb_fl_id}=this.state
    this.formRef.current.validateFields().then(async values => {
      updateFenlei({sb_fl_id,...values}).then(res=>{
        if(res.code===20000){
          this.setState({visible:false})
          Modal.success({content:'编辑成功！'})
          this.findAllFeilei(1)
        }
      })
    })
  }
  render() {
    const { pageSize, total, data,visible,title } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '设备类型',
        dataIndex: 'sb_fl_name',
      },
      {
        title: '类型描述',
        dataIndex: 'sb_fl_desc',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a href="#!" onClick={()=>this.editor(record)}> 编辑 </a>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗" okText="确认" cancelText="取消" onConfirm={()=>this.delete(record)}>
              <a  href="#!" style={{color:'red'}}  > 删除 </a>
            </Popconfirm>
          </div>
        )
      }
    ]
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className="classroomType">
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item name="sb_fl_name" label="设备类型 : ">
                <Input onChange={(e)=>this.setState({sb_fl_name:e.target.value})} style={{ width: 160 }} placeholder="请输入设备类型 " />
              </Form.Item>
            </div>
            <div>
              <Form.Item  >
                <Button htmlType="submit" style={{marginRight:'10px'}} onClick={()=>this.findAllFeilei(1)} >查询</Button>
                <Button onClick={()=>{ this.add() }} type="primary" >新增</Button>
              </Form.Item>
            </div>

          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.sb_fl_id}
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
            <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllFeilei(page)} style={{ textAlign: 'right', padding: 12 }} />
          </div>
        </div>
        <Modal
        title={title}
        visible={visible}
        onOk={()=>title==='新增'?this.saveFenlei():this.updateFenlei()}
        onCancel={()=>{this.setState({visible:false})}}>
          <Form  ref={this.formRef}  {...formItemLayout}  >
              <Form.Item rules={[{ required: true, message: '请输入设备类型名称!' }]}    name="sb_fl_name" label="设备类型名称">
                <Input  placeholder="请输入设备类型名称" style={{ width: 250 }}  />
              </Form.Item>
              <Form.Item    name="sb_fl_desc" label="设备类型描述">
                <TextArea  placeholder="请输入设备类型描述" style={{ width: 250 }}  />
              </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}