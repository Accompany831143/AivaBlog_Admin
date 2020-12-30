import React, { Component } from 'react';
import { Table,Avatar, Modal,Switch,message } from 'antd';
import { EyeOutlined, } from '@ant-design/icons'
import MenuForm from '../../../components/MenuForm'
import Axios from "../../../Axios"
import Moment from "moment"
import Env from "../../../Axios/envConst"
import "./index.css"
export default class Message extends Component {
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
                    title: '内容',
                    dataIndex: 'content',
                    key: 'content',
                    align: 'content',
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
                    title: '展示状态',
                    dataIndex: 'lock',
                    key: 'lock',
                    ellipsis: true,
                    render:(val, data, index) => {
                        return <Switch defaultChecked={data.lock === '1'} onChange={this.onLockChange.bind(this,data)}  />
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

    // 获取留言数据
    getMessageData() {
        Axios({
            url: '/api/admin/message/latest/',
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

    // 状态更改
    onLockChange(item,e) {
        Axios({
            url:'/api/admin/message/changeStatus',
            method:'post',
            data:{
                id:item.uuid,
                status:e ? '1' : '0'
            }
        }).then(res => {
            if(res) {
                message.success('更改成功！')
            }
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
                this.getMessageData()
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
                this.getMessageData()
            }
        })

    }

    // 提交搜索
    commitSearch() {
        Axios({
            url: '/api/admin/message/search',
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
        this.getMessageData()
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
                    title="留言详情"
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
                            <span>{this.state.detailInfo.content}</span>
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