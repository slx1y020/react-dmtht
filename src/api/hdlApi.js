import http from '../config/httpconfig';
import IP from '../config/config'

//auth:黄东利
/**********************************节点管理start****************************************/

/**
 * 查询所有菜单
 */
export const req_findAllFun = params => {
    return http.get('/sysFunController/findAllFun', params)
}

/**
 * 新增 菜单导航信息
 */
export const req_addSysFun = params => {
    return http.jsonPost('/sysFunController/addSysFun', params)
}

/**
 * 根据 菜单导航id查询 菜单导航信息
 */
export const req_findSysFunByid = params => {
    return http.get('/sysFunController/findSysFunByid', params)
}

/**
 * 修改 菜单导航信息
 */
export const req_updateSysFun = params => {
    return http.jsonPost('/sysFunController/updateSysFun', params)
}

/**
 * 删除 菜单导航信息
 */
export const req_deleteFunById = params => {
    return http.get('/sysFunController/deleteFunById', params)
}

/**********************************节点管理end****************************************/


/**********************************物料模块start****************************************/

/**********************物料配置start***************/
// 获取物料类型列表
export const req_findRepairGoodsType = params => {
    return http.get('/repairgoodstype/findRepairGoodsType', params)
}

// 新增物料类型
export const req_saveRepairGoodsType = params => {
    return http.jsonPost('/repairgoodstype/saveRepairGoodsType', params)
  }
  
// 修改物料类型
export const req_updateRepairGoodsType = params => {
return http.jsonPost('/repairgoodstype/updateRepairGoodsType', params)
}

// 删除物料类型
export const req_deleteRepairGoodsType = params => {
return http.post('/repairgoodstype/deleteRepairGoodsType', params)
}

/**********************物料配置end***************/




/**********************生产管理start***************/

// 获取生产厂家列表
export const req_findRepairGoodsProducerAll = params => {
    return http.get('/repairgoodsproducer/findRepairGoodsProducerAll', params)
}

// 新增厂家
export const req_saveRepairGoodsProducer = params => {
    return http.jsonPost('/repairgoodsproducer/saveRepairGoodsProducer', params)
}

// 修改厂家
export const req_updateRepairGoodsProducer = params => {
    return http.jsonPost('/repairgoodsproducer/updateRepairGoodsProducer', params)
}

// 删除厂家
export const req_deleteRepairGoodsProducer = params => {
    return http.post('/repairgoodsproducer/deleteRepairGoodsProducer', params)
}
/**********************生产管理end***************/



/**********************库名称start***************/
// 添加库名称
export const req_saveRepairGoodsRepertoryName = params => {
    return http.jsonPost('/repairgoodsrepertoryname/saveRepairGoodsRepertoryName', params)
}
  
// 修改库名称
export const req_updateRepairGoodsRepertoryName = params => {
    return http.jsonPost('/repairgoodsrepertoryname/updateRepairGoodsRepertoryName', params)
}

// 获取库名称列表
export const req_findRepairGoodsRepertoryName = params => {
    return http.get('/repairgoodsrepertoryname/findRepairGoodsRepertoryName', params)
}

// 获取库名称列表不分页
export const req_findRepairRepertoryName = params => {
    return http.get('/repairgoodsrepertoryname/findRepairRepertoryName', params)
}

// 删除库名称列表中的一条数据
export const req_deleteRepairGoodsRepertoryName = params => {
    return http.post('/repairgoodsrepertoryname/deleteRepairGoodsRepertoryName', params)
}
/**********************库名称end***************/

/**********************库类型start***************/
// 获取库类型列表
export const req_findRepairGoodsRepertoryTypeAll = params => {
    return http.get('/repairgoodsrepertorytype/findRepairGoodsRepertoryTypeAll', params)
}

// 新增库类型
export const req_saveRepairGoodsRepertoryType = params => {
    return http.jsonPost('/repairgoodsrepertorytype/saveRepairGoodsRepertoryType', params)
}

// 修改库类型
export const req_updateRepairGoodsRepertoryType = params => {
    return http.jsonPost('/repairgoodsrepertorytype/updateRepairGoodsRepertoryType', params)
}

// 删除库类型
export const req_deleteRepairGoodsRepertoryType = params => {
    return http.post('/repairgoodsrepertorytype/deleteRepairGoodsRepertoryType', params)
}
/**********************库类型end***************/

