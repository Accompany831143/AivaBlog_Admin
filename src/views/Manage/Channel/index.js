import React, { Component } from 'react';
import { Table, Drawer,Button,Form,Input } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MenuForm from '../../../components/MenuForm'
import Axios from "../../../Axios"
import "./index.css"
export default class Channel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            tableData: [],
            showAddDrawer:false,
            columnsData: [
                {
                    title: '栏目名称',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true
                },
                {
                    title: '栏目描述',
                    dataIndex: 'describe',
                    key: 'describe',
                    ellipsis: true

                },
                {
                    title: '创建时间',
                    dataIndex: 'createDate',
                    key: 'createDate',
                    sorter: (a, b) => {
                        return new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
                    }
                },
                {
                    title: '创建人',
                    dataIndex: 'author',
                    key: 'author',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'id',
                    render: (val, data, index) => {
                        return (
                            <div className="actionStyle">
                                <div title="查看" style={{ marginRight: 10 }}><EyeOutlined /></div>
                                <div title="编辑" style={{ marginRight: 10 }}><EditOutlined /></div>
                                <div title="删除"><DeleteOutlined /></div>
                            </div>
                        )
                    }
                },
            ],
            pageInfo: {
                total: 50,
                current: 1,
                pageSize: 10
            },
            validate: {
                channelName: [
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
                channelDesc: [
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
                ]
            },
        }
    }

    // 获取栏目数据
    getChannel() {
        Axios({
            url: '/api/admin/channel/latest/'
        }).then(res => {
            res = res.data
            res = res.map(item => {
                item.key = item.cid
                return item
            })
            this.setState({
                tableData: res
            })
        })
    }

    // 选择表格数据
    onSelectChange = (keys, rows) => {
        console.log(keys, rows);
        this.setState({ selectedRowKeys: keys });
    };

    // 页码变化 
    pageChange(page, pageSize) {
        console.log(page, pageSize)
    }

    // 搜索
    SearchHandler(val) {
        console.log('搜索', val)
    }

    // 添加栏目
    addChannel() {
        this.setState({
            showAddDrawer:true
        })
    }

    // 删除多个栏目
    removeManyChannel() {
        console.log('删除多个')
    }

    // 关闭添加抽屉
    closeAddDrawer() {
        this.setState({
            showAddDrawer:false
        })
    }

    // 表单完成
    onFinish(values) {
        console.log(values)
    }

    componentDidMount() {
        this.getChannel()
    }




    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const footer = (<div>
            <Button type="default" onClick={this.closeAddDrawer.bind(this)}  style={{marginRight:10}}>取消</Button>
            <Button type="primary">提交</Button>
        </div>)
        return (
            <div className="channelManage">
                <MenuForm onSearch={this.SearchHandler.bind(this)} add={this.addChannel.bind(this)} remove={this.removeManyChannel.bind(this)} />
                <div className="tableBox">
                    <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={this.state.columnsData} pagination={{ total: this.state.pageInfo.total, showQuickJumper: true, onChange: this.pageChange.bind(this) }} />

                </div>

                <Drawer
                    title="新建栏目"
                    width={460}
                    footer={footer}
                    footerStyle={{display:'flex',justifyContent:'flex-end'}}
                    onClose={this.closeAddDrawer.bind(this)}
                    visible={this.state.showAddDrawer}
                >
                    <Form labelCol={{ 'span': 4 }} onFinish={this.onFinish.bind(this)}>
                        <Form.Item label="栏目名称" name="channelName" rules={this.state.validate.channelName}>
                            <Input allowClear maxLength="50" placeholder="请输入栏目名称" />
                        </Form.Item>
                        <Form.Item label="栏目描述" name="channelDesc" rules={this.state.validate.channelDesc}>
                            <Input.TextArea showCount allowClear maxLength="255" placeholder="请输入栏目描述" />
                        </Form.Item>
                        <Form.Item label="栏目等级" name="channelLevel">
                            <Input type="number" allowClear maxLength="50" placeholder="请输入栏目等级" />
                        </Form.Item>
                        <Form.Item>
                            <p className="formMessage" style={{textIndent:'70px'}}>栏目等级为栏目排序规则，数值越高，栏目越靠前</p>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        )
    }
}