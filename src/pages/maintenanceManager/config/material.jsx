import React, { Component } from 'react'
import { Tabs } from 'antd'
import SuppliesClass from './suppliesClass'
import Vender from './vender'
import LibraryName from './libraryName'
import LibraryType from './libraryType'
import './index.less'

const { TabPane } = Tabs;

export default class Material extends Component {
  state = {

  }
  componentDidMount() {

  }

  callback = (key) => {
  }

  render() {
    return (
      <div className="classMaterial">
        <Tabs defaultActiveKey="1" onChange={this.callback()}>
          <TabPane tab="物料分类" key="1">
            <SuppliesClass></SuppliesClass>
          </TabPane>
          <TabPane tab="厂家管理" key="2">
            <Vender></Vender>
          </TabPane>
          <TabPane tab="库名称" key="3">
            <LibraryName></LibraryName>
          </TabPane>
          <TabPane tab="库类型" key="4">
            <LibraryType></LibraryType>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}