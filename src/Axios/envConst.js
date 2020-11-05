const envObject = {
    development:{
        baseUrl:'http://localhost:7758/'
    },
    production:{
        baseUrl:'https://aiva.vip/'
    }

}
const env = envObject[process.env.REACT_APP_BASE].baseUrl || envObject[process.env.NODE_ENV].baseUrl
module.exports = env