import http from '../config/httpconfig';
import IP from '../config/config'
//#region 用户登录

/**
 * 用户登录
 */
// sys-login-controller
// 后台登录界面
//// 用户登录 POST /syslogin/login
export const req_login = params => http.post('/syslogin/login', params)
//退出登录 POST/syslogin/logout
export const req_logout = params => http.post('/syslogin/logout', params)
/////////////////////////////////////
// sys-admin-controller
// 系统管理员
// GET/sysAdmin/deleteAdminById
// 根据管理员ID删除一个管理员(如果被删除的管理员有子级管理员,则不允许删除)
export const deleteAdminById = params => http.get('/sysAdmin/deleteAdminById', params)
// GET// /sysAdmin/findAllAdmin
// 查询所有管理员信息(只查询其所管理的管理员)
export const findAllAdmin = params => http.get('/sysAdmin/findAllAdmin', params)
// POST// /sysAdmin/resetPassword
// 管理员重置其子级管理员的密码
export const resetPassword = params => http.post('/sysAdmin/resetPassword', params)
// POST// /sysAdmin/saveAdmin
// 新增或修改一个后台管理员
export const saveAdmin = params => http.post('/sysAdmin/saveAdmin', params)
// POST// /sysAdmin/updatePassword
// 管理员修改自己的登录密码newPassword
export const updatePassword = params => http.post('/sysAdmin/updatePassword', params)


// GET
// /sysRoleController/findAllRole
// 查询所有角色
export const findAllRole = params => http.get('/sysRoleController/findAllRole', params)

// 查询部分角色
export const findAllAuthRole = params => http.get('/sysRoleController/findAllAuthRole', params)

// GET
// /sysuser/findAllUser
// 查询所有用户信息
export const findAllUser = params => http.get('/sysuser/findAllUser', params)
// GET
// /sysuser/authorizeRole
// 给用户授权手机端角色
export const authorizeRole = params => http.get('/sysuser/authorizeRole', params)
// GET
// /appuserrole/findUserRole
// 查询启用的用户角色信息
export const findUserRole = params => http.get('/appuserrole/findUserRole', params)
// POST
// /sysuser/delUser
// 删除用户信息
export const delUser = params => http.post('/sysuser/delUser', params)

/**
 * 保存角色信息
 */
export const saveRole = params => http.jsonPost('/sysRoleController/saveRole', params)

/**
 * 删除角色信息
 */
export const deleteRole = params => http.get('/sysRoleController/deleteRole', params)

/**
 * 查询角色功能信息
 */
export const findRoleByid = params => http.get('/sysRoleController/findRoleByid', params)

/**
 * 资源节点授权
 */
export const authorizeFunc = params => http.get('/sysRoleController/authorizeFunc', params)

// 查询日志
/**
 * 查询日志
 */
export const findAllLog = params => http.get('/syslog/findAllLog', params)

// database-controller
// 数据库备份
// POST
// /sysBackup/backup
// 手动数据库备份
export const backup = params => http.post('/sysBackup/backup', params)
// POST
// /sysBackup/downloadSpecifiedBackup
// 下载备份的数据库文件
export const downloadSpecifiedBackup= (params) => http.downLoad('/sysBackup/downloadSpecifiedBackup',params)
// GET
// /sysBackup/findAllBackups
// 备份数据加载
export const findAllBackups = params => http.get('/sysBackup/findAllBackups', params)
//#region 院系管理

/**
 * 查询院系信息
 */
export const findFaculty = params => http.get('/profaculty/findFaculty', params)
/**
 * 新增院系信息
 */
export const addFaculty = params => http.jsonPost('/profaculty/addFaculty', params)

/**
 * 编辑院系信息
 */
export const updateFaculty = params => http.jsonPost('/profaculty/updateFaculty', params)

/**
 * 删除院系信息
 */
export const deleteFaculty = params => http.get('/profaculty/deleteFaculty', params)


