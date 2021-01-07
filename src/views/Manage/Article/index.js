import React, { Component } from 'react';
import { Table, Drawer, Button, Form, Input, Select, Popconfirm, message, Modal, Image, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import MenuForm from '../../../components/MenuForm'
import Axios from "../../../Axios"
import Moment from "moment"
import "./index.css"
const html2md = require('html-to-md')
const hljs = require('highlight.js');
// 初始化Markdown解析器
const mdParser = new MarkdownIt({

    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + mdParser.utils.escapeHtml(str) + '</code></pre>';
    }

});
export default class Articles extends Component {
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
            formData: {
                containerId: '',
                activeTag: []
            },
            imgPath: '',
            channelArr: [],
            tagArr: [],
            columnsData: [
                {
                    title: '文章名称',
                    dataIndex: 'name',
                    key: 'name',
                    ellipsis: true
                },
                {
                    title: '所属栏目',
                    dataIndex: 'containerName',
                    key: 'containerName',
                    ellipsis: true

                },

                {
                    title: '发布时间',
                    dataIndex: 'releaseTime',
                    key: 'releaseTime',
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
                    key: 'aid',
                    render: (val, data, index) => {
                        return (
                            <div className="actionStyle">
                                <div title="查看" onClick={this.lookDetail.bind(this, data)} style={{ marginRight: 10 }}><EyeOutlined /></div>
                                <div title="编辑" onClick={this.editArticle.bind(this, data)} style={{ marginRight: 10 }}><EditOutlined /></div>
                                <div title="删除"><Popconfirm
                                    title="文章删除后无法恢复，您确定要删除吗？"
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
                articleName: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入文章名称')
                            } else {
                                let reg = /^[a-zA-Z0-9\u4e00-\u9fa5@\._-\s]{1,100}$/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('文章名称格式错误！')
                                }
                            }
                        }
                    }
                ],
                articlePicture: [
                    {
                        validator: (_, value) => {
                            value = value || ''
                            if (value.length <= 0) {
                                return Promise.reject('请输入文章标题图链接')
                            } else {
                                let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                                if (reg.test(value)) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('文章标题图链接格式错误！')
                                }

                            }
                        }
                    }
                ]
            },
            editContent: '',
            editContentValue: '',
        }
    }

    // 获取文章数据
    getArticle() {
        Axios({
            url: '/api/admin/article/latest/',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.aid
                item.releaseTime = Moment(item.releaseTime).format('YYYY-MM-DD HH:mm:ss')
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

    // 获取栏目数据
    getChannelData(fn) {
        Axios({
            url: '/api/admin/channel/latest/',
            params: {
                type: 'all'
            }
        }).then(res => {

            this.setState({
                channelArr: res.data,
                formData: {
                    containerId: res.data[0]['channelId'],
                    activeTag: []
                }
            }, () => {
                if (fn) {
                    fn()
                }
            })
        })
    }

    // 获取标签列表
    getTagData(fn) {
        Axios({
            url: '/api/admin/tag/get'
        }).then(res => {
            this.setState({
                tagArr: res.result
            }, () => {
                if (fn) {
                    fn()
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
                this.getArticle()
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
                this.getArticle()
            }
        })

    }

    // 提交搜索
    commitSearch() {
        Axios({
            url: '/api/admin/article/search',
            params: {
                keyword: this.state.keyWord,
                page: this.state.searchPageInfo.current,
                pageSize: this.state.searchPageInfo.pageSize
            }
        }).then(res => {
            res.data = res.data.map(item => {
                item.key = item.aid
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

    // 添加文章 
    addChannel() {
        this.getChannelData(() => {
            this.getTagData(() => {
                this.setState({
                    showAddDrawer: true,
                    editFlag: false
                })
            })

        })


    }

    // 编辑文章
    editArticle(val) {

        this.getChannelData(() => {
            this.getTagData(() => {
                Axios({
                    url: '/api/admin/article/getDetail',
                    params: {
                        aid: val.aid
                    }
                }).then(res => {
                    this.setState({
                        showAddDrawer: true,
                        editFlag: true,
                        formData: {
                            containerId: this.state.formData.containerId,
                            activeTag: res.result.activeTag
                        },
                        editContentValue: html2md(res.result.articleBody),
                        editContent: res.result.articleBody,
                        imgPath: res.result.articlePicture
                    }, () => {
                        let result = res.result

                        result.releaseTime = Moment(result.releaseTime)
                        this.state.addForm.current.setFieldsValue(
                            result
                        )
                    })
                })
            })

        })



    }

    // 删除多个文章
    removeManyChannel() {
        let { selectedRowKeys } = this.state
        if (selectedRowKeys.length <= 0) {
            message.warning('您还没有选择文章！')
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
            url: '/api/admin/article/delete',
            method: 'post',
            data: {
                ids: list
            }
        }).then(res => {
            message.success('删除成功！')
            this.setState({
                selectedRowKeys: []
            }, () => {
                this.getArticle()
            })

        })
    }

    // 删除单个
    removeItem(data) {
        let id = data.aid;
        this.commitRemoveMany({}, [id])

    }

    // 关闭添加抽屉
    closeAddDrawer() {
        this.state.addForm.current.resetFields()
        this.setState({
            showAddDrawer: false,
            imgPath: '',
            editContentValue: '',
            editContent: ''
        })
    }


    // 添加文章提交
    commitAdd() {
        this.state.addForm.current.validateFields().then(values => {
            let url = this.state.editFlag ? '/api/admin/article/update' : '/api/admin/article/add'

            let msg = this.state.editFlag ? '文章修改成功！' : '文章添加成功！'



            let props;
            let containerName = ''
            this.state.channelArr.forEach(item => {
                if (item.channelId === this.state.formData.containerId) {
                    containerName = item.channelName
                }
            })

            props = {
                activeTag: this.state.formData.activeTag,
                articleBody: this.state.editContent,
                articleName: values.articleName,
                articlePicture: values.articlePicture,
                containerName: containerName,
                containerId: this.state.formData.containerId,
                releaseTime: values.releaseTime ? values.releaseTime : new Date().getTime(),
            }
            if (values.aid) {
                props.articleId = values.aid
            }
            Axios({
                url,
                method: 'post',
                data: props
            }).then(res => {
                message.success(msg)
                this.closeAddDrawer()
                this.getArticle()
            })
        }).catch(err => {
            // 柱哥最帅
        })
    }

    // 查看详情
    lookDetail(data) {
        Axios({
            url: '/api/admin/article/getDetail/',
            params: {
                aid: data.aid
            }
        }).then(res => {
            this.setState({
                showDetail: true,
                detailInfo: res.result
            })
        })


    }

    handleEditorChange({ html, text }) {
        this.setState({
            editContent: html,
            editContentValue: text
        })
    }


    changeSelect(flag, key) {
        if (flag === 'channel') {
            this.setState({
                formData: {
                    containerId: key,
                    activeTag: this.state.formData.activeTag
                }
            })
        } else if (flag === 'tag') {
            this.setState({
                formData: {
                    containerId: this.state.formData.containerId,
                    activeTag: key
                }
            })
        }

    }

    changeImgPath(e) {
        console.log(e.target.value)
        this.setState({
            imgPath: e.target.value
        })
    }

    componentDidMount() {
        this.getArticle()
    }




    render() {
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange

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
                    title={this.state.editFlag ? "编辑文章" : "新建文章"}
                    width={600}
                    footer={footer}
                    footerStyle={{ display: 'flex', justifyContent: 'flex-end' }}
                    onClose={this.closeAddDrawer.bind(this)}
                    visible={this.state.showAddDrawer}
                >
                    <Form ref={this.state.addForm} labelCol={{ 'span': 4 }}>
                        <Form.Item name="aid" style={{ display: 'none' }}>
                            <Input type="hidden" />
                        </Form.Item>
                        <Form.Item label="文章名称" name="articleName" rules={this.state.validate.articleName}>
                            <Input allowClear maxLength="50" placeholder="请输入文章名称" />
                        </Form.Item>
                        <Form.Item label="所属栏目" name="containerName">
                            <Select allowClear defaultValue={this.state.formData.containerId} onChange={this.changeSelect.bind(this, 'channel')} value={this.state.formData.containerId} >
                                {
                                    this.state.channelArr.length <= 0 ? '' : this.state.channelArr.map(item => {
                                        return <Select.Option key={item.channelId} value={item.channelId}>{item.channelName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="标题图链接">
                            <Form.Item name="articlePicture" rules={this.state.validate.articlePicture}>
                                <Input allowClear maxLength="999" placeholder="请输入文章标题图链接" onChange={this.changeImgPath.bind(this)} />

                            </Form.Item>

                            {
                                this.state.imgPath ? <Image
                                    width={'200px'}
                                    src={this.state.imgPath}
                                    fallback="data:image/png;base64,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"
                                    alt="文章标题图"
                                /> : <Image
                                        width={'200px'}
                                        src="data:image/png;base64,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"
                                        alt="文章标题图"
                                    />
                            }
                        </Form.Item>
                        <Form.Item label="文章标签" name="activeTag">
                            <Select allowClear mode="multiple" onChange={this.changeSelect.bind(this, 'tag')} value={this.state.formData.activeTag} placeholder="请选择文章标签" notFoundContent="暂无内容">
                                {
                                    this.state.tagArr.map(item => {
                                        return <Select.Option key={item.tagId} value={item.tagId}>{item.tagName}</Select.Option>
                                    })
                                }

                            </Select>
                        </Form.Item>
                        <Form.Item label="发布时间" name="releaseTime">
                            <DatePicker showTime />
                        </Form.Item>
                        <div>
                            <MdEditor
                                style={{ height: "500px" }}
                                value={this.state.editContentValue}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange.bind(this)}
                            />
                        </div>
                    </Form>
                </Drawer>

                <Modal
                    title="文章详情"
                    wrapClassName={'articleDetail'}

                    visible={this.state.showDetail}
                    onCancel={() => { this.setState({ showDetail: false }) }}
                    footer={null}
                >
                    <div className="channelDetail custom-html-style">
                        <div dangerouslySetInnerHTML={{ __html: this.state.detailInfo.articleBody }}></div>
                    </div>
                </Modal>



                <Modal
                    title="提示"
                    visible={this.state.showRemoveConfirm}
                    onOk={this.commitRemoveMany.bind(this)}
                    onCancel={() => { this.setState({ showRemoveConfirm: false, selectedRowKeys: [] }) }}
                >
                    <p>您确定要删除这些文章吗？</p>
                </Modal>
            </div>
        )
    }
}