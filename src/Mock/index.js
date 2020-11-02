const Mock = require('mockjs')


// 用户登录
Mock.mock('/api/admin/login', 'post', (params) => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            userInfo: {
                userName: 'Aiva',
                userGroup: 'admin'
            },
            token: '@id'
        }
    })
})

// 验证码
Mock.mock('/api/admin/authCode', 'get', (params) => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            authCode: '@dataImage("100x32","验证码图片")'
        }
    })
})


// 获取统计数据
Mock.mock(/\/api\/admin\/home\/getStatistical/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data': {
                allUser:43,
                allPicture:126,
                allTag:23,
                allMessage:98
            }
        }
    })
})

// 获取连接数据
Mock.mock(/\/api\/admin\/home\/getAccess/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|30': [
                { id: '@id','date':"@date",'num|1-100':1}
            ]
        }
    })
})

// 获取最近添加文章数据
Mock.mock(/\/api\/admin\/home\/getAddArticle/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|7': [
                { id: '@id','date':"@date",'num|1-10':1}
            ]
        }
    })
})

// 获取文章占比数据
Mock.mock(/\/api\/admin\/home\/getArticle/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|7': [
                { id: '@id','type':"@title",'value|1-5':1}
            ]
        }
    })
})


// 获取用户信息数据
Mock.mock(/\/api\/admin\/home\/getUser/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|30': [
                { id: '@id','date':"@date",'num|1-100':1}
            ]
        }
    })
})

// 获取所有栏目
Mock.mock(/\/api\/admin\/channel\/latest/, 'get', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|5-10': [
                {   
                    cid:'@id',
                    name: '@ctitle',
                    describe: '@csentence',
                    createDate: '@date',
                    author:'@cname'
                },
            ]
        }
    })
})