/**********************库管角色start***************/
// 查询所有的库管角色
export const req_findExportRoleByAdmin = params => {
return http.get('/repertoryexportrole/findExportRoleByAdmin', params)
}

// 新增库管角色
export const req_saveExportRole = params => {
    return http.post('repertoryexportrole/saveExportRole', params)
}

// 删除库管角色
export const req_deleteExportRole = params => {
    return http.get('/repertoryexportrole/deleteExportRole', params)
}

// 查询一条库管角色
export const req_findExportRoleDetail = params => {
    return http.get('repertoryexportrole/findExportRoleDetail', params)
}

// 编辑库管角色
export const updateExportRole = params => {
    return http.post('/repertoryexportrole/updateExportRole', params)
}
/**********************库管角色end***************/

/**********************物料入库start***************/
  // 查询当前管理员入库信息
export const req_findRepairGoodsImportAll = params => {
    return http.get('/repairgoodsimport/findRepairGoodsImportAll', params)
}

// 新增入库信息
export const req_submitRepairGoodsImport = params => {
    return http.jsonPost('/repairgoodsimport/submitRepairGoodsImport', params)
}

// 编辑入库信息
export const req_submitUpdateGoodsImport = params => {
    return http.jsonPost('/repairgoodsimport/submitUpdateGoodsImport', params)
}

// 删除入库信息
export const req_deleteRepairGoodsImport = params => {
    return http.post('/repairgoodsimport/deleteRepairGoodsImport', params)
}

// 查询物料名称
export const req_findRepairGoodsByName = params => {
    return http.get('/repairgoods/findRepairGoodsByName', params)
}
/**********************物料入库end***************/


/**********************物料管理start***************/

// 根据当前登录管理员信息,查询其管理的库存
export const req_findAllGoodsByAdmin = params => {
    return http.get('/repairgoods/findAllGoodsByAdmin', params)
}

// 根据当前登录管理员信息,统计物品数量
export const req_countGoodsByAdmin = params => {
    return http.get('/repairgoods/countGoodsByAdmin', params)
}
/**********************物料管理end***************/

/**********************物料管理start***************/

// 获取出库记录信息
export const req_findRepairGoodsExportAll = params => {
    return http.get('/repairgoodsexport/findRepairGoodsExportAll', params)
}

/**********************物料管理end***************/

/**********************物料出库start***************/
// 获取出库汇总信息

export const findExportCount = params => {
    return http.get('/repairgoodsexport/findExportCount', params)
}

// 查询汇总记录数量
export const findSumAndCount = params => {
    return http.get('/repairgoodsexport/findSumAndCount', params)
}

/**********************物料出库end***************/

/**********************************物料模块end****************************************/


/**********************************维修管理start***************************************/

/**********************工单类型start***************/

// 新增
export const req_saveOrderType = params => {
    return http.jsonPost('/ordertype/saveOrderType', params)
}

// 编辑
export const req_updateOrderType = params => {
    return http.jsonPost('/ordertype/updateOrderType', params)
}

// 列表
export const req_findOrderType = params => {
    return http.get('/ordertype/findOrderType', params)
}

// 删除
export const req_deleteOrderType = params => {
    return http.post('/ordertype/deleteOrderType', params)
}

/**********************工单类型end***************/

/**********************维修人员信息start***************/

// 查询所有用户信息
export const req_findAllUser = params => {
    return http.get('/sysuser/findAllUser', params)
}

// 查询所有用户信息
export const req_findWorkUser = params => {
    return http.get('/sysuser/findWorkUser', params)
}

// 查询所有楼信息
export const req_findSpaceByFloor = params => {
    return http.get('/space/findSpaceByFloor', params)
}

// pc端保存维修人员信息
export const req_saveOrderUser = params => {
    return http.post('/orderuser/saveOrderUser', params)
}

// pc端查询维修人员信息
export const req_findOrderUser = params => {
    return http.get('/orderuser/findOrderUser', params)
}

// 删除维修人员信息
export const req_deleteOrderUser = params => {
    return http.post('/orderuser/deleteOrderUser', params)
}


/**********************维修人员信息end***************/

/**********************工单管理end***************/

// pc端查询工单信息
export const req_findPcOrderList = params => {
    return http.get('/order/findPcOrderList', params)
}

