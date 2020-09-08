<template>
    <div class="menu-table">
        <div class="menu-tree">
            <el-tree
                @node-click="treeNodeClick"
                :props="defaultProps"
                :data="menuList"
                current-node-key
                highlight-current
                :default-expanded-keys="['root']"
                node-key="id">
            <span class="slot-t-node" slot-scope="{ node, data }">
               <i class="el-icon-folder"></i>
                <span>{{ node.label }}</span>
            </span>
            </el-tree>
        </div>
        <div class="table">
<!--            <div class="formBox-top">-->
<!--                <el-form :model="formItem" class="clearFix" inline>-->
<!--                    <el-form-item>-->
<!--                      -->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </div>-->
            <el-button style="margin-bottom: 30px" class="cyanBtn" size="mini" round @click="addChild">新增子菜单</el-button>
            <div class="tableWp">

                <el-table  :data="tableData" size="small" stripe>
                    <el-table-column prop="name" label="菜单名称" header-align="center" align="center"/>
                    <el-table-column prop="path" label="路由" header-align="center" align="center"/>
                    <el-table-column label="操作" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-button class="cyanTableBtn" size="mini" round @click="changeMenuBtn(scope.row)">修改
                            </el-button>
                            <el-button v-if="scope.row.menuType !='1'" class="blueTableBtn" size="mini" round  @click="deployAPI(scope.row)">配置api</el-button>
                            <el-button class="redTableBtn" size="mini" round @click="deleteMenu(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--        新增-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetAdd"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">菜单管理-新增子级菜单</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addEdit" label-width="120px">
                <el-form-item label="菜单名称：" prop="name">
                    <el-input clearable v-model="addEdit.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由：" prop="path">
                    <el-input clearable v-model="addEdit.path" placeholder="请输入菜单路由"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" >
                    <el-input disabled v-model="addEdit.parentName" placeholder="请输入父级菜单"></el-input>
                </el-form-item>
<!--                <el-form-item label="菜单类型：">-->
<!--                    <el-input disabled v-model="addEdit.menuType" placeholder="请输入菜单类型"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="排序：" prop="list">
                    <el-input clearable v-model="addEdit.list" placeholder="请输入排序"></el-input>
                </el-form-item>
