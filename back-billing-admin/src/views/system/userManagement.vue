<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="手机号：">
                    <el-input @keyup.enter.native="getData()" clearable v-model="formItem.phoneNumber"
                              placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="单位：">
                    <el-select clearable v-model="formItem.factoryName" filterable placeholder="请选择单位">
                        <el-option
                                v-for="(item,index) in factoryNameList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select
                            clearable
                            placeholder="请选择角色"
                            v-model="formItem.roleId">
                        <el-option
                                v-for="(item,index) in roleList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop="role">
                    <el-select
                            clearable
                            placeholder="请选择状态"
                            v-model="formItem.userStatus">
                        <el-option label="启用" value="1"/>
                        <el-option label="停用" value="2"/>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item class="fr">
                    <el-button class="yellowBtn" @click="getData">查询</el-button>
                    <el-button class="cyanBtn" @click="synchronization">添加</el-button>
                    <el-button class="redBtn" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
                        <el-table :data="tableData" size="small" stripe>
                            <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                            <el-table-column prop="nickName" label="姓名" header-align="center" align="center"/>
                            <el-table-column prop="roleId" label="角色" header-align="center" align="center"/>
                            <el-table-column prop="mobile" label="手机号" header-align="center" align="center"/>
                            <el-table-column prop="factoryName" label="所属单位" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.factoryName">{{scope.row.factoryName}}</span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userStatus" label="状态" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.userStatus =='1'">启用</span>
                                    <span v-else>停用</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-button class="blueTableBtn" size="mini" round @click="changeRoleBtn(scope.row)">修改</el-button>
                                    <el-button v-if="scope.row.userStatus == 1" class="redTableBtn" @click="startRoStop(scope.row)">停用</el-button>
                                    <el-button v-if="scope.row.userStatus == 2" class="blueTableBtn"  @click="startRoStop(scope.row)">启用</el-button>
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
        <!--        <FormDialog title="修改测试"  @add="addBtns()" @cancel="cancelBtns()" :dialogFlag.sync="amendVisible" >-->
        <!--            <div slot="content">-->
        <!--                <el-form :model="amend" :rules="rules" ref="amend" label-width="120px">-->
        <!--                    <el-form-item label="角色：" prop="role">-->
        <!--                        <el-select-->
        <!--                                clearable-->
        <!--                                placeholder="请选择角色"-->
        <!--                                v-model="amend.role">-->
        <!--                            <el-option-->
        <!--                                    v-for="(item,index) in roleList"-->
        <!--                                    :key="index"-->
        <!--                                    :label="item.name"-->
        <!--                                    :value="item.id"/>-->
        <!--                        </el-select>-->
        <!--                    </el-form-item>-->
        <!--                </el-form>-->
        <!--            </div>-->
        <!--        </FormDialog>-->
        <!--    修改-->
        <el-dialog
                append-to-body
                :close-on-click-modal="true"
                :close-on-press-escape="false"
                :before-close="resetamend"
                :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-修改</span>
            </div>
            <el-form :model="amend" :rules="rules" ref="amend" label-width="120px">
                <el-form-item label="角色：" prop="role">
                    <el-select
                            clearable
                            placeholder="请选择角色"
                            v-model="amend.role">
                        <el-option
                                v-for="(item,index) in roleList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" @click="resetamend">取消</el-button>
                <el-button class="blueTableBtn" @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--   同步查询确认-->
        <el-dialog
                append-to-body
                :close-on-click-modal="true"
                :close-on-press-escape="false"
                :before-close="resetCode"
                :visible.sync="synchronizationVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-添加用户</span>
            </div>
            <div class="synPhone">
                <div class="box">
                    <el-form :model="addEdit" :rules="rules" ref="addSynBtn" label-width="110px">
                        <el-form-item label="手机号：" prop="cellPhone">
                            <div class="synbox">
                                <el-input clearable maxlength="11" v-model="addEdit.cellPhone"
                                          placeholder="请输入手机号"></el-input>
                                <el-button style="margin-left: 20px; margin-top: 5px;" class="cyanBtn" @click="synBtn">
                                    查询
                                </el-button>
                            </div>
                        </el-form-item>
                    </el-form>


                </div>
            </div>

            <el-form v-show="synForm" :rules="rules" :model="addEdit" ref="addEditSyn" label-width="150px">
                <el-form-item label="角色：" prop="user">
                    <el-select
                            clearable
                            v-model="addEdit.user">
                        <el-option v-for="(item) in roleList" :label="item.name" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户类型：" prop="UserType">
                    <el-select
                            clearable
                            v-model="addEdit.UserType">
                        <el-option label="数软" value="1"></el-option>
                        <el-option label="厂商" value="2"></el-option>
                        <el-option label="客户" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input disabled maxlength="11" clearable v-model="addEdit.Phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input clearable disabled v-model="addEdit.synname" placeholder="姓名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button class="redTableBtn" @click="resetCode">取消</el-button>
                <el-button class="blueTableBtn" @click="synData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // import {getDataTime} from '@/assets/js/time'
    import api from '../../uitls/http/system'
    import Pages from "../../components/pages"; // 分页
    import FormDialog from '../../components/formDialog'
    import sTable from '../../components/s-table'

    export default {
        name: 'userManagement',
        data() {
            return {
                userList: [],// 角色数组
                tableData: [],//  表格数据
                roleList: [], // 角色数据
                factoryNameList: [],
                extendompetenceList: [], // 权限范围
                configurationVisible: false, // 配置
                synchronizationVisible: false, // 同步查询
                amendVisible: false, // 修改角色
                synForm: false, // 同步数据显示
                textShow: false, // 提示字体
                checkList: [], // 复选框组
                rules: {
                    user: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    role: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    UserType: [
                        {required: true, message: '请选择用户类型', trigger: 'change'},
                    ],
                    cellPhone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                },
                // 表单数据
                formItem: {
                    phoneNumber: '', // 手机号
                    userStatus: '',
                    roleId: '',
                    factoryName: '',
                },
                amend: {
                    roleId: '',
                    mobile: '',
                },
                checkShow: false,
                // 新增对象
                addEdit: {
                    UserType: '',
                    type: '', // 类型
                    role: '', // 角色
                    name: '', // 姓名
                    cellPhone: '', // 同步手机号
                    Phone: '', // 返回手机号
                    synname: '', //同步姓名
                    user: '', // 角色
                },
            }
        },
        components: {
            Pages,
            FormDialog,
            sTable,
        },
        methods: {
            startRoStop(row) {
                var _t = this;
                _t.$confirm('你确定要停用此用户吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        mobile: row.mobile,
                        userStatus: row.userStatus,
                        accessToken: _t.$cookies.get('accessToken'),
                        openId: _t.$cookies.get('openId'),
                    };
                    _t.$api.post('api/json', params, api.USER_STATUS, function (res) {
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetCode() {
                // 取消
                this.configurationVisible = false;
                this.amendVisible = false;
                this.synchronizationVisible = false;
                this.synForm = false;
                this.textShow = false;
                this.addEdit.cellPhone = ''; // 同步手机号
                this.addEdit.Phone = ''; // 返回手机号
                this.addEdit.synname = ''; //同步姓名
                this.checkList = []
                this.addEdit.user = ''
                this.resetForm('addEditSyn') // 清除验证
                this.resetForm('addSynBtn') // 清除验证
            },
            synData() {
                // 同步保存
                var _t = this;
                let go = false
                if (_t.synForm) {
                    _t.$refs.addEditSyn.validate((valid) => {
                        if (valid) {
                            // 提交
                            const params = {
                                accessToken: _t.$cookies.get('accessToken'),
                                openId: _t.$cookies.get('openId'),
                                mobile: _t.addEdit.cellPhone, // 手机号
                                appIds: _t.checkList, // 应用编号列表
                                roleId: _t.addEdit.user,
                                name: _t.addEdit.synname,
                                UserType: _t.addEdit.UserType,
                            };
                            _t.$api.post('api/json', params, api.USER_ADD, function (res) {
                                if (res.statusCode == 0) {
                                    _t.synchronizationVisible = false;
                                    _t.getData();
                                    _t.alertDialogTip(_t, res.errorMsg);
                                    _t.resetCode()
                                } else {
                                    _t.resetCode()
                                    _t.alertDialogTip(_t, res.errorMsg)
                                }
                            })
                        }
                    })
                } else {
                    _t.alertDialogTip(_t, '请你先同步手机号！')
                }
            },
            getRoleLIst() {
                var _t = this;
                const params = {
                    accessToken: _t.$cookies.get('accessToken'),
                    openId: _t.$cookies.get('openId'),
                };
                _t.$api.post('api/json', params, api.ROLE_LIST, function (res) {
                    if (res.statusCode == 0) {
                        _t.roleList = JSON.parse(res.bizContent).list
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                })
            },
            synBtn() {
                var _t = this;
                _t.$refs.addSynBtn.validate((valid) => {
                    if (valid) {
                        _t.textShow = false;
                        _t.getRoleLIst()
                        const params = {
                            accessToken: _t.$cookies.get('accessToken'),
                            openId: _t.$cookies.get('openId'),
                            mobile: _t.addEdit.cellPhone, // 手机号
                        };
                        _t.$api.post('api/json', params, api.SSO_FIND, function (res) {
                            if (res.statusCode == 0) {
                                _t.synForm = true;
                                var getData = JSON.parse(res.bizContent)
                                _t.addEdit.Phone = getData.mobile
                                _t.addEdit.synname = getData.name
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    } else {
                        _t.textShow = true
                    }
                })
            },
            synchronization() {
                // 同步查询
                var _t = this;
                _t.synchronizationVisible = true;
            },
            getData() {
                // 查询功能
                var _t = this
                const params = {
                    code: '123'
                };
                _t.$api.post('api/json', params, api.USER_ADD, function (res) {
                    if (res.statusCode == 0) {
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;

                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },

            resetHandle() {
                // 重置功能
                this.formItem.phoneNumber = ''; // 手机号
                this.formItem.roleId = '';
                this.formItem.factoryName = '';
                this.formItem.userStatus = '';
                this.getData();
            },
            changeRoleBtn(row) {
                // 修改
                this.amend.mobile = row.mobile
                this.amend.roleId = row.roleId
                this.amendVisible = true;
                this.getRoleLIst()
            },
            // 修改取消
            resetamend() {
                this.amendVisible = false;
                this.amend.role = ''
                this.resetForm('amend') // 清除验证
            },
            amendData() {
                // 修改保存
                var _t = this;
                _t.$refs.amend.validate((valid) => {
                    if (valid) {
                        const params = {
                            accessToken: _t.$cookies.get('accessToken'),
                            openId: _t.$cookies.get('openId'),
                            mobile: _t.amend.mobile, // 手机号
                            roleId: _t.amend.role,
                        };
                        var filename = api.USER_ROLE + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookies.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.resetamend()
                                _t.getData()
                                _t.alertMessageTip(_t, res.errorMsg);
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    } else {
                        return false
                    }
                })

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
        },
        created() {
            this.$store.commit('set_loading', false);
            this.getData()
        }
    }
</script>

<style scoped>
    .synPhone {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .synbox {
        display: flex;

    }

    .text {
        margin-top: 5px;
        margin-left: 119px;
    }

    synBtn
    . {
        margin: 0 50px;
    }

    .synPhone .syninput {
        margin-left: 119px;
    }

    /*提示功能*/
    .staruser {
        position: relative;
        color: red;
    }

    .staruser:after {
        content: '*';
        color: red;
        margin-right: 5px;
        position: absolute;
        top: 10px;
        left: 29px;
    }
</style>
