<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" class="clearFix" inline>
                <el-form-item label="手机号：">
                    <el-input @keyup.enter.native="getData()" clearable v-model="formItem.phoneNumber"
                              placeholder="请输入手机号"></el-input>
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
                    <el-button class="blueBtn" @click="synchronization">上传</el-button>
                    <el-button class="redBtn" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <sTable :list="list"
                    :total="total"
                    :options="options"
                    :pagination="pagination"
                    :columns="columns"
                    @handleSizeChange="handleSizeChange"
                    @handleIndexChange="handleIndexChange"
                    @handleSelectionChange="handleSelectionChange"
                    :operates="operates"></sTable>
        </div>
<!--        编辑-->
        <FormDialog title="编辑" @add="addBtns()" @cancel="cancelBtns()" :dialogFlag.sync="amendVisible">
            <div slot="content">
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
            </div>
        </FormDialog>

    </div>
</template>

<script>
    import api from './../uitls/http/system'; // 引入 接口文件
    import FormDialog from './../components/formDialog'; // 封装 弹框
    import sTable from './../components/s-table'; //封装 table
    export default {
        name: "demo",
        data() {
            return {
                roleList: [],
                factoryNameList: [],
                amend: {
                    roleId: '',
                    mobile: '',
                },
                amendVisible: false,
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
                formItem: {
                    phoneNumber: '', // 手机号
                    userStatus: '',
                    roleId: '',
                    factoryName: '',
                },
                total: 20,
                list: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    state: '0',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-02',
                    name: '王小虎',
                    state: '0',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    state: '6',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    state: '4',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-08',
                    name: '王小虎',
                    state: '3',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    state: '',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    state: '2',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                otherHeight: 208,
                columns: [
                    {
                        prop: 'name',
                        label: '姓名',
                        align: 'center',
                        formatter: (row, column, cellValue) => {
                            return `<span style="white-space: nowrap;color: dodgerblue;">${row.name}</span>`
                        }
                    },
                    {prop: 'date', label: '时间', align: 'center', width: '160',},
                    {prop: 'address', label: '地址', align: 'center',},
                    {
                        prop: 'state',
                        label: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', {
                                style: {color: params.row.state > 4 ? 'blue' : params.row.state <= 3 ? 'red' : '#888'} // 组件的props
                            }, params.row.state ? params.row.state > 3 ? '已审核' : '未审核' : '-')
                        }
                    },
                ], // 需要展示的列

                operates: {
                    width: 200,
                    list: [
                        {
                            label: '编辑',
                            class: 'blueTableBtn',
                            disabled: (index, row) => {
                                return false
                            },
                            show: (index, row) => {
                                if (index == 0) {
                                    return false
                                } else {
                                    return true
                                }
                            },
                            method: (index, row) => {
                                this.handleEdit(index, row)
                            }
                        },
                        {
                            label: '删除',
                            class: 'redTableBtn',
                            show: (index, row) => {
                                if (index == 2 || index == 4) {
                                    return true
                                } else {
                                    return false
                                }

                            },
                            disabled: (index, row) => {
                                if (index == 2) {
                                    return true
                                } else {
                                    return false
                                }
                            },
                            method: (index, row) => {
                                this.handleDel(index, row)
                            }
                        }
                    ]
                }, // 操作按钮组
                // 分页参数
                pagination: {
                    pageIndex: 1,
                    pageSize: 10
                },
                options: {
                    stripe: false, // 是否为斑马纹 table
                    loading: false, // 是否添加表格loading加载动画
                    highlightCurrentRow: true, // 是否支持当前行高亮显示
                    mutiSelect: true, // 是否支持列表项选中功能
                    radioShow: false // 是否支持单选框
                }, // table 的参数
            }
        },
        components: {
            sTable,
            FormDialog
        },
        mounted() {
        },
        methods: {
            // 编辑 保存
            addBtns() {
                this.$refs.amend.validate((valid) => {
                    if (valid) {

                    } else {
                        return false
                    }
                })
            },
            // 取消
            cancelBtns() {
                this.amendVisible = false;
                this.resetForm('amend') // 清除验证
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 切换每页显示的数量
            handleSizeChange(pagination) {
                this.pagination = pagination
                this.getData()
            },
            // 切换页码
            handleIndexChange(pagination) {
                this.pagination = pagination
                this.getData()
            },
            // 选中行
            handleSelectionChange(val) {
                console.log('val:', val)
            },
            // 编辑
            handleEdit(index, row) {
                console.log(' index:', index)
                console.log(' row:', row)
                this.amendVisible = true
            },
            // 删除
            handleDel(index, row) {
                console.log(' index:', index)
                console.log(' row:', row)
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
            // 添加
            synchronization() {

            },
            // 重置
            resetHandle() {

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
            }
        },
        created() {
            this.$store.commit('set_loading', false);
            //this.getData()
        }
    }
</script>

<style scoped>

</style>