/*
 * @Date: 2020-11-14 20:29:33
 * @LastEditors: Aiva
 * @LastEditTime: 2021-01-04 17:19:06
 * @FilePath: \AivaBlog_Admin\src\Axios\envConst.js
 */
const envObject = {
    development:{
        baseUrl:'http://localhost:7758/'
    },
    test:{
        baseUrl:'http://192.168.16.130/'
    },
    production:{
        baseUrl:'https://aiva.vip/'
    }

}
const env = envObject[process.env.REACT_APP_BASE].baseUrl || envObject[process.env.NODE_ENV].baseUrl
module.exports = env
