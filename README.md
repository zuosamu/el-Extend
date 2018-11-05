# el-extend

## 依赖

```bash
npm i element-ui
npm i lodash/debounce
npm i lodash/cloneDeep
npm i lodash/merge
npm i moment
```

## 静态属性

仅且可以初始化配置，不支持响应式
名称 | 类型 | 说明
---|---|---|
api | Array | 整个表单请求接口，[Promise,Object]，数组第一个参数为请求接口的 api，必须为 Promise 的实例，数组的第二个参数为要渲染的列表 data 和 total，下面有例子。
config | Object | 整个表单的配置项，包含搜索框的配置项 searchConfig;表单的配置项 tableConfig;分页的配置项 pagination;每一个配置项下面都有详细介绍。
auto | Boolean | 重置之后是否重新发起请求，重新渲染表单

## config->searchConfig

```bash
config:{
  searchConfig:{
    searchShow:true,  //是否显示搜索框
    resetButton:true, //是否显示重置按钮
    flex: 1, //这是搜索框的flex布局
    form:{  //整体的搜索框，对应<el-form>标签,
      $attr:{}, //继承于<el-form>的属性
      $listener:{} ///继承于<el-form>的事件
    },
    formItem:[{
      method:'input', // 模块材料的类型，还有 select, datePicker, cascader, datePickerCustom
      label:'姓名',
      span: 3,
      prop: 'name',
      labelWidth:'88px',
      $attr: {},
      $listener: {}
    },{

    }]
  }
  ...
}
```

## api 例子

```bash
//这是请求后拿到的数据（request）
{
  code:0,
  data:{
    total:8374,
    content:[item1,item2,item3,...]
  }
}
//所以配置项应该为
{
  data:{
    data:'content',//content为request的需要渲染的数组的key
    total:'total',//显示总数
  }
}
```

## 引入方式

### Script 标签

将打包后的文件放到自己的 CDN 上面，然后引入

```html
<script src="https://你的CDN地址/hbf.min.js"></script>
<script>
  console.log(window.Hbf)  // 打印你导出的对象
</script>
```

### 全量引入

```javascript
// main.js
import Vue from "vue";
import hbf from "hbf-public-components";

Vue.use(hbf); // 会执行hbf的install方法，内部全部组件全局注册
```

### 按需引入

首先安装`babel-plugin-import`

```bash
yarn add babel-plugin-import -D
```

配置`.babelrc`

```javascript
"plugins": [
  ["import", {
    "libraryName": "hbf-public-components",
    "libraryDirectory": "lib/components"
  }]
]
```

使用`webpack-bundle-analyzer`可以查看模块按需引入的打包依赖图。

## 引入公共组件示例

```
<template>
  <public-menu :data="xxx">
  </public-menu>
</template>

import { publicMenu } from 'hbf-public-components'

export default {
  components: {
    publicMenu,
  },
}
```

## 公共组件编写

参考 [组件编写约定](https://github.com/huya-base-fed/public-components/blob/master/lib/README.md)
