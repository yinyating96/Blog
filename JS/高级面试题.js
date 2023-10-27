/**
 * https://cloud.tencent.com/developer/article/1503476 Chrome - JavaScript调试技巧总结（浏览器调试JS）
 * https://zhuanlan.zhihu.com/p/24770877    用 Chrome 调试你的 JavaScript
 * https://juejin.cn/post/6844903651509534728 运行 JavaScript 代码的三种方式    note:这里选择方式1-HTML文件
 * 
 * note: 本地项目没有配置这个git的ssh拉取方式
 * 配置并验证多个ssh 同一个     github两个账号，不同的git仓库比如还有gitee/gitlab/gerrit
 * https://www.cnblogs.com/amberdyy/p/10944291.html 
https://blog.csdn.net/qq_27361727/article/details/105935741
https://segmentfault.com/a/1190000018423168

 */

// 1.在JavaScript中，0.1+0.2=0.3吗？请阐述原因并给出解决方案

// 方案一
parseFloat((0.1 +0.2).toFixed(10))

// 方案一
function accAdd(arg1, arg2){
    var v1, v2, m;
    try {
        r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }

    m = Math.pow(10, Math.max(r1, r2));

    return (parseInt(arg1*m, 10) + parseInt(arg2*m, 10)) / m;
}
/**
 * 一句话概括：把参数扩大10^n倍后都变为整数， 然后相加减后再缩小10^n倍。
 */


// 2.详细说明Event Loop

// 2.1 输出下面在浏览器中的日志顺序
console.log('script start');
window.setTimeout(function(){
    console.log('setTimeout');
},0);
console.log('script end');
// script start -> script end ->  setTimeout

// 2.2 输出下面在浏览器中的日志顺序
console.log('script start');
window.setTimeout(function(){
    console.log('setTimeout')
},0)
new Promise((resolve)=>{
    console.log('Promise')
    resolve()
}).then(function(){
    console.log('promise1');
}).then(function(){
    console.log('promise2');
});
console.log('script end');
// script start => Promise => script end => promise1 => promise2 => setTimeout

// // 2.3 输出下面在Node.js中的日志顺序
// setTimeout(()=>{
//     console.log('setTimeout');
// },0);
// setImmediate(()=>{
//     console.log('setImmediate');
// })
/**
 * 这里可能会输出setTimeout,setImmediate,可能也会相反的输出，
 * 这取决于性能,因为可能进入 event loop 用了不到1毫秒，
 * 这时候会执行setImmediate,否则会执行setTimeout.
 */

// // 2.4 输出下面在Node.js中的日志顺序
// var fs = require('fs');
// fs.readFile(_filename,()=>{
//     setTimeout(()=> {
//         console.log('timeout');
//     },0);
//     setImmediate(()=>{
//         console.log('immediate');
//     });
// });
/**
 * 因为readFile的回调在poll中执行
 * 发现有setImmediate,所以会立即跳到check阶段执行回调
 * 再去timer阶段执行setTimeout
 * 所以以上输出一定是 immediate, timeout
 */

// // 2.5 输出下面在Node.js中的日志顺序
// window.setTimeout(()=>{
//     console.log("timer1");
//     Promise.resolve().then(function(){
//         console.log("promise1");
//     });
// },0);
// process.nextTick(()=>{
//     console.log("nextTick");
// });
// nextTick,timer1,promise

// 2.6 输出下面在浏览器中和Node.js中的日志顺序
window.setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function(){
        console.log('promise1')
    })
},0)
window.setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function(){
        console.log('promise2')
    })
},0)
/**
 * 以上代码在浏览器和node中打印情况是不同的
 * 浏览器中打印 timer1,promise1,timer2,promise2
 * node中打印 timer1,timer2,promise1,promise2
 */

// 6.最不起眼的循环打印题

// 下列代码打印出什么？
for (var i=0; i<10; i++){
    setTimeout(function(){
        console.log(i);
    },1000);
}
// 10个10

// 如何打印出0～9？

// 方案一 闭包
for (var i=0; i<10; i++){
    (function(i){
        setTimeout(function(){
            console.log(i, '6-1 闭包');
        });
    })(i)
}

// 方案二 让每次循环的代码块都能正常的拿到i值即可
var output = function(i){
    setTimeout(function(){
        console.log(i, '6-2 让每次循环的代码块都能正常的拿到i值');
    },1000);
}
for (var i=0; i<10; i++){
    output(i);
}

// 方案三 ES6的let
for (let i=0; i<10; i++){
    setTimeout(function(){
        console.log(i, '6-3 ES6的let');
    },1000);
}

// 方案四 Promise
const tasks = [];
for (var i = 0; i < 10; i++) {
    (function(i) {
        tasks.push(new Promise(resolve=>{
            setTimeout(()=>{
                console.log(i, ' 6-4-1 Promise');
                resolve();
            })
        }))
    })(i)
}

Promise.all(tasks).then(()=>{
    setTimeout(()=>{
        console.log('依次顺序执行之后i数值变为:', i)
    })
})

