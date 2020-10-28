const Mock = require('mockjs')

Mock.mock('/api/admin/login','post',(params) => {
    return Mock.mock({
        stateCode:0,
        stateMessage:'ok',
        body:{
            userInfo:{
                userName:'Aiva',
                userGroup:'admin'
            }
        }
    })
})

Mock.mock('/api/admin/authCode','get',(params) => {
    return Mock.mock({
        stateCode:0,
        stateMessage:'ok',
        body:{
            authCode:'@dataImage("100x32","验证码图片")'
        }
    })
})