# ruiyun-gani-mall-dy-uniapp

简一膜法用户端 uni-app 小程序项目，当前主要面向微信小程序运行。项目承载用户浏览商品和服务、下单支付、优惠券、会员、任务、质保、评价、售后、生活学院、渠道投放落地等核心体验。

## 项目定位

该仓库是用户侧小程序端，和后台管理端、业务后端配合使用。

当前主要业务包括：

- 首页：Banner、快捷入口、活动位、商品/服务推荐、商城入口。
- 商城：实物商品、服务商品、分类、搜索、详情、规格选择、购物车。
- 下单：地址、备注、优惠券、积分抵扣、支付、下单成功页。
- 订单：商品订单、服务订单、状态流转、物流、取消订单、确认收货、评价。
- 售后：申请售后、售后详情、退款状态、驳回反馈、售后记录。
- 评价：商品评价、服务评价、点赞、评论、商家回复展示。
- 会员：会员中心、积分、成长值、任务、权益、优惠券。
- 质保：官方质保申请、外部订单审核、质保详情、保存质保卡。
- 生活学院：内容列表、视频详情、图文内容、分享。
- 渠道投放：二维码入口、邀请、分销、渠道落地页。

## 技术栈

- uni-app
- Vue 2
- JavaScript
- Tuniao UI
- mp-html
- lottie-miniprogram
- big.js

## 开发环境

推荐工具：

- Visual Studio Code
- Node.js（建议 16+）
- tt-ide-cli（抖音小程序命令行）
- 抖音开发者工具（预览/调试）

微信小程序 AppID 配置在 `manifest.json` 的 `mp-weixin.appid`。

## 快速开始

1. 安装依赖：

```bash
npm install
```

2. 生成抖音产物（必须是 `unpackage/dist/dev/mp-toutiao`）：

```bash
# 1) 使用你的构建链路产出抖音产物（例如 uni-app 编译到 unpackage/dist/dev/mp-toutiao）
# 2) 确认该目录内有 `app.json`、`project.config.json` 等抖音可识别文件
```

3. 通过 tt-ide-cli 打开与上传（抖音官方 CLI）：

```bash
# 登录（首次）
npx -y tt-ide-cli login

# 或使用 token（可在抖音控制台获取）
npx -y tt-ide-cli set-app-config tt69331f8ef607e07c01 --token <token>

# 打开项目（读取当前目录下 project.config.json）
npx -y tt-ide-cli open .

# 上传到开发者平台
npx -y tt-ide-cli upload . --app-version 1.0.0 --app-changelog "debug build"
```

> 本项目为历史 uni-app 工程结构，文档已去掉 HBuilderX 的“打开/运行”步骤。当前打包链路按抖音官方文档要求：先产出 `unpackage/dist/dev/mp-toutiao`，再由 `tt-ide-cli` 处理预览与上传。

## 目录结构

```text
api/           接口请求封装
components/    业务组件和通用组件
libs/          第三方或基础库
pages/         页面与分包页面
static/        静态资源
store/         全局状态
tuniao-ui/     Tuniao UI 组件
uni_modules/   uni-app 插件模块
util/          工具函数
```

重点页面：

```text
pages/index/index          首页
pages/goods/detail         商品详情
pages/goods/order          提交订单
pages/cart/index           购物车
pages/orderList/index      订单列表
pages/order/detail         订单详情
pages/order/afterSales/*   售后申请、列表、详情
pages/order/comment/add    服务评价
pages/uesr/index           会员中心
pages/uesr/coupon          优惠券
pages/uesr/invite          邀请页
pages/goods/search         搜索
pages/goods/comment/list   商品评价列表
```

## 配置说明

核心配置文件：

- `manifest.json`：小程序 AppID、权限、平台配置。
- `pages.json`：页面、分包、导航栏、tabBar、easycom 组件规则。
- `App.vue`：全局样式和应用初始化。
- `api/`：业务接口地址和请求封装。
- `util/share.js`：分享标题、路径、图片等分享逻辑。

图片和分享图建议统一使用 CDN 域名：

```text
https://img.tmsglm.com/...
```

不要在正式数据中保留本地 IP、临时 OSS 地址或无法被微信访问的资源地址。

## 开发注意事项

- 小程序页面跳转路径必须在 `pages.json` 中存在。
- 后台配置的 Banner、快捷入口、活动位、投放入口，需要小程序端按跳转类型正确解析。
- 商品图、分享图、评价图、生活学院封面图应使用可公开访问的 CDN 地址。
- 订单金额、优惠券、积分抵扣、退款金额建议使用 `big.js` 或后端返回值，避免浮点误差。
- 商品规格展示应优先使用订单快照或 SKU 配置，不要回退成无意义的默认规格。
- 订单、售后、评价、质保这类状态型页面，需要进入页面时主动刷新接口数据。
- 抖音小程序报错时，优先检查接口地址、页面路径、外部组件、资源域名和网络超时。
- 调试时如果发现接口仍是线上域名，先执行本地联调清理：

```js
uni.removeStorageSync('scrm_base_url')
```

再重新运行 `tt-ide-cli open / upload` 流程，确认开发者工具里请求地址返回 `127.0.0.1:48080`。

## 与后台/后端关系

本小程序依赖后台和后端提供以下配置与接口：

- 商品、SKU、库存、销量。
- Banner、快捷入口、活动位、投放入口。
- 优惠券模板、用户优惠券、适用范围。
- 商品订单、服务订单、物流、售后、退款。
- 商品评价、服务评价、点赞、评论、商家回复。
- 会员权益、任务、积分、成长值。
- 质保规则、质保卡、外部订单审核。
- 生活学院内容和视频资源。

后台配置变更后，如果小程序端没有立即生效，优先检查接口返回数据、缓存、跳转解析和资源地址。

## 发布前检查

建议发布前完成：

- 抖音小程序命令行 `preview/open/upload` 能在产物目录上通过。
- 代码质量检查：主包大小、未使用 JS、组件按需注入。
- 首页、商品详情、购物车、下单、支付、订单详情、售后、评价链路走通。
- 分享页图片为 CDN 可访问图片。
- 线上接口域名、图片域名、上传域名在抖音平台能力与安全域名配置中可访问。

## 备注

本仓库是简一膜法业务小程序端，历史上保留了一些通用模板和旧命名，例如 `uesr` 目录。后续改造时应优先保持现有页面路径兼容，避免影响线上跳转、分享路径和后台配置入口。
