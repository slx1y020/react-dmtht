import React, { Component } from 'react';
// import { Form, Input, Button, Checkbox, Row, Col, Modal } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { req_login } from '../../api/api'
import cookie from 'react-cookies'
import './index.less'

class Login extends Component {

  state = {
    yanzheng: false
  }

  componentDidMount = () => {
    // this.acquire();
    // window.addEventListener('mousedown', this.onmousedown);
    // window.addEventListener('mousemove', this.onmousemove);
    // window.addEventListener('mouseup', this.onmouseup);
  }

  // 定义一个获取dom元素的方法
  acquire = () => {
    const $ = selector => {
      return document.querySelector(selector);
    };

    const box = $('.drag'); // 容器
    const bg = $('.bg'); // 背景
    const text = $('.text'); // 文字
    const btn = $('.btn'); // 滑块
    let success = false; // 是否通过验证的标志
    const distance = box.offsetWidth - btn.offsetWidth; // 滑动成功的宽度（距离）

    btn.onmousedown = e => {
      // 1.鼠标按下之前必须清除掉后面设置的过渡属性
      btn.style.transition = '';
      bg.style.transition = '';

      // 说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。

      // 2.当滑块位于初始位置时，得到鼠标按下时的水平位置
      const x = e || window.event;
      const downX = x.clientX;
      // 三、给文档注册鼠标移动事件
      document.onmousemove = v => {
        const f = v || window.event;
        // 1.获取鼠标移动后的水平位置
        const moveX = f.clientX;
        // 2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
        let offsetX = moveX - downX;
        // 3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
        if (offsetX > distance) {
          offsetX = distance; // 如果滑过了终点，就将它停留在终点位置
        } else if (offsetX < 0) {
          offsetX = 0; // 如果滑到了起点的左侧，就将它重置为起点位置
        }
        // 4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
        btn.style.left = `${offsetX}px`;
        bg.style.width = `${offsetX}px`;
        // 如果鼠标的水平移动距离 = 滑动成功的宽度
        if (offsetX === distance) {
          // 1.设置滑动成功后的样式
          text.innerHTML = '验证通过';
          text.style.color = '#fff';
          btn.innerHTML = '&radic;';
          btn.style.color = 'green';
          bg.style.backgroundColor = 'lightgreen';
          // 2.设置滑动成功后的状态
          success = true;
          // 成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
          btn.onmousedown = null;
          document.onmousemove = null;
          // 3.成功解锁后的回调函数
          setTimeout(() => {
            this.setState({
              yanzheng: true,
            });
          }, 100);
        }
      };
      // 四、给文档注册鼠标松开事件
      document.onmouseup = () => {
        // 如果鼠标松开时，滑到了终点，则验证通过
        if (!success) {
          // 反之，则将滑块复位（设置了1s的属性过渡效果）
          btn.style.left = 0;
          bg.style.width = 0;
          btn.style.transition = 'left 1s ease';
          bg.style.transition = 'width 1s ease';
        } else {
          return;
        }
        // 只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  };

  onFinish = async values => {
    // const { yanzheng } = this.state;
    // if(!yanzheng) return Modal.warning({ content: '请进行滑块验证' })
    const res = await req_login({ ...values })
    if (res.code === 20000) {
      cookie.save('user', values, { maxAge: 5000 })
      cookie.save('data', res.data)
      this.props.parent.setState({
        isLogin: true
      })
    }
  }

  render() {
    return (
      <div className="login-home">
        <div className="login-body">
          <div className="login-module">
            <div className="uilogin">
              <span>用户登录 / User login</span>
            </div>
            <div>
              <Form onFinish={this.onFinish} initialValues={{ remember: true }}>
                <Form.Item name='admin_name' rules={[{ required: true, message: '请输入你的用户名!' }]}>
                  <Input placeholder='请输入用户名' prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item name='admin_password' rules={[{ required: true, message: '请输入你的密码!' }]}>
                  <Input.Password placeholder='请输入密码' prefix={<LockOutlined />} />
                </Form.Item>
                {/* <Form.Item>
                  <Row>
                    <Col span={24}>
                      <div className="drag">
                        <div className="bg" />
                        <div className="text">请拖动滑块验证</div>
                        <div className="btn">&gt;&gt;</div>
                      </div>
                    </Col>
                  </Row>
                </Form.Item> */}
                {/* <Form.Item name="remember" valuePropName="checked" className="checkBox">
                  <Checkbox>记住我的登录账号</Checkbox>
                </Form.Item> */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" style={{
                          height: 45,
                          backgroundColor: '#35ccab',
                          border: '1px solid #35ccab'
                        }}>立即登录</Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        {/* <div className="footer">苏州萨思科技有限公司 苏ICP备17070648号</div> */}
      </div>
    );
  }
}

export default Login;