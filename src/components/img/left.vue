/**
* Created by chenxq on 2018/11/19.
*/
<template>
    <ul>
        <li v-for="item in list"
            v-bind:key="item.key"
            @click="leadingIn(item)"
        >
            <img :src="item.opts.content" style="width:60px; height: 60px;" alt="">
        </li>

    </ul>
</template>
<script>
    import Data from '../common/data';
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
                list:Data.img || [],
            }
        },
        methods: {
            leadingIn(info) {
                this.$emit('add-canvas',info.opts);
            },
        },
        mounted() {
            // console.log(Data)
        }

    }

</script>
<style lang="scss" scoped>
    ul {
        list-style: none;
        li{
            padding: 10px 0;
            text-align: center;
            img{
                margin: 0 auto;
            }
            &:hover{
                background: #e8e8e8;
            }
            cursor: pointer;
        }
    }


</style>
