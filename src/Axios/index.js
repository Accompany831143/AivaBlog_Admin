import Axios from 'axios';
import {message} from 'antd'

// Axios.defaults.baseURL = ''
export default (options) => {
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