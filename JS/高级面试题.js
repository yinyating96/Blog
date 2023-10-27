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

1.
parseFloat((0.1 +0.2).toFixed(10))

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
