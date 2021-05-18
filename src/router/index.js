import React from 'react'
import { Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import UserManager from '../pages/sys_manager/userManager/index.jsx'
import ClassroomList from '../pages/classroomManager/classroomList/index.jsx'
import ClassroomType from '../pages/classroomManager/classroomType/index.jsx'
import WorkOrderInformation from '../pages/workorderManage/workOrderInformation/index.jsx'
import WorkOrderManager from '../pages/workorderManage/workOrderManager/index.jsx'
import WorkOrderType from '../pages/workorderManage/workOrderType/index.jsx'
import WorkOrderTypes from '../pages/workorderManage/type/index.jsx'
import WorkOrderGrade from '../pages/workorderManage/grade/index.jsx'
import TimeOut from '../pages/workorderManage/timeOut/index.jsx'
import NodeManager from '../pages/sys_manager/node/index.jsx'
import AdminManager from '../pages/sys_manager/adminManger/admin_manager.jsx'
import Role from '../pages/sys_manager/role/index.jsx'
import Log from '../pages/sys_manager/log/index'
import AdviceFeedback from '../pages/adviceFeedback/index.jsx'
import EquipmentInformation from '../pages/equipmentManager/equipmentInformation'
import EquipmentType from '../pages/equipmentManager/equipmentType'

import Come from '../pages/maintenanceManager/come'
import MaterialManager from '../pages/maintenanceManager/materialManager'
import ConfigMaterialConfig from '../pages/maintenanceManager/config/material.jsx'
import ConfigRoleConfig from '../pages/maintenanceManager/config/role.jsx'
import Storage from '../pages/maintenanceManager/storage'
import Information from '../pages/networkingManager/information'
import Type from '../pages/networkingManager/type'
import SwitchToRecord from '../pages/networkingManager/switchToRecord'
import WarningManagement from '../pages/warningManagement'
import DatabaseBackup from '../pages/sys_manager/databaseBackup'
import DepManager from '../pages/depManager/index'
import FactoryManagement from '../pages/factoryManagement/index'
import MaintenanceRecord from '../pages/maintenanceDay/maintenanceRecord'
import MaintenanceType from '../pages/maintenanceDay/maintenanceType'
import Slideshow from '../pages/slideshow'
import MobileModule from '../pages/mobileModule'
import MobileRole from '../pages/mobileRole'
import WorkStatistics from '../pages/statisticalManager/workStatistics/index'
import DataStatistics from '../pages/statisticalManager/dataStatistics/index'
import ManualMaintenanceType from '../pages/maintenanceDay/manualMaintenanceType'
//懒加载
// const DataStatistics = lazy(() => import(''));
function RouteMap(props /* context */) {
  return (
    <div>
        <Route path="/" component={()=>(<Redirect to='/userManager' />)} />
        <Route path="/userManager" component={UserManager} />
        <Route path="/sys_manager/log" component={Log} />
        <Route path="/classroomManager/classroomList" component={ClassroomList} />
        <Route path="/classroomManager/classroomType" component={ClassroomType} />
        <Route path="/workorderManage/workOrderInformation" component={WorkOrderInformation} />
        <Route path="/workorderManage/workOrderManager" component={WorkOrderManager} />
        <Route path="/workorderManage/timeOut" component={TimeOut} />
        <Route path="/workorderManage/workOrderType" component={WorkOrderType} />
        <Route path="/workorderManage/type" component={WorkOrderTypes} />
        <Route path="/workorderManage/grade" component={WorkOrderGrade} />
        <Route path="/sys_manager/nodeManager" component={NodeManager} />
        <Route path="/sys_manager/adminManager" component={AdminManager} />
        <Route path="/sys_manager/databaseBackup" component={DatabaseBackup} />
        <Route path="/adviceFeedback" component={AdviceFeedback} />
        <Route path="/sys_manager/role" component={Role} />
        <Route path="/equipmentManager/equipmentInformation" component={EquipmentInformation} />
        <Route path="/equipmentManager/equipmentType" component={EquipmentType} />
        <Route path="/maintenanceManager/maintenanceRecord" component={MaintenanceRecord} />
        <Route path="/maintenanceManager/maintenanceType" component={MaintenanceType} />
        <Route path="/networkingManager/information" component={Information} />
        <Route path="/networkingManager/type" component={Type} />
        <Route path="/networkingManager/switchToRecord" component={SwitchToRecord} />
        <Route path="/warningManagement" component={WarningManagement} />
        <Route path="/depManager" component={DepManager} />
        <Route path="/factoryManagement" component={FactoryManagement} />
        <Route path="/materialManager/come" component={Come} />
        <Route path="/materialManager/materialManager" component={MaterialManager} />
        <Route path="/materialManager/material" component={ConfigMaterialConfig} />
        <Route path="/materialManager/role" component={ConfigRoleConfig} />
        <Route path="/materialManager/storage" component={Storage} />
        
        <Route path="/maintenanceDay/maintenanceRecord" component={MaintenanceRecord} />
        <Route path="/maintenanceDay/maintenanceType" component={MaintenanceType} />
        <Route path="/slideshow" component={Slideshow} />
        <Route path="/mobileModule" component={MobileModule} />
        <Route path="/mobileRole" component={MobileRole} />
        <Route path="/statisticalManager/workStatistics" component={WorkStatistics} />
        <Route path="/statisticalManager/dataStatistics" component={DataStatistics} />
        <Route path="/maintenanceDay/manualMaintenanceType" component={ManualMaintenanceType} />

        {/* < Route exact path="/classroomList">
              < Suspense fallback={
                  < div style={
                    {
                      color: 'red',
                      textAlign:'center',
                      fontSize:'20px',
                      marginTop:'50px'
                    }
                  } > loading... </div>}>
                  <ClassroomList />
                </Suspense>
        </ Route> */}
    </div>
    )
  }
export default RouteMap