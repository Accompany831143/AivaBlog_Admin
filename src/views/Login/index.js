import React, { Component } from "react";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import "./index.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                userName: '',
                password: '',
                authCode: ''
            }
        }
    }

    //
    formValueChange(activeValue, allValue) {
        
        this.setState({
            formData:allValue
        })
    }


    render() {
        return (
            <div className="loginMain">
                <div className="container">
                    <div className="loginBox">
                        <h1>Aiva博客后台管理系统</h1>
                        <Form labelCol={{ 'span': 4 }} onValuesChange={this.formValueChange.bind(this)}>
                            <Form.Item label="用户名" name="userName" rules={[
                                {
                                    validator: (rule, value, fn) => {
                                        value = value || ''
                                        if (value.length <= 0) {
                                            return Promise.reject('不能为空')
                                        } else {
                                            return Promise.resolve()
                                        }
                                    }
                                }
                            ]}>
                                <Input placeholder="请输入用户名" prefix={<UserOutlined />} allowClear maxLength="50" />
                            </Form.Item>
                            <Form.Item label="密码" name="password">
                                <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} allowClear maxLength="50" />
                            </Form.Item>
                            <Form.Item label="验证码">
                                <Form.Item name="authCode" noStyle>
                                    <Input style={{ width: 150 }} placeholder="请输入验证码" prefix={<SafetyCertificateOutlined />} allowClear />
                                </Form.Item>
                                <img style={{ marginLeft: 10, width: 100, height: 32 }} src="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" />
                            </Form.Item>
                            <Button size="large" type="primary" block htmlType="submit">立即登录</Button>
                        </Form>
                    </div>
                </div>

            </div>
        )
    }
}