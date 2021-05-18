import React, { Component } from 'react'
import { Tabs } from 'antd'
import Record from './record'
import Collect from './collect'
import Collectmainte from './collectmainte'
import Recordmainte from './recordmainte'
import './index.less'

const { TabPane } = Tabs;

export default class Material extends Component {
  state = {
    key:'1',
  }
  componentDidMount() {

  }

  callback = (key) => {
    this.setState({
      key
    })
  }

  render() {
    const {key}=this.state
    return (
      <div className="classMaterial">
        <Tabs defaultActiveKey="1" onTabClick={(e)=>this.callback(e)}>
          <TabPane tab="换新出库记录" key="1">
            <Record msg={key}></Record>
          </TabPane>
          <TabPane tab="换新出库汇总" key="2">
            <Collect msg={key}></Collect>
          </TabPane>
          <TabPane tab="维修出库记录" key="3">
            <Recordmainte msg={key}></Recordmainte>
          </TabPane>
          <TabPane tab="维修出库汇总" key="4">
            <Collectmainte msg={key}></Collectmainte>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}