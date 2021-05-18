import React, { Component } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import NavBar from './components/navbar'
import RouteMap from './router/index'
import Login from './pages/sys_user/login'
import cookie from 'react-cookies'
import Utils from './utils/utils';
import './App.less'
import './common/index.less'
const history = createBrowserHistory();
class App extends Component {

  state = {
    isLogin: false
  }

  // 判断用户是否登录
  isLogin = () => {
    // 首先判断当前cookie里面是否存在数据
    let userCookie = cookie.load('user')
    if (userCookie) return true
    return false
  }

  componentDidMount = () => {
    var href=window.location.href
    // ?admin_name=FWH&token=15893108190&id=1
    // const id = Utils.GetQueryString('state');
    // console.log(Utils.GetQueryString('token'))
    // console.log(Utils.GetQueryString('admin_name'))
    if(Utils.GetQueryString('token')){
      cookie.save('token',Utils.GetQueryString('token'))
      cookie.save('app','app')
      cookie.save('user',{admin_name:Utils.GetQueryString('admin_name')})
      this.setState({
        isLogin: true
      })
    }else{
      cookie.save('app','home')
      this.setState({
      isLogin: this.isLogin()
    })
    }
    
  }

  render() {
    const { isLogin } = this.state;
    return (
        <Router history={history} forceRefresh={false} keyLength={12}>
          <div>
            {
              isLogin ? <NavBar><RouteMap /></NavBar> : <Login parent={this} />
            }
          </div>
        </Router>
    );
  }
}

export default App;