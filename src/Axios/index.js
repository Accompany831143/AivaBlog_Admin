/*
 * @Date: 2020-11-14 20:29:33
 * @LastEditors: Aiva
 * @LastEditTime: 2020-12-29 15:31:23
 * @FilePath: \AivaBlog_Admin\src\Axios\index.js
 */
import Axios from 'axios';
import {message} from 'antd';
const baseUrl = require('./envConst.js')
Axios.defaults.baseURL = baseUrl
Axios.defaults.timeout = 5000
Axios.defaults.withCredentials = true

export default (options) => {
    let loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'))

    if(loginInfo && loginInfo.token) {
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
                }else if(res.stateCode === 403) {
                    sessionStorage.clear()
                }else {
                    message.error(res.stateMessage)
                    reject()
                }
            }
        }).catch(err => {
            console.log('错误信息',err.message)
            message.error('请求出错了，请检查网络！')
        })
    })
}