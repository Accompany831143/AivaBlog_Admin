import React, { Component } from 'react';
import { Button, Card, Modal, Upload, message, Image, Spin } from 'antd'
import {
    UploadOutlined,
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import "./index.css"
import Axios from '../../../Axios';
import Moment from "moment"
const { Meta } = Card;
const baseUrl = require('../../../Axios/envConst')

export default class Picture extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showAdd: false,
            previewImage: '',
            previewVisible: false,
            previewTitle: '',
            loading: false,
            hasMore: true,
            pictureList: [],
            imgBox: React.createRef(),
            pageInfo: {
                current: 1,
                pageSize: 8,
                total: 0
            },
            lock: false,
            downLoadLink: React.createRef(),
            downLoadPath: '',
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
    getPicture(flag) {
        this.setState({
            loading: true,
        });
        if (!(flag === true)) {
            if ((this.state.pictureList.length !== 0) && (this.state.pictureList.length >= this.state.pageInfo.total)) {
                message.info('没有图片了！')
                this.setState({
                    hasMore: false,
                    loading: false,
                });
                return
            }
        }

        Axios({
            url: '/api/admin/picture/latest',
            params: {
                page: this.state.pageInfo.current,
                pageSize: this.state.pageInfo.pageSize
            }
        }).then(res => {
            if(res.result.length <= 0) {
                message.info('暂无数据！')
                this.setState({
                    hasMore: false,
                    loading: false,
                });
                return
            }
            res.result = res.result.map(item => {
                item.uploadTime = Moment(item.uploadTime).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            
            let arr = flag ? res.result : this.state.pictureList.concat(res.result)
            this.setState({
                pictureList: arr,
                pageInfo: {
                    total: res.pageInfo.total,
                    current: res.pageInfo.current + 1,
                    pageSize: this.state.pageInfo.pageSize
                },
                lock: false,
                loading: false
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
                        current: this.state.pageInfo.current + 1,
                        total: this.state.pageInfo.total,
                        pageSize: this.state.pageInfo.pageSize,
                    },
                    lock: true
                }, () => {
                    _this.getPicture()

                })
            }
        })
    }

    // 下载图片
    downLoadImg(path) {
        this.setState({
            downLoadPath: path
        }, () => {
            this.state.downLoadLink.current.click()
        })
    }

    // 删除图片
    deleteImg(uid) {
        Axios({
            url: '/api/admin/picture/deletePicture',
            method: 'post',
            data: {
                uid
            }
        }).then(res => {
            this.setState({
                pageInfo: {
                    current: 1,
                    pageSize: 8,
                    total: 0
                }
            }, () => {
                message.info('删除成功！')
                this.getPicture(true)
            })

        })
    }

    handleInfiniteOnLoad() {
        this.getPicture()
    }

    
    changeStatus() {
        this.setState({
            pageInfo: {
                current: 1,
                pageSize: 8,
                total: 0
            },
            showAdd: false
        }, () => {
            this.getPicture(true)
        })
    }

    componentDidMount() {
        // this.getPicture()
        // this.scrollHandler()
    }

    render() {
        const { previewVisible, previewImage, previewTitle } = this.state;
        return (
            <div className="pictureManage">
                <div className="picture_headr">
                    <Button type="primary" onClick={() => { this.setState({ showAdd: true }) }}>上传图片</Button>
                </div>
                <div className="picture_box" ref={this.state.imgBox}>
                    <InfiniteScroll
                        initialLoad={true}
                        className="cardWapper"
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad.bind(this)}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                    >

                        {
                            this.state.pictureList.length > 0 ? this.state.pictureList.map(item => {
                                return (

                                    <Card
                                        key={item.uid}
                                        hoverable
                                        className="cardItem"
                                        cover={<Image
                                            width={'100%'}
                                            fallback="data:image/png;base64,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"
                                            src={item.path}
                                        />}
                                        // cover={<img alt="example" src={item.path} />}
                                        actions={[
                                            <DownloadOutlined onClick={this.downLoadImg.bind(this, item.path)} />,
                                            <DeleteOutlined onClick={this.deleteImg.bind(this, item.uid)} />,
                                        ]}
                                    >
                                        <Meta title={'上传于 ' + item.uploadTime} description={<p className="ellipsis" title={item.path}>{item.path}</p>} />
                                    </Card>
                                )

                            }, this) : <div className="emptyText">暂无数据</div>
                        }

                            {this.state.loading && this.state.hasMore ? <div className="demo-loading-container">
                                <Spin tip="疯狂加载中" />
                            </div> : ''}
                            
                        




                    </InfiniteScroll>

                </div>

                <Modal
                    title="上传图片"
                    visible={this.state.showAdd}
                    onCancel={this.changeStatus.bind(this)}
                    onOk={this.changeStatus.bind(this)}
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

                <a ref={this.state.downLoadLink} href={this.state.downLoadPath} target="_blank" style={{ display: 'none' }}></a>
            </div>
        )
    }
}