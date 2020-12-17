import React, { Component } from 'react';
import { Table, Drawer, Button, Form, Input, Popconfirm, message, Modal, TreeSelect,Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MenuForm from '../../../../../components/MenuForm'
import Axios from "../../../../../Axios"
import Moment from "moment"
import "./index.css"
const { SHOW_PARENT } = TreeSelect;
export default class PopleGroup extends Component {
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
            columnsData: [
                {
                    title: '用户组名称',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true
                },
                {
                    title: '用户组描述',
                    dataIndex: 'describe',
                    key: 'describe',
                    ellipsis: true

                },
                // {
                //     title: '用户组权限',
                //     dataIndex: 'permissions',
                //     key: 'permissions',
                //     align: 'center',
                //     ellipsis: true

                // },
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
                                <div title="编辑" onClick={this.editPopleGroup.bind(this, data)} style={{ marginRight: 10 }}><EditOutlined /></div>
                                <div title="删除"><Popconfirm
                                    title="用户组删除后无法恢复，您确定要删除吗？"
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
                PopleGroupName: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入用户组名称')
                            } else {
                                let reg = /^[a-zA-Z0-9\u4e00-\u9fa5@\._-]{1,50}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('用户组名称格式错误！')
                                }
                            }
                        }
                    }
                ],
                PopleGroupDesc: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入用户组描述')
                            } else {

                                return Promise.resolve()

                            }
                        }
                    }
                ]
            },
            treeData: [
                {
                    title: '全部菜单',
                    value: 'all',
                    key: 'all',
                    children: [
                        {
                            title: '菜单1',
                            value: 'key1',
                            key: 'key1',
                        },
                        {
                            title: '菜单2',
                            value: 'key2',
                            key: 'key2',
                            children: [
                                {
                                    title: '菜单2-1',
                                    value: 'key2-1',
                                    key: 'key2-1',
                                },
                            ]
                        },
                        {
                            title: '菜单3',
                            value: 'key3',
                            key: 'key3',
                        },
                    ],
                },
            ],
            menuData:[]
        }
    }

    // 获取所有菜单数据
    getAllMenu() {
        Axios({
            url: '/api/admin/adminGroup/allMenu'
        }).then(res => {
            let arr = res.data.map(item => {
                if (item.children && Array.isArray(item.children) && item.children[0]) {
                    item.children.forEach(item => {
                        item.value = item.uid
                        item.key = item.uid
                    })

                }
                item.value = item.uid
                item.key = item.uid
                return item

            })
            this.setState({
                treeData: arr,
                menuData:res.data
            })
        })
    }

    // 获取用户组数据
    getPoplegroupData() {
        Axios({
            url: '/api/admin/PopleGroup/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
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
                this.getPoplegroupData()
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
                this.getPoplegroupData()
            }
        })

    }

    // 提交搜索
    commitSearch() {
        Axios({
            url: '/api/admin/PopleGroup/search',
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

    // 添加用户组
    addPopleGroup() {
        this.setState({
            showAddDrawer: true,
            editFlag: false
        })
    }

    // 编辑用户组
    editPopleGroup(val) {
        this.setState({
            showAddDrawer: true,
            editFlag: true
        }, () => {
            this.state.addForm.current.setFieldsValue({
                PopleGroupName: val.name,
                PopleGroupDesc: val.describe,
                permissions: val.permissions,
                cid: val.cid
            })
        })

    }

    // 删除多个用户组
    removeManyPopleGroup() {
        let { selectedRowKeys } = this.state
        if (selectedRowKeys.length <= 0) {
            message.warning('您还没有选择用户组！')
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
            url: '/api/admin/PopleGroup/delete',
            method: 'post',
            data: {
                ids: list
            }
        }).then(res => {
            message.success('删除成功！')
            this.setState({
                selectedRowKeys: []
            }, () => {
                this.getPoplegroupData()
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


    // 添加文章提交
    commitAdd() {
        this.state.addForm.current.validateFields().then(values => {

            let url = this.state.editFlag ? '/api/admin/PopleGroup/update' : '/api/admin/PopleGroup/add'
            if (!this.state.editFlag) {
                values.createDate = new Date().valueOf()
            }
            let msg = this.state.editFlag ? '用户组修改成功！' : '用户组添加成功！'
            Axios({
                url,
                method: 'post',
                data: values
            }).then(res => {
                message.success(msg)
                this.closeAddDrawer()
                this.getPoplegroupData()
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
        this.getPoplegroupData()
        this.getAllMenu()
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

        const tProps = {
            treeData: this.state.treeData,
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            placeholder: '请配置菜单',
            style: {
                width: '100%',
            },
        };
        return (
            <div className="PopleGroupManage">
                <MenuForm onSearch={this.SearchHandler.bind(this)} add={this.addPopleGroup.bind(this)} remove={this.removeManyPopleGroup.bind(this)} />
                <div className="tableBox">
                    <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={this.state.columnsData} pagination={{ total: this.state.pageInfo.total, showQuickJumper: true, onChange: this.pageChange.bind(this) }} />

                </div>

                <Drawer
                    title={this.state.editFlag ? "编辑用户组" : "新建用户组"}
                    width={580}
                    footer={footer}
                    footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
                    onClose={this.closeAddDrawer.bind(this)}
                    visible={this.state.showAddDrawer}
                >
                    <Form ref={this.state.addForm} labelCol={{ 'span': 4 }}>
                        <Form.Item name="cid" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item label="用户组名称" name="PopleGroupName" rules={this.state.validate.PopleGroupName}>
                            <Input allowClear maxLength="50" placeholder="请输入用户组名称" />
                        </Form.Item>
                        <Form.Item label="用户组描述" name="PopleGroupDesc" rules={this.state.validate.PopleGroupDesc}>
                            <Input.TextArea showCount allowClear maxLength="255" placeholder="请输入用户组描述" />
                        </Form.Item>
                        <Form.Item label="菜单配置" name="permissions">
                            <TreeSelect {...tProps}  />
                        </Form.Item>
                    </Form>
                </Drawer>

                <Modal
                    title="用户组详情"
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    footer={null}
                >
                    <div className="PopleGroupDetail">
                        <div>
                            <span>用户组名称：</span>
                            <span>{this.state.detailInfo.name}</span>
                        </div>
                        <div>
                            <span>用户组描述：</span>
                            <span>{this.state.detailInfo.describe}</span>
                        </div>
                        <div>
                            <span>用户组权限：</span>
                            <span>
                                {
                                    this.state.detailInfo.permissions && this.state.detailInfo.permissions.map(item => {
                                        let title = ''
                                        this.state.menuData.forEach(el => {
                                            if(el.value === item) {
                                                title =  el.title
                                            }
                                        })
                                        return <Tag color="blue" key={title}>{title}</Tag>
                                    })
                                }
                            </span>
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
                    <p>您确定要删除这些用户组吗？</p>
                </Modal>
            </div>
        )
    }
}