// 查询可分配工单人员信息
export const req_allocationOrderUser = params => {
    return http.get('/order/allocationOrderUser', params)
}

// pc端分配工单
export const req_allocationOrderList = params => {
    return http.post('/order/allocationOrderList', params)
}

// 导出工单信息到excle
export const req_exportOrderExcel = params => {
    return http.downLoad2('工单管理列表','/order/exportOrderExcel', params)
}

/**********************工单管理end***************/



/**********************超时配置start***************/

// pc端查询工单超时配置
export const req_findRepairTimeout = params => {
    return http.get('/repairtimeout/findRepairTimeout', params)
}

// 保存超时配置信息
export const req_saveRepairTimeout = params => {
    return http.jsonPost('/repairtimeout/saveRepairTimeout', params)
}

/**********************超时配置end***************/

/*********************工单类型start********************/


// pc端保存工单类型信息
export const req_repairSaveOrderType = params => {
    return http.jsonPost('/repairordertype/saveOrderType', params)
}

// pc端查询所有工单类型分页
export const req_repairOrderBarGraph= params => {
    return http.get('/repairordertype/repairOrderBarGraph', params)
}

// 根据工单类型id删除一个工单类型信息
export const req_deleteOrderTypeById= params => {
    return http.get('/repairordertype/deleteOrderTypeById', params)
}

/*********************工单类型end********************/

/**********************************维修管理end****************************************/


/*********************分数统计start********************/

// pc端统计维修工分数
export const req_repairOrderCountScore = params => {
    return http.get('/order/repairOrderCountScore', params)
}

// 导出维修人员分数信息
export const req_exportOrderScoreExcel = params => {
    return http.downLoad2('分数统计列表','/order/exportOrderScoreExcel', params)
}


/*********************分数统计end********************/

/**********************************维修管理end****************************************/


/**********************************日常维护管理start****************************************/

/**********************维护任务start***************/

// 查询楼以及对应教室
// export const req_findSpaceFloorRoom = params => {
//     return http.get('/space/findSpaceFloorRoom', params)
// }
// orderuser/findFloorRoomByUserId
export const req_findSpaceFloorRoom = params => {
    return http.get('/orderuser/findFloorRoomByUserId', params)
}
// 新增保养任务
export const req_addMaintenancetask = params => {
    return http.jsonPost('/promaintenancetask/addMaintenancetask', params)
}

// 查询保养任务
export const req_findAllMaintenancetask = params => {
    return http.get('/promaintenancetask/findAllMaintenancetask', params)
}

// 删除保养任务
export const req_deleteMaintenancetask = params => {
    return http.get('/promaintenancetask/deleteMaintenancetask', params)
}

/**********************维护任务end***************/

/**********************维护记录start***************/

// 查询保养记录信息
export const req_findAllMaintain = params => {
    return http.get('/promaintain/findAllMaintain', params)
}


/**********************维护记录start***************/

/**********************************日常维护管理end****************************************/


/**********************************轮播图管理start****************************************/

// 加载手机端轮播图管理
export const req_findAllLunbo = params => {
    return http.get('/findAllLunbo', params)
}

// 上传手机端轮播图图片
export const req_uploadLunboImage = params =>  `${IP.host}/uploadLunboImage`

// 新增手机端轮播图管理/修改手机端轮播图管理
export const req_saveLunbo = params => {
    return http.jsonPost('/saveLunbo', params)
}

// 删除手机端轮播图管理
export const req_delLunbo = params => {
    return http.post('/delLunbo', params)
}

/**********************************轮播图管理end****************************************/


/**********************************联网设备管理start****************************************/

/**********************联网设备分类start***************/

// 保存设备分类
export const req_saveFenlei = params => {
    return http.jsonPost('/OnlineshebeiFeilei/saveFenlei', params)
}

// 修改设备分类
export const req_updateFenlei = params => {
    return http.jsonPost('/OnlineshebeiFeilei/updateFenlei', params)
}

// 查询所有设备分类
export const req_findAllFeilei = params => {
    return http.get('/OnlineshebeiFeilei/findAllFeilei', params)
}

// 删除设备分类
export const req_deleteFenlei = params => {
    return http.post('/OnlineshebeiFeilei/deleteFenlei', params)
}

/**********************联网设备分类end***************/


/**********************联网设备基本信息start***************/


