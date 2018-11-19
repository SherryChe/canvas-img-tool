/**
 * Created by chenxq on 2018/11/19.
 */
import uuid from '../../util/uuid';
const defaultData={
    text: {
        content: '双击编辑文本',
        fill: '#333',
        type: 'text',
    }
}

const Data={
    text: [
        {
            title: '添加标题文字',
            type: 'text',
            key: 'title',
            opts: Object.assign({}, defaultData.text, {
                width: 300,
                height: 60,
                fontSize: 50,
                fontWeight: 800,
                func: fabric.IText
            })
        },
        {
            title: '添加副标题文字',
            key: 'subtitle',
            type: 'text',
            opts: Object.assign({},defaultData.text, {
                width: 200,
                height: 40,
                fontSize: 32,
                func: fabric.IText
            })
        },
        {
            title: '内容文本',
            key: 'content',
            type: 'text',
            opts: Object.assign({},defaultData.text, {
                width: 90,
                height: 20,
                fontSize: 14,
                func: fabric.IText
            })
        }
    ],
    img: [{
        title: '图一',
        key: uuid(),
        type: 'img',
        opts: Object.assign({},{
            type: 'img',
            width: 61,
            height: 74,
            content: require('../../assets/level-0.png'),
            func: fabric.Image.fromURL
        })
    },{
        title: '图二',
        key: uuid(),
        type: 'img',
        opts: Object.assign({},{
            type: 'img',
            width: 61,
            height: 74,
            content: require('../../assets/level-1.png'),
            func: fabric.Image.fromURL
        })
    }],
    shape: [],
    canvas: [],
}




export default Data;
