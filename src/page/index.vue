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
                <button @click="copyCanvas">复制</button>
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
            <div class="footer">
                <div v-for="one in footer" :title="one.text" @click="handleFooter(one)">
                    <img :src="one.icon" alt="">
                </div>
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
                }],
                footer: [{icon: require('../assets/fd.png'), text: '放大', func: this.changeZoom.bind(this,1)},
                    {icon: require('../assets/sx.png'), text: '缩小', func: this.changeZoom.bind(this,2)},
                    {icon: require('../assets/zs.png'), text: '抓手', },
                    {icon: require('../assets/allsrceen.png'), text: '满屏'},
                    {icon: require('../assets/yby.png'), text: '1:1', func: this.setZoom.bind(this,1)},]
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
                let {width, height} = this.getOrigin();
                let {ratio} = this;
                let objs=this.mainCanvas.getObjects();
                let w = objs[0].width * ratio;
                let h =objs[0].height * ratio;
                let {top, left} = this.mainCanvas.getCenter(); // 中心
                let x = Math.ceil(left - w / 2);
                let y =Math.ceil(top - h / 2);
                var topCanvas = new fabric.Canvas('top-ruler', {
                    backgroundColor: '#f8f8f8',
                    width: width,
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
                });
                topCanvas.clear();
                leftCanvas.clear();
                for (let i = 0; i <= width; i++ ) {
                    if ((i-x) % 100 === 0) {
                        let line = new fabric.Line([i , 18, i , 0], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        let text = new fabric.Text(String(Math.ceil((i-x) * ratio)), {
                            left: i + 2,
                            top: 5,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 8,
                            selectable: false
                        });
                        topCanvas.add(line, text);

                    } else if ((i-x) % 50 ===0 ) {
                        let line = new fabric.Line([i , 18, i , 10], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        topCanvas.add(line);
                    } else if((i-x) % 5 === 0) {
                        let line = new fabric.Line([i, 18, i, 16], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        topCanvas.add(line);
                    }

                }
                for (let j = 0; j <= height ; j++) {
                    if ((j-y) % 100 === 0) {
                        let line = new fabric.Line([0, j, 18, j], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        let text = new fabric.Text(String(Math.ceil((j-y) * ratio)), {
                            top: j + 8,
                            left: 12,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 8,
                            selectable: false,
                            angle: 90,
                        });
                        leftCanvas.add(line, text);

                    } else if ((j -y) % 50 ===0 ) {
                        let line = new fabric.Line([10 , j , 18, j ], {
                            fill: '#dedede',
                            stroke: '#dedede',
                            strokeWidth: 1,
                        })
                        leftCanvas.add(line);
                    } else if((j-y) % 5 === 0) {
                        let line = new fabric.Line([16, j , 18, j], {
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
                    backgroundColor: 'red',
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
                this.mainCanvas.on('mouse:wheel', (opt)=>{
                    var delta = opt.e.deltaY;
                    var zoom = this.mainCanvas.getZoom();
                    zoom = zoom + delta/500;
                    if (zoom > 5) zoom = 5;
                    if (zoom < 0.01) zoom = 0.01;
                    this.setZoom(zoom);
                    opt.e.preventDefault();
                    opt.e.stopPropagation();
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
                    this.setActive(itext);
                }
                if (type === 'img') {
                    new func(opts.content, oImg => {
                        oImg.set(opts);
                        this.mainCanvas.add(oImg);
                        this.setActive(oImg);
                    })
                }
                this.mainCanvas.renderAll();
            },
            copyCanvas() {
                let _this=this;
                this.mainCanvas.getActiveObject().clone(function(cloned){
                    _this.paste(cloned);
                })
            },
            paste(_clipboard){
                let canvas = this.mainCanvas;
                _clipboard.clone(function(clonedObj) {
                    canvas.discardActiveObject();
                    clonedObj.set({
                        left: clonedObj.left + 20,
                        top: clonedObj.top + 20,
                        evented: true,
                    });
                    if (clonedObj.type === 'activeSelection') {
                        // active selection needs a reference to the canvas.
                        clonedObj.canvas = canvas;
                        clonedObj.forEachObject(function(obj) {
                            canvas.add(obj);
                        });
                        // this should solve the unselectability
                        clonedObj.setCoords();
                    } else {
                        canvas.add(clonedObj);
                    }
                    _clipboard.top += 20;
                    _clipboard.left += 20;
                    canvas.setActiveObject(clonedObj);
                });
            },
            setActive(activeObj) { // 默认选中某一个 active
                this.selectTopType = activeObj.type;
                this.mainCanvas.discardActiveObject();
                this.mainCanvas.setActiveObject(activeObj);
            },
            deleteCanvas() {
                this.mainCanvas.remove(this.mainCanvas.getActiveObject());
                this.selectTopType = '';  // 空白处
            },
            handleFooter(info) {
                info.func && info.func.apply(null);
            },
            changeZoom(type) { // 1 放大  2 缩小
                let zoom = this.mainCanvas.getZoom();
                if (type === 1 && zoom<= 5) {
                    zoom = zoom + 0.11;
                }
                if(type ===2 && zoom > 0.01){
                    zoom = zoom - 0.11;
                }
                this.setZoom(zoom);
            },
            setZoom(zoom) {
                this.ratio= zoom;
                var zoomPoint = new fabric.Point(this.mainCanvas.width / 2 , this.mainCanvas.height / 2);
                //开始缩放  居中缩放
                this.mainCanvas.zoomToPoint(zoomPoint, zoom);
                this.ruler();
            }

        },
        mounted() {
            this.showMain();
            this.ruler();
        },
        watch:{

        },
        computed:{
            maxHeight() {
                return Math.ceil (10000 / this.ratio);
            },
            maxWidth() {
                return Math.ceil (10000 / this.ratio);
            },
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
        border-left: 1px solid #e5e5e5;

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
    .footer{
        position: fixed;
        display: flex;
        left: 50%;
        width: 250px;
        height: 35px;
        line-height: 35px;
        bottom: 15px;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        background-color: #fff;
        box-shadow: 0 0 5px rgba(0,0,0,.15);
        z-index: 20;
        >div{
            flex: 1;
            border-right: 1px solid #f1f1f1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover{
                background: #e8e8e8;
            }
            &:last-child{
                border-right: none;
            }
            img{
                width: 20px;
                height: 20px;
            }
        }
    }

</style>
