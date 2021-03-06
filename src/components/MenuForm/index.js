/*
 * @Date: 2020-11-14 20:29:33
 * @LastEditors: Aiva
 * @LastEditTime: 2020-12-28 12:56:58
 * @FilePath: \AivaBlog_Admin\src\components\MenuForm\index.js
 */
import React, { Component } from 'react';

import { Input, Button } from 'antd';
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
        this.props.onSearch(this.state.keyword)
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
                {this.props.noShowBtn === undefined ? <div className="btnsWrapper">
                    
                    <Button type="primary" onClick={this.addHandler.bind(this)}>新建</Button>
                    <Button type="danger" onClick={this.removeHandler.bind(this)}>删除</Button>
                </div> : ''}
                
            </div>
        )
    }
}