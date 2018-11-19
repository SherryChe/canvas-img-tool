<template>
    <div v-cloak>
        <div class="operate-view" @click="showGrid">顶部操作按钮区域</div>
        <div class="layer-operate-view">
            <div class="color-setting" v-show="isOutsideLayer">
                <p class="color-setting-title">背景色</p>
                <colorPicker v-model="color" @change="selectColort" />
            </div>
        </div>
        <div class="draw-view">
            <div class="left-view">
                <div class="item-func" v-for="(item,index) in fastFuncList" :key="index" @click="selectFunc(index)" :class="{'selected-func':curIndex==index}">
                    <!-- <img src="" alt=""> -->
                    <p>{{item.text}}</p>
                </div>
            </div>
            <div class="middle-view" @mousewheel="mouseScroll">
                <canvas id="top-line"></canvas>
                <canvas id="left-line"></canvas>
                <div class="main-view">
                    <canvas id="main"></canvas>
                    <div>
                        <div>
                            <button @click="enlarge">放大</button>
                            <button>缩小</button>

                        </div>
                    </div>

                </div>
            </div>
            <div class="right-view">占位2</div>
        </div>
    </div>
</template>

<script>
    // import ruler from '../assets/ruler.js';
    export default {
        data: function() {
            return {
                curIndex: 0,
                color: 'red',
                fastFuncList: [{
                    icon: '',
                    text: '文本'
                }, {
                    icon: '',
                    text: '模板'
                }, {
                    icon: '',
                    text: '形状'
                }, {
                    icon: '',
                    text: '素材'
                }, {
                    icon: '',
                    text: '工具'
                }, {
                    icon: '',
                    text: '背景'
                }, {
                    icon: '',
                    text: '上传'
                }],
                mainCanvas: null, //主界面的canvas对象
                isOutsideLayer: false, //当前正在操作的是否是最外层图层(矩形图层)
                number: 1
            };
        },
        created() {
            //监听网页宽高变化，变化后重新绘制canvas
            // window.addEventListener('resize', (e) => {
            //     this.drawTopLine();
            //     this.drawLeftLine();
            //     //差内容绘制
            // })
        },
        mounted() {

            this.fixedBody();
            this.drawTopLine();
            this.drawLeftLine();
            this.mainCanvas = new fabric.Canvas('main', {
                backgroundColor: '#ececec',
                width: document.documentElement.clientWidth - 160,
                height: document.documentElement.clientHeight - 102,
                zIndex: -1
            });
            this.mainCanvas.renderAll();
            // fabric.Image.fromURL('https://image.ih-tracking.com/cat-bg.jpeg', function(oImg) {
            //     oImg.scale(0.5).set('flipX', true).set({'width':500,'height':500});
            //     var circle = new fabric.Circle({
            //         radius: 20,
            //         fill: 'green',
            //         left: 100,
            //         top: 100
            //     });
            //     canvas.add(oImg,circle);
            // });
            var rect = new fabric.Rect({
                width: 200,
                height: 300,
                fill: '#ffffff',
                selectable: false,
                type: 'rect',
            })
            rect.set({
                left: (this.mainCanvas.width - rect.width) / 2,
                top: (this.mainCanvas.height - rect.height) / 2,
            })
            this.mainCanvas.add(rect);
            var itext = new fabric.IText('这是可编辑文本，相当高级', {
                left: 100,
                top: 150,
                fill: '#D81B60',
                strokeWidth: 2,
                stroke: "#880E4F",
                type: 'text',
                cornerStyle: 'circle'
            });
            this.mainCanvas.add(itext);
            this.mainCanvas.on('mouse:down', (e) => {
                //判断是否选择了最外层
                if (e.target && e.target.type == 'rect') {
                    this.isOutsideLayer = true;
                } else {
                    this.isOutsideLayer = false;
                }
            })
        },
        methods: {
            //放大
            enlarge() {

            },
            //显示网格
            showGrid() {
                this.number++;
                let topLine, leftLine;
                let width = this.mainCanvas.width;
                let height = this.mainCanvas.height;
                if (this.number % 2 == 0) {
                    for (let i = 0; i < width; i += 5) {
                        topLine = new fabric.Line([i * 5, 0, i * 5, height], {
                            fill: '#d9d9d9',
                            stroke: '#d9d9d9',
                            strokeWidth: 1,
                            selectable: false,
                            type: 'grid',
                            zIndex: -1
                        })
                        this.mainCanvas.add(topLine);
                    }
                    for (let j = 0; j < height; j += 5) {
                        leftLine = new fabric.Line([0, j * 5, width, j * 5], {
                            fill: '#d9d9d9',
                            stroke: '#d9d9d9',
                            strokeWidth: 1,
                            selectable: false,
                            type: 'grid',
                            zIndex: -1
                        })
                        this.mainCanvas.add(leftLine);
                    }
                } else {
                    // this.mainCanvas.clear().renderAll();
                }
            },
            //选择左侧快速功能
            selectFunc(index) {
                this.curIndex = index;
            },
            //canvas对象操作
            getCanvasObj(type) {
                let array = this.mainCanvas.getObjects();
                for (let i = 0, len = array.length; i < len; i++) {
                    if (type == array[i].type) {
                        return array[i];
                    }
                }
            },
            //固定网页，禁止滑动
            fixedBody() {
                document.body.style.width = '100%';
                document.body.style.height = '100%';
                document.body.style.overflow = 'hidden';
            },
            //鼠标滑动事件
            mouseScroll(e) {
                if (e.deltaY > 0) {
                    console.log('向下');
                } else {
                    console.log('向上');
                }
            },
            //选择颜色
            selectColort() {
                this.getCanvasObj('rect').set('fill', this.color);
                this.mainCanvas.renderAll();
            },
            drawTopLine() {
                var min, middle, max, lineText;
                var canvas = new fabric.Canvas('top-line', {
                    backgroundColor: '#f8f8f8',
                    width: document.documentElement.clientWidth - 160,
                    height: 30,
                    top: 0,
                    left: 0,
                    selection: false
                });
                var line = new fabric.Line([0, 28, canvas.width, 28], {　　
                    fill: '#dedede',
                    　　stroke: '#dedede',
                    　　strokeWidth: 1,
                    selectable: false
                });
                for (let i = 0, len = canvas.width; i < len; i += 5) {
                    min = new fabric.Line([i, 28, i, 25], {
                        fill: '#dedede',
                        　　stroke: '#dedede',
                        　　strokeWidth: 1,
                    })
                    if (i % 5 == 0) {
                        middle = new fabric.Line([i * 5, 28, i * 5, 20], {
                            fill: '#dedede',
                            　　stroke: '#dedede',
                            　　strokeWidth: 1,
                        })
                    }
                    if (i % 10 == 0) {
                        max = new fabric.Line([i * 5, 28, i * 5, 0], {
                            fill: '#dedede',
                            　　stroke: '#dedede',
                            　　strokeWidth: 1,
                        })
                        lineText = new fabric.Text(String(i), {
                            left: i * 5 + 5,
                            top: 7,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 10,
                            fontWeight: 'normal'
                        });
                    }
                    canvas.add(line, min, middle, max, lineText);
                }
            },
            drawLeftLine() {
                var min, middle, max, lineText;
                var canvas = new fabric.Canvas('left-line', {
                    backgroundColor: '#f8f8f8',
                    width: 30,
                    height: document.documentElement.clientHeight - 135,
                    top: -30,
                    left: 0,
                });
                var line = new fabric.Line([28, 0, 28, canvas.height], {　　
                    fill: '#dedede',
                    　　stroke: '#dedede', //笔触颜色
                    　　strokeWidth: 1, //笔触宽度
                    selectable: false
                });
                for (let i = 0, len = canvas.height; i < len; i += 5) {
                    min = new fabric.Line([28, i, 25, i], {
                        fill: '#dedede',
                        　　stroke: '#dedede',
                        　　strokeWidth: 1,
                        selectable: false
                    })
                    if (i % 5 == 0) {
                        middle = new fabric.Line([28, i * 5, 20, i * 5, ], {
                            fill: '#dedede',
                            　　stroke: '#dedede',
                            　　strokeWidth: 1,
                            selectable: false
                        })
                    }
                    if (i % 10 == 0) {
                        max = new fabric.Line([28, i * 5, 0, i * 5, ], {
                            fill: '#dedede',
                            　　stroke: '#dedede',
                            　　strokeWidth: 1,
                            selectable: false
                        })
                        lineText = new fabric.Text(String(i), {
                            left: 7,
                            top: i * 5 + 5,
                            fill: '#dedede',
                            strokeWidth: 1,
                            stroke: "#dedede",
                            fontSize: 12,
                            fontWeight: 'normal',
                            selectable: false
                        });
                    }
                    canvas.add(line, min, middle, max, lineText);
                }
            }
        },
        destroyed() {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .operate-view {
        width: 100%;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #fff;
        background: #424242;
    }
    .layer-operate-view {
        width: 100%;
        height: 50px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #dedede;
    }
    .draw-view {
        width: 100%;
        height: calc(100vh - 102px);
        display: flex;
        position: relative;
    }
    .left-view {
        width: 60px;
        height: calc(100vh - 102px);
        position: absolute;
        left: 0;
        top: 0;
        border-right: 1px solid #e6e6e6;
    }
    .right-view {
        width: 100px;
        height: calc(100vh - 102px);
        position: absolute;
        right: 0;
        top: 0;
        background: green;
    }
    .item-func {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 18px;
        cursor: pointer;
    }
    .selected-func {
        background: #00a2eb;
    }
    .middle-view {
        width: calc(100vw - 160px);
        position: absolute;
        left: 60px;
        top: 0;
        overflow: hidden;
    }
    .main-view {
        position: absolute;
        left: 30px;
        top: 30px;
    }
    .color-setting {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .color-setting-title {
        font-size: 14px;
        font-weight: bold;
        margin-right: 10px;
    }
</style>