// space-controller
// 学校空间
// POST
// /space/delSpace
// 删除空间节点
export const delSpace = params => http.post('/space/delSpace', params)
// GET
// /space/findAllSpaceTypes
// 加载空间节点类型
export const findAllSpaceTypes = params => http.get('/space/findAllSpaceTypes', params)
// GET
// /space/findAllSpaces
// 加载空间节点
export const findAllSpaces = params => http.get('/space/findAllSpaces', params)
// POST
// /space/saveSpace
// 新增空间节点/修改空间节点//spaceEntity:{}
export const saveSpace = params => http.jsonPost('/space/saveSpace', params)
// classroom-info-controller
// 教室信息
// GET
// /classroominfo/findAllClassroomInfos
// 加载教室信息
export const findAllClassroomInfos = params => http.get('/classroominfo/findAllClassroomInfos', params)
// POST
// /classroominfo/saveClassroomInfos
// 新增教室信息/修改教室信息
export const saveClassroomInfos = params => http.jsonPost('/classroominfo/saveClassroomInfos', params)
// POST
// /classroominfo/delClassroomInfos
// 根据id删除教室信息--假删除，修改有效状态为0
export const delClassroomInfos = params => http.post('/classroominfo/delClassroomInfos', params)
// GET
// /classroominfo/findClassroomTypes
// 加载教室类型
export const findClassroomTypes = params => http.get('/classroominfo/findClassroomTypes', params)
// POST
// /classroominfo/saveClassroomTypes
// 新增教室类型/修改教室类型
export const saveClassroomTypes = params => http.jsonPost('/classroominfo/saveClassroomTypes', params)
// POST
// /classroominfo/delClassroomTypes
// 删除教室类型
export const delClassroomTypes = params => http.post('/classroominfo/delClassroomTypes', params)
// shebei-fenlei-controller
// 设备所属的分类
// get
// /shebeiFeilei/deleteFenlei
// 删除设备分类
export const deleteFenlei = params => http.post('/shebeiFeilei/deleteFenlei', params)
// GET
// /shebeiFeilei/findAllFeilei
// 查询所有设备分类
export const findAllFeilei = params => http.get('/shebeiFeilei/findAllFeilei', params)

// POST
// /shebeiFeilei/saveFenlei
// 保存设备分类
export const saveFenlei = params => http.jsonPost('/shebeiFeilei/saveFenlei', params)

// POST
// /shebeiFeilei/updateFenlei
// 修改设备分类
export const updateFenlei = params => http.jsonPost('/shebeiFeilei/updateFenlei', params)
// shebei-type-controller
// 设备类型
// /shebeiType/findAllShuxingSbType
// 设备类型属性
export const findAllShuxingSbType = params => http.get('/shebeiType/findAllShuxingSbType', params)
// shebei-shebei-controller
// 设备基本信息
// GET
// /shebeishebei/createQR
// 生成二维码
// POST
// /shebeishebei/delShebiebyId
// 删除设备
export const delShebiebyId = params => http.post('/shebeishebei/delShebiebyId', params)

// GET
// /shebeishebei/findAllShebei
// 查询所有设备
export const findAllShebei = params => http.get('/shebeishebei/findAllShebei', params)
// GET
// /shebeishebei/findAllSpacesAndClassrooms
// 设备管理-空间教室节点查询
export const findAllSpacesAndClassrooms = params => http.get('/shebeishebei/findAllSpacesAndClassrooms', params)
// GET
// /shebeishebei/findAllXujianShebei
// 查询所有巡检设备--巡检配置查询没有被配置过的设备
// POST
// /shebeishebei/saveShebie
// 新增一个设备
// POST
export const req_saveShebie = params => http.jsonPost('/shebeishebei/saveShebie', params)
// /shebeishebei/updateShebei
// 修改设备
// POST
export const req_updateShebei = params => http.jsonPost('/shebeishebei/updateShebei', params)

// 生成二维码
export const req_createBase64QR = params => http.post('/shebeishebei/createBase64QR', params)

// /shebeishebei/uploadBgImage
// 上传图片
export const uploadBgImage = params =>  `${IP.host}/shebeishebei/uploadBgImage`
// POST
// /shebeishebei/uploadFile
// 上传文件
export const uploadFile = params =>  `${IP.host}/shebeishebei/uploadFile`
/******************工单数据统计**********************/
/**
 * 工单统计之折线图统计
 */
export const req_repairOrderLineChart = params => {
  return http.get('/repairorder/repairOrderLineChart', params)
}

/**
 * 工单统计之扇形统计图
 */
export const req_repairOrderPieChart = params => {
  return http.get('/repairorder/repairOrderPieChart', params)
}

/**
 * 工单统计之柱状统计图
 */
export const req_repairOrderBarGraph = params => {
  return http.get('/repairorder/repairOrderBarGraph', params)
}

/********************建议反馈*********************** */

/**
 * 查询反馈意见信息
 */
