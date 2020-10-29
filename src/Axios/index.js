import Axios from 'axios';
import {message} from 'antd'

// Axios.defaults.baseURL = ''
export default (options,flag) => {
    if(flag === undefined) {
        flag = true
    }
    let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))

    if(flag && loginInfo.state && loginInfo.token) {
        if(options.headers) {
            options.headers['Authorization'] = loginInfo.token
        }else {
            options.headers = {}
            options.headers['Authorization'] = loginInfo.token
        }
    }

    return new Promise((resolve,reject) => {
        Axios(options).then(res => {
            if(res.status === 200) {
                res = res.data
                if(res.stateCode === 0) {
                    resolve(res.body)
                }else {
                    message.error(res.stateMessage)
                }
            }
        }).catch(err => {
            console.log('错误信息',err.message)
            message.error('请求出错了，请检查网络！')
        })
    })
}