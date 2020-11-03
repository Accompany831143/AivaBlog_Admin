import React, { Component } from "react";
import { message } from 'antd'
import { Chart,Util } from '@antv/g2';
import Axios from '../../../Axios'
import { UserOutlined, PictureOutlined, TagOutlined, MessageOutlined } from "@ant-design/icons"
import http from "axios"
import "./index.css"

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
            gdKey: '91f9a6eeb51088c2e9f9283aa50ecafa',
            statistical:{},
            weatherInfo: {},
            accessData: [],
            addArticleData: [],
            articleMapData: [],
            userData:[],
            lastInfo:{}
        }
    }

    componentDidMount() {
        this.getLastInfo()
        this.getStatisticalData()
        this.getWeather()
        this.getAddArticleData(this.renderAddArticleMap.bind(this))
        this.getArticleData(this.renderArticleMap.bind(this))
        this.getUserData(this.renderUserMap.bind(this))
        this.getAccessData(this.renderAccessMap.bind(this))

    }

    // 获取统计数据
    getStatisticalData() {
        Axios({
            url: '/api/admin/home/getStatistical'
        }).then(res => {
            this.setState({
                statistical: res.data
            })
        })
    }

    // 获取上次登录数据
    getLastInfo() {
        Axios({
            url: '/api/admin/home/getLastInfo'
        }).then(res => {
            console.log(res)
            this.setState({
                lastInfo: res.data
            })
        })
    }



    // 请求天气
    getWeather() {
        new Promise((resolve, reject) => {
            http({
                url: 'https://restapi.amap.com/v3/ip',
                params: {
                    key: this.state.gdKey
                }
            }).then(res => {
                res = res.data
                resolve(res.adcode)
            }).catch(err => {
                console.log('获取位置信息失败', err)
                message.error('获取位置信息失败')
            })
        }).then(code => {
            http({
                url: 'https://restapi.amap.com/v3/weather/weatherInfo',
                params: {
                    key: this.state.gdKey,
                    city: code
                }
            }).then(res => {
                res = res.data
                if (res.status === '1') {
                    this.setState({
                        weatherInfo: res.lives[0]
                    })
                } else {
                    console.log('获取天气信息失败', res)
                    message.error('获取天气信息失败')
                }
            }).catch(err => {
                console.log('获取天气信息失败', err)
                message.error('获取天气信息失败')
            })
        })

    }

    // 请求新增文章数据
    getAddArticleData(fn) {
        Axios({
            url: '/api/admin/home/getAddArticle',
            params: {
                length: 7
            }
        }).then(res => {
            this.setState({
                addArticleData: res.data
            }, () => {
                if (fn) {
                    fn()
                }
            })
        })
    }

    // 渲染新增文章图表
    renderAddArticleMap() {

        const data = this.state.addArticleData

        const chart = new Chart({
            container: 'addArticleMap',
            autoFit: true,
            height: 260,
            padding: [50, 0, 0, 0]
        });
        chart.data(data);
        chart.scale({
            date: {
                nice: true
            },
            num: {
                alias: '新增文章数量 ',
            }
        })




        chart.interval().position('date*num');
        chart.interaction('element-active');

        // 添加文本标注
        data.forEach((item) => {
            chart
                .annotation()
                .text({
                    position: [item.date, item.num],
                    content: item.num,
                    style: {
                        textAlign: 'center',
                    },
                    offsetY: -30,
                })
        });
        chart.render();
    }


    // 渲染文章扇形图
    renderArticleMap() {

        const data = this.state.articleMapData;
        const chart = new Chart({
            container: 'articleMap',
            autoFit: true,
            height: 260,
        });
        chart.data(data);

        chart.coordinate('theta', {
            radius: 0.75
        });
        chart.tooltip({
            showMarkers: false
        });

        const interval = chart
            .interval()
            .adjust('stack')
            .position('value')
            .color('type')
            .style({ opacity: 0.4 })
            .state({
                active: {
                    style: (element) => {
                        const shape = element.shape;
                        return {
                            matrix: Util.zoom(shape, 1.1),
                        }
                    }
                }
            })
            .label('type', (val) => {
                return {
                    offset: -30,
                    style: {
                        opacity:1,
                        fill: 'white',
                        fontSize: 12,
                        shadowBlur: 2,
                        shadowColor: 'rgba(0, 0, 0, .45)',
                    },
                    content: (obj) => {
                        return obj.value + '%';
                    },
                };
            });

        chart.interaction('element-single-selected');

        chart.render();

    }

    // 获取文章扇形图数据
    getArticleData(fn) {
        Axios({
            url: '/api/admin/home/getArticle',
        }).then(res => {
            this.setState({
                articleMapData: res.data
            }, () => {
                if (fn) {
                    fn()
                }
            })
        })
    }


    // 获取用户图表数据
    getUserData(fn) {
        Axios({
            url: '/api/admin/home/getUser'
        }).then(res => {
            this.setState({
                userData: res.data
            }, () => {
                if (fn) {
                    fn()
                }
            })
        })
    }


    //渲染用户图表
    renderUserMap() {
        const data = this.state.userData;

        const chart = new Chart({
            container: 'userMap',
            autoFit: true,
            height: 300,
        });

        chart.data(data);
        chart.scale({
            date: {
                nice: true,
            },
            num: {
                nice: true
            },
        });

        chart.tooltip({
            showCrosshairs: true,
            shared: true,
            itemTpl: `<div>
                        <p>注册人数：{num}</p>
                      </div>`,
        });
        chart.option('slider', {
            end: 1
        });


        chart.area().position('date*num').tooltip('date*num', (date, num) => {
            return {
                date,
                num,
            };
        })
        chart.point().position('date*num').shape('circle');
        chart.line().position('date*num');


        chart.render();

    }

    // 获取访问量数据
    getAccessData(fn) {
        Axios({
            url: '/api/admin/home/getAccess',
            params: {
                length: 30
            }
        }).then(res => {
            this.setState({
                accessData: res.data
            }, () => {
                if (fn) {
                    fn()
                }
            })
        })
    }

    //渲染访问量图表
    renderAccessMap() {
        const data = this.state.accessData;

        const chart = new Chart({
            container: 'accessMap',
            autoFit: true,
            height: 300,
        });

        chart.data(data);
        chart.scale({
            date: {
                nice: true,
            },
            num: {
                nice: true
            },
        });

        chart.tooltip({
            showCrosshairs: true,
            shared: true,
            itemTpl: `<div>
                        <p>访问量：{num}</p>
                      </div>`,
        });
        chart.option('slider', {
            end: 0.8
        });


        chart.line().position('date*num').tooltip('date*num', (date, num) => {
            return {
                date,
                num,
            };
        }).shape('smooth');
        chart.point().position('date*num').shape('circle');


        chart.render();

    }


    render() {
        return (
            <div className="manage_home">
                <div>
                    <h2>欢迎您，{this.state.userInfo.userName}</h2>
                    <p style={{color:'#999'}}>
                        <span>上次登录IP：{this.state.lastInfo.ip}</span>
                        <span style={{marginLeft:16}}>登录时间：{this.state.lastInfo.date}</span>
                    </p>
                    <p>
                        今天
                        {this.state.weatherInfo.city}
                        &nbsp;
                        <b>{this.state.weatherInfo.weather}</b>，
                        气温
                        {this.state.weatherInfo.temperature}
                        ℃，
                        空气湿度
                        {this.state.weatherInfo.humidity}，

                        {this.state.weatherInfo.winddirection}风

                    </p>
                </div>
                <div className="home_summary">
                    <h2>数据统计</h2>
                    <ul>
                        <li>
                            <div className="summary_icon">
                                <div>
                                    <UserOutlined style={{ fontSize: 30 }} />
                                </div>

                            </div>
                            <div className="summary_info">
                                <div>用户总数</div>
                                <div>{this.state.statistical.allUser}</div>
                            </div>
                        </li>
                        <li>
                            <div className="summary_icon">
                                <div>
                                    <PictureOutlined style={{ fontSize: 30 }} />
                                </div>

                            </div>
                            <div className="summary_info">
                                <div>图片总数</div>
                                <div>{this.state.statistical.allPicture}</div>
                            </div>
                        </li>
                        <li>
                            <div className="summary_icon">
                                <div>
                                    <TagOutlined style={{ fontSize: 30 }} />
                                </div>

                            </div>
                            <div className="summary_info">
                                <div>标签总数</div>
                                <div>{this.state.statistical.allTag}</div>
                            </div>
                        </li>
                        <li>
                            <div className="summary_icon">
                                <div>
                                    <MessageOutlined style={{ fontSize: 30 }} />
                                </div>

                            </div>
                            <div className="summary_info">
                                <div>留言总数</div>
                                <div>{this.state.statistical.allMessage}</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="caMap">
                    <div>
                        <h2>近期新增文章数据</h2>
                        <div id="addArticleMap"></div>
                    </div>
                    <div>
                        <h2>文章统计</h2>
                        <div id="articleMap"></div>
                    </div>
                </div>
                <div>
                    <h2>用户数据</h2>
                    <br />
                    <div id="userMap"></div>
                </div>
                <div>
                    <h2>访问记录</h2>
                    <br />
                    <div id="accessMap"></div>
                </div>
            </div>
        )
    }
}


