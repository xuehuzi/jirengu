import _ from 'lodash';
//这是按照课堂尝试加的
import x from './test.js'
x()
console.log('fuck webpack')
import y from './test2'//不写文件后缀名也可以导入
y()
import './sass_test.scss';
//这是按照课堂尝试加的
import './style.css';
import mypic from './icon.png';

function component() {
    const element = document.createElement('div');
    element.innerHTML ='Hello webpack';
    element.classList.add('hello');
    const pic = new Image();
    pic.src = mypic;
    element.appendChild(pic);
    return element;
}
document.body.appendChild(component());