// 方案四 Promise 简洁版
const jobs = [];
const outputFunc = (i) => new Promise(resolve =>{
    setTimeout(()=> {
        console.log(i, '6-4-2 Promise 简洁版');
        resolve();
    }, 500)
})

for (var i = 0; i < 10; i++) {
    jobs.push(outputFunc(i));
}

Promise.all(jobs).then(()=>{
    setTimeout(()=>{
        console.log('简洁依次顺序执行之后i数值变为:', i)
    })
})

// 方案四 Promise 最简洁版
new Promise( resolve => {
    for (var i = 0; i < 10; i++) {
        console.log(i, '6-4-3 Promise 最简洁版!');
        resolve();   
    }
})

// // 方案五 async/await
// const sleep = (timeout) => new Promise((resolve) =>{
//     setTimeout(resolve, timeout);
// })

// (async () => {
//     for (var i = 0; i < 10; i++) {
//         await sleep(1000);      // 这个浏览器也不支持打印，应该是还没支持await写法
//         console.log(i, '6-5-1 async/await');
//     }
// })()

// // 方案五 async/await 简洁版
// (async () => {  // 不注释两个都不打印，注释方案5报错初步猜测是由于async的写法
//     for (var i = 0; i < 10; i++) {
//         console.log(i, '6-5-2 async/await 简洁版');
//     }
// })()

// 7.防抖和节流

// 防抖
function debounce(func, delay){
    console.log('debounce');
    var timeout;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(()=>{
            func.apply(context, args);
        }, delay)
    }
}
// 验证

// 节流 实践戳方式实现
function throttle(func, delay){
    console.log('throttle');
    var context, args;
    var previous = 0;
    return function(){
        var now = +new Date().getTime();
        context = this;
        args = arguments;
        if (now - previous > delay) {
            func.apply(context, args);
            previous = now;
        }
    }
}
// 节流 定时器方式实现
const throttleFunc = (func, delay) => {
    console.log('throttleFunc');
    var timeout, context, args;
    return function () {
        context = this;
        args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, delay);
        }
    }
}
// 验证


// 8.JavaScript中的设计模式

// 单例模式
class Singleton{
    constructor(name){
        this.name = name;
        this.instance = null;
    }
    getName(){
        alert(this.name);
    }
    static getInstance(name){
        if(!this.instance){
            this.instance = new Singleton(name);
        }
        return this.instance;
    }
}

// 工厂模式

// 文本工厂
class Text{
    constructor(text){
        this.text = text;
    }
    insert(where){
        const txt = document.createTextNode(this.text);
        where.appendChild(txt);
    }
}
// 链接工厂
class Link {
    constructor(url){
        this.url = url;
    }
    insert(where){
        const a = document.createElement('a');
        a.href = this.url;
        const txt = document.createTextNode(this.url);
        a.appendChild(txt);
        where.appendChild(a);
    }
}
// 图片工厂
class Image{
    constructor(url){
        this.url = url;
    }
    insert(where){
        const img = document.createElement('img');
        img.src = this.url;
        where.appendChild(img);
    }
}
// DOM工厂
class DomFactory {
    constructor(type){
        return new (this[type]())
    }
    link() { return Link }
    text() { return Text }
    image() { return Image }
}
// 创建工厂
const textFactiry = new DomFactory('text')
const linkFactory = new DomFactory('link')
const imgFactory = new DomFactory('image')
textFactiry.text = 'Hi, I am Lily! \n';
textFactiry.insert(document.body);
imgFactory.url = 'https://www.runoob.com/wp-content/uploads/2013/07/js-logo.png';
imgFactory.insert(document.body);
linkFactory.url = 'https://www.runoob.com/js/js-tutorial.html';
linkFactory.insert(document.body);


// 9.数据结构与算法题

// 统计字符串中出现次数最多的字符
let str = 'asdfghjklaqwertyuiopiaia';
const strChar = (str) => {
    let string = [...str],
        maxvalue = '',
        obj = {},
        max = 0
    string.forEach((item,index,array)=>{
        obj[item] = obj[item] == undefined ? 1 : obj[item] + 1;
        if (obj[item] > max) {
            max = obj[item]
            maxvalue = item
        }
    })
    return maxvalue;
}
// 验证
const maxStr = strChar(str)
console.log(`字符串 ${str} 中出现次数最多的字符是：`, maxStr);

// 数组去重
// forEach
let arr=['1','2','3','1','a','b','b'];
const uniqueForEach = arr =>{
    let obj = {}
    arr.forEach(value=>{
        obj[value] = 0;
    })
    return Object.keys(obj);
}
// filter 
const uniqueFilter = arr =>{
    return arr.filter((str, index, array)=>{
        return index === array.indexOf(str)
    })
}
//set 
const uniqueSet = arr => {
    return [...new Set(arr)];
}
// 验证
const forEachResult = uniqueForEach(arr);
console.log("forEach数组去重的结果：" , forEachResult);
const filterResult = uniqueFilter(arr);
console.log("filter数组去重的结果：" , filterResult);
const setResult = uniqueSet(arr);
console.log("set数组去重的结果：" , setResult);