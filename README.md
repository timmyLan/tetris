## 目的
* 为熟悉es6增加趣味性
* 提高开发动力
* balabalabala....编不下去了

## 注意
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome.
    俄罗斯方块用es6写,无经过babel转es5,示例请用支持es6的chrome.
    
##实现

### 第零步:构思`俄罗斯方块`的形状&规则
* 形状
![俄罗斯方块][1]
每个`方块`都可看作一个二维数组,需要填充的部分为1,留空为0.
* 规则
    * 上方向键 ===> 方块顺时针形变
    * 左方向键 ===> 方块向左移动
    * 右方向键 ===> 方块向右移动
    * 空格键 ===> 方块加速下落
    * 方块掉落自动掉落
    * 方块集齐满一排消除
    * 方块到顶部视为失败

### 第一步:让方块出现&动起来
    在`document.body`添加一个方块,并绑定`document.onkeydown`,让方块跟随键盘方向键动起来.
* [添加方块样式][2]
* [添加js交互][3]
* [本步骤示例][4]

### 第二步:让方块在规定画布上动起来
    在`document.body`添加一个画布,每次方块运动前判断对应方向能否移动
![边界设定][5]
* [添加site样式][6]
* [添加边界限定js][7]
* [本步骤示例][8]

### 第三步:根据数组矩阵画出`俄罗斯方块`
* 根据数组矩阵判断值为1的下标,利用得到的下标对各个小方块进行定位,从而得出一整块`俄罗斯方块`.
* 判断能否移动则根据绘制出的`俄罗斯方块`取最值,根据最值比对边界即可.
![偏移量最值比较][9]
* [矩阵判断&最值与边界对比js][10]
* [本步骤示例][11]

### 第四步:`俄罗斯方块`形变
* 利用变量记录`俄罗斯方块`当前位置
* 数组矩阵顺时针旋转后返回数组矩阵&每个方块的偏移量
* 利用矩阵判断`俄罗斯方块`能移动的边界
![方块形变][12]
* [改用变量代替常量&方块形变js][13]
* [本步骤示例][14]

### 第五步:`俄罗斯方块`自由下落
* 利用setTimeout方法指定一定时间下方块下落20px
* 每次下落期间判断当前`方块`可移动边界
* 当前`方块`不可再位移时,`方块`变灰,新的`方块`出现
* [方块自由下落&统一边界js][15]
* [本步骤示例][16]

### 第六步:`俄罗斯方块`消除
* 每次`俄罗斯方块`下落结束时,判断每一行小方块个数
* `方块`个数等于画布宽度/`方块`,则取出该行`方块`集合并从`document.body`消除
* 消除后将高度高于该消除行的`方块`掉落一个`方块`高度
![方块消除][17]
* [消除行js][18]
* [本步骤示例][19]

### 第七步:加速下落
* 让`方块`在按空格键的时候,下落2个单位的BLOCK_SIZE,也就是40px
* 需要在`canMove`函数中添加`displacement`(位移)参数标识`方块`下落的位移量
* 判断`方块`是否到达最高位置,需要加上位移量的距离
* [加速下落js][20]
* [本步骤示例][21]

### 第八步:判断游戏GG
* 判断已下落`方块`是否到达画布顶端
* 增加游戏结束填充动画
* [游戏结束js][22]
* [本步骤示例][23]
 
### 第九步:增加随机下落`方块`
* 将[第零步][24]的形状添加进变量arrs数组
* 用`Math.random`在每次初始化`方块`时,随机挑选arrs中的一个二维数组进行渲染
* [随机方块js][25]
* [本步骤示例][26]

### 第十步:增加游戏信息
* 增加计分板
* 增加等级判断
* 增加下一个方块提示
* 增加操作提示
* [提示info css][27]
* [游戏信息js][28]
* [本步骤示例][29]

## 传送门
* 若本教程对你有启发或帮助,各位看官请到github上点`star`,给我动力:smirk:
* [github地址][30]  
* [本教程示例][31]  
* [本教程出处][32]
* [vue版本的俄罗斯方块][33]

  [1]: http://ohumzw01d.bkt.clouddn.com/%E4%BF%84%E7%BD%97%E6%96%AF%E6%96%B9%E5%9D%97.png
  [2]: https://github.com/timmyLan/tetris/blob/master/first-step/index.css
  [3]: https://github.com/timmyLan/tetris/blob/master/first-step/index.js
  [4]: https://timmylan.github.io/tetris/first-step
  [5]: http://ohumzw01d.bkt.clouddn.com/%E8%BE%B9%E7%95%8C%E8%AE%BE%E5%AE%9A.png
  [6]: https://github.com/timmyLan/tetris/tree/master/second-step/index.css
  [7]: https://github.com/timmyLan/tetris/tree/master/second-step/index.js
  [8]: https://timmylan.github.io/tetris/second-step
  [9]: http://ohumzw01d.bkt.clouddn.com/%E5%81%8F%E7%A7%BB%E9%87%8F.png
  [10]: https://github.com/timmyLan/tetris/tree/master/third-step/index.js
  [11]: https://timmylan.github.io/tetris/third-step
  [12]: http://ohumzw01d.bkt.clouddn.com/%E5%BD%A2%E5%8F%98.png
  [13]: https://github.com/timmyLan/tetris/tree/master/fourth-step/index.js
  [14]: https://timmylan.github.io/tetris/fourth-step
  [15]: https://github.com/timmyLan/tetris/tree/master/fifth-step/index.js
  [16]: https://timmylan.github.io/tetris/fifth-step
  [17]: http://ohumzw01d.bkt.clouddn.com/%E6%B6%88%E9%99%A4%E6%96%B9%E5%9D%97.png
  [18]: https://github.com/timmyLan/tetris/tree/master/sixth-step/index.js
  [19]: https://timmylan.github.io/tetris/sixth-step
  [20]: https://github.com/timmyLan/tetris/tree/master/seventh-step/index.js
  [21]: https://timmylan.github.io/tetris/seventh-step
  [22]: https://github.com/timmyLan/tetris/tree/master/eighth-step/index.js
  [23]: https://timmylan.github.io/tetris/eighth-step
  [24]: #实现
  [25]: https://github.com/timmyLan/tetris/tree/master/ninth-step/index.js
  [26]: https://timmylan.github.io/tetris/ninth-step
  [27]: https://github.com/timmyLan/tetris/tree/master/tenth-step/index.css
  [28]: https://github.com/timmyLan/tetris/tree/master/tenth-step/index.js
  [29]: https://timmylan.github.io/tetris/tenth-step
  [30]: https://github.com/timmyLan/tetris
  [31]: https://timmylan.github.io/tetris/
  [32]: https://segmentfault.com/a/1190000008181905
  [33]: https://github.com/timmyLan/tetris-vue
