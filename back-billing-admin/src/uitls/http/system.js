//系统管理
var number = '99999925_'
export default  {
    // 用户管理
    SSO_FIND:'DEVICE_SSO_FIND_REQ_' + number, // 同步查询
    USER_ADD:'DEVICE_USER_ADD_REQ_' + number,  // 同步保存
    USER_PAGE :'DEVICE_USER_PAGE_REQ_' + number,  // 查询
    ROLE_LIST :'DEVICE_ROLE_LIST_REQ_' + number,  // 添加查询角色
    USER_STATUS :'DEVICE_USER_STATUS_REQ_' + number,  // 停用
    USER_ROLE :'DEVICE_USER_ROLE_REQ_' + number,  // 修改
    COMPANY_LIST :'DEVICE_COMPANY_LIST_REQ_' + number,  //获取 单位
    // 角色管理
    ROLE_PAGE :'DEVICE_ROLE_PAGE_REQ_' + number,  // 查询
    ROLE_ADD :'DEVICE_ROLE_ADD_REQ_' + number,  // 添加
    ROLE_UPDATE :'DEVICE_ROLE_UPDATE_REQ_' + number,  // 更新
    ROLE_DELETE :'DEVICE_ROLE_DELETE_REQ_' + number,  // 删除
    MENU_LIST :'DEVICE_MENU_LIST_REQ_' + number,  // 配置
    CONF_MENU :'DEVICE_ROLE_CONFMENU_REQ_' + number,  // 配置保存
    MENU :'DEVICE_ROLE_MENU_REQ_' + number,  // 回显
    // 菜单管理
    MENU_ADD :'DEVICE_MENU_ADD_REQ_' + number,  // 添加
    MENU_TREE :'DEVICE_MENU_TREE_REQ_' + number,  // 查询
    MENU_DELETE :'DEVICE_MENU_DELETE_REQ_' + number,  // 删除
    MENU_UPDATE :'DEVICE_MENU_UPDATE_REQ_' + number,  // 修改
    DEVAPI_TREE :'DEVICE_API_TREE_REQ_' + number,  // 查询api配置
    DEVMENU_CONFIG :'DEVICE_MENU_CONFIG_REQ_' + number,  // 保存api配置
    DEVMENU_API :'DEVICE_MENU_API_REQ_' + number,  // 回显api配置
}
