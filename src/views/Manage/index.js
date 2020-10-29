import React, { Component } from "react"
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import {
    HomeOutlined,
    MenuOutlined,
    ReadOutlined,
    TagsOutlined,
    UserOutlined,
    PictureOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';

import Home from "./Home";
import Channel from "./Channel";
import Article from "./Article";
import Tag from "./Tag";
import Picture from "./Picture";
import User from "./User";

import AivaLogo from '../../images/Aiva.png';
import "./index.css"

const { Header, Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;

export default class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
            timeInfo:'',
            timer1:null
        }
    }

    
    
    componentDidMount() {
        this.getTime()
        let userInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        if (!userInfo || !userInfo.state) {
            let { history } = this.props
            history.push('/')
        }
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

            let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][t.getDay()]
            timeStr = `${Y}年${m}月${d}日 ${week} ${H}:${M}:${S}`
            this.setState({
                timeInfo:timeStr
            })
        },1000)
        
    }

    // 用户退出
    userQuit() {
        sessionStorage.clear()
        this.props.history.push('/login')
    }




    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsed={collapsed}>
                    <div className="logo">
                        <img src={AivaLogo} width="50%" />
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['/home']}>
                        <Menu.Item key="/home" onClick={this.viewChange.bind(this)} icon={<HomeOutlined />}>首页</Menu.Item>
                        <Menu.Item key="/channel" onClick={this.viewChange.bind(this)} icon={<MenuOutlined />}>栏目管理</Menu.Item>
                        {/* <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu> */}
                        <Menu.Item key="/article" onClick={this.viewChange.bind(this)} icon={<ReadOutlined />}>文章管理</Menu.Item>
                        <Menu.Item key="/tag" onClick={this.viewChange.bind(this)} icon={<TagsOutlined />}>标签管理</Menu.Item>
                        <Menu.Item key="/picture" onClick={this.viewChange.bind(this)} icon={<PictureOutlined />}>图片管理</Menu.Item>
                        <Menu.Item key="/user" onClick={this.viewChange.bind(this)} icon={<UserOutlined />}>用户管理</Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ paddingLeft: 16, paddingRight: 16 }}>

                        <div className="headerBox">
                            <div className="timeInfo">
                                <div>
                                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.toggle.bind(this),
                                    })}
                                </div>
                                <div style={{ marginLeft: 20 }}>
                                    <p>{this.state.timeInfo}</p>
                                </div>
                            </div>
                            <div className="userSetting">
                                <p><span>{this.state.userInfo.userName}</span><span onClick={this.userQuit.bind(this)} className="quit">退出</span></p>
                            </div>
                        </div>
                    </Header>
                    <Content style={{ margin: '0 16px',maxHeight:'calc(100vh - 64px - 54px)',overflow:'hidden' }}>

                        <div className="mainContent">
                            <Switch>
                                <Route path={"/manage/home"} exact component={Home} />
                                <Route path={"/manage/channel"} exact component={Channel} />
                                <Route path={"/manage/article"} exact component={Article} />
                                <Route path={"/manage/tag"} exact component={Tag} />
                                <Route path={"/manage/picture"} exact component={Picture} />
                                <Route path={"/manage/user"} exact component={User} />
                                <Redirect from='/manage' exact to={"/manage/home"} />
                            </Switch>
                        </div>
                    </Content>
                    <Footer>Copyright © 2020 By Aiva. All Rights Reserved</Footer>
                </Layout>
            </Layout>
        )
    }
}