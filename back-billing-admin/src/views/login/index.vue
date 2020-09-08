<template>
    <div  class="loadings">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">初始化中，请稍后 <span class="shadow_dot"></span></p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                loginForm:{
                    accessToken:'',
                    openId:'',
                }
            }
        },
        components: {},
        mounted() {
        },
        methods: {
            // 清除数据
            clearString() {
                this.$cookies.remove('openId');
                this.$cookies.remove('accessToken');
                this.$cookies.remove('phone');
                this.$cookies.remove('username');
                this.$cookies.remove('roleName');
                this.$cookies.remove('roleId');
                this.$cookies.remove('companyName');
                localStorage.removeItem("DEVICE_MENU_LIST");
            },
            // 获取openId
            getTokenAndId () {
                this.loginForm.openId = this.GetQueryValue1('openId')
                this.loginForm.accessToken = this.GetQueryValue1 ('accessToken')


                if(this.loginForm.accessToken && this.loginForm.openId) {
                    this.loginForm.accessToken= this.loginForm.accessToken.slice(0, this.loginForm.accessToken.length-1)
                    this.$cookies.set('openId', this.loginForm.openId);
                    this.$cookies.set('accessToken', this.loginForm.accessToken);
                }



            },
            // 获取菜单权限
            getMenu () {
                var _t = this;
                const params = {
                    openId: _t.loginForm.openId,
                    accessToken:_t.loginForm.accessToken
                };
                var filename = 'DEVICE_USER_LOGIN_REQ_99999925_'
                _t.$api.post('api/json', params,filename, function (res) {
                    if (res.statusCode == 0) {
                        var menuList = JSON.parse(res.bizContent).menus
                        localStorage.setItem("DEVICE_MENU_LIST", JSON.stringify(menuList));
                        const mobile = JSON.parse(res.bizContent).mobile;
                        const name = JSON.parse(res.bizContent).name;
                        const roleId = JSON.parse(res.bizContent).roleId;
                        const companyName = JSON.parse(res.bizContent).companyName;
                        const roleName = JSON.parse(res.bizContent).roleName ? JSON.parse(res.bizContent).roleName: '';
                        _t.$cookies.set('username', name); // 用户名
                        _t.$cookies.set('phone', mobile); // 手机号
                        _t.$cookies.set('roleId', roleId); // 角色Id
                        _t.$cookies.set('companyName', companyName); // 单位名称
                        _t.$cookies.set('roleName', roleName); // 角色  1:数软 ，2：厂商， 3：客户
                        _t.$nextTick(function () {
                            _t.handleLogin()
                        })
                    } else {
                        var alertName = ''
                        if(res.statusCode == '701') {
                            alertName = 'openId不能为空！'
                        }else {
                            alertName = res.errorMsg
                        }
                        _t.$confirm(alertName, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            var url = 'https://device.cywetc.com/device/webLogin'
                            window.location.replace(url)
                        }).catch(() => {
                            var url = 'https://device.cywetc.com/device/webLogin'
                            window.location.replace(url)
                            return false
                        });
                    }
                })
            },
            // 获取url 地址
            GetQueryValue1(queryName) {
                var text = queryName? queryName: ''
                var reg = new RegExp("(^|&)" + text + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(r[2]);
                } else {
                    return null;
                }
            },
            handleLogin() {
                var _t = this;
                // 测试
                //var url ='https://'+ location.hostname + '/device/html/#/index'
                // 本地
                 var url ='/device/html/#/index'
                window.location.replace(url)

            },
        },
        created() {
            this.clearString()
            // this.getTokenAndId()
            // this.getMenu()
        }
    }
</script>

<style scoped>
    .loadings {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
        background:rgba(0,0,0,.6);
        z-index: 99;
    }
    .loading-content {
        text-align: center;
        box-sizing: border-box;
        background:rgba(255,255,255,1);
        border-radius:12px;
        padding: 32px 7px 22px 7px;
        height: 220px;
        width: 220px;
        cursor: pointer;
    }
    .loading-content .loading-spinner {
        background: url("../../assets/img/loading.gif");
        background-size: cover;
        width: 206px;
        height: 111px;
    }
    .loading-text {
        margin-top: 22px;
        font-size:17px;
        font-weight:600;
        color:rgba(153,153,153,1);
        line-height:28px;
    }

    .shadow_dot {
        display: inline-block;
        width: 4px;
        height: 4px;
        margin-left: -5px;
        border-radius: 3px;
        box-shadow: 4px 0 currentColor, 11px 0 currentColor, 18px 0 currentColor;
        -webkit-animation: shadow_dot 4s infinite step-start both;
        animation: shadow_dot 4s infinite step-start both;
        *zoom: expression(this.innerHTML = '...'); /* IE7 */
    }
    .shadow_dot:before { content: '. . .';} /* IE8 */
    .shadow_dot::before { content: ' '; }
    .shadow_dot { margin-right: 8px; } /* IE9+,FF,CH,OP,SF */

    @-webkit-keyframes shadow_dot {
        25% { box-shadow: none; }
        50% { box-shadow: 4px 0 currentColor; }
        75% { box-shadow: 4px 0 currentColor, 11px 0 currentColor; }
    }
    @keyframes shadow_dot {
        25% { box-shadow: none; }
        50% { box-shadow: 4px 0 currentColor; }
        75% { box-shadow: 4px 0 currentColor, 11px 0 currentColor; }
    }
</style>