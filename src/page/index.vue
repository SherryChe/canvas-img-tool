<template>
    <div v-cloak class="container" @click="commonClick">
        <div class="header">
            <p class="page-set" v-if="selectTopType===''">
                <span>页宽</span>
                <input type="text" v-model="width">
                <span>px</span>
                <span style="margin-left: 30px;">页高</span>
                <input type="text" v-model="height">
                <span>px</span>
            </p>
            <p v-else>
                <button @click="deleteCanvas">复制</button>
                <button @click="deleteCanvas">删除</button>
            </p>
        </div>
        <div class="wrapper">
            <div class="left-bar">
                <div v-for="item in list"
                     v-bind:key="item.type"
                     class="icon"
                     @click.stop="showDetail(item)"
                >
                    <img :src="item.icon" alt="">
                    <span>{{item.text}}</span>
                </div>
            </div>
            <div class="main">
                <canvas class="top-ruler" id="top-ruler"></canvas>
                <div class="main-canvas">
                    <canvas class="left-ruler" id="left-ruler"></canvas>
                    <div class="tool-main" id="main">
                        <canvas id="main-canvas"></canvas>
                    </div>
                </div>


            </div>
            <div class="right-bar"></div>
            <div :class="['tab-content', leftVisible && 'show']" >
                <word-left v-if="selectLeftType === 'text' " :canvas="mainCanvas" :width="width" :height="height" @add-canvas="addCanvas"></word-left>
                <img-left v-if="selectLeftType === 'img' " :canvas="mainCanvas" :width="width" :height="height" @add-canvas="addCanvas" ></img-left>
            </div>
        </div>

    </div>

</template>

