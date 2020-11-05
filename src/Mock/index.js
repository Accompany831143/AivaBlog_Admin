const Mock = require('mockjs')


// 用户登录
Mock.mock('/api/admin/login', 'post', (params) => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            userInfo: {
                userId:'@id',
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
                allUser: 43,
                allPicture: 126,
                allTag: 23,
                allMessage: 98
            }
        }
    })
})

// 获取上次登录信息
Mock.mock(/\/api\/admin\/home\/getLastInfo/, 'post', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data': {
                ip: '@ip',
                date: '@datetime'
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
                { id: '@id', 'date': "@date", 'num|1-100': 1 }
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
                { id: '@id', 'date': "@date", 'num|1-10': 1 }
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
                { id: '@id', 'type': "@title", 'value|1-5': 1 }
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
                { id: '@id', 'date': "@date", 'num|1-100': 1 }
            ]
        }
    })
})

// 获取所有栏目
Mock.mock(/\/api\/admin\/channel\/latest/, 'get', params => {
    let page = params.url.split('?')[1].split('&')[0].split('=')[1]
    let pageSize = params.url.split('?')[1].split('&')[1].split('=')[1]
    page = parseInt(page)
    pageSize = parseInt(pageSize)
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|5-10': [
                {
                    cid: '@id',
                    name: '@ctitle',
                    describe: '@csentence',
                    'level|1-10': 0,
                    createDate: '@datetime',
                    author: '@cname'
                },
            ],
            pageInfo: {
                'total|6-32': 10,
                current: page,
                pageSize
            }
        }
    })
})


// 添加栏目
Mock.mock(/\/api\/admin\/channel\/add/, 'post', params => {

    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'result': [
                {
                    cid: '@id',
                    name: '@ctitle',
                    describe: '@csentence',
                    'level|1-10': 0,
                    createDate: '@datetime',
                    author: '@cname'
                },
            ],

        }
    })
})

// 编辑栏目
Mock.mock(/\/api\/admin\/channel\/update/, 'post', params => {

    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'result': [
                {
                    cid: '@id',
                    name: '@ctitle',
                    describe: '@csentence',
                    'level|1-10': 0,
                    createDate: '@datetime',
                    author: '@cname'
                },
            ],

        }
    })
})

// 删除栏目
Mock.mock(/\/api\/admin\/channel\/delete/, 'post', params => {
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'result': JSON.parse(params.body).ids

        }
    })
})

// 搜索栏目
Mock.mock(/\/api\/admin\/channel\/search/, 'get', params => {
    // console.log(params)
    let page = params.url.split('?')[1].split('&')[1].split('=')[1]
    page = parseInt(page)
    return Mock.mock({
        stateCode: 0,
        stateMessage: 'ok',
        body: {
            'data|5-10': [
                {
                    cid: '@id',
                    name: '@ctitle',
                    describe: '@csentence',
                    'level|1-10': 0,
                    createDate: '@datetime',
                    author: '@cname'
                },
            ],
            pageInfo: {
                'total|6-32': 10,
                current: page,
                pageSize:10
            }
        }
    })
})