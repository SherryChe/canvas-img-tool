<template>
    <ul>
        <li v-for="item in list"
            v-bind:key="item.key"
            @click="leadingIn(item)"
        >{{item.title}}</li>

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
                list:Data.text || [],
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
            &:hover{
                background: #e8e8e8;
            }
            cursor: pointer;
        }
    }


</style>