<script>
    import WordLeft from '../components/word/left.vue';
    import ImgLeft from '../components/img/left.vue';
    import uuid from '../util/uuid';
    export default {
        data(){
            return {
                width: 900,
                height: 500,
                ratio: 1, // 缩放比例
                leftVisible: false,
                mainCanvas: {},
                selectLeftType: '', //左侧选中
                selectTopType: '', // 顶部bar选中
                list: [{
                    icon: '',
                    text: '文字',
                    type: 'text',
                }, {
                    icon: '',
                    text: '模板',
                    type: 'model',
                },{
                    icon: '',
                    text: '形状',
                    type: 'shape',
                },{
                    icon: '',
                    text: '素材',
                    type: 'img',
                },{
                    icon: '',
                    text: '背景',
                    type: 'background',
                },{
                    icon: '',
                    text: '上传',
                    type: 'upload',
                }]
            }
        },
        components:{
            WordLeft,
            ImgLeft,
        },
        methods: {
            getOrigin() {
                let top_w = document.getElementsByClassName("top-ruler")[0].offsetWidth;
                let left_h = document.getElementsByClassName("left-ruler")[0].offsetHeight;
                let {width, height} = this;
                let x = Math.ceil((top_w - width) / 2 );
                let y = Math.ceil((left_h - height) / 2);
                return {
                    width: top_w,
                    height: left_h,
                    x,
                    y,
                }
            },
            ruler() {
                let {x, y, width, height} = this.getOrigin();
                let {ratio} = this;
                let maxWidth = this.maxWidth;
                let maxHeight = this.maxHeight;
                var topCanvas = new fabric.Canvas('top-ruler', {
                    backgroundColor: '#f8f8f8',
                    width,
                    height: 18,
                    top: 0,
                    left: 0,
                    selection: false
                });
                var leftCanvas = new fabric.Canvas('left-ruler', {
                    backgroundColor: '#f8f8f8',
                    width: 18,
                    height,
                    top: 0,
                    left: 0,
                    selection: false
                })
                for (let i = -maxWidth; i <= maxWidth; i++ ) {
                    if (i % 100 === 0) {
                        let line = new fabric.Line([i + x, 18, i + x, 0], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        let text = new fabric.Text(String(i * ratio), {
                            left: i + x + 2,
                            top: 5,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 8,
                            selectable: false
                        });
                        topCanvas.add(line, text);

                    } else if (i % 50 ===0 ) {
                        let line = new fabric.Line([i + x, 18, i + x, 10], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        topCanvas.add(line);
                    } else if(i % 5 === 0) {
                        let line = new fabric.Line([i + x, 18, i + x, 16], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        topCanvas.add(line);
                    }

                }
                for (let j = -maxHeight; j <= maxHeight ; j++) {
                    if (j % 100 === 0) {
                        let line = new fabric.Line([0, j + y, 18, j + y], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        let text = new fabric.Text(String(j * ratio), {
                            top: j + y + 8,
                            left: 12,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 8,
                            selectable: false,
                            angle: 90,
                        });
                        leftCanvas.add(line, text);

                    } else if (j % 50 ===0 ) {
                        let line = new fabric.Line([10 , j + y, 18, j + y], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        leftCanvas.add(line);
                    } else if(j % 5 === 0) {
                        let line = new fabric.Line([16, j + y, 18, j + y], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        leftCanvas.add(line);
                    }
                }
                topCanvas.renderAll();
                leftCanvas.renderAll();
            },
            showMain() {
                let {x, y, width, height,} = this.getOrigin();
                var rect = new fabric.Rect({
                    width: this.width,
                    height: this.height,
                    fill: '#fff',
                    selectable: false,
                    type: 'rect',
                    top: y,
                    left: x - 18,
                })
                this.mainCanvas = new fabric.Canvas('main-canvas', {
                    backgroundColor: '#ececec',
                    width: width-18,
                    height: height-18,
                    zIndex: 33,
                    top: - (this.maxHeight / 2),
                    left: -(this.maxWidth / 2)
                });
                this.mainCanvas.add(rect);
                this.mainCanvas.on({
                    'mouse:down': this.changeTopbar,
                });
                this.mainCanvas.renderAll();

            },
            changeTopbar(e) {
                if(e && e.target && e.target.type && e.target.selectable) { // 并且处于解锁状态
                    this.selectTopType = e.target.type;
                } else {
                    this.selectTopType = '';  // 空白处
                }
            },
            showDetail(info) {
                this.leftVisible = true;
                this.selectLeftType = info.type;
            },
            commonClick() {
                this.leftVisible = false;
            },
            addCanvas({func, type,width=0, height=0,...opts}) {
                let top_w = document.getElementsByClassName("top-ruler")[0].offsetWidth;
                let left_h = document.getElementsByClassName("left-ruler")[0].offsetHeight;
                let top =  Math.ceil((left_h - height) / 2);
                let left = Math.ceil((top_w - width) / 2);
                opts.top = top;
                opts.left = left;
                opts.selectable = true;
                if (type === 'text') {
                    let itext = new func(opts.content, opts);
                    this.mainCanvas.add(itext);
                }
                if (type === 'img') {
                    new func(opts.content, oImg => {
                        oImg.set(opts);
                        this.mainCanvas.add(oImg);
                    })
                }


                this.mainCanvas.renderAll();
            },
            deleteCanvas() {
                this.mainCanvas.remove(this.mainCanvas.getActiveObject());
            }

        },
        mounted() {
            this.ruler();
            this.showMain();
        },
        watch:{

        },
        computed:{
            maxHeight() {
                return Math.ceil (10000 / this.ratio);
            },
            maxWidth() {
                return Math.ceil (10000 / this.ratio);
            }
        }

    }

</script>


<style scoped lang="scss">
    .container{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #fff;
        display: flex;
        flex-direction: column;

    }

    .header {
        width: 100%;
        height: 50px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e5e5e5;

    }

    .wrapper {
        flex: 1;
        display: flex;
        position: relative;

    }

    .left-bar {
        width: 60px;
        z-index: 99;
        background: #fff;
    }

    .tab-content{
        background-color: #f8f8f8;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
        position: absolute;
        width: 310px;
        height: 100%;
        left: -320px;
        top: 0;
        transition: .3s;
        z-index: 1;
        &.show{
            left: 60px;
        }
    }
    .icon{
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 2;
        cursor: pointer;

    }

    .main {
        flex: 1;
        background: #e8e8e8;
        display: flex;
        flex-direction: column;
    }

    .right-bar{
        width: 100px;

    }

    .top-ruler {
        border-left: 1px solid #e5e5e5;
        height: 18px;
        background: #f8f8f8;
    }
    .main-canvas {
        display: flex;
        flex: 1;
    }
    .left-ruler {
        border-top: 1px solid #e5e5e5;
        width: 18px;
        background: #f8f8f8;
    }
    .page-set {
        display: flex;
        align-items: center;
        justify-content: center;
        flex:1;
        span {
            font-size: 12px;
            margin-right: 4px;
        }
        input{
            width: 28px;
            padding: 3px 5px;
            border:1px solid #dbdbdb;
            margin-right: 4px;

        }
    }

</style>
