import React, { Component } from 'react';
import { Table, Drawer, Button, Form, Input, InputNumber, Popconfirm, message, Modal } from 'antd';
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
            showAddDrawer: false,
            editFlag: false,
            showDetail: false,
            detailInfo: {},
            addForm: React.createRef(),
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
                    title: '栏目等级',
                    dataIndex: 'level',
                    key: 'level',
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
                                <div title="删除"><Popconfirm
                                    title="栏目删除后无法恢复，您确定要删除吗？"
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
            validate: {
                channelName: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入栏目名称')
                            } else {
                                let reg = /^[a-zA-Z0-9\u4e00-\u9fa5@\._-]{1,50}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('栏目名称格式错误！')
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
                                return Promise.reject('请输入栏目描述')
                            } else {

                                return Promise.resolve()

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
            url: '/api/admin/channel/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: 10
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.cid
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
        this.setState({
            pageInfo: {
                current: page,
                pageSize
            }
        }, () => {
            this.getChannel()
        })
    }

    // 搜索
    SearchHandler(val) {
        console.log('搜索', val)
    }

    // 添加栏目
    addChannel() {
        this.setState({
            showAddDrawer: true,
            editFlag: false
        })
    }

    // 编辑栏目
    editChannel(val) {
        this.setState({
            showAddDrawer: true,
            editFlag: true
        }, () => {
            this.state.addForm.current.setFieldsValue({
                channelName: val.name,
                channelDesc: val.describe,
                channelLevel: val.level
            })
        })

    }

    // 删除多个栏目
    removeManyChannel() {
        let { selectedRowKeys } = this.state
        if (selectedRowKeys.length <= 0) {
            message.warning('您还没有选择栏目！')
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
            url: '/api/admin/channel/delete',
            method: 'post',
            data: {
                ids: list
            }
        }).then(res => {
            message.success('删除成功！')
            this.setState({
                selectedRowKeys: []
            }, () => {
                this.getChannel()
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
            if (!values.channelLevel) {
                values.channelLevel = 0
            }

            let url = this.state.editFlag ? '/api/admin/channel/update' : '/api/admin/channel/add'
            if (!this.state.editFlag) {
                values.createData = new Date().valueOf()
            }
            let msg = this.state.editFlag ? '栏目修改成功！' : '栏目添加成功！'
            Axios({
                url,
                method: 'post',
                data: values
            }).then(res => {
                message.success(msg)
                this.closeAddDrawer()
                this.getChannel()
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
        this.getChannel()
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
                    title={this.state.editFlag ? "编辑栏目" : "新建栏目"}
                    width={460}
                    footer={footer}
                    footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
                    onClose={this.closeAddDrawer.bind(this)}
                    visible={this.state.showAddDrawer}
                >
                    <Form ref={this.state.addForm} labelCol={{ 'span': 4 }}>
                        <Form.Item label="栏目名称" name="channelName" rules={this.state.validate.channelName}>
                            <Input allowClear maxLength="50" placeholder="请输入栏目名称" />
                        </Form.Item>
                        <Form.Item label="栏目描述" name="channelDesc" rules={this.state.validate.channelDesc}>
                            <Input.TextArea showCount allowClear maxLength="255" placeholder="请输入栏目描述" />
                        </Form.Item>
                        <Form.Item label="栏目等级" name="channelLevel">
                            <InputNumber style={{ width: 200 }} placeholder="请输入栏目等级" />
                        </Form.Item>
                        <Form.Item>
                            <p className="formMessage" style={{ textIndent: '70px' }}>栏目等级为栏目排序规则，数值越高，栏目越靠前</p>
                        </Form.Item>
                    </Form>
                </Drawer>

                <Modal
                    title="栏目详情"
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    footer={null}
                >
                    <div className="channelDetail">
                        <div>
                            <span>栏目名称：</span>
                            <span>{this.state.detailInfo.name}</span>
                        </div>
                        <div>
                            <span>栏目描述：</span>
                            <span>{this.state.detailInfo.describe}</span>
                        </div>
                        <div>
                            <span>栏目级别：</span>
                            <span>{this.state.detailInfo.level}</span>
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
                    <p>您确定要删除这些栏目吗？</p>
                </Modal>
            </div>
        )
    }
}