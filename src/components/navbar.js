import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import * as Icon from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import Logout from '../pages/sys_user/logout';
import Bread from './breadcrumb';
import { req_findAllFun } from './../api/hdlApi'

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
class Navbar extends Component {

  state = {
    collapsed: false,
    menu: [],
    data: [],
    funId: null,
    openKeys: [],
  }

  componentDidMount = async () => {
    const res = await req_findAllFun()
    if (res.code === 20000) {
      let data = res.data.map(val => {
        const item = {
          fun_id: val.fun_id,
          fun_parentId: val.fun_parentId,
          fun_name: val.fun_name,
          fun_icon: val.fun_icon,
          fun_url: val.fun_url,
        }
        return item
      })
      const pathName = window.location.pathname
      if (pathName === '/') {
        var funId = data[0].fun_id
      } else {
        // funId = data.find(x => x.fun_url === pathName).fun_id
        var funId = data[0].fun_id
      }
      let menu = data.map(m => {
        m.children = data.filter(p => p.fun_parentId === m.fun_id);
        return m;
      }).filter(x => x.fun_parentId === 0);
      this.setState({
        funId,
        menu,
        data,

      })
    }
  }

  toggleCollapsed = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  iconBC = (name) => {
    return (React.createElement(Icon && Icon[name], {
      style: { fontSize: 16 }
    }))
  }

  // 菜单渲染
  renderMenu = data => {
    return data.map(item => {
      if (item.children.length) {
        return (
          <SubMenu title={item.fun_name} key={item.fun_id} icon={item.fun_icon ? this.iconBC(item.fun_icon) : ''}>
            {this.renderMenu(item.children)}
          </SubMenu>
        )
      }
      return <Menu.Item title={item.fun_name} key={item.fun_id} icon={item.fun_icon ? this.iconBC(item.fun_icon) : ''} onClick={() => this.setState({ funId: item.fun_id })}>
        {
          item.fun_id===192?<a href={item.fun_url} target="_blank">{item.fun_name}</a>:(<NavLink to={`${item.fun_url || ''}`}>{item.fun_name}</NavLink>)
        }
        
      </Menu.Item>
    })
  }
  onOpenChange = openKeys => {
    const { data } = this.state
    if (openKeys.length >= 2 && data.find(item => item.fun_id === Number(openKeys[openKeys.length - 1])).fun_parentId === Number(openKeys[openKeys.length - 2])) {
      this.setState({ openKeys })
      return
    } else {
      this.setState({ openKeys: [String(openKeys[openKeys.length - 1])] })
    }
  };
  render() {
    const { menu, data, collapsed, funId } = this.state;
    return (
      <Layout className='navbar-layout'>
        <Sider
          theme='dark'
          collapsible
          collapsed={collapsed}
          onCollapse={this.onCollapse}
        >
          <div className='logo'>
            {
              collapsed ? <img alt='' src={require('../images/02.png')} /> :
                <img alt='' src={require('../images/logo.png')} />
            }
          </div>
          <Menu openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} className='navbar-menu' theme='dark' selectedKeys={[data.find(x => x.fun_id === funId) && String(data.find(x => x.fun_id === funId).fun_id)]} mode='inline'>
            {this.renderMenu(menu)}
          </Menu>
        </Sider>
        <Layout>
          <Header className='navbar-header'>
            <div className='menu-btn' style={{display:'flex'}} onClick={() => this.toggleCollapsed()}>
              <div>
                {
                  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                }
              </div>
              <div style={{ margin: '16px 15px' }}>
                <div className='bread-content'>
                  {/* <img alt='' src={require('../images/03.png')} /> */}
                  <Bread />
                </div>
              </div>
            </div>
            <Logout />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div style={{ padding: 0, paddingTop: '15px', minHeight: 360 }}>
              {this.props.children}
            </div>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}></Footer> */}
        </Layout>
      </Layout>
    );
  }
}

export default Navbar;