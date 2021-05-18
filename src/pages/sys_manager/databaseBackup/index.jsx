import React, { Component } from 'react';
import { Form, Button, Divider, Select,DatePicker, Table, Modal, Pagination, message } from 'antd'
import { findAllBackups,backup,downloadSpecifiedBackup ,restoreDB} from '../../../api/api'
import moment from 'moment'
import './index.less'
const { RangePicker } = DatePicker;
class DatabaseBackup extends Component {
    formRef = React.createRef();
    state = {
        data: [],
        pageSize: 15,
        total: 1,
        backup_type:'',//手动/自动
        file_state:'',//文件当前状态
        operate:'',//operate
        createTime:'',//开始时间
        endTime:'',//结束时间
        visible:false,
        closablebtn:false,
        closable:false,
        visible2:false,
        item:{}
    }

    componentDidMount = () => {
        this.findAllBackups(1)
    }
    //查询backup_type
    findAllBackups=(pageNum)=>{
        // backup_type:备份状态:1自动2手动,file_state:文件当前状态(0正常 1已删除),operate:操作状态1备份2还原,createTime:开始时间,endTime:结束时间
        const {backup_type,file_state,createTime,endTime,pageSize}=this.state
        findAllBackups({backup_type,file_state,pageNum,createTime:createTime ? createTime + ' 00:00:00' : null,endTime: endTime ? endTime + ' 23:59:59' : null,pageSize}).then(res=>{
            if(res.code===20000){
                this.setState({
                    total:res.data.total ? res.data.total : 1,
                    data:res.data.list,
                    pageNum
                })
            }
        })
    }
    clickk(item){
        downloadSpecifiedBackup({backup_id:item.backup_id})
    }
    restoreDB(item){
        this.setState({
            closablebtn:false,
            visible2:true,
            closable:false,
            item
        })
    }
    render() {
        const { data, pageSize ,closable,closablebtn,total,visible,visible2,item} = this.state;
        const columns = [
            {
                title: '序号',
                render: (text, record, index) => ++index
            },
            {
                title: '备份路径',
                dataIndex: 'file_url',
            },
            {
                title: '备份方式',
                dataIndex: 'backup_type',
                render: backup_type => backup_type===1 ?<div>自动</div>:backup_type===2 ?<div>手动</div>:''
            },
            {
                title: '文件状态',
                dataIndex: 'file_state',
                render: file_state => file_state===0 ?<div>正常</div>:file_state===1 ?<div>已删除</div>:''
            },
            {
                title: '操作人',
                dataIndex: 'operation_admin',
            },
            {
                title: '操作时间',
                dataIndex: 'create_time',
                render: time => time ? moment(time).format('YYYY-MM-DD HH:mm') : ''
            },
            {
                title: '操作',
                render: record => (
                    <div>
                        <a href="#!" onClick={() =>this.clickk(record) }>下载</a>
                        <Divider type="vertical" />
                            <a href="#!"  onClick={()=>this.restoreDB(record)}>还原</a>
                    </div>
                ),
                width: '15%'
            }
        ]
        return (
            <div >
                <div className="topForm">
                    <Form  layout="inline" >
                        <div>
                            <Form.Item name="backup_type">
                                <Select onChange={e => this.setState({backup_type:e})} placeholder="备份方式" allowClear style={{ width: 160,marginRight:'10px' }} >
                                <Select.Option  value="1">自动</Select.Option>   
                                <Select.Option  value="2">手动</Select.Option>   
                                </Select>
                            </Form.Item>
                            <Form.Item name="file_state" >
                                <Select  onChange={e => this.setState({file_state:e})} placeholder="文件当前状态" allowClear style={{ width: 160,marginRight:'10px' }} >
                                 <Select.Option  value="0">正常</Select.Option>    
                                 <Select.Option  value="1">已删除</Select.Option>   
                                </Select>
                            </Form.Item>
                            {/* <Form.Item name="operate">
                                <Select  onChange={e => this.setState({operate:e})} placeholder="操作状态" allowClear style={{ width: 160,marginRight:'10px' }} >
                                 <Select.Option  value="1">备份</Select.Option>    
                                 <Select.Option  value="2">还原</Select.Option>  
                                </Select>
                            </Form.Item> */}
                            <Form.Item name="admin_time">
                                <RangePicker  onChange={(e)=>this.setState({createTime:e&&e[0]?moment(e[0]).format('YYYY-MM-DD'):'',endTime:e&&e[1]?moment(e[1]).format('YYYY-MM-DD'):''})} /> 
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item>
                                <Button htmlType="submit" onClick={()=>this.findAllBackups(1)}  style={{ marginRight: '10px' }}>查询</Button>
                                <Button type='primary' onClick={()=>this.setState({visible:true,closable:false,closablebtn:false})} >手动备份</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div className='contentbody'>
                    <Table
                        scroll={{ x: true }}
                        columns={columns}
                        bordered
                        rowKey={record => record.backup_id}
                        dataSource={data}
                        pagination={false} />
                </div>
                <div className="pagination">
                    <div >

                    </div>
                    <div>
                        <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllBackups(page)} style={{ textAlign: 'right', padding: 12 }} />
                    </div>
                </div>
                 <Modal
                title="备份"
                visible={visible}
                closable={closable}
                width={540}
                maskClosable={false}
                okButtonProps={{disabled:closablebtn}}
                cancelButtonProps={{disabled:closablebtn}}
                onOk={()=>{this.setState({
                    closablebtn:true,
                })
                message.loading("数据库备份过程中请不要进行其他操作，以免备份失败。数据库备份需要一定时间，请耐心等待...", 0)
                backup().then(res=>{
                    if(res.code===20000){
                        message.destroy()
                        this.setState({
                            closable:true,
                            visible:false
                        })
                        Modal.success({content:'备份成功！'})
                        this.findAllBackups(1)
                    }else{
                        message.destroy()
                        this.setState({
                            closablebtn:false,
                            visible:false
                        })
                    }
                })
            }}
                onCancel={()=>{this.setState({visible:false,closablebtn:false})}}>
                    <div>
                        <span>{closable?'数据库备份成功':'确认要执行备份操作吗？非专业人士建议谨慎操作！'}</span>
                    </div>
                </Modal>
                <Modal
                title="还原备份"
                visible={visible2}
                closable={closable}
                width={540}
                maskClosable={false}
                okButtonProps={{disabled:closablebtn}}
                cancelButtonProps={{disabled:closablebtn}}
                onOk={()=>{
                    this.setState({
                    closablebtn:true,
                })
                
                message.loading("数据库备份还原过程中请不要进行其他操作，以免备份失败。数据库备份需要一定时间，请耐心等待...", 0)
                restoreDB({backup_id:item.backup_id}).then(res=>{
                    if(res.code===20000){
                        message.destroy()
                        this.setState({
                            visible2:false,
                            closable:true
                        })
                        Modal.success({content:'数据库还原成功！'})
                    }else{
                        message.destroy()
                        this.setState({
                            closablebtn:false,
                            visible2:false
                        })
                    }
                })
            }}
                onCancel={()=>{this.setState({visible2:false,closablebtn:false})}}>
                    <div>
                        <span>{closable?'数据库还原成功':'确认要执行还原操作吗？非专业人士建议谨慎操作！'}</span>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DatabaseBackup;