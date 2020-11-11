import React, { Component } from 'react';
import { Tag, Input, Button, Modal, Form, message } from 'antd'
import Axios from '../../../Axios';
import "./index.css"
export default class TagComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tagList: [],
            showAdd: false,
            addForm:React.createRef(),
            formData: {}
        }
    }

    componentDidMount() {
        this.getTags()
    }

    // 获取标签
    getTags() {
        Axios({
            url: '/api/admin/tag/get'
        }).then(res => {
            this.setState({
                tagList: res.result
            })
        })
    }

    // 表单更新
    changeForm(val, allVal) {
        this.setState({
            formData: allVal
        })
    }

    // 添加标签
    commitAdd() {
        if (!this.state.formData.tagName) {
            message.warn('请输入标签名称')
            return
        } else {
            let obj = { tagName: this.state.formData.tagName }
            obj.tagColor = this.state.formData.tagColor ? this.state.formData.tagColor : '#fafafa'
            obj.tagFontColor = this.state.formData.tagFontColor ? this.state.formData.tagFontColor : '#424242'
            this.setState({
                formData: obj

            }, () => {
                Axios({
                    url: '/api/admin/tag/add',
                    method: 'post',
                    data: this.state.formData
                }).then(res => {
                    message.success('添加标签成功！')
                    this.closeForm()
                    this.getTags()
                })
            })

        }
    }

    // 删除标签
    deleteTag(id) {
        Axios({
            url:'/api/admin/tag/delete',
            method:'post',
            data:{
                id
            }
        }).then(res => {
            message.info('删除标签成功！')
            this.getTags()
        })
    }

    // 关闭添加标签弹窗
    closeForm() {
        this.state.addForm.current.resetFields()
        this.setState({
            showAdd: false,
            formData: {}
        })
    }


    render() {
        return (
            <div className="tagManage">
                <div className="tag_header">
                    <Button type="primary" onClick={() => { this.setState({ showAdd: true }) }}>添加标签</Button>
                </div>
                <div className="tagBox">
                    {
                        this.state.tagList.map(item => {
                            return (
                                <Tag closable color={item.tagColor} onClose={this.deleteTag.bind(this,item.tagId)} style={{ color: item.tagFontColor,display:'inline-block' }}>{item.tagName}</Tag>
                            )
                        })
                    }
                </div>

                <Modal
                    title="添加标签"
                    visible={this.state.showAdd}
                    onCancel={this.closeForm.bind(this)}
                    onOk={this.commitAdd.bind(this)}
                // footer={null}
                >
                    <Form ref={this.state.addForm} onValuesChange={this.changeForm.bind(this)}>
                        <Form.Item label="标签名称" name="tagName">
                            <Input allowClear maxLength="50" placeholder="请输入标签名称" />
                        </Form.Item>
                        <Form.Item label="标签颜色" name="tagColor">
                            <Input style={{ width: 100 }} allowClear type="color" placeholder="请输入标签颜色" />
                        </Form.Item>
                        <Form.Item label="文字颜色" name="tagFontColor">
                            <Input style={{ width: 100 }} allowClear type="color" placeholder="请输入文字颜色" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}