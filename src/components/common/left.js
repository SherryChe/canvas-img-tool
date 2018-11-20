/**
 * Created by chenxq on 2018/11/20.
 */



function Left (WrappedComponent) {
    return {
        props: {},
        render (h) {
            const slots = Object.keys(this.$slots)
                .reduce((arr, key) => arr.concat(this.$slots[key]), [])
                .map(vnode => {
                    vnode.context = this._self
                    return vnode
                })
            return h(WrappedComponent, {
                on: {...this.$listeners, customizeclick: this.customizeClick},
                props: {...this.$props,},
                scopedSlots: this.$scopedSlots,
                attrs: this.$attrs,
            }, slots)
        },
        methods: {
            customizeClick() {
                console.log('click');
            }
        },
        mounted(){
            console.log('params',this.$route.params);
        }


    }
}

export default Left;
