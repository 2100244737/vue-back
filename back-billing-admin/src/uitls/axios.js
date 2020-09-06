import axios from 'axios';
import cookies from 'vue-cookies'
var root = process.env.BASE_URL;
import NProgress from 'nprogress'
import{store} from "./vuex";
import router from "../router";
import {getTime,getDataTime} from '../uitls/time'
import {
    MessageBox
} from 'element-ui';
import {
    message
} from './resetMessage';

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;//初始化取消请求的构造函数
let arr=[]//区分是请求还是响应的头部
let removePending = (config,f) => {
    if(config.data.bizContent) {
        var file = config.data.filename
        var a = file.split('_')
        a.pop();
        var flagUrl = a.join('_')
    }else {
        var file1 = JSON.parse(config.data).filename
        var b= file1.split('_')
        b.pop();
        var flagUrl = b.join('_')

    }
    if(pending.indexOf(flagUrl)!==-1){
        if(f){
            f()
            store.commit('set_loading', false);
        }else{
            pending.splice(pending.indexOf(flagUrl), 1)
        }
    }else{
        if(f){
            pending.push(flagUrl)
        }
    }
}

// 封装 axios
function apiAxios(method, url, params, success) {
    axios({
        // `url` 是用于请求的服务器 URL
        url: url,

        // `method` 是创建请求时使用的方法
        method: method, // 默认是 get

        // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
        // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
        baseURL: root,

        // `params` 是即将与请求一起发送的 URL 参数
        // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
        params: method === 'GET' || method === 'DELETE' ? params : null,

        // `data` 是作为请求主体被发送的数据
        // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
        // 在没有设置 `transformRequest` 时，必须是以下类型之一：
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - 浏览器专属：FormData, File, Blob
        // - Node 专属： Stream
        data: method === 'POST' || method === 'PUT' ? params : null,
        withCredentials: false,  // cookie
        headers: {
            'Content-Type': 'application/json;charset=utf-8', // 请求头
        }
    }).then(function (res) {
// 成功时回调
        if (success) {

            success(res.data);
            store.commit('set_loading', false);
            if (res.data.statusCode == 1000) {
                MessageBox.confirm('登陆状态失效，请重新登录！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var url = 'https://web.datasw.cn/device/webLogin'
                    window.location.replace(url)
                }).catch(() => {
                    var url = 'https://web.datasw.cn/device/webLogin'
                    window.location.replace(url)
                    return false
                });
            }
            if(res.data.statusCode === 403) {
                //_this.$router.replace('/err')
            }
        }
    }).catch(function (err) {
        // 异常时回调
        //   message.warning('网络连接失败, 请检查网络......');
        return false;
    });
}
axios.interceptors.request.use(
    config => {
        NProgress.start()
        // 该处可以将config打印出来看一下，该部分将发送给后端（server端）
        // if (!_this.$cookies.get('openId')) {
        //     // _this.$router.push('/login')
        // }
        if(config.method==='post'&& !config.headers.upData) {
            config.cancelToken = new cancelToken((c) => {
                removePending(config, c);
            });
        }
        return config  // 对config处理完后返回，下一步将向后端发送请求
    },
    error => {  // 当发生错误时，执行该部分代码
        return Promise.reject(error)
    }
)

// 响应拦截（配置请求回来的信息）
axios.interceptors.response.use(function (response) {
    // 处理响应数据
    NProgress.done()
    if (response.config.method === 'post' && !response.config.headers.upData) {
        removePending(response.config)
    }
    return response
}, function (error) {
    NProgress.done()
    pending = []
    // 处理响应失败
    if (error && error.response){
        // 关闭loading
        store.commit('set_loading', false);
        switch (error.response.status) {
            case 400:
                message.warning('错误请求....');
                break
            case 401:
                message.warning('未授权，请重新登录(401)......');
                break;
            case 403:
                message.warning('拒绝访问(403)......');
                break;
            case 408:
                message.warning('请求超时(408)......');
                break;
            case 404:
                message.warning('请求错误，未找到资源股......');
                break
            case 500:
                message.warning('服务器出错......');
                break
            case 502:
                message.warning('网络出错......');
                break
            case 501:
                message.warning('服务未实现(501)......');
                break;
            case 503:
                message.warning('服务不可用......');
                break
            case 504:
                message.warning('网络超时......');
                break
            case 505:
                message.warning('HTTP版本不受支持(505)......');
                break;
            default:
                message.warning('连接出错......');
        }
    }
    return Promise.reject(error)
})
function changeData (content,filename){
    var dataItme = {
        "bizContent": JSON.stringify(content),
        "encryptType":"NONE",
        "filename": filename,
        "sigdataItmen":"NONE",
        "signType":"NONE",
        "timestamp": getTime(),
        "version":"2.0",
        "tokenType":"USER_AUTH",
        "accessToken": cookies.get('token')
    }
    return dataItme
}
// 返回在vue模板中的调用接口
export default {
    // 查询
    get: function (url, params, success) {
        return apiAxios('GET', url, params, success);
    },
    // 修改
    post: function (url, params,filename, success) {
        var file = filename + getDataTime() + '.json';
        var  data = changeData(params,file)
        return apiAxios('POST', url, data, success);
    },
    // 更新
    put: function (url, params, success) {
        return apiAxios('PUT', url, params, success);
    },
    // 删除
    delete: function (url, params, success) {
        return apiAxios('DELETE', url, params, success);
    },
}
