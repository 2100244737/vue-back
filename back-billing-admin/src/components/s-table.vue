<template>
    <!--swb 封装的 分页 table-->
    <div class="table">
        <el-table id="iTable" size="small"
                  :data="list"
                  show-overflow-tooltip
                  :highlight-current-row="options.radioShow"
                  @selection-change="handleSelectionChange"
                  @row-click="handleRowClick"
                  ref="mutipleTable" :stripe="options.stripe">
            <!--region 选择框-->
            <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;">
            </el-table-column>
                <el-table-column type="index" width="80px" label="序号" header-align="center" align="center"/>
            <!--region 数据列-->
            <template v-for="(column, index) in columns">
                <el-table-column :prop="column.prop"
                                 :label="column.label"
                                 :align="column.align"
                                 :width="column.width">
                    <template slot-scope="scope">
                        <template v-if="!column.render">
                            <template v-if="column.formatter">
                                <span v-html="column.formatter(scope.row, column)"></span>
                            </template>
                            <template v-else>
                                <span>{{scope.row[column.prop]}}</span>
                            </template>
                        </template>
                        <template v-else>
                            <expand-dom :column="column" :row="scope.row" :render="column.render"
                                        :index="index"></expand-dom>
                        </template>
                    </template>
                </el-table-column>
            </template>
            <!--region 按钮操作组-->
            <el-table-column ref="fixedColumn" label="操作" header-align="center"  align="center" :width="operates.width"
                             v-if="operates.list.length > 0">
                <template slot-scope="scope">
                    <div style="display: flex " class="operate-group">
                        <template v-for="(btn, key) in operates.list">
                            <div class="item" v-if=" btn.show(scope.$index,scope.row)">
                                <el-button  :class="btn.class"
                                           :disabled="btn.disabled(scope.$index,scope.row)"
                                            @click.native.prevent="btn.method(key,scope.row)">{{
                                    btn.label }}
                                </el-button>
                            </div>
                        </template>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--region 分页-->
        <el-pagination class="pages" v-if="pagination" @size-change="handleSizeChange"
                       @current-change="handleIndexChange"
                       :page-size="tableCurrentPagination.pageSize"
                       :page-sizes="this.tableCurrentPagination.pageArray"
                       :current-page="tableCurrentPagination.pageIndex"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>
    </div>
</template>

<script>
    const _pageArray = [10, 20, 30,40,50] // 每页展示条数的控制集合
    export default {
        props:{
            list: {
                type: Array,
                default: [] // prop:表头绑定的地段，label：表头名称，align：每列数据展示形式（left, center, right），width:列宽
            }, // 数据列表
            // 表格数据
            columns: {
                type: Array,
                default: [] // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
            },
            // 操作表格
            operates: {
                type: Object,
                default: {} // width:按钮列宽，,按钮集合 === label: 文本，show：是否显示，disabled：是否禁用，method：回调方法
            },
            total: {
                type: Number,
                default: 0
            }, // 总数
            pagination: {
                type: Object,
                default: null // 分页参数 === pageSize:每页展示的条数，pageIndex:当前页，pageArray: 每页展示条数的控制集合，默认 _page_array
            },
            // table 表格的控制参数
            options: {
                type: Object,
                default: {
                    stripe: false, // 是否为斑马纹 table
                    loading: false, // 是否添加表格loading加载动画
                    highlightCurrentRow: false, // 是否支持当前行高亮显示
                    mutiSelect: false // 是否支持列表项选中功能
                }
            }
        },

        name: "s-table",
        data() {
            return {
                pageIndex: 1,
                radioVal: -1,
                tableCurrentPagination: {},
                multipleSelection: [] // 多行选中
            }
        },
        components: {
            expandDom: {
                functional: true,
                props: {
                    row: Object,
                    render: Function,
                    index: Number,
                    column: {
                        type: Object,
                        default: null
                    }
                },
                render: (h, ctx) => {
                    const params = {
                        row: ctx.props.row,
                        index: ctx.props.index
                    }
                    if (ctx.props.column) params.column = ctx.props.column
                    return ctx.props.render(h, params)
                }
            }
        },
        mounted() {
            if (this.pagination && !this.pagination.pageSizes) {
                this.pagination.pageArray = _pageArray // 每页展示条数控制
            }
            this.tableCurrentPagination = this.pagination || {
                pageSize: this.total,
                pageIndex: 1
            } // 判断是否需要分页
        },
        methods: {
            // 单选框
            handleCurrentChange(row) {
                this.$emit("giveTableRowData", row);
            },
            // 切换每页显示的数量
            handleSizeChange(size) {
                if (this.pagination) {
                    this.tableCurrentPagination = {
                        pageIndex: 1,
                        pageSize: size
                    }
                    this.$emit('handleSizeChange', this.tableCurrentPagination)
                }
            },
            // 切换页码
            handleIndexChange(currnet) {
                if (this.pagination) {
                    this.tableCurrentPagination.pageIndex = currnet
                    this.$emit('handleIndexChange', this.tableCurrentPagination)
                }
            },
            // 多行选中
            handleSelectionChange(val) {
                this.multipleSelection = val
                this.$emit('handleSelectionChange', val)
            },
            //点击行触发，选中或不选中复选框
            handleRowClick(row, column, event) {
                console.log(column,'123');
                if(column.label == '操作') return;
                this.$refs.mutipleTable.toggleRowSelection(row);
                // console.log("this.selecTestContent", this.selectTestContent);
            },
        },
        created() {

        }
    }
</script>

<style scoped>
.pages {
    margin-top: 10px;
    margin-bottom: 10px;
}
/deep/.el-table thead  .el-checkbox .el-checkbox__input{
    margin-left: 4px;
}
</style>