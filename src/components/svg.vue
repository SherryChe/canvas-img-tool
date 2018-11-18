<template>
    <div class="draw-view">
        <vue-draggable-resizable  id="drawing" :w="100" :h="100" :minw="0" :minh="0" :x="0" :y="0"  :parent="true">
            
        </vue-draggable-resizable>
        <vue-draggable-resizable  id="image" :w="100" :h="100" :minw="0" :minh="0" :x="200" :y="200"  :parent="true">
            
        </vue-draggable-resizable>
    </div>
</template>
<script>
    import SVG from 'svg.js';
    import VueDraggableResizable from 'vue-draggable-resizable';
    export default {
        data() {
            return {
                width: 0,
                height: 0,
                x: 0,
                y: 0,
                draw:null
            }
        },
        created() {
        },
        mounted() {
            var draw = SVG('drawing').size('100%', '100%');
            var rect = draw.rect('100%', '100%').attr({
                fill: '#f06'
            })
            var drawImg=SVG('image').size('100%','100%');
            var image=drawImg.image('https://cdn.img42.com/4b6f5e63ac50c95fe147052d8a4db676.jpeg','100%', '100%');

        },
        methods: {
            onResize: function(x, y, width, height) {
                // this.x = x
                // this.y = y
                // this.width = width
                // this.height = height
            },
            onDrag: function(x, y) {
                // this.x = x
                // this.y = y
            }
        }
    }
</script>
<style scoped>
    .draw-view{
        width: 500px;
        height: 500px;
        border: 1px solid red;
        position: relative;
    }
</style>