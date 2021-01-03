/*
 * @Date: 2020-11-14 20:29:33
 * @LastEditors: Aiva
 * @LastEditTime: 2021-01-03 19:55:35
 * @FilePath: \AivaBlog_Admin\src\Axios\envConst.js
 */
const envObject = {
    development:{
        baseUrl:'http://localhost:7758/'
    },
    test:{
        baseUrl:'https://192.168.0.189:7758/'
    },
    production:{
        baseUrl:'https://aiva.vip:7758/'
    }

}
const env = envObject[process.env.REACT_APP_BASE].baseUrl || envObject[process.env.NODE_ENV].baseUrl
module.exports = env