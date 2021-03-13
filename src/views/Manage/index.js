import React, { Component, lazy } from "react"
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Layout, Menu,Spin } from 'antd';

import Axios from "../../Axios"
import {
    HomeOutlined,
    MenuOutlined,
    ReadOutlined,
    TagsOutlined,
    UserOutlined,
    PictureOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MessageOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';

import AivaLogo from '../../images/Aiva.png';
import "./index.css"
import "./Channel/index.css"


const Home = lazy(() => import("./Home"))
const Channel = lazy(() => import("./Channel"))
const Article = lazy(() => import("./Article"))
const Tag = lazy(() => import("./Tag"))
const Picture = lazy(() => import("./Picture"))
const User = lazy(() => import("./User"))
const Message = lazy(() => import("./Message"))
const UserSetting = lazy(() => import('./Admin/TabPanes/PopleSettings'))
const userGroupSetting = lazy(() => import('./Admin/TabPanes/PopleGroup'))




const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class Manage extends Component {
    state = {
        collapsed: false,
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
        timeInfo: '',
        timer1: null,
        menuList: [],
        menuInfo: [
            {
                path: '/home',
                title: '首页',
                key: 'home',
                component: Home,
                icon: <HomeOutlined />
            },
            {
                path: '/channel',
                title: '栏目管理',
                key: 'channel',
                component: Channel,
                icon: <MenuOutlined />
            },
            {
                path: '/article',
                title: '文章管理',
                key: 'article',
                component: Article,
                icon: <ReadOutlined />
            },
            {
                path: '/tag',
                title: '标签管理',
                key: 'tag',
                component: Tag,
                icon: <TagsOutlined />
            },
            {
                path: '/picture',
                title: '图片管理',
                key: 'picture',
                component: Picture,
                icon: <PictureOutlined />
            },
            {
                path: '/user',
                title: '用户管理',
                key: 'user',
                component: User,
                icon: <UserOutlined />
            },
            {
                path: '/message',
                title: '留言管理',
                key: 'message',
                component: Message,
                icon: <MessageOutlined />
            },
            {
                path: '/admin',
                title: '管理员设置',
                key: 'admin',
                icon: <SettingOutlined />,
                children: [
                    {
                        path: '/admin/userSetting',
                        title: '成员设置',
                        key: 'userSetting',
                        component: UserSetting,
                        icon: <UserSwitchOutlined />,
                    },
                    {
                        path: '/admin/groupSetting',
                        title: '用户组设置',
                        key: 'groupSetting',
                        component: userGroupSetting,
                        icon: <UsergroupAddOutlined />,
                    },
                ]
            },
        ]
    }



    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        if (!userInfo || !userInfo.state || !userInfo.token) {
            let { history } = this.props
            history.push('/')
            return
        }
        this.getTime()
        this.getMenu()
    }


    componentWillUnmount() {
        clearInterval(this.timer1)
    }

    // 侧边栏切换
    toggle() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    // 路由跳转
    viewChange(item) {
        this.props.history.push('/manage' + item.key)
    }

    // 计算时间
    getTime() {
        function addZero(num) {
            return num < 10 ? '0' + num : num
        }
        this.timer1 = setInterval(() => {
            let timeStr = ''
            let t = new Date()
            let Y = t.getFullYear()
            let m = addZero(t.getMonth() + 1)
            let d = addZero(t.getDate())

            let H = addZero(t.getHours())
            let M = addZero(t.getMinutes())
            let S = addZero(t.getSeconds())

            let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][t.getDay()]
            timeStr = `${Y}年${m}月${d}日 ${week} ${H}:${M}:${S}`
            this.setState({
                timeInfo: timeStr
            })
        }, 1000)

    }

    // 获取菜单权限
    getMenu() {
        Axios({
            url: '/api/admin/adminUser/getMenu',
            method: 'post',
            data: {
                userId: JSON.parse(sessionStorage.getItem('userInfo')).userId
            }
        }).then(res => {
            let arr = []
            res.data.forEach(menuItem => {
                this.state.menuInfo.forEach(item => {
                    if (menuItem.path === item.path && menuItem.key === item.key) {
                        arr.push(item)
                    }
                })
            })
            this.setState({
                menuList: arr
            })
        })
    }

    // 用户退出
    userQuit() {
        Axios({
            url: '/api/admin/logout',
            method: 'post'
        }).then(res => {
            sessionStorage.clear()
            this.props.history.push('/login')
        })

    }




    render() {
        const { state } = this;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsed={state.collapsed}>
                    <div className="logo">
                        <img src={AivaLogo} width="50%" />
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['/home']}>
                        {
                            state.menuList.map(item => {
                                if (item.children && Array.isArray(item.children) && item.children[0]) {
                                    return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                                        {item.children.map(item => {
                                            return <Menu.Item key={item.path} onClick={this.viewChange.bind(this)} icon={item.icon}>{item.title}</Menu.Item>

                                        })}

                                    </SubMenu>


                                } else {
                                    return <Menu.Item key={item.path} onClick={this.viewChange.bind(this)} icon={item.icon}>{item.title}</Menu.Item>
                                }
                            })
                        }
                        {/* <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu> */}

                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ paddingLeft: 16, paddingRight: 16 }}>

                        <div className="headerBox">
                            <div className="timeInfo">
                                <div>
                                    {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.toggle.bind(this),
                                    })}
                                </div>
                                <div style={{ marginLeft: 20 }}>
                                    <p>{state.timeInfo}</p>
                                </div>
                            </div>
                            <div className="userSetting">
                                <p><span>{state.userInfo.userName}</span><span onClick={this.userQuit.bind(this)} className="quit">退出</span></p>
                            </div>
                        </div>
                    </Header>
                    <Content style={{ margin: '0 16px', maxHeight: 'calc(100vh - 64px - 54px)', overflow: 'hidden' }}>

                        <div id="onlyScroll" className="mainContent">
                            <React.Suspense fallback={<Spin size="large" className="mainLoading" tip="正在玩命加载中" />}>
                                <Router>
                                    <Switch>
                                        {
                                            state.menuList.map(item => {
                                                if (item.children && Array.isArray(item.children) && item.children[0]) {
                                                    return item.children.map(item => {
                                                        return <Route path={"/manage" + item.path} key={item.key} exact component={item.component} />
                                                    })
                                                } else {
                                                    return <Route path={"/manage" + item.path} key={item.key} exact component={item.component} />
                                                }

                                            })
                                        }
                                        <Redirect from='/manage' to={"/manage/home"} />
                                    </Switch>
                                </Router>
                            </React.Suspense>
                        </div>
                    </Content>
                    <Footer>Copyright © 2020 By Aiva. All Rights Reserved</Footer>
                </Layout>
            </Layout>
        )
    }
}