export const findFeedback = params => http.get('/feedback/findFeedback', params)

/**
 * 删除反馈意见
 */
export const deleteFeedback = params => http.get('/feedback/deleteFeedback', params)


/**
 * 设备管理空间节点  / 网络设备管理空间节点
 * /space/findAllSpaces4Shebei
 */
export const findAllSpaces4Shebei = params => http.get('/space/findAllSpaces4Shebei', params)


/**
 * 房间设备开关详情
 */
export const req_findShebeiKaiguanDetail = params => http.get('/shebeikaiguanrecord/findShebeiKaiguanDetail', params)


//还原数据库
///sysBackup/restoreDB
export const restoreDB = params => http.get('/sysBackup/restoreDB', params)

// GET
// /kaiguan/findAllHoutaiRecord  pc后台开关记录
export const findAllHoutaiRecord = params => http.get('/kaiguan/findAllHoutaiRecord', params)


// GET
// /warn/warn4Chuku出库预警
export const warn4Chuku = params => http.get('/warn/warn4Chuku', params)
// GET
// /warn/warn4Kaiguan开关操作不当预警
export const warn4Kaiguan = params => http.get('/warn/warn4Kaiguan', params)


// GET
// /warn/warn4ChukuDetails设备频烦出库详情
export const warn4ChukuDetails = params => http.get('/warn/warn4ChukuDetails', params)

// GET
// /warn/warn4KaiguanDetails开关操作不当详情
export const warn4KaiguanDetails = params => http.get('/warn/warn4KaiguanDetails', params)
// prowarnconfig/findWarnConfig
export const findWarnConfig = params => http.get('/prowarnconfig/findWarnConfig', params)
// prowarnconfig/saveWarnConfig
export const saveWarnConfig = params => http.jsonPost('/prowarnconfig/saveWarnConfig', params)

// GET
// /shebeiliferecord/findShebeiLifeRecord
// 查询设备寿命预警
export const findShebeiLifeRecord = params => http.get('/shebeiliferecord/findShebeiLifeRecord', params)
// GET
// /shebeikaiguanrecord/findShebeiKaiguanRecord
// 查询设备未关预警
export const findShebeiKaiguanRecord = params => http.get('/shebeikaiguanrecord/findShebeiKaiguanRecord', params)

// 投影寿命预警
export const req_warn4Touying = params => http.get('/warn/warn4Touying', params)

 // 投影照度配置
export const req_eidtZhaoduConf = params => http.jsonPost('/Onlineshebeishebei/eidtZhaoduConf', params)

//#region 厂家管理

/**
 * 查询厂家信息
 */
export const findAllFactory = params => http.get('/factory/findAllFactory', params)

/**
 * 新增厂家信息
 */
export const saveFactory = params => http.jsonPost('/factory/saveFactory', params)

/**
 * 编辑厂家信息
 */
export const editFactory = params => http.jsonPost('/factory/editFactory', params)

/**
 * 删除厂家信息
 */
export const delFactory = params => http.post('/factory/delFactory', params)

//#endregion

// /dologin/DoLogout
export const DoLogout = params => http.get('/dologin/DoLogout', params)


/**
 * 获取物料名称
 */
export const req_goodsName = (params) => {
  return http.get('/repairgoods/findByCondition', params)
}

/**
* 出库
*/
export const req_out = (params) => {
  return http.jsonPost('/repairgoodsexport/saveExportGoods', params)
}
/**
 * 根据库名称与库类型查询对应的物品分类(手机端出库使用)
 */
export const req_searchThingType = (params) => {
  return http.get('/repairgoodstype/findByCondition', params)
}

/**
* 根据库名称,库类型以及物品类型查询对应的生产厂家(手机端出库使用)
*/
export const req_goodsProducer = (params) => {
  return http.get('/repairgoodsproducer/findByCondition', params)
}
/**
 * 根据微信用户ID查询其管理的库
 */
export const req_searchWarehouse = (params) => {
  return http.get('/repairgoodsrepertoryname/findRepertoryNameByUserId', params)
}

/**
* 库名ID查询其拥有的库类型(PC端出库使用)
*/
export const req_searchWarehouseType = (params) => {
  return http.get('/repairgoodsrepertorytype/findRepertoryTypeByRepertoryNameId', params)
}
/**
 * 获取楼和教室
 */
export const req_findAllSpaceFloorRoom = params => http.get('/space/findAllSpaceFloorRoom', params)
