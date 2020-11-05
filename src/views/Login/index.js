import React, { Component } from "react";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import Axios from "../../Axios"
import "./index.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: {
                userName: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入用户名！')
                            } else {
                                let reg = /^[a-zA-Z0-9]{4,20}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('用户名格式错误！')
                                }
                            }
                        }
                    }
                ],
                password: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入密码')
                            } else {
                                let reg = /^[a-zA-Z0-9\.@_]{4,20}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('密码格式错误！')
                                }
                            }
                        }
                    }
                ],
                authCode: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入验证码')
                            } else {
                                let reg = /^[abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRETUVWXYZ23456789]{4}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('验证码格式错误！')
                                }
                            }
                        }
                    }
                ],
            },
            authCode: ''
        }
    }

    componentDidMount() {
        let userInfo = JSON.parse(sessionStorage.getItem('loginInfo'))
        if (userInfo && userInfo.state && userInfo.token) {
            let { history } = this.props
            history.push('/manage')
        } else {
            this.getAuthCode()
        }
    }

    // 获取验证码
    getAuthCode() {
        Axios({
            url: '/api/admin/authCode'
        }).then(res => {
            this.setState({
                authCode: res.authCode
            })
        })
    }

    // 发送登录请求
    userLogin(options) {
        Axios({
            url: '/api/admin/login',
            method: 'post',
            data: {
                userName: options.userName,
                userPassword: options.password,
                authCode: options.authCode.toLowerCase()
            }
        }).then(res => {
            sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
            sessionStorage.setItem('loginInfo', JSON.stringify({ state: true, token: res.token }))
            let { history } = this.props
            message.success('登录成功！')
            history.push('/manage')
        })
    }


    //表单验证通过触发
    onFinish(values) {
        this.userLogin(values)
    }


    render() {
        return (
            <div className="loginMain">
                <div className="container">
                    <div className="loginBox">
                        <h1>Aiva博客后台管理系统</h1>
                        <Form labelCol={{ 'span': 4 }} onFinish={this.onFinish.bind(this)}>
                            <Form.Item label="用户名" name="userName" rules={this.state.validate.userName}>
                                <Input placeholder="请输入用户名" prefix={<UserOutlined />} allowClear maxLength="50" />
                            </Form.Item>
                            <Form.Item label="密码" name="password" rules={this.state.validate.password}>
                                <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} allowClear maxLength="50" />
                            </Form.Item>
                            <Form.Item label="验证码">
                                <Form.Item name="authCode" noStyle rules={this.state.validate.authCode}>
                                    <Input style={{ width: 150 }} placeholder="请输入验证码" prefix={<SafetyCertificateOutlined />} allowClear />
                                </Form.Item>
                                <span style={{ display: 'inline-block', background: '#fff', verticalAlign: 'middle', marginLeft: 10, width: 100, height: 32, cursor: 'pointer' }} onClick={this.getAuthCode.bind(this)} dangerouslySetInnerHTML={{ __html: this.state.authCode }}></span>
                            </Form.Item>
                            <Button size="large" type="primary" block htmlType="submit">立即登录</Button>
                        </Form>
                    </div>
                </div>

            </div>
        )
    }
}