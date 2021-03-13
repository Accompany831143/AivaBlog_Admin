import React, { Component } from 'react';
import { Button, Card, Modal, Upload, message, Image, Spin } from 'antd'
import {
    UploadOutlined,
    DownloadOutlined,
    DeleteOutlined,
    CopyOutlined
} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import LazyImage from "../../../components/LazyImg"

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
            if (res.result.length <= 0) {
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
            // this.setState({}, () => {
            //     message.info('删除成功！')
            //     this.getPicture(true)
            // })
            let arr = JSON.parse(JSON.stringify(this.state.pictureList))
            let index = arr.map(item => {
                return item.uid
            }).indexOf(uid)
            if(index >= 0 ) {
                arr.splice(index, 1)
            }
            this.setState({
                pictureList: arr
            }, () => {
                message.success('删除成功！')
            })


        })
    }

    handleInfiniteOnLoad() {
        this.getPicture()
    }


    changeStatus() {
        this.setState({
            showAdd: false
        }, () => {
            this.render()
        })
    }

    copyPath(path) {

        let inp = document.createElement('input')
        inp.setAttribute('value', path)
        inp.setAttribute('readonly', 'readonly')
        document.body.appendChild(inp)
        inp.select()

        if (document.execCommand('Copy')) {
            document.execCommand('Copy')
            message.success('复制成功！')

        } else {
            message.warn('您的浏览器不支持复制功能！')
        }
        document.body.removeChild(inp)
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
                                        cover={<LazyImage
                                            width={'100%'}
                                            src={item.path}
                                        />}
                                        // cover={<img alt="example" src={item.path} />}
                                        actions={[
                                            <CopyOutlined onClick={this.copyPath.bind(this, item.path)} />,

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