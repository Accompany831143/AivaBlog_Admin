const Mock = require('mockjs')

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

Mock.mock('/api/admin/authCode', 'get', (params) => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            authCode: '@dataImage("100x32","验证码图片")'
        }
    })
})

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