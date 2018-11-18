<template>
    <ul>
        <li v-for="item in list"
            v-bind:key="item.type"
            @click="leadingIn(item)"
        >{{item.text}}</li>

    </ul>

</template>

<script>
    export default {
        props:{
            canvas: {},
            width:{
                default: 900,
            },
            height:{
                default: 500,
            }
        },
        data(){
            return {
                list: [
                    {text: '添加标题文字', type: 'title'},
                    {text: '添加副标题', type: 'subTitle'},
                    {text: '添加正文', type: 'text'}
                ]
            }
        },
        methods: {
            leadingIn(info) {
                let obj;
                switch (info.type) {
                    case 'title': obj= {
                        width: 100,
                        height: 150,
                        fontSize: 50,
                        fontWeight: 800
                    };break;
                    case 'subTitle': obj={fontSize: 32 }; break;
                    case 'text': obj={fontSize: 14 }; break;
                    default: console.warn('暂无此type')
                }
                this.addCanvas(obj);

            },
            addCanvas(params) {
                let defaultText = {
                    width:100,
                    height: 60,
                    fill: '#333',
                    type: 'text',
                    fontSize: 14,
                }
                let opts= Object.assign({}, defaultText, params);
                opts.top = Math.ceil((this.height - opts.height)/2);
                opts.left = Math.ceil((this.width - opts.width)/2);
                let itext = new fabric.IText('双击编辑文本', opts);
                this.canvas.add(itext);
                this.canvas.renderAll();
            }


        },

    }

</script>


<style lang="scss" scoped>
    ul {
        list-style: none;
        li{
            padding: 10px 0;
            text-align: center;
            &:hover{
                background: #e8e8e8;
            }
            cursor: pointer;
        }
    }


</style>
