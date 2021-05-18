import React, { Component } from 'react'
import { Form, Input, Button, Select, Divider, Popconfirm, Table, Pagination, Modal, Tree, message } from 'antd'
import { findAllRole, saveRole, deleteRole, findRoleByid, authorizeFunc } from '../../../api/api'
import { req_findAllFun } from '../../../api/hdlApi'
import './index.less'

const { TreeNode } = Tree;
class Role extends Component {

  formRef = React.createRef();

  state = {
    pageSize: 15,
    total: 1,
    name: '', // 姓名
    roleIsActive: '', // 状态
    data: [],
    visible: false,
    treeData: [], // 资源节点内容
    authorizationVisible: false,
    powerSelectedKeys: [], // 选中资源节点
    checkedKeys: [], // 需提交的资源节点
  }

  componentDidMount = () => {
    this.fetch(1)
    this.fetchResources()
  }

  // 查询角色信息
  fetch = async pageNum => {
    const { name, roleIsActive, pageSize } = this.state;
    const res = await findAllRole({ roleName: name, roleIsActive, pageNum, pageSize })
    if (res.code === 20000) {
      this.setState({
        data: res.data.list,
        total: res.data.total ? res.data.total : 1
      })
    }
  }

  // 点击授权按钮
  handleAuthoriAzation = async record => {
    const res = await findRoleByid({ roleId: record.role_id })
    if (res.code === 20000) {
      let list = (res.data || []).map(x => {
        // 遍历每个节点
        if (! res.data.filter(p => p.fun_parentId === x.fun_id).length > 0) {
          // 如果没有字节点的话
          return x
        }
        return undefined
      }).filter(q => q)
      this.setState({
        authorizationVisible: true,
        powerSelectedKeys: list.map(x => String(x.fun_id)),
        roleId: record.role_id,
        checkedKeys: res.data.map(x => x.fun_id),
      })
    }
  }

  // 查询所有资源节点信息
  fetchResources = async () => {
    const res = await req_findAllFun()
    if (res.code === 20000) {
      let menuList = res.data;
      menuList = menuList.map(m => {
        m.children = menuList.filter(p => p.fun_parentId === m.fun_id);
        return m;
      });
      this.setState({
        treeData: menuList.filter(x => x.fun_parentId === 0)
      });
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
      this.formRef.current.setFieldsValue({ role_isActive: 1 });
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
      const res = await saveRole(values)
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
    const res = await deleteRole({ roleId: record.role_id })
    if (res.code === 20000) {
      Modal.success({ content: res.message })
      this.fetch(1)
    }
  }

  // 资源树结构
  renderTreePowerNodes = data => {
    return data.map(item => {
      if (item.children.length > 0) {
        return (
          <TreeNode title={item.fun_name} key={item.fun_id} dataRef={item}>
            {this.renderTreePowerNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode title={item.fun_name} key={item.fun_id} dataRef={item} />
      );
    });
  };

  // 资源节点提交
  handleAuthorizationOk = async () => {
    message.loading('正在处理中...', 0)
    const { checkedKeys, roleId } = this.state;
    const res = await authorizeFunc({ roleId, funcIds: checkedKeys.join(',') })
    if (res.code === 20000) {
      message.destroy()
      this.setState({
        authorizationVisible: false,
      })
      Modal.success({ content: res.message })
    }
  }

  render() {
    const { pageSize, total, data, visible, title, treeData, authorizationVisible, powerSelectedKeys } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'text',
        render: (text, record, index) => ++index
      },
      {
        title: '角色名称',
        dataIndex: 'role_name',
      },
      {
        title: '描述',
        dataIndex: 'role_desc',
      },
      {
        title: '状态',
        dataIndex: 'role_isActive',
        render: status => status ? <span style={{color:'blue'}}>启用</span> : <span style={{color:'red'}}>禁用</span>,
      },
      {
        title: '操作',
        render: record => (
          <div>
            <a href="#!" onClick={() => this.handleEdit(record)}>编辑</a>
            <Divider type="vertical" />
            {
              record.role_isActive ? (<span><a href="#!" onClick={() => this.handleAuthoriAzation(record)}>授权</a>
              <Divider type="vertical" /></span>):('')
            }
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
    return (
      <div className="">  
        <div className="topForm">
          <Form layout="inline">
            <div>
              <Form.Item label="角色名称 : ">
                <Input style={{ width: 160 }} placeholder="请输入角色名称" onChange={e => this.setState({ name: e.target.value })} />
              </Form.Item>
              <Form.Item label="状态 : ">
                <Select style={{ width: 160 }} placeholder='请选择状态' allowClear onChange={e => this.setState({ roleIsActive: e })}>
                  <Select.Option value={0}>禁用</Select.Option>
                  <Select.Option value={1}>启用</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item className="searchBtn">
                <Button style={{ marginRight: 10 }} htmlType="submit" onClick={() => this.handleQuery()}>查询</Button>
                <Button type="primary" onClick={() => this.handleAdd()}>新增</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            bordered
            rowKey={record => record.role_id}
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
            <Form.Item name="role_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item label="角色名称" name="role_name" rules={[{ required: true, message: '请输入角色名称!' }]}>
              <Input placeholder='请输入角色名称' />
            </Form.Item>

            <Form.Item label="描述" name="role_desc" rules={[{ required: false, message: '请输入描述!' }]}>
              <Input.TextArea placeholder='请输入描述' rows={4} />
            </Form.Item>

            <Form.Item label="状态" name="role_isActive" rules={[{ required: true, message: '请选择状态!' }]}>
              <Select placeholder='请选择状态' allowClear>
                <Select.Option value={0}>禁用</Select.Option>
                <Select.Option value={1}>启用</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title='角色授权'
          visible={authorizationVisible}
          onOk={this.handleAuthorizationOk}
          onCancel={() => {
            this.setState({
              authorizationVisible: false
            });
          }}
          okText="确认"
          cancelText="取消"
        >
          <Tree
            checkable={true}
            onCheck={(c, x) => {
              this.setState({
                checkedKeys: [...c, ...x.halfCheckedKeys],
                // checkedKeys: c,
                powerSelectedKeys: c
              });
            }}
            checkedKeys={powerSelectedKeys}
            defaultExpandAll={true}
          >
            {this.renderTreePowerNodes(treeData)}
          </Tree>
        </Modal>
      </div>
    )
  }
}
export default Role