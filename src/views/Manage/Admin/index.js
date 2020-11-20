import React, { Component } from 'react';
import { Tabs } from "antd"
import PopleSetting from "./TabPanes/PopleSettings"
import PopleGroup from "./TabPanes/PopleGroup"
import "./index.css"

export default class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="adminManage">
                <Tabs tabPosition="left">
                    <Tabs.TabPane tab="成员设置" key="1">
                        <PopleSetting />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="用户组设置" key="2">
                        <PopleGroup />

                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}