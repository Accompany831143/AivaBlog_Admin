import React, { Component } from 'react';

import { Input, Button,message } from 'antd';
import "./index.css";
const { Search } = Input
export default class MenuForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            keyword: ''
        }
    }

    // 标题搜索框改变
    changeSearchTitle(e) {
        let val = e.target.value
        this.setState({
            keyword: val
        })
    }

    // 搜索标题内容
    searchTitle() {
        if (this.state.keyword === '') {
            message.warning('请输入搜索内容！')
            return
        } else {
            this.props.onSearch(this.state.keyword)

        }
    }

    // 添加
    addHandler() {
        this.props.add()
    }

    // 删除
    removeHandler() {
        this.props.remove()
    }


    render() {
        return (
            <div className="menu_form">
                <div className="inputsWrapper">
                    <Search enterButton={'搜索'} style={{ width: 260 }} allowClear value={this.state.keyword} onSearch={this.searchTitle.bind(this)} placeholder="请输入搜索内容" onChange={this.changeSearchTitle.bind(this)} />

                </div>
                <div className="btnsWrapper">
                    <Button type="primary" onClick={this.addHandler.bind(this)}>新建</Button>
                    <Button type="danger" onClick={this.removeHandler.bind(this)}>删除</Button>
                </div>
            </div>
        )
    }
}