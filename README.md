# mini-mp-html

⚠️ 注意：将此项目导入微信开发者工具时请选择项目根目录而非 `dist` 目录。

更多信息请访问官方文档：[vuemini.org](https://vuemini.org)


## 说明

- 粗糙版本mp-html 仅支持微信小程序， 借鉴mp-html用来学习使用

## 依赖安装

```sh
pnpm install
```

## 本地开发

```sh
pnpm start
```

## 生产构建

```sh
pnpm build
```

## 代码格式化

```sh
pnpm format
```

## CSS 代码质量检测

```sh
pnpm lint
```

## 类型检测

```sh
pnpm type-check
```

## 提交规范

- commit message格式

``` ts

 <type>(<scope>): <subject>

 <commit类型>(影响范围): 具体描述

 举例 fix(DAO): fixed invalid user table indexes.


```
###### scope（可选）
- scope用于说明 commit 影响的范围，根据不同项目有不同层次描述。若没有特殊规定，也可以描述影响的哪些功能等。

###### subject

- subject是commit目的的简短描述，不超过50/80个字符，一般git提交的时候会有颜色提示。


``` ts


feat：新功能（feature）

fix：修补bug

docs：文档（documentation）

style： 格式（不影响代码运行的变动）

refactor：重构（即不是新增功能，也不是修改bug的代码变动）

test：增加测试

perf：优化相关内容，比如提升性能、体验、算法等

chore：改变构建流程、辅助工具的变动、或者增加依赖库、工具等

revert： 回滚到某一个版本

merge： 代码合并
```