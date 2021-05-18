import React, { Component } from 'react'
import { Form, Input, Button, Select, Divider, Tree, Popconfirm, Modal, Table, Pagination, message, Spin } from 'antd'
import QRCode from 'qrcode.react';
import { findAllSpaceTypes, findAllSpaces, delSpace, saveSpace, findAllClassroomInfos, saveClassroomInfos, findClassroomTypes, delClassroomInfos,findFaculty } from '../../../api/api'
import './index.less'
import * as Icon from '@ant-design/icons';
class ClassList extends Component {
  formRef = React.createRef();
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
    node: {},//右键点击的节点信息
    dataType: [],//节点类型
    dataTypeBackups: [], // 节点类型
    disabledEditor: false,
    selectedKeys: {},
    classNameTypeList: [],//教室类型列表
    isEditor: false,
    classroominfor: {},
    classroom_code: '',//搜索教室编号
    classroom_name: '',//搜索教室名称
    classroom_type: null,//搜索教室类型
    status: '',//搜索的教室状态
    facultyDates:[],//学院列表
    visible3:false,
    qrCode:'',
    classRoomCode:'',
    loadings: false,
    space_flag:0
  }
  iconBC = (name) => {
    return (React.createElement(Icon && Icon[name], {
      style: { fontSize: 16 }
    }))
  }
  componentDidMount =async () => {
    // this.fetchDepartment()
    await this.findClassroomTypes()
    await this.findAllSpaces()
    await this.findAllSpaceTypes()
    await this.findAllClassroomInfos(1)
    await this.findFaculty()
  }
  //查询院系
  findFaculty= async()=>{
    const res=await findFaculty({flag:2})
    if(res.code===20000){
      // console.log(res,'asaaaaaaaaaaaaaa')
      this.setState({
        facultyDates:res.data.length?res.data:[]
      })
    }
  }
  //查询教室类型
  findClassroomTypes =async () => {
    const res=await findClassroomTypes({ pageSize: 9999, pageNum: 1 })
      if (res.code === 20000) {
        this.setState({
          classNameTypeList: res.data.list || []
        })
      }
  }
  // 查询所有楼宇信息
  findAllSpaces = () => {
    findAllSpaces().then(res => {
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
        dataList: res.data
      })
      
    })
  }
  //查询节点类型
  findAllSpaceTypes = () => {
    findAllSpaceTypes().then(res => {
      if (res.code === 20000) {
        this.setState({ dataType: res.data, dataTypeBackups: res.data })
        // console.log(res.data,'aaaaaaaaaaaaaaaaaaaaaaaaaa')
      }
    })
  }
  //查询教室
  findAllClassroomInfos = (pageNum) => {
    const {space_flag}=this.state
    setTimeout(() => {
      this.setState({
        loadings: true
      })
      const { node, pageSize, classroom_code, classroom_type } = this.state
      findAllClassroomInfos({space_flag, pageNum, pageSize, space_id: node.key || '', classroom_code, classroom_type }).then(res => {
        // console.log(res.data.list,'sssssssssssssssssssssssss')
        if (res.code === 20000) {
          this.setState({
            data: res.data.list.map((val, key) => {
              const item = { ...val }
              item.key = key
              return item
            }),
            total: res.data.total ? res.data.total : 1,
            loadings: false
          })
        }
      })
    }, 0)
    
  }
    //点击Tree查询
    findAllClassroomInfos2 = (pageNum) => {
      const {space_flag}=this.state
      setTimeout(() => {
        this.setState({
          loadings: true
        })
        const { node, pageSize } = this.state
        findAllClassroomInfos({ space_flag,pageNum, pageSize, space_id: node.key || '' }).then(res => {
          if (res.code === 20000) {
            this.setState({
              data: res.data.list.map((val, key) => {
                const item = { ...val }
                item.key = key
                return item
              }),
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
    // console.log(info.node,'ssssssssssssssssssssss')
    this.setState({
      selectedKeys: selectedKeys.length ? info.node  :{},
      node: selectedKeys.length ?info.node: {}  ,
      space_flag:selectedKeys.length ?info.node.value: 0  ,
    }, () => {
      this.findAllClassroomInfos2(1)
    })
  };

  // 树节点右键
  handleOnRight = e => {
    const { dataTypeBackups } = this.state;
    var x = e.event.currentTarget.offsetLeft + e.event.currentTarget.clientWidth;
    var y = e.event.currentTarget.offsetTop;
    // console.log(e.node)
    this.setState({
      NodeTreeItem: {
        pageX: x,
        pageY: y,
        node: e.node,
      },
    });
    if (e.node.value === 0) {
      this.setState({
        dataType: dataTypeBackups.filter(p => p.space_flag_name === '学区')
      })
    } else if (e.node.value === 1) {
      this.setState({
        dataType: dataTypeBackups.filter(p => p.space_flag_name === '楼宇')
      })
    } else {
      this.setState({
        dataType: dataTypeBackups
      })
    }
  }
  //删除楼宇
  handleDeleteSub = (item) => {
    delSpace({ space_id: item.key }).then(res => {
      if (res.code === 20000) {
        message.success({ content: '删除成功！' })
        this.findAllSpaces()
        if(String(item.key)===String(this.state.selectedKeys.key)){
          this.setState({
            selectedKeys:{}
          })
        }
      }
    })
  }
  // 树节点右键弹窗内容
  getNodeTreeMenu = () => {
    const { pageX, pageY, node } = { ...this.state.NodeTreeItem };
    const tmpStyle = {
      position: 'absolute',
      textAlign: 'center',
      left: `${pageX - 18}px`,
      top: `${pageY + 20}px`,
      zIndex: 99999,
      padding: '10px',
      background: '#fff',
      boxShadow: '1px 1px 3px 1px #888888',
      borderRadius: '5px',
    };
    const menu = (
      <div
        style={tmpStyle}
      >
        {
          [0, 1].includes(node.value) ? <div style={{ textAlign: 'center', cursor: 'pointer', padding: '3px 0' }} onClick={() => this.handleAddSub(node)}>
            添加子节点信息
          </div> : ''
        }

        {
          [1, 2].includes(node.value) ? <div style={{ textAlign: 'center', cursor: 'pointer', padding: '3px 0' }} onClick={() => this.handleEditorSub(node)}>
            修改节点信息
          </div> : ''
        }

        {
          [1, 2].includes(node.value) ? <div style={{ textAlign: 'center', cursor: 'pointer', padding: '3px 0' }} onClick={() => this.handleDeleteSub(node)}>
            删除节点信息
          </div> : ''
        }
      </div>
    );
    return (this.state.NodeTreeItem == null) || (node.value === 3) ? '' : menu;
  }
  //新增编辑
  saveSpace = (item) => {//spaceEntity 
    const { node, disabledEditor } = this.state
    if (disabledEditor) {
      item = {  space_flag: item.space_flag, space_id: node.key, space_name: item.space_name }
    }
    saveSpace({ ...item }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '操作成功！' })
        this.setState({
          visible: false
        })
        this.findAllSpaces()
      }
    })
  }
  // 清除树节点右键的弹窗
  clearMenu = () => {
    this.setState({
      NodeTreeItem: null
    })
  }
  //显示编辑框
  handleEditorSub = node => {
    setTimeout(() => {
      this.formRef.current.setFieldsValue({ parent_id: node.parentId, space_flag: node.value, space_name: node.title });
    }, 100)
    this.setState({ visible: true, title: '编辑节点信息', node: node, disabledEditor: true })
  }
  //显示添加框
  handleAddSub = node => {
    setTimeout(() => {
      this.formRef.current.resetFields();
      this.formRef.current.setFieldsValue({ parent_id: node.key,space_flag: node.value+1 });
    }, 100)
    this.setState({ visible: true, title: '添加子节点', node: node, disabledEditor: false })
  }
  // 保存or编辑
  handleOk = () => {
    this.formRef.current.validateFields().then(async values => {
      this.saveSpace(values)
    })
  }
  //编辑教室
  editor = (record) => {
    const { classNameTypeList } = this.state
    this.setState({
      visible2: true,
      isEditor: true,
      classroominfor: record
    }, () => {
      setTimeout(() => {
        this.formRef.current.setFieldsValue({ classroom_code: record.classroom_code, classroom_name: record.classroom_name, classroom_type: record.classroom_type, classroom_type_name: classNameTypeList.filter(item => item.classroom_type === record.classroom_type).classroom_type_name, space_id: record.space_id, space_name: record.space_name, classroom_id: record.classroom_id,faculty_id:record.faculty_id });
      }, 100)
    })
  }
  //删除教室
  delete = (record) => {
    delClassroomInfos({ classroom_id: record.classroom_id }).then(res => {
      if (res.code === 20000) {
        Modal.success({ content: '删除成功！' })
        this.findAllClassroomInfos(1)
        this.findAllSpaces()
      }
    })
  }
  //添加教室
  addClassroom = () => {
    const { selectedKeys, node } = this.state
    // console.log(selectedKeys.value,'sssssssssssssss')
    setTimeout(() => {
      if(this.formRef.current){
        this.formRef.current.resetFields()
      }
    }, 10)
    if(selectedKeys.value!==undefined){
      if (selectedKeys.value===2) {
          this.setState({ visible2: true, isEditor: false })
      } else {
        Modal.warning({ content: `当前选中的是${selectedKeys.value === 0?'学校':selectedKeys.value === 1?'学区':''},请选择一个教学楼！！` })
      }
    }else {
      Modal.warning({ content: `请选择一个教学楼！！` })
    }
    
  }
  handleAddClassroom = () => {
    const { node, classNameTypeList, isEditor, classroominfor } = this.state
    this.formRef.current.validateFields().then(async values => {
      
      let item = { classroom_code: values.classroom_code,  classroom_type: values.classroom_type, classroom_type_name: classNameTypeList.filter(item => item.classroom_type === values.classroom_type)[0].classroom_type_name, space_id: node.key, space_name: node.title ,faculty_id:values.faculty_id}
      if (isEditor) {
        item = { classroom_code: values.classroom_code, classroom_type: values.classroom_type, classroom_type_name: classNameTypeList.filter(item => item.classroom_type === values.classroom_type)[0].classroom_type_name, space_id: classroominfor.space_id, space_name: classroominfor.space_name, classroom_id: classroominfor.classroom_id ,faculty_id:values.faculty_id}
      }
      saveClassroomInfos({ ...item }).then(res => {
        if (res.code === 20000) {
          this.setState({ visible2: false, isEditor: false })
          Modal.success({ content: '操作成功！' })
          this.findAllClassroomInfos(1)
          this.findAllSpaces()
        }
      })
    })
  }
  windQRCode = () => {
            var img = document.getElementById("image"); /// get image element
                 var canvas  = document.getElementsByTagName("canvas")[0];  /// get canvas element
                img.src = canvas.toDataURL();
                setTimeout(()=>{
                  var printHtml = document.getElementById("windQRCode").innerHTML;
                  var wind = window.open("", 'newwindow', 'height=300, width=700, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
                  wind.document.body.innerHTML = printHtml;
                  //执行打印
                  wind.print();
                },300)
  }
  render() {
    const { pageSize, total, dataList, visible2, classNameTypeList, data, dataType, visible3, buildingData, title, visible, isEditor ,facultyDates, qrCode,dataTypeBackups,classRoomCode, loadings } = this.state
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
      // {
      //   title: '空间ID',
      //   dataIndex: 'classroom_code',
      // },
//        sunray_spaceID
//        sunray_on_scene_id
//        sunray_off_scene_id
      // {
      //   title: '教室',
      //   dataIndex: 'classroom_name',
      // },
      {
        title: '区域',
        dataIndex: 'quyu_lou',
      },
      {
        title: '类型',
        dataIndex: 'classroom_type',
        render: type => (
          <>
            {
              classNameTypeList.find(x => x.classroom_type === type).classroom_type_name || ''
            }
          </>
        )
      },
      {
        title: '院系',
        dataIndex: 'faculty_name',
      },
      {
        title: '操作',
        render: (record) => (
          <div>
            <a href="#!" onClick={()=>{
            const qrCode = 'http://dmt.huanghuai.edu.cn:7712/?state='+record.space_parent_id+','+record.classroom_id
            console.log(qrCode)
            // console.log(record.space_parent_id,record.classroom_id)
            this.setState({
              visible3:true,
              qrCode,
              classRoomCode:record.classroom_code
            })
          }}> 二维码 </a>
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
    return (
      <Spin  spinning={loadings} tip='加载中...'>
      <div className="classroomList" onClick={this.clearMenu}>
        <div className="topForm">
          <Form layout="inline" >
            <div>
              <Form.Item name="classroom_code" label="教室门牌号 : ">
                <Input onChange={(e) => this.setState({ classroom_code: e.target.value })} style={{ width: 160 }} placeholder="请输入教室门牌号" />
              </Form.Item>
              {/* <Form.Item name="classroom_name" label="教室名称 : ">
                <Input onChange={(e) => this.setState({ classroom_name: e.target.value })} style={{ width: 160 }} placeholder="请输入教室名称" />
              </Form.Item> */}
              <Form.Item name="classroom_type" label="教室类型 : ">
                <Select onChange={(e) => this.setState({ classroom_type: e })} style={{ width: 160 }} allowClear placeholder="请选择教室类型 ">
                  {
                    (classNameTypeList || []).map((item, key) => {
                      return <Select.Option key={key} value={item.classroom_type}>{item.classroom_type_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
              {/* <Form.Item name="status" label="状态 : ">
                <Select onChange={(e)=>this.setState({status:e})} style={{ width: 160 }} allowClear>
                  <Select.Option value="1">开</Select.Option>
                  <Select.Option value="2">关</Select.Option>
                </Select>
              </Form.Item> */}
            </div>
            <div>
              <Form.Item>
                <Button htmlType="submit" onClick={() => this.findAllClassroomInfos(1)} style={{ marginRight: '10px' }}>查询</Button>
                <Button onClick={() => this.addClassroom()} type="primary">添加教室</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="content_center">
          {this.state.NodeTreeItem !== null ? this.getNodeTreeMenu() : ''}
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
                rowKey={(record) => record.key}
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
                <Pagination defaultCurrent={1} pageSize={pageSize} total={total} showSizeChanger={false} onChange={page => this.findAllClassroomInfos(page)} style={{ textAlign: 'right', padding: 12 }} />
              </div>
            </div>
          </div>
        </div>
        <Modal
          title={title}
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => { this.formRef.current.resetFields();this.setState({ visible: false }) }}
        >
          <div>
            <Form ref={this.formRef}  {...formItemLayout}  >
              <Form.Item rules={[{ required: true, message: '请选择父级节点!' }]} name="parent_id" label="父级节点">
                <Select disabled placeholder="请选择父级节点" style={{ width: 250 }} allowClear>
                  { 
                    (dataList || []).map((item, key) => {
                      return <Select.Option value={item.space_id} key={key} >{item.space_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择节点类型!' }]} name="space_flag" label="节点类型">
                <Select disabled placeholder="请选择节点类型" style={{ width: 250 }} allowClear>
                  {
                    (dataTypeBackups || []).map((item, key) => {
                      return <Select.Option key={key} value={item.space_flag_id}>{item.space_flag_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请输入节点名称!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value.indexOf(',')===-1 && value.indexOf('，')===-1) {
                        return Promise.resolve();
                      }
                      return Promise.reject('不能输入逗号！！!');
                    },
                  })]} name="space_name" label="节点名称">
                <Input placeholder="请输入节点名称" style={{ width: 250 }} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          title={isEditor ? '编辑教室信息' : '添加教室信息'}
          visible={visible2}
          onOk={() => this.handleAddClassroom()}
          onCancel={() => { this.formRef.current.resetFields();this.setState({ visible2: false, disabledEditor: false }) }}
        >
          <div>
            <Form ref={this.formRef}  {...formItemLayout}  >
              {/* <Form.Item rules={[{ required: true, message: '请输入教室名称!' }]} name="classroom_name" label="教室名称">
                <Input placeholder="请输入教室名称" style={{ width: 250 }} />
              </Form.Item> */}
              <Form.Item rules={[{ required: true, message: '请输入教室门牌号!' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (value.indexOf(',')===-1 && value.indexOf('，')===-1) {
                        return Promise.resolve();
                      }
                      return Promise.reject('不能输入逗号！！!');
                    },
                  })]} name="classroom_code" label="教室门牌号">
                <Input placeholder="请输入教室门牌号" style={{ width: 250 }} />
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择院系!' }]} name="faculty_id" label="学院名称">
                <Select  placeholder="请选择学院" style={{ width: 250 }} allowClear>
                  {
                    (facultyDates || []).map((item, key) => {
                      return <Select.Option key={key} value={item.faculty_id}>{item.faculty_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item rules={[{ required: true, message: '请选择教室类型名称!' }]} name="classroom_type" label="教室类型名称">
                <Select  placeholder="请选择教室类型名称" style={{ width: 250 }} allowClear>
                  {
                    (classNameTypeList || []).map((item, key) => {
                      return <Select.Option key={key} value={item.classroom_type}>{item.classroom_type_name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Modal
           title='二维码'
          visible={visible3}
          okText="打印二维码"
          cancelText="关闭"
          onOk={()=>this.windQRCode()}
          onCancel={() => { this.setState({ visible3: false }) }}
        >
           <div  style={{ width: '100%', height: '300px',display: 'flex',justifyContent: 'center',marginTop:'20px'}}>
             <div>
               <QRCode size={200} style={{width:'200px',height:'200px',color:'red',backgroundColor:'blue'}} value={qrCode} />
               {/* <img id='image' src="" alt=""/> */}
             </div>
            
           </div>
        </Modal>
        <div  id="windQRCode" style={{display:'none'}}>
            {/* <div style={{width:'100%',display:'flex',justifyContent:'center',height:'100%',alignItems:'center',flexDirection:'column',backgroundImage:`url(${'http://114.116.10.77:7711//carousel/202011/2020110479522.jpg'})`,backgroundRepeat:'no-repeat',backgroundSize:'auto 720px',backgroundPosition:'center center'}}>
              <img  style={{width:'300px',height:'300px',transform:'translateY(15px)'}} src="" id="image" alt=""/>
            </div> */}
            {/* <div style={{width:'100%',display:'flex',justifyContent:'center',height:'100%',alignItems:'center',flexDirection:'column',position:'relative'}}>
              <img style={{width:'100%',height:'auto'}}  src="http://114.116.10.77:7711//carousel/202011/2020110479522.jpg"  alt=""/>
              <img  style={{width:'25%',position:'absolute',top:'50%',bottom:'50%',transform:'translateY(-46%)'}} src="" id="image" alt=""/>
            </div> */}
            {/* <div style={{width:'100%',display:'flex',justifyContent:'center',height:'auto',alignItems:'center',flexDirection:'column',position:'relative',marginTop:'200px'}}>
              <img style={{width:'100%',height:'auto'}}  src="http://114.116.10.77:7711//carousel/202011/2020110479522.jpg"  alt=""/>
              <img  style={{width:'25%',position:'absolute',top:'50%',bottom:'50%',transform:'translateY(-46%)'}} src="" id="image" alt=""/>
            </div> */}
            <div style={{width:'1000px',justifyContent:'center',alignItems:'center',display:'flex',alignItems:'center',height:'100%'}}>
              <div style={{position:'relative',width:'100%',height:'auto'}}>
                <img style={{width:'1000px',height:'auto'}}  src="http://114.116.10.77:7711//carousel/202011/2020110479522.jpg"  alt=""/>
                <span style={{color:'rgb(15,83,161)',fontSize:'40px',position:'absolute',top:'60px',left:'330px'}}>{classRoomCode}</span>
                <img  style={{width:'300px',position:'absolute',top:'215px',left:'350px'}} src="" id="image" alt=""/>
              </div>
            </div>
            
        </div>
      </div>
      </Spin>
      // http://114.116.10.77:7711//carousel/202011/2020110479522.jpg
      // http://114.116.10.77:7711//carousel/202011/2020110464848.jpg
    )
  }
}
export default ClassList