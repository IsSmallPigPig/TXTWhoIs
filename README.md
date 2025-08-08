# TXTech 身份核验系统

## 项目简介
这是一个身份核验系统，用于查询和验证人员身份信息。

## 缓存控制说明
为了解决浏览器缓存问题，确保文件更新后用户能立即看到最新内容，我们实现了以下方案：

### 版本控制策略
所有静态资源（CSS、JS文件）都添加了版本号参数，例如：
```html
<link rel="stylesheet" href="css/style.css?v=1.0.1">
<script src="js/script.js?v=1.0.1"></script>
```

当你修改了任何静态资源后，需要更新版本号，浏览器才会重新加载文件。

### 自动更新版本号工具
我们提供了一个脚本来自动更新所有HTML文件中的版本号：

1. 确保你已安装Node.js
2. 在项目根目录运行以下命令：
```bash
node update_version.js
```

这个脚本会：
- 自动生成新版本号（当前版本号加1）
- 更新所有HTML文件中的静态资源版本号
- 更新脚本自身中的当前版本号

### 当前版本号
项目当前使用的版本号是：1.0.1

## 开发指南
1. 启动本地服务器：
```bash
python3 -m http.server --directory '/Users/ankoqaq/Project/Website/Auth Who is'
```

2. 在浏览器中打开：http://localhost:8000

3. 修改文件后，运行版本更新脚本：
```bash
node update_version.js
```

4. 刷新浏览器查看更改

## 注意事项
- 每次修改CSS或JS文件后，务必运行版本更新脚本
- 版本号格式为：主版本.次版本.修订号（如：1.0.1）
- 脚本会自动递增修订号

这是一个静态的身份查询网站，用户可以通过输入姓名或编号来查询相关信息。网站设计美观、响应式，并且易于部署到Netlify等静态网页托管平台。

## 功能特点

1. **静态网站**：全部使用HTML、CSS和JavaScript构建，无需后端服务器
2. **美观设计**：现代、简洁的UI设计，带有平滑动画效果
3. **响应式布局**：适配各种屏幕尺寸的设备
4. **易于部署**：可以轻松部署到Netlify、GitHub Pages等平台
5. **静态数据**：使用JSON文件存储数据，无需数据库

## 如何使用

1. 在输入框中输入姓名或编号
2. 点击查询按钮或按下回车键
3. 查看查询结果

## 项目结构

```
/Users/ankoqaq/Project/Website/Auth Who is/
├── index.html         # 网站首页
├── css/
│   └── style.css      # 样式表
├── js/
│   └── script.js     # JavaScript脚本
├── data/
│   └── data.json      # 数据文件
├── images/
│   └── default.jpg    # 默认头像
└── README.md          # 说明文件
```

## 自定义数据

您可以通过编辑`data/data.json`文件来添加或修改用户信息。数据格式如下：

```json
{
    "users": [
        {
            "id": "001",
            "name": "张三",
            "position": "软件工程师",
            "currentJob": "开发新功能模块",
            "validityPeriod": "2023-01-01 至 2023-12-31",
            "boundCard": "员工卡-A001",
            "photo": "images/zhang-san.jpg"
        },
        ...
    ]
}
```

## 添加用户照片

1. 将用户照片添加到`images/`文件夹
2. 在`data.json`文件中更新对应的`photo`路径

## 部署到Netlify

1. 将项目推送到GitHub仓库
2. 登录Netlify，点击"New site from Git"
3. 选择您的GitHub仓库
4. 配置构建选项（无需特殊配置，Netlify会自动识别静态网站）
5. 点击"Deploy site"完成部署

## 本地运行

1. 在项目根目录下打开终端
2. 运行以下命令启动本地服务器：
   ```
   python -m http.server
   ```
   或
   ```
   npx serve
   ```
3. 在浏览器中访问`http://localhost:8000`

## 技术栈

- HTML5
- CSS3
- JavaScript
- Tailwind CSS (通过CDN)
- Font Awesome (通过CDN)