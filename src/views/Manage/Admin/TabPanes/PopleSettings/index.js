import React, { Component } from 'react';
import { Table, Drawer, Button, Form, Input, Popconfirm, message, Modal, Select,Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MenuForm from '../../../../../components/MenuForm'
import Axios from "../../../../../Axios"
import Moment from "moment"
import "./index.css"
export default class PopleSetting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            tableData: [],
            keyWord: '',
            showAddDrawer: false,
            editFlag: false,
            showDetail: false,
            detailInfo: {},
            addForm: React.createRef(),
            password: '',
            columnsData: [
                {
                    title: '用户名称',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true
                },
                {
                    title: '用户账户',
                    dataIndex: 'account',
                    key: 'account',
                    ellipsis: true

                },
                {
                    title: '所属用户组',
                    dataIndex: 'group',
                    key: 'group',
                    align: 'center',
                    ellipsis: true

                },
                {
                    title: '上次登录IP',
                    dataIndex: 'beforeLoginIp',
                    key: 'beforeLoginIp',
                    align: 'center',
                    ellipsis: true

                },
                {
                    title: '上次登录时间',
                    dataIndex: 'beforeLoginTime',
                    key: 'beforeLoginTime',
                    align: 'center',
                    ellipsis: true

                },
                {
                    title: '创建时间',
                    dataIndex: 'createDate',
                    key: 'createDate',
                    ellipsis: true,
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
                                <div title="查看" onClick={this.lookDetail.bind(this, data)} style={{ marginRight: 10 }}><EyeOutlined /></div>
                                <div title="编辑" onClick={this.editChannel.bind(this, data)} style={{ marginRight: 10 }}><EditOutlined /></div>
                                <div title="删除" className={data.lock ? 'disable' : ''}><Popconfirm
                                    title="管理员删除后无法恢复，您确定要删除吗？"
                                    disabled={data.lock}
                                    onConfirm={this.removeItem.bind(this, data)}
                                    okText="删除"
                                    cancelText="取消"
                                >
                                    <DeleteOutlined />
                                </Popconfirm></div>
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
            searchPageInfo: {
                total: 50,
                current: 1,
                pageSize: 10
            },
            validate: {
                userName: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入管理员名称')
                            } else {
                                let reg = /^[a-zA-Z0-9\u4e00-\u9fa5@\._-]{1,50}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('管理员名称格式错误！')
                                }
                            }
                        }
                    }
                ],
                userAccount: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入管理员账号')
                            } else {

                                return Promise.resolve()

                            }
                        }
                    }
                ],
                userPassword1: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入管理员密码')
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
                userPassword2: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请再次输入管理员密码')
                            } else {
                                if (value === this.state.password) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('两次输入的密码不一致')
                                }
                            }
                        }
                    }
                ],
                userGroup: [
                    {
                        validator: (_, value) => {
                            if (value === undefined) {
                                return Promise.reject('请选择用户组')
                            } else {
                                return Promise.resolve()
                            }

                        }
                    }
                ]
            },
            userGroupVal: '',
            userGroupData: []
        }
    }

    // 获取管理员数据
    getUserData() {
        Axios({
            url: '/api/admin/adminUser/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.cid
                item.createDate = Moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                item.beforeLoginTime = Moment(item.beforeLoginTime).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            let userName = JSON.parse(sessionStorage.getItem('userInfo')).userName
            res.data = res.data.filter(item => {
                return item.name !== userName
            })
            this.setState({
                tableData: res.data,
                pageInfo: {
                    total: res.pageInfo.total,
                    current: res.pageInfo.current
                }
            })
        })
    }

    // 选择表格数据
    onSelectChange = (keys, rows) => {
        this.setState({ selectedRowKeys: keys });
    };

    // 页码变化 
    pageChange(page, pageSize) {
        if (this.state.keyWord) {
            this.setState({
                searchPageInfo: {
                    current: page,
                    pageSize
                }
            }, () => {
                this.commitSearch()
            })
        } else {
            this.setState({
                pageInfo: {
                    current: page,
                    pageSize
                }
            }, () => {
                this.getUserData()
            })
        }

    }

    // 搜索
    SearchHandler(val) {
        this.setState({
            keyWord: val,
            searchPageInfo: {
                current: val ? this.state.searchPageInfo.current : 1
            }
        }, () => {
            if (val) {
                this.commitSearch()
            } else {
                // message.warning('请输入搜索内容！')
                this.getUserData()
            }
        })

    }

    // 密码change
    changePassword(e) {
        this.setState({
            password: e.target.value
        }, () => {
            // console.log(e)
        })
    }

    // 获取用户组
    getUserGroup(fn) {
        Axios({
            url: '/api/admin/PopleGroup/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize,
                type: 'all'
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.PopleGroupId
                item.createDate = Moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            this.setState({
                userGroupData: res.data
            }, () => {
                fn && fn()
            })
        })
    }

    // 提交搜索
    commitSearch() {
        Axios({
            url: '/api/admin/channel/search',
            params: {
                keyword: this.state.keyWord,
                page: this.state.searchPageInfo.current,
                pageSize: this.state.searchPageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.cid
                item.createDate = Moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                return item
            })

            this.setState({
                tableData: res.data,
                pageInfo: {
                    total: res.pageInfo.total,
                    current: res.pageInfo.current
                }
            })
        })
    }

    // 添加管理员
    addChannel() {
        this.getUserGroup(() => {
            this.setState({
                showAddDrawer: true,
                editFlag: false
            })
        })

    }

    // 编辑管理员
    editChannel(val) {
        this.setState({
            showAddDrawer: true,
            editFlag: true
        }, () => {
            this.state.addForm.current.setFieldsValue({
                userName: val.name,
                userAccount: val.account,
                // userPassword1: val.level,
                // userPassword2: val.level,
                userGroup: val.group,
                cid: val.cid
            })
        })

    }

    // 删除多个管理员
    removeManyChannel() {
        let { selectedRowKeys } = this.state
        if (selectedRowKeys.length <= 0) {
            message.warning('您还没有选择管理员！')
            return
        }
        this.setState({
            showRemoveConfirm: true
        })

    }

    // 删除多个请求
    commitRemoveMany(e, arr) {
        this.setState({
            showRemoveConfirm: false
        })
        let { selectedRowKeys } = this.state
        let list = arr === undefined ? selectedRowKeys : arr

        Axios({
            url: '/api/admin/adminUser/delete',
            method: 'post',
            data: {
                ids: list
            }
        }).then(res => {
            message.success('删除成功！')
            this.setState({
                selectedRowKeys: []
            }, () => {
                this.getUserData()
            })

        })
    }

    // 删除单个
    removeItem(data) {
        let id = data.cid;
        this.commitRemoveMany({}, [id])

    }

    // 关闭添加抽屉
    closeAddDrawer() {
        this.state.addForm.current.resetFields()
        this.setState({
            showAddDrawer: false
        })
    }


    // 添加提交
    commitAdd() {
        this.state.addForm.current.validateFields().then(values => {

            let url = this.state.editFlag ? '/api/admin/adminUser/update' : '/api/admin/adminUser/add'
            if (!this.state.editFlag) {
                values.createDate = new Date().valueOf()
            }
            let msg = this.state.editFlag ? '管理员修改成功！' : '管理员添加成功！'
            // console.log(values, this.state.userGroupVal)
            // return
            values.userPassword = values.userPassword1
            delete values.userPassword1
            delete values.userPassword2
            Axios({
                url,
                method: 'post',
                data: values
            }).then(res => {
                message.success(msg)
                this.closeAddDrawer()
                this.getUserData()
            })
        }).catch(err => {
            // 柱哥最帅
        })
    }

    // 查看详情
    lookDetail(data) {
        this.setState({
            showDetail: true,
            detailInfo: data
        })
    }



    componentDidMount() {
        this.getUserData()
    }




    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const footer = (<div>
            <Button type="default" onClick={this.closeAddDrawer.bind(this)} style={{ marginRight: 10 }}>取消</Button>
            <Button type="primary" onClick={this.commitAdd.bind(this)}>提交</Button>
        </div>)
        return (
            <div className="channelManage">
                <MenuForm onSearch={this.SearchHandler.bind(this)} add={this.addChannel.bind(this)} remove={this.removeManyChannel.bind(this)} />
                <div className="tableBox">
                    <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={this.state.columnsData} pagination={{ total: this.state.pageInfo.total, showQuickJumper: true, onChange: this.pageChange.bind(this) }} />

                </div>

                <Drawer
                    title={this.state.editFlag ? "编辑管理员" : "新建管理员"}
                    width={620}
                    footer={footer}
                    footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
                    onClose={this.closeAddDrawer.bind(this)}
                    visible={this.state.showAddDrawer}
                >
                    <Form ref={this.state.addForm} labelCol={{ 'span': 4 }}>
                        <Form.Item name="cid" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item label="管理员名称" name="userName" rules={this.state.validate.userName}>
                            <Input allowClear maxLength="50" placeholder="请输入管理员名称" />
                        </Form.Item>
                        <Form.Item label="管理员账号" name="userAccount" rules={this.state.validate.userAccount}>
                            <Input allowClear maxLength="255" placeholder="请输入管理员账号" />
                        </Form.Item>
                        {
                            this.state.editFlag ? '' : <Form.Item label="管理员密码" name="userPassword1" rules={this.state.validate.userPassword1}>
                                <Input.Password onChange={this.changePassword.bind(this)} placeholder="请输入管理员密码" />
                            </Form.Item>
                        }
                        {
                            this.state.editFlag ? '' : <Form.Item label="确认密码" name="userPassword2" rules={this.state.validate.userPassword2}>
                                <Input.Password placeholder="请再次输入管理员密码" />
                            </Form.Item>
                        }
                        <Form.Item label="用户组" name="userGroup" rules={this.state.validate.userGroup}>
                            <Select value={this.state.userGroupData[0]} style={{ width: 200 }} placeholder="请选择用户组">

                                {
                                    this.state.userGroupData.map(item => {
                                        return <Select.Option key={item.key} value={item.key}>{item.PopleGroupName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Drawer>

                <Modal
                    title="管理员详情"
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    footer={null}
                >
                    <div className="channelDetail">
                        <div>
                            <span>管理员名称：</span>
                            <span>{this.state.detailInfo.name}</span>
                        </div>
                        <div>
                            <span>管理员账号：</span>
                            <span>{this.state.detailInfo.account}</span>
                        </div>
                        <div>
                            <span>所属用户组：</span>
                            <span><Tag color="blue">{this.state.detailInfo.group}</Tag></span>
                        </div>
                        <div>
                            <span>创建时间：</span>
                            <span>{this.state.detailInfo.createDate}</span>
                        </div>
                        <div>
                            <span>创建人：</span>
                            <span>{this.state.detailInfo.author}</span>
                        </div>
                    </div>
                </Modal>



                <Modal
                    title="提示"
                    visible={this.state.showRemoveConfirm}
                    onOk={this.commitRemoveMany.bind(this)}
                    onCancel={() => { this.setState({ showRemoveConfirm: false, selectedRowKeys: [] }) }}
                >
                    <p>您确定要删除这些管理员吗？</p>
                </Modal>
            </div>
        )
    }
}