<!--                <el-form-item label="图片地址：" prop="imgUrl">-->
<!--                    <el-input clearable v-model="addEdit.imgUrl" placeholder="请输入图片地址"></el-input>-->
<!--                </el-form-item>-->
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAdd">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="confirmAdd">保存</el-button>
            </div>
        </el-dialog>
        <!--        修改-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetAmend"
            :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">菜单管理-修改</span>
            </div>
            <el-form :model="amend" ref="amend" :rules="rules" label-width="120px">
                <el-form-item label="菜单名称：" prop="name">
                    <el-input clearable v-model="amend.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单路由：" prop="path">
                    <el-input clearable v-model="amend.path" placeholder="请输入菜单路由"></el-input>
                </el-form-item>
                <el-form-item label="排序：" prop="list">
                    <el-input clearable v-model="amend.list" placeholder="请输入排序"></el-input>
                </el-form-item>
                <el-form-item label="图片地址：" >
                    <el-input clearable v-model="amend.imgUrl" placeholder="请输入图片地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAmend">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="confirmAmend">保存</el-button>
            </div>
        </el-dialog>
        <!--        配置api-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="deployAPIAccess"
            width="75%"
            top="10vh"
            :visible.sync="deployAPIVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">配置api</span>
            </div>
            <div class="roleContent">
                <div class="query">
                    <el-input placeholder="请输入查询内容" v-model="deploy.query"></el-input>
                    <el-button class="yellowBtn" style="margin-left: 30px;" size="mini" round @click="getTree" >查询</el-button>
                </div>
                <div class="bottonContent">
                    <div class="tree">
                        <el-tree
                            ref="tree"
                            @check-change="changehandle"
                            :data="deploy.treeList"
                            :highlight-current="true"
                            :default-expanded-keys="defaultShowNodes"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps">
                        </el-tree>
                    </div>
                    <div class="treeBox">
                        <h4>已勾权限</h4>
                        <div class="tag">
                            <el-tag v-for="(item, index) in pushTreeName" :key="index">{{item}}</el-tag>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="deployAPIAccess">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="deployAPISave">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
     import api from '../../uitls/http/system'
    export default {
        name: "menuManagement",
        data() {
            return {
                addVisible: false,
                amendVisible: false,
                deployAPIVisible: false,
                menuList: [],
                pushTreeName: [],
                defaultShowNodes: [],
                deploy: {
                    treeList: [],
                    query: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    path: [
                        {required: true, message: '请输入菜单路由', trigger: 'blur'}
                    ],
                    list: [
                        {required: true, message: '请输入排序', trigger: 'blur'}
                    ],
                    imgUrl: [
                        {required: true, message: '请输入图片地址', trigger: 'blur'}
                    ],

                },
                addEdit: {
                    path: '',
                    name: '',
                    parentId: '',
                    imgUrl: 'el-icon-s-promotion',
                    menuType: '',
                    list: '',
                    parentName:''
                },
                amend: {
                    menuId: '',
                    path: '',
                    name: '',
                    parentId: '',
                    imgUrl: 'el-icon-s-promotion',
                    menuType: '',
                    list: ''
                },
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                tableData: [],
                formItem: {},
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id: 'id'
                }
            }
        },
        components: {},
        mounted() {
        },
        methods: {

            // 获取树形数据
            getTree (val) {
                var _t = this;
                const params = {
                    openId: _t.$cookies.get('openId'),
                    menuId: _t.menuId,
                    serviceId:'SMPW'
                };
                _t.$api.post('api/json', params,api.DEVAPI_TREE, function (res) {
                    if (res.statusCode == 0) {
                        _t.deploy.treeList = JSON.parse(res.bizContent).list
                        _t.getMenu()
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 获取菜单回显
            getMenu () {
                var _t = this;
                const params = {
                    openId: _t.$cookies.get('openId'),
                    menuId: _t.menuId,
                };
                _t.$api.post('api/json', params,api.DEVMENU_API, function (res) {
                    if (res.statusCode == 0) {
                        var MenuData = JSON.parse(res.bizContent).data?JSON.parse(res.bizContent).data: []
                        MenuData.forEach(item => {
                            _t.$nextTick(function () {
                                _t.$refs.tree.setChecked(item, true, false)
                            })
                        })
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            getSimpleCheckedNodes(store) {
                const checkedNodes = [];
                const traverse = function (node) {
                    const childNodes = node.root ? node.root.childNodes : node.childNodes;
                    childNodes.forEach(child => {
                        if (child.checked) {
                            checkedNodes.push(child.data);
                        }
                        if (child.indeterminate) {
                            traverse(child);
                        }
                    });
                };
                traverse(store)

                return checkedNodes;
            },
            changehandle () {
                var _t = this;
                var list = this.getSimpleCheckedNodes(this.$refs.tree);
                _t.pushTreeName = []
                var arr = []
                list.forEach(item => {
                    if (!item.children) {
                        arr.push(item.name)
                    } else {
                        if (item.children) {
                            item.children.forEach(val => {
                                if (val.children) {
                                    val.children.forEach(lit => {
                                        arr.push(lit.name)
                                    })
                                } else {
                                    arr.push(val.name)
                                }

                            })
                        }

                    }
                })
                _t.$nextTick(function () {
                    _t.pushTreeName = arr
                })
            },
            // 配置api 保存
            deployAPISave () {
                var _t = this;
                var list = this.getSimpleCheckedNodes(this.$refs.tree);
                // pushDataTree
                _t.pushDataTree = []
                var arr = []
                list.forEach(item => {
                    if (!item.children) {
                        arr.push(item.id)
                    } else {
                        if (item.children) {
                            item.children.forEach(val => {
                                if (val.children) {
                                    val.children.forEach(lit => {
                                        arr.push(lit.id)
                                    })
                                } else {
                                    arr.push(val.id)
                                }

                            })
                        }

                    }
                })
                _t.pushDataTree = arr
                const params = {
                    openId: _t.$cookies.get('openId'),
                    menuId: _t.menuId,// row id
                    apiIds: _t.pushDataTree,//角色id
                };
                _t.$api.post('api/json', params,api.DEVMENU_CONFIG, function (res) {
                    if (res.statusCode == 0) {
                        _t.deployAPIVisible = false;
                        _t.alertMessageTip(_t, res.errorMsg);
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 配置api
            deployAPI(row) {
                this.deployAPIVisible = true
                this.menuId = row.id;
                this.getTree(row.id);
            },
            // 配置api 取消
            deployAPIAccess() {
                this.deployAPIVisible = false
            },
            resetAmend() {
                this.amendVisible = false
                this.resetForm('amend')
            },
            // 修改保存
            confirmAmend() {
                var _t = this;
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            name: _t.amend.name,
                            path: _t.amend.path,
                            imgUrl:_t.amend.imgUrl,
                            list:_t.amend.list,
                            menuId: _t.amend.menuId,
                            accessToken: _t.$cookies.get('accessToken'),
                            openId: _t.$cookies.get('openId'),
                        };
                        _t.$api.post('api/json', params,api.MENU_UPDATE, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetAmend();
                                _t.getDataTable(_t.amend.parentId);
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                    }else {
                        return false
                    }
                })

            },
            // 删除
            deleteMenu(row) {
                var _t = this
                _t.$confirm('你确定要删除此菜单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        menuId: row.id,
                        accessToken: _t.$cookies.get('accessToken'),
                        openId: _t.$cookies.get('openId'),
                    };
                    _t.$api.post('api/json', params,api.MENU_DELETE, function (res) {
                        if (res.statusCode == 0) {
                            _t.alertMessageTip(_t, res.errorMsg);
                            _t.getData();
                            _t.getDataTable();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg);
                        }
                    })

                }).catch(() => {
                    return false
                });
            },
            // 修改
            changeMenuBtn(row) {
                this.amendVisible = true
                this.amend.menuId = row.id
                this.amend.path = row.path;
                this.amend.parentId = row.parentId;
                this.amend.name = row.name;
                this.amend.imgUrl = row.imgUrl;
                this.amend.list = row.list;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            treeNodeClick(node) {

                this.addEdit.parentId = node.id;
                this.addEdit.parentName = node.name;
                if (node.id == 'root') {
                    this.addEdit.menuType = '一级菜单'
                } else {
                    this.addEdit.menuType = '子级菜单'
                }
                this.getDataTable(node.id)
            },
            //  新增 取消
            resetAdd() {
                this.addEdit.path = '';
                this.addEdit.name = '';
                this.addEdit.imgUrl = 'el-icon-s-promotion';
                this.addEdit.menuType = '';
                this.addEdit.list = '';
                this.addVisible = false;
                this.resetForm('addEdit')
            },
            // 新增保存
            confirmAdd() {
                var _t = this
                _t.$refs.addEdit.validate((valid) => {
                    if (valid) {
                        const params = {
                            name: _t.addEdit.name,
                            path: _t.addEdit.path,
                            parentId: _t.addEdit.parentId=='root'? null: _t.addEdit.parentId,
                            imgUrl: _t.addEdit.imgUrl,
                            list: _t.addEdit.list,
                            menuType: _t.addEdit.menuType == '一级菜单' ? '1' : '2',
                            accessToken: _t.$cookies.get('accessToken'),
                            openId: _t.$cookies.get('openId'),
                        };
                        _t.$api.post('api/json', params,api.MENU_ADD, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData()
                                _t.getDataTable(_t.addEdit.parentId)
                                _t.resetAdd()

                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                    }else {
                        return false
                    }
                })

            },
            getDataTable(row) {
                var _t = this
                _t.tableData = []
                const params = {
                    parentId: row,
                    accessToken: _t.$cookies.get('accessToken'),
                    openId: _t.$cookies.get('openId'),
                };
                _t.$api.post('api/json', params,api.MENU_LIST, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },

            // 新增子 菜单
            addChild() {
                if (this.addEdit.parentId) {
                    this.addVisible = true;
                }else {
                    this.alertDialogTip(this, '请选择父级节点');
                }
            },
            getData() {
                // 查询
                var _t = this
                _t.menuList = []
                const params = {
                    parentId: '',
                    accessToken: _t.$cookies.get('accessToken'),
                    openId: _t.$cookies.get('openId'),
                };
                _t.$api.post('api/json', params,api.MENU_TREE, function (res) {
                    if (res.statusCode == 0) {
                        var obj = new Object()
                        obj.name = '目录'
                        obj.id = 'root'
                        obj.children = JSON.parse(res.bizContent).nodes
                        _t.menuList.push(obj)
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            }
        },
        created() {
            this.getData()
            this.getDataTable('root')
        }
    }
</script>

<style scoped>
    .menu-tree .el-tree--highlight-current /deep/ .el-tree-node.is-checked > .el-tree-node__content {
        background-color: rgb(255, 255, 255);
        color: rgb(64, 158, 255);
    }

    .menu-tree .el-tree--highlight-current /deep/ .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgb(255, 255, 255);
        color: rgb(64, 158, 255);
    }
    .bottonContent {

    }
    .menu-table {
        display: flex;
        overflow: hidden;
    }

    .table {
        margin-left: 20px;
        flex: 1;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 11px 5px rgba(227, 227, 227, 0.5);
        border-radius: 10px;
        padding: 30px;
    }

    .el-icon-folder {
        margin-right: 5px;
    }

    .menu-tree {
        width: 260px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 11px 5px rgba(227, 227, 227, 0.5);
        border-radius: 10px;
        padding: 10px;
        height: calc(100vh - 190px);
    }


    .tag {
        margin-top: 20px;
    }

    .bottonContent {
        margin-top: 20px;
        display: flex;
        height: 100%;
        width: 100%;

    }

    .tree {
        width: 50%;
        height: 50vh;
        overflow: hidden;
        overflow-y: auto;

        box-sizing: border-box;
    }

    h4 {
        color: #888;
    }

    .bottonContent .treeBox {
        width: 50%;
        background: #eef1f6;
        height: 50vh;
        overflow: hidden;
        overflow-y: auto;
        padding: 10px;
        box-sizing: border-box;
    }

    .query {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 75%;
    }
</style>