// 设备管理-空间教室节点查询
export const req_findAllSpacesAndClassrooms = params => {
    return http.get('/Onlineshebeishebei/findAllSpacesAndClassrooms', params)
}

// 上传图片
export const req_uploadBgImage = params =>  `${IP.host}/Onlineshebeishebei/uploadBgImage`

// 上传文件
export const req_uploadFile = params =>  `${IP.host}/Onlineshebeishebei/uploadFile`

// 查询所有设备
export const req_findAllOnlineShebei = params => {
    return http.get('/Onlineshebeishebei/findAllOnlineShebei', params)
}

// 新增一个设备
export const req_saveShebie = params => {
    return http.jsonPost('/Onlineshebeishebei/saveShebie', params)
}

// 修改设备
export const req_updateShebei = params => {
    return http.jsonPost('/Onlineshebeishebei/updateShebei', params)
}

// 删除设备
export const req_delShebiebyId = params => {
    return http.post('/Onlineshebeishebei/delShebiebyId', params)
}

/**********************联网设备基本信息end***************/


/**********************************联网设备管理end****************************************/


/**********************************手机端模块管理start****************************************/

/**********************手机端模块管理start***************/

// 查询模块信息(可根据模块名模糊查询/状态查询)
export const req_findAllModule = params => {
    return http.get('/appmodule/findAllModule', params)
}

// 上传模块图标
export const req_uploadModuleImage = params =>  `${IP.host}/appmodule/uploadModuleImage`

// 新增模块信息
export const req_addModule = params => {
    return http.jsonPost('/appmodule/addModule', params)
}

// 修改模块信息
export const req_updateModule = params => {
    return http.jsonPost('/appmodule/updateModule', params)
}

// 删除一个模块信息
export const req_deleteModule = params => {
    return http.get('/appmodule/deleteModule', params)
}

/**********************手机端模块管理end***************/


/**********************************手机端模块管理end****************************************/


/**********************************手机端角色管理start****************************************/

/**********************手机端角色管理start***************/

// 查询所有手机端用户角色
export const req_findAllUserRole = params => {
    return http.get('/appuserrole/findAllUserRole', params)
}

// 新增角色信息
export const req_addUserRole = params => {
    return http.jsonPost('/appuserrole/addUserRole', params)
}

// 修改角色信息
export const req_updateUserRole = params => {
    return http.jsonPost('/appuserrole/updateUserRole', params)
}

// 删除角色信息
export const req_deleteUserRole = params => {
    return http.get('/appuserrole/deleteUserRole', params)
}

// 修改默认角色状态
export const req_updateUserRoleByRoleId = params => {
    return http.get('/appuserrole/updateUserRoleByRoleId', params)
}

// 手机端用户角色授权模块和按钮
export const req_authorizeModuleAndFunction = params => {
    return http.get('/appuserrole/authorizeModuleAndFunction', params)
}

// 根据角色id查询授权的信息
export const req_findUserRoleByRoleId = params => {
    return http.get('/appuserrole/findUserRoleByRoleId', params)
}



/**********************手机端角色管理end***************/


/**********************************手机端角色管理end****************************************/

// GET
// /orderuser/findOrderUserById pc端根据维修人员id查询维修人员信息
export const findOrderUserById = params => http.get('/orderuser/findOrderUserById', params)


/**********************其他统计start***************/

// 教室类型统计
export const countClassroomType = params => http.get('/repairorder/countClassroomType', params)

// 教室故障率统计
export const countClassroom = params => http.get('/repairorder/countClassroom', params)

// 预警次数统计
export const countWarn = params => http.get('/warnstatistics/countWarn', params)

// 预警类型统计
export const countWarnType = params => http.get('/warnstatistics/countWarnType', params)

/**********************其他统计end***************/


/**********************定期维护配置start***************/

// 查询所有保养任务
export const findAllTask = params => http.get('/autoPromaintenancetask/findAllTask', params)

// 新增自动保养任务
export const saveTask = params => http.jsonPost('/autoPromaintenancetask/saveTask', params)

// 删除自动保养任务
export const deletetask = params => http.get('/autoPromaintenancetask/deletetask', params)

// 查询房间
export const findClassroomsByUserId = params => http.get('orderuser/findClassroomsByUserId', params)

/**********************定期维护配置end***************/
