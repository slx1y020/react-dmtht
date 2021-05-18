import axios from 'axios';
import { message, Modal } from 'antd';
import qs from 'qs';
import IP from './config'
import cookie from 'react-cookies';
let baseUrl = IP.host;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 3000000;
if (process.env.NODE_ENV === 'development') {
  baseUrl = IP.host;
}

const instance = axios.create({
  //当创建实例的时候配置默认配置
  xsrfCookieName: 'xsrf-token',
  baseURL: baseUrl,
  timeout: 10000000,
  responseType: 'json'
});

//添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    //请求错误时做些事
    message.destroy();
    return Promise.reject(error);
  }
);

//添加一个响应拦截器
instance.interceptors.response.use(
  function (response) {
    if(response && response.data && response.data.code){
      if (response.data.code !== 20000) {
        Modal.error({ content: response.data.message });
      }
      if (response.data.code === 20009) {
        // console.log(response.data.code)
        cookie.remove('user')
        cookie.remove('data')
        window.location.href = "/";
        // window.location.reload();
      }
    }
    // 3.其他失败，比如校验不通过等
    return Promise.resolve(response);
    
  },
  error => {
    message.destroy();
    // 4.系统错误，比如500、404等
    message.error('系统异常，请联系管理员！', 1);
    return Promise.reject({
      messageCode: 'sysError'
    });
  }
);

export default {
  get(url, param) {
    return new Promise((resolve) => {
      instance({
        method: 'get',
        url,
        headers: { 'x-auth-token': cookie.load('token') },
        params: param
      }).then(res => {
        resolve(res.data); // resolve在promise执行器内部
      }).catch(() => { });
    });
  },
  post(url, param) {
    return new Promise((resolve) => {
      instance({
        method: 'post',
        url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'x-auth-token': cookie.load('token') },
        data: qs.stringify(param)
      })
        .then(res => {
          resolve(res.data);
          cookie.save('token', res.headers['x-auth-token'])
        })
        .catch(() => { });
    });
  },
  jsonPost(url, param) {
    return new Promise((resolve) => {
      instance({
        method: 'post',
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': cookie.load('token')
        },
        data: param
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(() => { });
    });
  },
  downLoad( url, param) {
    return new Promise(resolve => {
      instance({
        method: 'post',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': cookie.load('token')
        },
        params: param,
        responseType: 'blob',
      })
        .then(res => {
          // const file = qs.parse(decodeURIComponent(res.config.data));
          const blob = new Blob([res.data]);
          const linkNode = document.createElement('a');
          linkNode.download =  '数据库备份.sql'; // a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); // 生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click(); // 模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
          resolve('下载成功');
        })
        .catch(err => {
          console.error(err);
        });
    });
  },
  downLoad2( fileName,url, param) {
    return new Promise(resolve => {
      instance({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-auth-token': cookie.load('token')
        },
        params: param,
        responseType: 'blob',
      })
        .then(res => {
          // const file = qs.parse(decodeURIComponent(res.config.data));
          const blob = new Blob([res.data]);
          const linkNode = document.createElement('a');
          linkNode.download =  fileName+'.xls'; // a标签的download属性规定下载文件的名称
          linkNode.style.display = 'none';
          linkNode.href = URL.createObjectURL(blob); // 生成一个Blob URL
          document.body.appendChild(linkNode);
          linkNode.click(); // 模拟在按钮上的一次鼠标单击
          URL.revokeObjectURL(linkNode.href); // 释放URL 对象
          document.body.removeChild(linkNode);
          resolve('下载成功');
        })
        .catch(err => {
          console.error(err);
        });
    });
  },
}