import React, { Component } from 'react';
import { Button, Card, Modal, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import "./index.css"
import Axios from '../../../Axios';
import Moment from "moment"
const { Meta } = Card;
const baseUrl = require('../../../Axios/envConst')
const pageSize = 8;

export default class Picture extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAdd: false,
            previewImage: '',
            previewVisible: false,
            previewTitle: '',
            pictureList: [],
            imgBox: React.createRef(),
            pageInfo: {
                current: 1,
                pageSize: pageSize,
                total: 0
            },
            lock: false
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async openPreview(file) {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    }


    // 获取图片
    getPicture() {
        console.log('--', this.state.pictureList.length, this.state.pageInfo)
        console.log('---', this.state.pictureList.length, this.state.pageInfo.total)
        if ((this.state.pictureList.length !== 0) && (this.state.pictureList.length >= this.state.pageInfo.total)) {
            message.info('没有更多了！')
            return
        }
        Axios({
            url: '/api/admin/picture/latest',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
            }
        }).then(res => {
            res.result = res.result.map(item => {
                item.uploadTime = Moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            let arr = this.state.pictureList.concat(res.result)
            this.setState({
                pictureList: arr,
                pageInfo: {
                    total: res.pageInfo.total,
                    current: res.pageInfo.current,
                    pageSize: pageSize
                },
                lock: false
            })

        })
    }

    // 滚动
    scrollHandler() {

        let _this = this

        document.querySelector('#onlyScroll').addEventListener('scroll', (e) => {
            if (_this.state.lock) {
                return false
            }
            let h = e.target.scrollHeight
            let mt = e.target.scrollTop
            let sb = h - (mt + e.target.offsetHeight)
            let max = 30
            if (sb <= max) {
                this.setState({
                    pageInfo: {
                        current: this.state.pageInfo.current + 1
                    },
                    lock: true
                }, () => {
                    _this.getPicture()

                })
            }
        })
    }

    componentDidMount() {
        this.getPicture()
        this.scrollHandler()
    }

    render() {
        const { previewVisible, previewImage, previewTitle } = this.state;
        return (
            <div className="pictureManage">
                <div className="picture_headr">
                    <Button type="primary" onClick={() => { this.setState({ showAdd: true }) }}>上传图片</Button>
                </div>
                <div className="picture_box" ref={this.state.imgBox}>

                    {
                        this.state.pictureList.map(item => {
                            return (
                                <Card
                                    key={item.uid}
                                    hoverable
                                    className="cardItem"
                                    cover={<img alt="example" src={item.path} />}
                                >
                                    <Meta title={<p className="ellipsis" title={item.path}>{item.path}</p>} description={'上传于 ' + item.uploadTime} />
                                </Card>
                            )
                        }, this)

                    }


                </div>

                <Modal
                    title="上传图片"
                    visible={this.state.showAdd}
                    onCancel={() => { this.setState({ showAdd: false }) }}
                    onOk={() => { this.setState({ showAdd: false }) }}
                >
                    <Upload
                        accept=".jpg,.png,.jpeg,.gif,.bmp,.webp"
                        multiple
                        listType="picture-card"
                        onPreview={this.openPreview.bind(this)}
                        action={baseUrl + 'api/admin/picture/upload'}
                        withCredentials
                        name="customImg"
                        headers={{
                            Authorization: JSON.parse(sessionStorage.getItem('loginInfo')).token
                        }}
                    >
                        {/* <Button icon={<UploadOutlined />}>点击上传图片</Button> */}
                        <div>
                            <div><UploadOutlined /></div>
                            <p style={{ fontSize: 12 }}>上传图片</p>
                        </div>

                    </Upload>,
                </Modal>

                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => { this.setState({ previewVisible: false }) }}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}