import React, { Component } from 'react'
import { Form, Row, Col, Button, Tree, TreeSelect, Input, InputNumber, Switch, Slider, Popconfirm, Modal } from 'antd'
import './index.less'
import  { req_findAllFun, req_addSysFun, req_findSysFunByid, req_updateSysFun, req_deleteFunById } from './../../../api/hdlApi'

class node extends Component {
  formRef = React.createRef();
  state = {
    Data: [], // tree数组
    gData: [],
    expandedKeys: [],
    inputValue: 1,
    fun_parentId: '',
    selectKey: undefined, //单挑数据的ID
    formValues: {
      fun_sort:1,
      fun_type:true,
    }, //编辑对象
  }

  componentDidMount = async() => {
    await this.findDataAll()
  }

  // 获取所有节点数据
  findDataAll=async()=>{
    const res = await req_findAllFun()
    if(res.code === 20000){
      let menuList = res.data.map(item => {
        return {
          key: item.fun_id,
          title: item.fun_name,
          parentid: item.fun_parentId,
          value: item.fun_id,
        };
      });
      menuList = menuList
        .map(item => {
          const newItem = item;
          newItem.children = menuList.filter(p => p.parentid === item.key);
          return item;
        })
        .filter(p => p.parentid === 0);
      this.setState({
        gData: menuList,
      });
    }
  }

  // 排序数字
  onSliderChange = value => {
    this.setState({
      inputValue: value,
    })
  };

  onTreeSelectChange = selectTreeValue => {
    

  };

  // 提交数据
  handleSubmit = async value => {
    // 新增or编辑
    const { inputValue } = this.state;
    const method = value.fun_id?req_updateSysFun:req_addSysFun
    value.fun_sort = inputValue
    value.fun_type = value.fun_type?1:2
    const res = await method(value)
    if(res.code===20000){
      this.setState({
        selectKey: undefined,
        formValues: {
          fun_sort:1,
          fun_type:true,
        },
        fun_parentId: ''
      })
      this.formRef.current.resetFields()
      await this.findDataAll()
      Modal.success({content:res.message})
    }
  };

  // 验证失败
  onFinishFailed = () => {

  };

  // 删除
  onDeleteBtnClick = async() => {
    const { selectKey } = this.state;

    if (selectKey) {
      const res = await req_deleteFunById({fun_id:selectKey})
      if(res.code===20000){
        Modal.success({content:'删除成功'})
        this.findDataAll()
        this.formRef.current.resetFields()
      }
    }
  }

  // 点击树节点
  onTreeSelect = e => {
    this.setState({
      selectKey: e.length > 0 ? e[0] : undefined,
    }, () => {
      this.findFun()
    });
  };

  // 查询单条数据
  findFun = async() => {
    const { selectKey } = this.state;
    const res = await req_findSysFunByid({fun_id:selectKey})
    if(res.code===20000){
      let data=res.data
      if(data){
        data.fun_type= data.fun_type===1?true:false
        data.fun_parentId= data.fun_parentId?data.fun_parentId:null
      }
      this.formRef.current.setFieldsValue(data);
    }
  }

  //点击新增form表单
  reset=()=>{
    this.formRef.current.resetFields()
      this.setState({
        selectKey: undefined,
        formValues: {
          fun_sort:1,
          fun_type:true,
        },
        fun_parentId: ''
      })
  }

  render() {
    const { expandedKeys, inputValue, gData, formValues, selectKey } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 4 },
    };

    return (
      <div className='node'>
        <Row style={{ height: '100%' }}>
          <Col span={7} style={{ borderRight: '1px solid #ddd', height: '100%' }}>
            <div className="nodeLeft">
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #ddd', fontSize: 16 }}>组织架构</div>
              <div style={{ padding: '12px 24px' }}>
                <Button type="primary" onClick={() => {this.reset()}}>
                  新增节点
              </Button>
              <Popconfirm
                title="你确定删除这个节点吗？？？"
                onConfirm={this.onDeleteBtnClick}
                onCancel={()=>{}}
                disabled={selectKey?false:true}
                okText="确定"
                cancelText="取消"
              >
                <Button type="danger" style={{ marginLeft: 15 }}>
                  删除节点
                </Button>
              </Popconfirm>
                
              </div>
              <div style={{ padding: '0 24px' }}>
                <Tree
                  defaultExpandedKeys={expandedKeys}
                  draggable
                  blockNode
                  selectedKeys={[selectKey]}
                  treeData={gData}
                  onDragEnter={this.onDragEnter}
                  onDrop={this.onDrop}
                  onSelect={this.onTreeSelect}
                >
                </Tree>
              </div>
            </div>
          </Col>
          <Col span={17} >
            <div className="nodeRight" >
              <Form layout="horizontal"  onFinish={this.handleSubmit} initialValues={formValues} onFinishFailed={this.onFinishFailed} className="nodeForm" ref={this.formRef}>
                <Form.Item name="fun_id" hidden>
                  <Input />
                </Form.Item>
                <Form.Item label="父节点" name="fun_parentId" {...formItemLayout}>
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择父节点"
                    treeData={gData}
                    onChange={this.onTreeSelectChange}
                  />
                </Form.Item>
                <Form.Item label="页面节点名称" rules={[{ required: true, message: '请输入节点名称' }]} name='fun_name' {...formItemLayout}><Input placeholder="请输入页面节点名称" />
                </Form.Item>

                <Form.Item label="路径" rules={[{ required: true, message: '请输入路径' }]} name="fun_url" {...formItemLayout}><Input placeholder="请输入路径" />
                </Form.Item>

                <Form.Item label="Icon" name="fun_icon" {...formItemLayout}><Input placeholder="请输入ICON" />
                </Form.Item>

                <Form.Item label="类型" name="fun_type"  valuePropName="checked" {...formItemLayout}>
                    <Switch checkedChildren="页面" unCheckedChildren="按钮" defaultChecked  />
                </Form.Item>

                <Form.Item label="标识" name="fun_code" {...formItemLayout}><Input placeholder="请输入节点标识" />
                </Form.Item>

                <Form.Item label="排序" name="fun_sort" {...formItemLayout}>
                  <Row>
                    <Col span={12}>
                      <Slider min={1} max={100} value={inputValue} onChange={this.onSliderChange} />
                    </Col>
                    <Col span={4}>
                      <InputNumber
                        min={1}
                        max={100}
                        style={{ marginLeft: 16 }}
                        value={inputValue}
                        onChange={this.onSliderChange}
                      />
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item label="节点描述" name="fun_desc" {...formItemLayout}>
                  <Input placeholder="节点描述" />
                </Form.Item>

                <Form.Item  {...buttonItemLayout}>
                <Button onClick={()=>{
                    this.formRef.current.resetFields()
                    this.setState({
                      selectKey: undefined,
                      formValues: {
                        fun_sort:1,
                        fun_type:true,
                      },
                      fun_parentId: ''
                    })
                  }}>重置</Button>
                  <Button style={{marginLeft:'20px'}} type="primary" htmlType="submit">
                    {selectKey?'修改':'提交'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default node;

