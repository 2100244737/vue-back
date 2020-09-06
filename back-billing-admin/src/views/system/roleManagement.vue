<template>
    <div class="role">
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="角色名称：">
                    <el-input  @keyup.enter.native="getData" clearable v-model="formItem.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <br>
                <el-form-item class=" fr marBottom7">
                    <el-button class="yellowBtn" size="mini" round @click="getData">查询</el-button>
                    <el-button class="cyanBtn" size="mini" round @click="setAddHandle">添加</el-button>
                    <el-button class="redBtn" size="mini" round @click="refreshHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData"  size="small" stripe>
                <el-table-column type="index" width="80px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="name" label="角色名称" header-align="center" align="center"/>
                <el-table-column  label="角色类型" header-align="center" align="center">
                    <template slot-scope="scope">
                       <span v-if="scope.row.group == '1'" >数软</span>
                       <span v-if="scope.row.group == '2'">厂商</span>
                       <span v-if="scope.row.group == '3'">客户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comments" label="备注信息" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.systemRole" class="cyanTableBtn" size="mini" round @click="upDataBtn(scope.row)">修改</el-button>
                        <el-button v-if="!scope.row.systemRole" class="blueTableBtn" size="mini" round @click="allocation(scope.row)">配置</el-button>
                        <el-button v-if="!scope.row.systemRole" class="redTableBtn" size="mini" round @click="deleteRole(scope.row)">删除</el-button>
                        <span v-if="scope.row.systemRole">系统默认角色</span>
                    </template>
                </el-table-column>
            </el-table>
            <Pages
                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--    添加弹框-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="dialogVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">角色管理-添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addEdit" label-width="150px">
                <el-form-item label="角色名称：" prop="name">
                    <el-input clearable v-model="addEdit.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色类型：" prop="roleGroupType">
                    <el-select
                        clearable
                        v-model="addEdit.roleGroupType">
                        <el-option  label="数软" value="1"></el-option>
                        <el-option  label="厂商" value="2"></el-option>
                        <el-option  label="客户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述：" prop="comments">
                    <el-input
                        class="textarea"
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="addEdit.comments">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="addCodeData">保存</el-button>
            </div>
        </el-dialog>
        <!--    更新-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetupData"
            :visible.sync="upDateVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">角色管理-更新</span>
            </div>
            <el-form :model="upDataForm"    :rules="rules" ref="upData" label-width="150px">
                <el-form-item label="角色名称：" prop="name">
                    <el-input clearable v-model="upDataForm.name" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色分组：" prop="roleGroupType">
                    <el-select
                        clearable
                        v-model="upDataForm.roleGroupType">
                        <el-option  label="数软" value="1"></el-option>
                        <el-option  label="厂商" value="2"></el-option>
                        <el-option  label="客户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述：" prop="comments">
                    <el-input
                        class="textarea"
                        type="textarea"
                        placeholder="请输入内容"
                        v-model="upDataForm.comments">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetupData">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="updataconfirm">确定</el-button>
            </div>
        </el-dialog>
        <!--    配置-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetAllocation"
            :visible.sync="allocationVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">角色管理-配置</span>
            </div>
            <div class="tree">
                <el-tree
                    ref="tree"
                    :data="menuList"
                    node-key="id"
                    :props="props"
                    show-checkbox>
                </el-tree>
            </div>
            <div slot="footer">
                <el-button class="redTableBtn" size="medium" round @click="resetAllocation">取消</el-button>
                <el-button class="blueTableBtn" size="medium" round @click="allocationConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import api from '../../uitls/http/system'
    import Pages from "../../components/pages"; // 分页
    export default {
        name: 'roleManagement',
        data() {
            return {
                data: [],
                formItem: {
                    roleName: ''
                }, // 表单数据
                tableData: [],//  表格数据
                typeList: [], // 添加类型数组
                dialogVisible: false, // 添加弹窗显示
                upDateVisible: false, // 更新弹窗显示
                allocationVisible: false, // 配置弹窗显示
                dialogTitle: '',
                roleId:'',
                props: {
                    label: 'name',
                    id: 'id',
                    children: 'children',
                },
                menuList:[],
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                    ],
                    roleGroupType: [
                        {required: true, message: '请输入角色类型', trigger: 'blur'}
                    ],
                    comments: [
                        {required: true, message: '请输入描述信息', trigger: 'blur'}
                    ],
                },
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 添加修改弹窗
                addEdit: {
                    name: '', // 名称
                    roleGroupType: '',
                    comments: '', // 描述
                },
                upDataForm: {
                    id: '',
                    name: '', // 名称
                    roleGroupType: '',
                    comments: '', // 描述
                },

            }
        },


        components: {
            Pages
        },
        mounted() {

        },
        methods: {

            // 配置
            allocation(row) {
                this.roleId = row.id
                this.getMenu({parenId:''})

            },
            getMenu(row) {
                var _t = this
                const params = {
                    parentId:row.parentId,
                    accessToken: _t.$cookies.get('accessToken'),
                    openId: _t.$cookies.get('openId'),
                    roleId: _t.$cookies.get('roleId')
                };
                var filename = api.MENU_TREE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookies.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.allocationVisible = true;
                        _t.menuList =  JSON.parse(res.bizContent).nodes
                        _t.geShowMenu()
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })

            },
            // 配置取消
            resetAllocation() {
                this.allocationVisible = false;
                this.menuList = []
            },
            // 角色回显
            geShowMenu () {
                var _t = this;
                const params = {
                    roleId: _t.roleId,
                    accessToken: _t.$cookies.get('accessToken'),
                    openId: _t.$cookies.get('openId'),
                };
                var filename = api.MENU + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookies.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {

                         var MenuData = JSON.parse(res.bizContent).menuIds ? JSON.parse(res.bizContent).menuIds : []

                        MenuData.forEach(item => {

                            if(item.menuType == 2) {

                                _t.$nextTick(function () {
                                    _t.$refs.tree.setChecked(item.id, true, false)
                                })
                            }
                        })
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            allocationConfirm () {
                var _t =this;
                let treeList = _t.$refs.tree.getCheckedKeys().concat(_t.$refs.tree.getHalfCheckedKeys())
                const params = {
                    roleId: _t.roleId,
                    menuId: treeList,
                    accessToken: _t.$cookiess.get('accessToken'),
                    openId: _t.$cookiess.get('openId'),
                };
                var filename = api.CONF_MENU + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookies.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.resetAllocation()
                        _t.alertMessageTip(_t, res.errorMsg);
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg);
                    }
                })
            },
            // 添加取消按钮
            resetCode() {
                this.addEdit.name = '';
                this.addEdit.group = '';
                this.addEdit.comments = '';
                this.dialogVisible = false;
                this.resetForm('addEdit')

            },
            // 跟新取消
            resetupData() {
                this.resetForm('upData')
                this.upDateVisible = false;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 查询功能
            getData() {
                var _t = this
                const params = {
                    name: _t.formItem.roleName,
                    accessToken: _t.$cookiess.get('accessToken'),
                    openId: _t.$cookiess.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                _t.$store.commit('set_loading', true);
                var filename = api.ROLE_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookiess.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {

                        _t.$store.commit('set_loading', false);
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                        // if (JSON.parse(res.bizContent).data) {
                        //
                        // }else {
                        //      _t.tableData = [];
                        //     // _t.alertDialogTip(_t,'查询数据为空！')
                        // }

                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                    // _t.tableData = JSON.parse(res.bizContent).data

                })
            },

            setAddHandle() {
                // 添加功能
                this.dialogVisible = true;
            },
            addCodeData() {
                // 添加 保存功能
                var _t = this;
                _t.$refs.addEdit.validate((valid) => {
                    if (valid) {
                        const params = {
                            name: _t.addEdit.name,
                            group: _t.addEdit.roleGroupType,
                            comments: _t.addEdit.comments,
                            accessToken: _t.$cookiess.get('accessToken'),
                            openId: _t.$cookiess.get('openId'),
                        };
                        var filename = api.ROLE_ADD + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookiess.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.dialogVisible = false;
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetCode();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            refreshHandle() {
                this.formItem.roleName = ''
                this.getData()

            },
            upDataBtn(row) {
                // 更新

                this.upDateVisible = true;
                this.upDataForm.id = row.id;
                this.upDataForm.name = row.name;
                this.upDataForm.roleGroupType = row.group;
                this.upDataForm.comments = row.comments;
            },
            updataconfirm() {
                var _t = this;
                _t.$refs.upData.validate((valid) => {
                    if (valid) {
                        const params = {
                            name: _t.upDataForm.name,
                            group: _t.upDataForm.roleGroupType,
                            id: _t.upDataForm.id,
                            comments: _t.upDataForm.comments,
                            accessToken: _t.$cookiess.get('accessToken'),
                            openId: _t.$cookiess.get('openId'),
                        };

                        var filename = api.ROLE_UPDATE + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookiess.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertMessageTip(_t, res.errorMsg);
                                _t.getData();
                                _t.resetupData();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg);
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            changeRoleBtn(row) {
                // 修改
            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.getData()
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.getData()
            },
            deleteRole(row) {
                // 删除
                var _t = this;
                _t.$confirm('你确定要删除此角色？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        id: row.id,
                        accessToken: _t.$cookiess.get('accessToken'),
                        openId: _t.$cookiess.get('openId'),
                    };
                    var filename = api.ROLE_DELETE + getDataTime() + '.json';
                    var data = _t.changeData(params, filename, _t.$cookiess.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.alertMessageTip(_t, res.errorMsg);
                            _t.getData();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg);
                        }
                    })

                }).catch(() => {
                    return false
                });
            },

        },
        created() {
            this.$store.commit('set_loading', false);
           // this.getData()
        },
    }
</script>

<style scoped>


</style>
