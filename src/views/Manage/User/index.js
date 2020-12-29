import React, { Component } from 'react';
import { Table,Avatar, Modal } from 'antd';
import { EyeOutlined, } from '@ant-design/icons'
import MenuForm from '../../../components/MenuForm'
import Axios from "../../../Axios"
import Moment from "moment"
import Env from "../../../Axios/envConst"
import "./index.css"
export default class Channel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            tableData: [],
            keyWord: '',
            showDetail: false,
            detailInfo: {},
            addForm: React.createRef(),
            columnsData: [
                {
                    title: '用户名称',
                    dataIndex: 'userName',
                    key: 'userName',
                    ellipsis: true
                },
                {
                    title: '用户头像',
                    dataIndex: 'userAvatar',
                    key: 'userAvatar',
                    ellipsis: true,
                    render:(val, data, index) => {
                        return (
                            <Avatar src={data.userAvatar} />
                        )
                    }

                },
                {
                    title: '手机号码',
                    dataIndex: 'userTel',
                    key: 'userTel',
                    align: 'center',
                    ellipsis: true

                },
                {
                    title: '性别',
                    dataIndex: 'userSex',
                    key: 'userSex',
                    render:(val, data, index) => {
                        return (
                            <span>{['男','女'][data.userSex]}</span>
                        )
                    }
                },
                {
                    title: '邮箱',
                    dataIndex: 'userEmail',
                    key: 'userEmail',
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
                    title: '操作',
                    dataIndex: 'action',
                    key: 'id',
                    render: (val, data, index) => {
                        return (
                            <div className="actionStyle">
                                <div title="查看" onClick={this.lookDetail.bind(this, data)} style={{ marginRight: 10 }}><EyeOutlined /></div>
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
            }
        }
    }

    // 获取用户数据
    getUserData() {
        Axios({
            url: '/api/admin/user/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.cid
                item.createDate = Moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                item.userAvatar = item.userAvatar.replace(/\\/g,
                    '/')
                item.userAvatar = Env + item.userAvatar
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

    // 提交搜索
    commitSearch() {
        Axios({
            url: '/api/admin/user/search',
            params: {
                keyword: this.state.keyWord,
                page: this.state.searchPageInfo.current,
                pageSize: this.state.searchPageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.cid
                item.createDate = Moment(item.createDate).format('YYYY-MM-DD HH:mm:ss')
                item.userAvatar = item.userAvatar.replace(/\\/g,
                    '/')
                item.userAvatar = Env + item.userAvatar
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
        return (
            <div className="channelManage">
                <MenuForm noShowBtn={true} onSearch={this.SearchHandler.bind(this)}/>
                <div className="tableBox">
                    <Table rowSelection={rowSelection} dataSource={this.state.tableData} columns={this.state.columnsData} pagination={{ total: this.state.pageInfo.total, showQuickJumper: true, onChange: this.pageChange.bind(this) }} />

                </div>

                <Modal
                    title="用户详情"
                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    footer={null}
                >
                    <div className="channelDetail">
                        <div>
                            <span>用户名称：</span>
                            <span>{this.state.detailInfo.userName}</span>
                        </div>
                        <div>
                            <span>用户头像：</span>
                            <span>
                                <Avatar src={this.state.detailInfo.userAvatar} />
                            </span>
                            
                        </div>
                        <div>
                            <span>手机号码：</span>
                            <span>{this.state.detailInfo.userTel}</span>
                        </div>
                        <div>
                            <span>用户性别：</span>
                            <span>{['男','女'][this.state.detailInfo.userSex]}</span>
                        </div>
                        <div>
                            <span>用户邮箱：</span>
                            <span>{this.state.detailInfo.userEmail}</span>
                        </div>
                        <div>
                            <span>创建时间：</span>
                            <span>{this.state.detailInfo.createDate}</span>
                        </div>
                       
                    </div>
                </Modal>

            </div>
        )
    }
}