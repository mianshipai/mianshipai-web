# 交叉面试

二面结束以后，有可能会再找隔壁部门的高级/资深工程师交叉面试。交叉面试会综合考察候选人的技术能力。

注意，不一定所有面试都会有交叉面试，但这些面试题还是要刷一遍的，都是常考题。

::: tip
如有疑问，可免费 [加群](/docs/services/group.md) 讨论咨询，也可参与 [1v1 面试咨询服务](/docs/services/1v1.md)， 专业、系统、高效、全流程 准备前端面试
:::

## 求两个数组的交集和并集

给两个数组，求数组的交集和并集

```js
const arr1 = [1, 3, 4, 6, 7]
const arr2 = [2, 5, 3, 6, 1]

function getIntersection(arr1, arr2) {
  // 交集...
}

function getUnion(arr1, arr2) {
  // 并集...
}
```

参考答案

::: details

要点

- 交集，转换为 Set ，因为 Set has 比数组 includes 快很多（前者 O(1) 后者 O(n)）
- 并集，直接 add 即可，利用 Set 去重特性

代码

```js
const arr1 = [1, 3, 4, 6, 7]
const arr2 = [2, 5, 3, 6, 1]

// 交集
function getIntersection(arr1, arr2) {
  const res = new Set()
  const set2 = new Set(arr2)
  for (let item of arr1) {
    if (set2.has(item)) {
      // 注意，这里要用 Set has 方法，比数组的 includes 快很多
      res.add(item)
    }
  }
  return Array.from(res)
}

// 并集
function getUnion(arr1, arr2) {
  const res = new Set(arr1)
  for (let item of arr2) {
    res.add(item) // 利用 Set 自动去重的特性
  }
  return Array.from(res)
}

// 测试
console.log('交集', getIntersection(arr1, arr2))
console.log('并集', getUnion(arr1, arr2))
```

:::

## 数组转树

通常我们有一个包含父子关系的数组，目标是将其转化为树形结构。

示例数据：

```javascript
const arr = [
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child 1' },
  { id: 3, parentId: 1, name: 'Child 2' },
  { id: 4, parentId: 2, name: 'Grandchild 1' },
]
```

目标生成：

```javascript
const tree = [
  {
    id: 1,
    name: 'Root',
    children: [
      {
        id: 2,
        name: 'Child 1',
        children: [{ id: 4, name: 'Grandchild 1', children: [] }],
      },
      {
        id: 3,
        name: 'Child 2',
        children: [],
      },
    ],
  },
]
```

参考答案:

::: details

实现思路：

1. 遍历数组，将每个元素存储到一个以 `id` 为键的 Map 中。
2. 再次遍历数组，根据 `parentId` 将子节点挂载到父节点的 `children` 属性上。
3. 提取 `parentId` 为 `null` 的顶层节点作为树的根。

代码实现：

```javascript
function arrayToTree(arr) {
  const idMap = new Map()
  const result = []

  // 初始化 Map
  arr.forEach((item) => {
    idMap.set(item.id, { ...item, children: [] })
  })

  // 构建树
  arr.forEach((item) => {
    const parent = idMap.get(item.parentId)
    if (parent) {
      parent.children.push(idMap.get(item.id))
    } else {
      result.push(idMap.get(item.id))
    }
  })

  return result
}

console.log(JSON.stringify(arrayToTree(arr), null, 2))
```

注意点：

- 确保 `parentId` 为 `null` 的节点是根节点。
- 避免循环依赖：输入数据需要合法，否则会导致死循环。
  :::

## 树转数组

将树形结构扁平化为数组，保留原有的层级关系。

示例数据：

```javascript
const tree = [
  {
    id: 1,
    name: 'Root',
    children: [
      {
        id: 2,
        name: 'Child 1',
        children: [{ id: 4, name: 'Grandchild 1', children: [] }],
      },
      {
        id: 3,
        name: 'Child 2',
        children: [],
      },
    ],
  },
]
```

目标生成：

```javascript
const arr = [
  { id: 1, name: 'Root', parentId: null },
  { id: 2, name: 'Child 1', parentId: 1 },
  { id: 3, name: 'Child 2', parentId: 1 },
  { id: 4, name: 'Grandchild 1', parentId: 2 },
]
```

参考答案:

::: details

实现思路：

1. 使用递归遍历树。
2. 在每次递归中记录当前节点的 `parentId`。
3. 将节点及其子节点逐一添加到结果数组中。

代码实现：

```javascript
function treeToArray(tree, parentId = null) {
  const result = []

  tree.forEach((node) => {
    const { id, name, children } = node
    result.push({ id, name, parentId })
    if (children && children.length > 0) {
      result.push(...treeToArray(children, id))
    }
  })

  return result
}

console.log(JSON.stringify(treeToArray(tree), null, 2))
```

注意点：

- 递归中需避免重复引用。
- 树节点的 `children` 属性需要有效（可以为空数组但不能为 `undefined`）。

:::

## cookie localStorage sessionStorage 三者有什么区别，有什么应用场景？

参考答案：
:::details
区别：
| **特性** | **Cookie** | **LocalStorage** | **SessionStorage** |
|-------------------|-----------------------------|--------------------------|--------------------------|
| 写入方式 | 服务端和前端都可写入，不过http-only情况下只允许服务端写入 | 前端 | 前端 |
| 存储大小 | 4KB 左右 | 5~10MB | 5~10MB |
| 生命周期 | 手动设置，默认关闭浏览器失效 | 长期保留，直至用户手动清理缓存 | 当前会话，关闭页面清除 |
| 服务器交互 | **会** 随请求发送到服务器 | 不会 | 不会 |
| 数据共享 | 同域下所有页面共享 | 同域下所有页面共享 | 当前页面及子页面共享 |

应用场景：

- **Cookie** ：小数据量、需与服务器交互的场景，如保存会话标识（如 `token`）。
- **LocalStorage** ：需持久化存储、跨页面共享的数据，如用户设置、主题偏好。
- **SessionStorage** ：页面刷新或跳转时临时保存的数据，如表单填写进度。
  :::

## 前端会有哪些安全问题？该如何预防？

先从应用架构的角度来看，前端可以分为多个核心模块，每个模块都有可能成为攻击目标。

:::details

1. 用户界面与数据展示层

- **攻击风险** ：跨站脚本攻击（XSS）、HTML注入、点击劫持
- **防御措施** ：
  - 严格过滤和转义用户输入，防止恶意代码注入
  - 使用安全模板渲染，避免直接操作 DOM（例如避免使用 innerHTML）
  - 配置内容安全策略（CSP），限制脚本来源
  - 设置 X-Frame-Options 或 CSP 的 frame-ancestors 指令防止点击劫持

2. 业务逻辑层

- **攻击风险** ：业务逻辑漏洞导致未授权访问或功能滥用
- **防御措施** ：
  - 实现完善的权限校验和身份验证机制
  - 定期进行代码审查和安全测试，及时发现逻辑漏洞

3. 数据交互层

- **攻击风险** ：跨站请求伪造（CSRF）、中间人攻击、数据窃取
- **防御措施** ：
  - 使用 HTTPS 加密数据传输，防止数据在传输过程中被窃取或篡改
  - 在请求中加入 CSRF Token，并在服务器端验证请求合法性
  - 配置严格的 CORS 策略，确保 API 调用来源可信

4. 数据存储层

- **攻击风险** ：本地存储数据泄露（LocalStorage、SessionStorage）、Cookie 劫持
- **防御措施** ：
  - 避免在前端存储敏感信息，如必须存储应进行加密处理
  - 对 Cookie 设置 HttpOnly、Secure 等属性，降低被脚本读取的风险

5. 资源加载与依赖管理层

- **攻击风险** ：第三方依赖库漏洞、供应链攻击、外部资源篡改
- **防御措施** ：
  - 定期更新和审查第三方依赖，及时修补已知漏洞
  - 使用子资源完整性（SRI）校验机制，确保加载的外部资源未被篡改
  - 仅从可信源加载资源，杜绝未知或不受信任的代码注入

6. 构建与部署流程

- **攻击风险** ：构建工具或 CI/CD 流程被攻击，导致恶意代码注入
- **防御措施** ：
  - 加强构建环境安全管理，定期更新和审查构建工具及依赖
  - 采用代码签名、版本管理和自动化安全测试，确保发布版本的完整性和可追溯性
  - 将安全检测纳入 CI/CD 流程，实现自动化的安全漏洞扫描

综上所述，只有从整体应用架构的角度出发，针对各个模块的不同攻击面采取多层次防御措施，才能真正保障前端系统的安全性和稳定性。
:::

## 常见的 git 命令有哪些？

::: details

1. **克隆远程仓库** ：每个开发者首先需要将远程仓库克隆到本地，以获取项目的最新代码。

   ```bash
   git clone <远程仓库URL>
   ```

2. **创建并切换到功能分支** ：在主分支（如 `main` 或 `master`）上创建一个新的功能分支，以便在该分支上进行开发，避免直接在主分支上工作。

   ```bash
   git checkout -b feature-branch
   ```

3. **进行开发并提交更改** ：在功能分支上进行开发，完成后将更改添加到暂存区并提交。

   ```bash
   git add .
   git commit -m "描述本次提交的内容"
   ```

4. **同步远程主分支的最新更改** ：在推送之前，先拉取远程主分支的最新更改，以避免推送时发生冲突。

   ```bash
   git fetch origin main
   git merge origin/main
   ```

5. **推送功能分支到远程仓库** ：将本地的功能分支推送到远程仓库，以便其他团队成员可以访问。

   ```bash
   git push origin feature-branch
   ```

6. **创建 Pull Request（PR）** ：在 GitHub 等平台上，从功能分支向主分支发起 PR，请求将功能分支的更改合并到主分支。

7. **代码审查与合并** ：团队成员对 PR 进行审查，提出修改建议或直接在网页上进行评论。审查通过后，项目管理员或有权限的成员将 PR 合并到主分支。

8. **删除已合并的功能分支（可选）** ：为保持仓库整洁，合并后可考虑删除远程和本地的功能分支。

   ```bash
   git branch -d feature-branch
   git push origin --delete feature-branch
   ```

**注意事项** ：

- **解决冲突** ：在拉取远程主分支的更改时，可能会遇到冲突。此时，需要手动解决冲突，然后提交解决后的更改。

- **保持分支同步** ：在开发过程中，定期从远程主分支拉取最新的更改，以保持本地分支的同步，减少合并时的冲突。

- **提交规范** ：遵循统一的提交规范，如使用清晰的提交信息，方便团队成员理解每次提交的目的和内容。

:::

## 如何使用 git 多人协作开发？

根据项目的规模、性质和团队需求有不同的安排。

::: details

1. **小型项目** （例如：1-3 人的小型开发团队）

- **共享仓库模型** ：大家都对同一个远程仓库进行操作。
- **策略** ：
  - 可以直接使用 `master/main` 分支，所有成员都可以在此分支上工作，避免复杂的分支管理。
  - 每个开发者都在本地创建自己的功能分支进行开发，完成后合并回 `main` 或 `master`。
  - 提交时保持简洁，并且在每次 `push` 前与远程仓库同步（`git pull --rebase`）。
- **具体流程** ：
  1.  `git clone` 克隆远程仓库。
  2.  `git checkout -b feature-branch` 创建并切换到自己的功能分支。
  3.  完成功能开发后，`git add .`、`git commit -m "Description"` 提交本地修改。
  4.  使用 `git pull --rebase` 更新远程仓库，解决冲突。
  5.  使用 `git push` 推送到远程仓库。
  6.  其他成员拉取最新的修改，确保项目同步。

2. **中型项目** （例如：3-10 人的团队）

- **基于分支的协作** ：主分支用于发布，功能开发分支（feature branch）和修复分支（bugfix branch）被广泛使用。
- **策略** ：
  - `main` 或 `master` 作为生产分支，稳定且可以随时部署。
  - 开发人员通过功能分支进行开发，提交合并请求（Pull Requests）前进行代码审查。
  - 通过 `develop` 分支进行日常开发，`feature` 分支从 `develop` 分支创建，开发完成后合并回 `develop`。
- **具体流程** ：
  1.  `git clone` 克隆远程仓库。
  2.  切换到 `develop` 分支并保持更新（`git pull`）。
  3.  创建自己的功能分支 `git checkout -b feature-branch`。
  4.  开发完成后，将功能分支推送到远程 `git push origin feature-branch`。
  5.  创建 Pull Request (PR)，请求代码审查并合并到 `develop` 分支。
  6.  定期将 `develop` 分支合并回 `main` 或 `master` 分支进行发布。

3. **大型项目** （例如：10 人以上的团队）

- **Git Flow** ：这是一个非常适合大团队协作的模型。通过多个分支策略进行管理，确保版本发布和功能开发的平稳过渡。
- **策略** ：
  - `main` 或 `master` 用于发布稳定版本。
  - `develop` 分支用于日常开发，所有新功能都在此基础上开发。
  - 使用 `feature` 分支进行独立的功能开发。
  - 使用 `release` 分支准备发布版本，包含 Bug 修复和最后的稳定性验证。
  - `hotfix` 分支用于快速修复生产环境的 bug。
- **具体流程** ：
  1.  `git clone` 克隆仓库，切换到 `develop` 分支。
  2.  创建并切换到新的功能分支 `git checkout -b feature/feature-name`。
  3.  在功能分支上开发，完成后推送并创建 PR 合并回 `develop` 分支。
  4.  在 `develop` 分支合并后，测试团队测试新的功能，确保没有问题。
  5.  若需发布新版本，从 `develop` 创建 `release` 分支，进行最后的 bug 修复和稳定性测试。
  6.  发布后将 `release` 分支合并到 `main` 和 `develop` 分支。
  7.  快速修复 bug 时，从 `main` 分支创建 `hotfix` 分支，修复后合并回 `main` 和 `develop`。

4. **开源项目**

- **Fork & Pull Request 模式** ：开源项目通常采用这种模式，每个贡献者通过自己的 Fork 进行开发，并通过 Pull Request 提交贡献。
- **策略** ：
  - 贡献者 Fork 项目仓库到自己的 GitHub（或其他平台）账户。
  - 在 Fork 的仓库中开发新的功能或修复 bug。
  - 完成开发后，创建 Pull Request 提交到原仓库进行审查。
  - 项目维护者负责合并经过审查的代码，确保项目稳定。
- **具体流程** ：
  1.  `git fork` 仓库到自己的 GitHub 账户。
  2.  `git clone` 自己 Fork 后的仓库。
  3.  创建一个功能分支 `git checkout -b feature-name`。
  4.  在功能分支上进行开发，提交修改并推送到自己的 Fork 仓库。
  5.  提交 PR 请求合并到原仓库的 `main` 或 `develop` 分支。
  6.  原项目维护者审查代码，若通过则合并；如果有问题，贡献者根据反馈修改代码。

5. **闭源项目**

- **私有仓库** ：闭源项目通常使用私有仓库进行管理，团队协作模式与开源项目类似，但可能不需要开放给外部贡献者。
- **策略** ：
  - 仅限团队内部访问，所有成员都在相同的权限范围内操作。
  - 使用与中型项目类似的 Git Flow 或其他基于分支的工作流。
- **具体流程** ：
  1.  创建私有仓库并初始化 `main` 或 `master` 分支。
  2.  开发人员从 `develop` 分支创建功能分支进行开发。
  3.  完成后提交 PR 进行代码审查。
  4.  审查通过后，合并回 `develop` 分支并准备发布。
  5.  发布前测试人员验证，发布后合并到 `main`。

总结

- **小型项目** ：共享仓库模型，简单的开发流程。
- **中型项目** ：功能分支管理，使用 `develop` 和 `feature` 分支。
- **大型项目** ：Git Flow 模式，多分支管理，发布和修复分支分开。
- **开源项目** ：Fork & Pull Request 模式，社区贡献，开放和审查。
- **闭源项目** ：私有仓库，常用 Git Flow 或类似工作流，团队内部管理。

:::

## 是否熟悉 Linux 系统，常见的 Linux 命令有哪些？

::: details

1. **文件与目录操作**

- `ls`：列出当前目录下的文件和目录。
  - `ls -l`：显示详细信息（如权限、大小、修改时间）。
  - `ls -a`：显示所有文件，包括隐藏文件。
- `cd`：切换当前目录。
  - `cd /path/to/directory`：跳转到指定目录。
  - `cd ..`：跳转到上级目录。
  - `cd ~`：跳转到用户的主目录。
- `pwd`：显示当前工作目录的完整路径。
- `mkdir`：创建目录。
  - `mkdir new-directory`：创建名为 `new-directory` 的目录。
- `rm`：删除文件或目录。
  - `rm file.txt`：删除文件。
  - `rm -rf directory/`：递归删除目录及其内容。
- `cp`：复制文件或目录。
  - `cp source.txt destination.txt`：复制文件。
  - `cp -r source-directory/ destination/`：递归复制目录。
- `mv`：移动文件或目录，或重命名。
  - `mv oldname.txt newname.txt`：重命名文件。
  - `mv file.txt /path/to/destination/`：移动文件。

2. **文件内容查看与编辑**

- `cat`：查看文件内容。
  - `cat file.txt`：查看 `file.txt` 文件的内容。
- `less`：分页查看文件内容，支持上下翻页。
  - `less file.txt`：分页查看文件内容。
- `head`：查看文件的前几行。
  - `head -n 10 file.txt`：查看文件前 10 行。
- `tail`：查看文件的后几行。
  - `tail -n 10 file.txt`：查看文件后 10 行。
  - `tail -f file.txt`：实时查看文件新增的内容（常用于查看日志文件）。
- `nano` 或 `vim`：命令行文本编辑器。
  - `nano file.txt`：用 `nano` 编辑文件（易用）。
  - `vim file.txt`：用 `vim` 编辑文件（功能强大，学习曲线较陡）。

3. **权限管理**

- `chmod`：更改文件或目录的权限。
  - `chmod 755 file.txt`：给文件设置读、写、执行权限。
  - `chmod +x script.sh`：给脚本文件增加执行权限。
- `chown`：更改文件或目录的所有者。
  - `chown user:group file.txt`：将文件的所有者改为 `user`，所属组改为 `group`。

4. **Git 与版本控制**

- `git clone`：克隆远程 Git 仓库到本地。
- `git pull`：从远程仓库拉取最新的更新。
- `git push`：将本地的提交推送到远程仓库。
- `git commit`：提交代码。
- `git status`：查看当前工作区的状态。
- `git branch`：列出所有本地分支。
- `git checkout`：切换到其他分支。
- `git merge`：合并分支。
- `git log`：查看提交历史。

5. **系统管理与监控**

- `top`：查看系统的实时进程和资源使用情况。
- `htop`：`top` 的增强版，图形化界面（需要安装）。
- `ps`：查看当前正在运行的进程。
  - `ps aux`：查看所有进程。
- `kill`：终止进程。
  - `kill PID`：杀死指定 PID 的进程。
- `df`：查看磁盘空间使用情况。
  - `df -h`：以人类可读的格式显示磁盘空间。
- `free`：查看内存使用情况。
  - `free -h`：以人类可读格式显示内存使用情况。

6. **网络操作**

- `ping`：测试网络连接。
  - `ping google.com`：测试与 Google 的网络连接。
- `curl`：获取网页或 API 响应。
  - `curl https://api.example.com`：获取指定 URL 的内容。
- `wget`：从网络下载文件。
  - `wget http://example.com/file.zip`：下载文件。
- `netstat`：查看网络连接。
  - `netstat -tuln`：查看监听的端口。
- `ssh`：远程连接到其他服务器。
  - `ssh user@hostname`：通过 SSH 连接到远程服务器。

7. **日志查看**

- `tail -f /var/log/nginx/access.log`：实时查看 Nginx 访问日志。
- `journalctl -u service-name`：查看特定服务的日志。
- `grep`：在文件中查找特定的文本模式。
  - `grep "ERROR" /var/log/nginx/error.log`：查找 Nginx 错误日志中的所有 `ERROR`。

8. **包管理**

- `apt`（Debian/Ubuntu 系）：
  - `apt update`：更新软件包列表。
  - `apt upgrade`：升级已安装的软件包。
  - `apt install package-name`：安装指定软件包。
  - `apt remove package-name`：卸载指定软件包。
- `yum`（CentOS/RHEL 系）：
  - `yum install package-name`：安装指定软件包。
  - `yum update`：更新软件包。

9. **前端开发相关**

- **Node.js 项目管理** ：
  - `npm install`：安装项目依赖。
  - `npm run build`：执行构建命令（如构建生产环境的代码）。
  - `npm start`：启动开发服务器。
- **查看端口占用情况** ：
  - `lsof -i :3000`：查看是否有进程在使用 3000 端口。
  - `kill $(lsof -t -i :3000)`：杀掉占用 3000 端口的进程。
- **使用 `pm2` 管理 Node.js 应用** ：
  - `pm2 start app.js`：使用 `pm2` 启动 Node.js 应用。
  - `pm2 restart app`：重启已启动的应用。
  - `pm2 logs`：查看应用日志。

10. **自动化与调度**

- `cron`：定时任务调度。
  - 编辑定时任务：`crontab -e`。
  - 查看当前定时任务：`crontab -l`。
- `at`：设置一次性任务。
  - `at now + 5 minutes`：在 5 分钟后执行任务。

:::

## 如何调试前端代码？

::: details
调试前端代码的关键考点是调试流程和工具的掌握。

调试的目标是识别和修复代码中的问题。

我们可以从以下几个方面来看：

1. **调试流程** ：

   - **重现问题** ：确保你能准确重现问题，了解问题发生的条件。
   - **隔离问题范围** ：通过分段注释、简化代码等方式，将问题范围逐渐缩小，便于定位问题。
   - **检查错误信息** ：查看浏览器的控制台，检查是否有报错或警告，通常浏览器会提供比较详细的错误信息和堆栈跟踪。

2. **常用调试工具** ：

   - **浏览器开发者工具** ：Chrome、Firefox 等浏览器都自带强大的开发者工具，可以用来检查 DOM、样式、网络请求、控制台输出等。
   - **断点调试** ：通过在代码中设置断点，逐步执行程序，查看各个变量的值，帮助定位问题。
   - **调试输出** ：使用 `console.log()` 或更专业的调试工具（如 `debugger`）来输出变量或执行状态。

3. **调试策略** ：
   - **逐步排查** ：将代码分解成小模块，逐个排查，确认是哪个环节出了问题。
   - **日志与错误追踪** ：在应用中嵌入日志功能，尤其是在生产环境中，利用像 Sentry 这样的工具收集并分析错误信息。

最终，调试的关键是高效的定位和快速的修复。你在进行调试时，首先要了解应用的整体架构，然后再根据问题定位具体的模块或环节进行深入分析。

:::

## 移动端 H5 如何抓包网络请求？

::: details

抓包网络请求的关键考点是如何能够在移动端环境下监控和捕获网络流量。

尤其是在 H5 应用中，通常需要处理多种协议（如 HTTP、HTTPS）和不同的网络层（如请求、响应、WebSocket 等）。

我们可以从以下几个方面来进行分析：

1. **抓包工具的选择** ：

   - **Charles Proxy** ：一款功能强大的跨平台抓包工具，支持 HTTP、HTTPS 等协议的抓包，能够分析移动端应用的网络请求。可以通过在手机上设置代理，将手机的流量转发到电脑上进行抓包。
   - **Fiddler** ：类似于 Charles，也是一个常用的抓包工具，可以抓取本地和移动设备的 HTTP 和 HTTPS 请求。通过配置代理服务器，将移动设备的流量通过它进行捕获。
   - **Wireshark** ：适用于更低层次的网络分析，能够捕捉各种网络协议的数据包，但需要更高的网络知识。
   - **Chrome DevTools** ：如果是调试 Web 移动版的 H5 页面，可以使用 Chrome 的开发者工具，直接通过远程调试功能抓取网络请求。

2. **如何抓包** ：

   - **设置代理** ：一般需要在移动端设备上设置代理，指向本地电脑的抓包工具。这样，所有移动设备的流量就会通过你的电脑转发，可以在抓包工具中查看和分析。
     - 在手机的 Wi-Fi 设置中修改代理设置，填写电脑的 IP 地址和抓包工具的端口（通常是 8888 或 8889）。
   - **HTTPS 证书问题** ：为了抓取 HTTPS 流量，抓包工具（如 Charles 或 Fiddler）通常需要安装它们的根证书。安装后，它们就能解密 HTTPS 请求，从而显示加密流量内容。
   - **查看和分析数据** ：通过抓包工具，你可以看到每个请求的详细信息，如请求头、响应头、请求体、响应体等，帮助你诊断请求问题或调试接口。

3. **调试时注意事项** ：
   - **隐私和安全性** ：确保你只在合法的环境下抓包，避免捕获到敏感信息或违反用户隐私。
   - **网络状态** ：抓包时可以模拟不同的网络环境（如模拟 3G、4G、Wi-Fi 等），帮助你排查网络质量对请求的影响。

总结来说，抓包的关键是理解代理机制和 HTTPS 解密的过程，掌握合适的工具和流程，才能有效地分析移动端 H5 应用的网络请求。

:::

## 网页重绘 repaint 和重排 reflow 有什么区别

::: details

网页 **重绘（Repaint）** 和 **重排（Reflow）** 的区别可以从性能开销、触发原因和渲染机制三个关键点来分析：

**1. 定义与触发条件**

- **重绘（Repaint）**
  重绘是指当元素的样式发生改变，但不影响布局时触发的渲染过程。
  **触发条件** ：颜色、背景、边框等视觉样式的变化。

  **示例** ：

  ```css
  element.style.backgroundColor = "red";
  ```

- **重排（Reflow）**
  重排（又称回流）是指当页面布局或结构发生变化时，浏览器重新计算元素的位置和几何尺寸的过程。
  **触发条件** ：DOM 节点的增删、元素位置的变化、盒模型属性（如 `width`, `height`, `padding` 等）的修改。

  **示例** ：

  ```css
  element.style.width = "300px";
  ```

**2. 性能开销**

- **重绘（Repaint）** ：
  相对较轻，只需要更新像素信息，不需要重新计算布局。

- **重排（Reflow）** ：
  开销较大，可能会影响整个页面的渲染，尤其是当涉及到根节点或复杂嵌套布局时。

**3. 如何优化**

- **减少重绘和重排的方法** ：
  - **合并样式更改** ：通过一次性设置多个样式属性，避免多次触发重排。
  - **使用 `class` 替代内联样式** ：批量管理样式更高效。
  - **避免频繁读取和写入 DOM 属性** ：将读取操作和写入操作分开。
  - **使用 CSS3 硬件加速** ：如 `transform: translateZ(0);` 以减少重排。

总结来说，重绘和重排的关键区别在于是否涉及布局计算。前者只影响视觉样式，后者会改变页面结构，性能开销也显著不同。

:::

## 网页多标签页之间如何通讯？和 iframe 如何通讯？

::: details
网页多标签页和 iframe 通讯的关键考点是跨窗口和跨域通信模型的选择，以及不同场景下的适用方法。可以从以下几个方面分析：

**1. 多标签页之间的通讯方法**

- **BroadcastChannel API**
  同源的多个标签页可以使用 `BroadcastChannel` 进行消息广播，简单方便。
  **示例** ：

  ```javascript
  const channel = new BroadcastChannel('my_channel')
  channel.postMessage('Hello from another tab!')
  channel.onmessage = (event) => {
    console.log('Received message:', event.data)
  }
  ```

- **LocalStorage + Storage 事件监听**
  不同标签页可以共享 `localStorage`，通过监听 `storage` 事件实现通讯。
  **示例** ：

  ```javascript
  window.addEventListener('storage', (event) => {
    if (event.key === 'my_key') {
      console.log('Received message:', event.newValue)
    }
  })
  localStorage.setItem('my_key', 'Hello from another tab!')
  ```

- **Service Worker**
  通过 `Service Worker` 作为中介，实现跨标签页通讯。适合 PWA 场景。

- **WebSocket**
  通过服务器中转实现实时通讯，适合跨域或需要长连接的场景。

---

**2. iframe 通讯方法**

- **postMessage API**
  最常用的方式，可以跨域发送消息。父页面和 iframe 双向通信都支持。
  **示例（父页面向 iframe 发送消息）** ：

  ```javascript
  const iframe = document.querySelector('iframe')
  iframe.contentWindow.postMessage('Hello iframe!', '*')
  window.addEventListener('message', (event) => {
    console.log('Received from iframe:', event.data)
  })
  ```

- **URL Hash 传参**
  通过修改 iframe 的 URL 哈希来传递参数。适用于简单场景。
  **示例** ：

  ```javascript
  iframe.src = 'https://example.com#message=Hello'
  ```

- **共享 Cookie 或 LocalStorage**
  在同源环境下可以通过共享存储机制间接通讯。

---

**3. 注意事项**

- **安全性考虑** ：
  - 使用 `postMessage` 时要指定目标源，避免消息被恶意网站接收。
  - 避免直接信任外部传入的数据，做好验证与校验。
- **兼容性与性能** ：
  - 优先选择现代 API（如 `BroadcastChannel`）。
  - 避免频繁存取 `localStorage` 导致性能问题。

总结来说，选择通讯方法的关键在于是否同源、跨域需求、实时性要求等因素。
:::

## 什么是 axios 拦截器，能用来做什么？

Axios 拦截器的关键是提供了网络请求生命周期的可控节点，能够有效地简化和规范前端网络请求的管理。

::: details

**Axios 拦截器** 的关键考点在于它是请求与响应流程中的中间层，用来在网络请求前后进行处理，满足业务需求和性能优化。可以从以下几个方面分析其用途和实践方法：

---

**1. 什么是 Axios 拦截器？**

Axios 拦截器是 Axios 库提供的功能，可以在请求发出之前和响应数据返回之后进行拦截和处理。
拦截器主要分为两类：

- **请求拦截器（Request Interceptors）**
- **响应拦截器（Response Interceptors）**

---

**2. Axios 拦截器的应用场景**

- **添加通用请求头**
  可以统一为所有请求添加认证 Token、语言信息等。

  ```javascript
  axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = 'Bearer my-token'
    return config
  })
  ```

- **全局错误处理**
  统一处理服务器返回的错误，如用户未登录、网络错误等。

  ```javascript
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        alert('Unauthorized, please login')
      }
      return Promise.reject(error)
    }
  )
  ```

- **数据格式预处理**
  对服务器返回的数据进行格式化，比如从 API 响应中提取有效数据部分。

  ```javascript
  axios.interceptors.response.use((response) => {
    return response.data.result
  })
  ```

- **请求节流与取消**
  防止短时间内重复请求。

  ```javascript
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  axios.get('/some-url', {
    cancelToken: source.token,
  })

  source.cancel('Request canceled')
  ```

---

**3. 注意事项**

- **拦截器顺序** ：
  请求拦截器会按添加顺序执行，而响应拦截器按相反顺序执行。
- **错误处理机制** ：
  错误处理函数需要显式调用 `Promise.reject(error)`，否则错误可能被吞掉。

:::

## 是否熟悉 Performance API ，是否了解常见的性能指标？

::: details

**Performance API** 的关键考点是提供了一组 Web 标准接口来获取和分析页面性能数据，帮助开发者定位性能瓶颈并优化体验。其中涉及到的常见性能指标如 FP、FCP、LCP 等能直观反映用户的视觉加载体验。

---

**1. 什么是 Performance API？**

Performance API 是浏览器提供的内置接口，用于测量网页的加载时间、资源性能和用户体验。

**常用接口**

- `performance.now()`：返回相对于页面加载时间的高精度时间戳。
- `performance.mark()` 和 `performance.measure()`：创建和测量自定义性能标记。
- `performance.getEntriesByType()`：获取特定类型的性能数据，如资源加载或导航时间。

---

**2. 常见性能指标**

- **FP (First Paint)**
  **首次绘制** ，指用户第一次看到页面内容时的时间点（通常是背景颜色）。
- **FCP (First Contentful Paint)**
  **首次内容绘制** ，页面中首个内容（如文字、图片）被绘制的时间点。
  **优化思路** ：减少 CSS 阻塞、优化首屏加载内容。

- **LCP (Largest Contentful Paint)**
  **最大内容绘制** ，页面中最大内容元素（如主标题、图片）绘制完成的时间点。
  **优化思路** ：使用延迟加载策略、优化图像加载。

- **CLS (Cumulative Layout Shift)**
  **累积布局偏移** ，页面加载过程中视觉内容意外变化的总量。
  **优化思路** ：设置明确的宽高，避免懒加载导致布局移动。

- **FID (First Input Delay)**
  **首次输入延迟** ，用户第一次交互（如点击按钮）与浏览器响应之间的时间间隔。
  **优化思路** ：减少主线程阻塞。

- **TTI (Time to Interactive)**
  **可交互时间** ，页面完成加载并能够快速响应用户交互的时间。

---

**3. 如何使用 Performance API**

**示例：获取 FCP**

```javascript
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries()
  entries.forEach((entry) => {
    if (entry.name === 'first-contentful-paint') {
      console.log('FCP:', entry.startTime)
    }
  })
}).observe({ type: 'paint', buffered: true })
```

---

**4. 注意事项**

- **兼容性** ：不同 API 在浏览器中的支持情况可能不同，需合理降级处理。
- **数据分析** ：结合 Lighthouse 等工具进行系统化分析，而不是依赖单一指标。

:::

## sourcemap 有何作用，如何配置？

::: details

**1. Source Map 的作用及配置**

Source Map 是一种将压缩、混淆后的代码映射回源代码的文件，用于调试和定位错误。它的主要作用如下：

- **调试优化** ：在开发者工具中看到源代码而非压缩后的代码。
- **错误定位** ：在生产环境中准确定位代码错误。
- **性能分析** ：配合性能工具对源代码进行优化分析。

**配置方法**

1. **Webpack 中配置**

   ```javascript
   module.exports = {
     mode: 'production',
     devtool: 'source-map', // 生成 Source Map
   }
   ```

   常见选项：

   - `source-map`: 完整映射，适合生产环境。
   - `cheap-module-source-map`: 生成更快，但映射不包括列信息。
   - `eval-source-map`: 适合开发环境，生成速度快。

2. **Vite 配置**
   ```javascript
   export default {
     build: {
       sourcemap: true,
     },
   }
   ```

:::

## 什么是 HTTPS 中间人攻击，如何预防

::: details

**中间人攻击（MITM, Man-In-The-Middle）** 是指攻击者拦截客户端与服务器之间的通信，获取敏感信息或篡改数据。

**攻击原理**

攻击者通过伪造证书或劫持网络流量，冒充服务器或客户端，使通信双方无法察觉中间人的存在。

**预防措施**

1. **启用 HTTPS 和强证书验证**

   - 配置 TLS 并购买可信的 SSL 证书。
   - 使用 HSTS（HTTP Strict Transport Security）强制 HTTPS 访问。

2. **证书固定（Certificate Pinning）**
   确保客户端只接受特定 CA 签发的证书。
3. **开启 CORS 配置**
   配置严格的跨域策略，减少不必要的网络暴露。

4. **安全头部配置**

   - 设置 `Content-Security-Policy` 防止资源篡改。
   - 设置 `Strict-Transport-Security` 强制使用 HTTPS。

5. **客户端验证**
   通过双向 TLS（Mutual TLS）验证客户端身份。

:::

## 什么是 OOP ，面向对象三要素是什么？

::: details

**1. 什么是 OOP (Object-Oriented Programming)?**

面向对象编程（Object-Oriented Programming，简称 OOP）是一种编程范式，通过将程序中的功能和数据封装为对象来实现模块化和复用。对象是具有属性（状态）和方法（行为）的实体，能够与其他对象进行交互。OOP 的核心思想是**通过模拟现实世界的模型来提高软件开发的灵活性与维护性** 。

**2. 面向对象的三要素**

1. **封装（Encapsulation）**

   - **概念** ：将数据和操作数据的方法绑定在一起，对外隐藏对象的内部实现细节。
   - **作用** ：
     - 提高代码安全性，避免外部直接修改数据。
     - 便于代码维护，减少不同模块之间的耦合。
   - **示例**

     ```javascript
     class Person {
       constructor(name, age) {
         this._name = name // 私有变量（约定形式）
         this._age = age
       }

       get name() {
         return this._name
       }

       set name(newName) {
         if (newName) this._name = newName
       }
     }
     const person = new Person('Alice', 25)
     console.log(person.name) // Alice
     ```

2. **继承（Inheritance）**

   - **概念** ：子类继承父类的属性和方法，从而避免重复代码。
   - **作用** ：
     - 代码复用，减少重复。
     - 建立层次结构，实现多态。
   - **示例**

     ```javascript
     class Animal {
       speak() {
         console.log('Animal sound')
       }
     }

     class Dog extends Animal {
       speak() {
         console.log('Woof!')
       }
     }
     const dog = new Dog()
     dog.speak() // Woof!
     ```

3. **多态（Polymorphism）**

   - **概念** ：不同对象可以以不同的形式执行相同的方法调用。
   - **作用** ：
     - 增强代码的灵活性。
     - 提高系统的扩展性。
   - **示例**

     ```javascript
     class Shape {
       draw() {
         console.log('Drawing shape')
       }
     }

     class Circle extends Shape {
       draw() {
         console.log('Drawing circle')
       }
     }

     const shapes = [new Shape(), new Circle()]
     shapes.forEach((shape) => shape.draw())
     ```

:::

## 前端常见的设计模式有哪些？以及应用场景

::: details

1. **单例模式（Singleton Pattern）**

- **概念** ：保证一个类只有一个实例，并提供全局访问点。
- **应用场景** ：
  - 全局状态管理，例如 Vuex 或 Redux Store。
  - 浏览器缓存管理或全局配置。
- **示例** ：
  ```javascript
  class Singleton {
    constructor() {
      if (!Singleton.instance) {
        Singleton.instance = this
      }
      return Singleton.instance
    }
  }
  const instance1 = new Singleton()
  const instance2 = new Singleton()
  console.log(instance1 === instance2) // true
  ```

---

2. **工厂模式（Factory Pattern）**

- **概念** ：通过工厂方法创建对象，而不是直接实例化。
- **应用场景** ：
  - 动态创建 UI 组件。
  - 根据配置动态生成实例。
- **示例** ：

  ```javascript
  class Button {
    render() {
      console.log('Render Button')
    }
  }

  class Input {
    render() {
      console.log('Render Input')
    }
  }

  class Factory {
    static createElement(type) {
      switch (type) {
        case 'button':
          return new Button()
        case 'input':
          return new Input()
        default:
          throw new Error('Unknown type')
      }
    }
  }

  const button = Factory.createElement('button')
  button.render() // Render Button
  ```

---

3. **观察者模式（Observer Pattern）**

- **概念** ：一个对象（观察者）订阅另一个对象（被观察者）的变化。
- **应用场景** ：
  - 数据绑定和事件系统，例如 Vue 的响应式系统、EventEmitter。
  - 实现消息推送功能。
- **示例** ：

  ```javascript
  class Subject {
    constructor() {
      this.observers = []
    }

    subscribe(observer) {
      this.observers.push(observer)
    }

    notify(data) {
      this.observers.forEach((observer) => observer.update(data))
    }
  }

  class Observer {
    update(data) {
      console.log(`Received: ${data}`)
    }
  }

  const subject = new Subject()
  const observer1 = new Observer()
  subject.subscribe(observer1)
  subject.notify('Hello!') // Received: Hello!
  ```

---

4. **策略模式（Strategy Pattern）**

- **概念** ：将一组算法封装到独立的类中，使得它们可以互换。
- **应用场景** ：
  - 表单验证策略。
  - 动态路由匹配。
- **示例** ：

  ```javascript
  class AddStrategy {
    execute(a, b) {
      return a + b
    }
  }

  class MultiplyStrategy {
    execute(a, b) {
      return a * b
    }
  }

  class Calculator {
    constructor(strategy) {
      this.strategy = strategy
    }

    calculate(a, b) {
      return this.strategy.execute(a, b)
    }
  }

  const calculator = new Calculator(new MultiplyStrategy())
  console.log(calculator.calculate(2, 3)) // 6
  ```

---

5. **代理模式（Proxy Pattern）**

- **概念** ：通过代理控制对对象的访问。
- **应用场景** ：
  - API 请求的缓存代理。
  - 数据过滤或格式化。
- **示例** ：

  ```javascript
  const apiProxy = new Proxy(
    {},
    {
      get(target, property) {
        if (property in target) {
          return target[property]
        } else {
          console.log(`Fetching ${property} from API...`)
          // 模拟 API 请求
          return `Data for ${property}`
        }
      },
    }
  )

  console.log(apiProxy.user) // Fetching user from API...
  ```

---

6. **装饰器模式（Decorator Pattern）**

- **概念** ：在不修改原始对象的情况下动态扩展功能。
- **应用场景** ：
  - 动态扩展类的功能，例如权限控制。
  - React 的高阶组件（HOC）。
- **示例** ：

  ```javascript
  function withLogging(fn) {
    return function (...args) {
      console.log(`Calling ${fn.name} with`, args)
      return fn(...args)
    }
  }

  function add(a, b) {
    return a + b
  }

  const loggedAdd = withLogging(add)
  console.log(loggedAdd(2, 3)) // Calling add with [2, 3]
  ```

---

7. **中介者模式（Mediator Pattern）**

- **概念** ：通过一个中介对象来管理不同对象之间的交互，避免对象之间的直接引用。
- **应用场景** ：
  - 模块之间的解耦，例如前端组件通信。
- **示例** ：

  ```javascript
  class Mediator {
    constructor() {
      this.channels = {}
    }

    subscribe(channel, fn) {
      if (!this.channels[channel]) {
        this.channels[channel] = []
      }
      this.channels[channel].push(fn)
    }

    publish(channel, data) {
      if (this.channels[channel]) {
        this.channels[channel].forEach((fn) => fn(data))
      }
    }
  }

  const mediator = new Mediator()
  mediator.subscribe('event', (data) => console.log(`Received: ${data}`))
  mediator.publish('event', 'Hello from Mediator!') // Received: Hello from Mediator!
  ```

---

8. **命令模式（Command Pattern）**

- **概念** ：将请求封装为对象，以便参数化不同的请求。
- **应用场景** ：
  - 撤销与重做功能。
  - 任务队列管理。
- **示例** ：

  ```javascript
  class Command {
    constructor(execute, undo) {
      this.execute = execute
      this.undo = undo
    }
  }

  class Light {
    turnOn() {
      console.log('Light is ON')
    }

    turnOff() {
      console.log('Light is OFF')
    }
  }

  const light = new Light()
  const turnOnCommand = new Command(
    () => light.turnOn(),
    () => light.turnOff()
  )
  turnOnCommand.execute() // Light is ON
  turnOnCommand.undo() // Light is OFF
  ```

---

9. **适配器模式（Adapter Pattern）**

- **概念** ：将一个类的接口转换成另一个接口，以便兼容不同系统。
- **应用场景** ：
  - 前端组件库的接口适配。
  - 数据格式转换。
- **示例** ：

  ```javascript
  class OldAPI {
    getData() {
      return 'Old API Data'
    }
  }

  class NewAPI {
    fetchData() {
      return 'New API Data'
    }
  }

  class Adapter {
    constructor(api) {
      this.api = api
    }

    getData() {
      if (this.api instanceof OldAPI) {
        return this.api.getData()
      } else if (this.api instanceof NewAPI) {
        return this.api.fetchData()
      }
    }
  }

  const adapter = new Adapter(new NewAPI())
  console.log(adapter.getData()) // New API Data
  ```

---

10. **组合模式（Composite Pattern）**

- **概念** ：将对象组合成树形结构，以表示“部分-整体”的层次结构。
- **应用场景** ：
  - UI 组件树。
  - 文件系统管理。
- **示例** ：

  ```javascript
  class Component {
    constructor(name) {
      this.name = name
    }

    display() {
      console.log(this.name)
    }
  }

  class Composite extends Component {
    constructor(name) {
      super(name)
      this.children = []
    }

    add(child) {
      this.children.push(child)
    }

    display() {
      console.log(this.name)
      this.children.forEach((child) => child.display())
    }
  }

  const root = new Composite('Root')
  const leaf1 = new Component('Leaf 1')
  const leaf2 = new Component('Leaf 2')

  root.add(leaf1)
  root.add(leaf2)
  root.display()
  ```

:::

## 观察者模式和发布订阅模式的区别

::: details

**核心区别**

- **观察者模式：** 两个对象，通知者和观察者，直接关联。
- **发布订阅模式：** 三个对象：事件中心、发布者、订阅者，彼此解耦。

**详细解释**

**1. 定义与结构**

- **观察者模式** ：

  - **简介：** 被观察者（Subject）维护一个观察者列表，状态变化时直接通知观察者（Observers）。
  - **结构：** 被观察者与观察者直接关联。
  - **简单类比：** 像微信群，群主发消息直接通知所有成员。

- **发布订阅模式** ：
  - **简介：** 通过事件中心（Event Bus）解耦发布者和订阅者。发布者将消息交给事件中心，事件中心分发给订阅者。
  - **结构：** 发布者、事件中心、订阅者三者解耦。
  - **简单类比：** 像电台广播，听众订阅不同频道，电台播出节目后，只有订阅该频道的听众收到。

**2. 示例代码**

#**观察者模式**

```javascript
class Subject {
  constructor() {
    this.observers = []
  }

  addObserver(observer) {
    this.observers.push(observer)
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data))
  }
}

class Observer {
  update(data) {
    console.log(`Received: ${data}`)
  }
}

const subject = new Subject()
subject.addObserver(new Observer())
subject.notify('Hello')
```

#**发布订阅模式**

```javascript
class EventBus {
  constructor() {
    this.events = {}
  }

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
  }

  publish(event, data) {
    ;(this.events[event] || []).forEach((callback) => callback(data))
  }
}

const eventBus = new EventBus()
eventBus.subscribe('greet', (data) => console.log(`Received: ${data}`))
eventBus.publish('greet', 'Hello Subscribers!')
```

**区别总结**

| 特性     | 观察者模式             | 发布订阅模式           |
| -------- | ---------------------- | ---------------------- |
| 依赖关系 | 被观察者直接通知观察者 | 发布者与订阅者解耦     |
| 中介角色 | 无                     | 事件中心               |
| 适用场景 | 状态变化通知           | 广播消息，模块解耦     |
| 耦合度   | 高                     | 低                     |
| 触发方式 | 被观察者主动触发       | 发布者通过事件中心触发 |

**选择建议**

- **观察者模式：** 适合对象依赖明确的场景，如模型与视图同步。
- **发布订阅模式：** 适合模块解耦的场景，如前端事件总线。

**实践应用**

- **观察者模式：** Vue 2.x 的响应式系统。
- **发布订阅模式：** Node.js 的 `EventEmitter`、Vue 3.x 的事件总线。

**总结类比帮助记忆**

- **观察者模式：** 直接通知像微信群消息通知所有人。
- **发布订阅模式：** 广播消息像电台分发到不同订阅频道。

:::

## 后端返回 10w 条数据，前端该如何处理？

::: details

当前如果后端一次返回 10w（100,000）条数据，直接在前端全部加载和渲染会导致内存占用高、页面卡顿、响应缓慢等性能问题。因此，处理这类大数据集时应采用以下策略：

1. 服务器端分页和过滤

- **服务器端分页：** 最理想的方法是让后端只返回当前页面所需的数据，通过接口传递分页参数（例如 page 和 limit）。这样前端只处理少量数据，减轻渲染压力。
- **服务器端过滤和排序：** 在后端做数据筛选，只返回满足条件的数据，进一步减少前端接收的数据量。

2. 前端虚拟化技术

- **虚拟滚动（Virtual Scrolling）：** 如果一定要在前端加载大数据集，采用虚拟列表技术仅渲染当前可见区域的数据项。例如使用 React 的 [react-window](https://github.com/bvaughn/react-window) 或 [react-virtualized](https://github.com/bvaughn/react-virtualized)；对于 Vue 也有类似的虚拟列表组件。
- **懒加载（Lazy Loading）：** 仅在用户滚动或交互时动态加载数据，避免一次性加载所有数据。

3. 异步数据处理

- **Web Worker：** 若前端需要对数据进行复杂计算，可以使用 Web Worker 将计算放到后台线程，避免阻塞主线程。
- **分批渲染：** 将数据分为小批次，逐步渲染到页面上，从而分摊渲染开销，保持 UI 流畅。

4. 数据缓存与状态管理

- **数据缓存：** 对于已加载的数据可以使用内存缓存或者 IndexedDB 缓存，避免重复请求，提升用户体验。
- **状态管理工具：** 使用 Redux、Vuex 等状态管理工具，结合分页、懒加载策略管理大数据集的状态，避免全量数据占用内存。

总结

最佳实践是尽量避免一次性将所有 10w 条数据传输到前端显示，优先在服务器端进行分页和过滤；如果确实需要在前端处理大量数据，则应采用虚拟化、懒加载和异步处理等技术以保障页面性能和用户体验。

这种综合策略能有效平衡用户体验与数据处理能力，避免前端资源耗尽的问题。

:::

## 一个网页，一开始很流畅，越用越卡顿，你怎么办？

::: details

**1. 内存泄漏检查**

- **表现：** 内存占用持续上升，不释放。
- **解决方案：**
  - 使用 Chrome DevTools 的 **Memory 面板** ，录制快照 (Heap Snapshot)，查看 DOM 节点、事件监听器是否未被正确清理。
  - 确保组件卸载时清除定时器、事件监听 (`removeEventListener`) 和订阅。
  - 避免闭包导致无法释放变量。

---

**2. 不必要的状态和数据堆积**

- **表现：** 前端状态或数据管理混乱，状态持续增长。
- **解决方案：**
  - 检查状态管理工具（Redux、Vuex）中的数据，避免存储大规模冗余数据。
  - 使用数据分页、懒加载策略，减少前端数据体积。
  - 清理过期缓存数据，避免 IndexedDB 或 LocalStorage 无限堆积。

---

**3. 节流和防抖优化**

- **表现：** 频繁用户交互导致过多重渲染或计算。
- **解决方案：**
  - 使用 `throttle` 和 `debounce` 控制滚动、输入等高频事件。
  - 框架层面可使用 React.memo、Vue 的 computed 属性等避免不必要渲染。

---

**4. DOM 操作与渲染性能优化**

- **表现：** 频繁重排重绘，页面渲染卡顿。
- **解决方案：**
  - 检查是否有频繁的 DOM 操作，优化为批量更新。
  - 使用虚拟 DOM 或虚拟滚动（virtual scrolling）技术。
  - 尽量避免触发 Layout Throttle 属性（如 `offsetWidth`、`getBoundingClientRect()`）。

---

**5. 垃圾回收 (GC) 问题**

- **表现：** 短时间内频繁的卡顿现象。
- **解决方案：**
  - 检查大对象频繁创建导致的 GC 开销。
  - 优化对象复用策略，减少不必要的内存分配。

---

**6. 资源管理优化**

- **表现：** 资源加载越来越慢。
- **解决方案：**
  - 使用 `IntersectionObserver` 实现懒加载，避免图片和第三方资源过早加载。
  - 确保 WebSocket 连接、第三方 SDK 及时关闭。

---

**7. 工具与监控**

- **工具：**
  - **Chrome DevTools：** 内存分析（Heap）、性能分析（Performance）。
  - **Lighthouse:** 检查性能瓶颈。
  - **前端监控平台（如 Sentry）：** 收集卡顿和性能数据。

通过系统化分析和优化，逐步解决页面卡顿问题，提升用户体验。

:::

## 一个 web 系统，加载很慢，交给你来优化，你会怎么办？

::: details

**1. 性能分析与瓶颈定位**

- **使用 Chrome DevTools 的 Performance 和 Network 面板** ，分析页面加载的时间消耗，找出以下关键瓶颈：
  - **白屏时间** （First Paint）过长
  - **首屏渲染时间** （Largest Contentful Paint, LCP）过慢
  - **阻塞资源** 导致延迟加载
  - **API 请求过多或响应时间长**

---

**2. 资源加载优化**

- **减少 HTTP 请求数量：**
  - 合并 CSS、JS 文件，或者采用 Tree Shaking 去掉无用代码。
  - 使用雪碧图（Sprites）处理小图片，或者直接改用 SVG。
- **压缩与优化资源：**
  - 压缩图片（使用 WebP），优化视频大小。
  - 压缩 JS、CSS、HTML 文件，开启 Gzip 或 Brotli 压缩。
- **Lazy Loading：**
  - 延迟加载图片和视频，使用 `loading="lazy"` 属性。
  - 采用懒加载策略来加载非首屏模块。

---

**3. 静态资源缓存**

- **启用浏览器缓存：**
  设置 `Cache-Control`、`ETag` 等响应头，缓存静态资源。

- **使用 CDN：**
  静态资源分发到 CDN 节点，减少服务器负载。

---

**4. 网络传输优化**

- **启用 HTTP/2 或 HTTP/3:** 并行加载资源，降低传输延迟。
- **减少跨域请求:** 优化 API 接口分布，避免预检请求（OPTIONS）。
- **开启 DNS 预解析:** 提前解析第三方域名。

---

**5. 渲染与框架性能优化**

- **服务端渲染（SSR）/静态生成（SSG）：**
  减少客户端渲染时间，提升首屏性能。
- **组件懒加载:** 分离路由和组件，按需加载代码。
- **虚拟化列表:** 渲染大量数据时使用 `react-window` 或类似方案。

---

**6. 后端与 API 优化**

- **数据库优化：**

  - 建立索引，优化查询。
  - 数据库结果分页返回。

- **接口合并与优化：**
  减少多次 API 调用，使用 GraphQL 或批量 API。

- **缓存策略：**
  使用 Redis 等缓存热点数据，减轻数据库查询压力。

---

**7. 用户体验提升**

- **骨架屏:** 在加载内容前显示占位图，减少白屏时间。
- **Loading 动画:** 提升用户感知体验。

---

**8. 监控与持续优化**

- **引入性能监控工具:**
  - Lighthouse 进行性能分析。
  - Sentry 捕获性能问题。
  - Web Vitals（FCP、LCP、CLS）实时监控。

通过系统化分析和持续优化，可以显著提升 Web 系统的加载性能，带来更流畅的用户体验。

:::

## 你知道哪些前端或 JS 工具链？它们分别什么作用？

::: details

前端和 JavaScript 工具链中包含构建、打包、编译、优化等工具，它们为前端开发提供高效的开发和生产环境支持。以下是一些常见工具及其作用：

**1. 构建与打包工具**

**Webpack**

- **作用：** 模块打包工具，支持各种静态资源（JS、CSS、图片等）的处理。
- **特点：** 插件和 Loader 丰富，适用于大型复杂项目。
- **场景：** 传统企业项目、需要自定义复杂配置的大型项目。

**Vite**

- **作用：** 现代前端开发工具，基于原生 ES 模块，提供极速开发服务器。
- **特点：** 开发阶段几乎无需打包，HMR 快速；生产环境基于 Rollup 打包。
- **场景：** 适合 Vue、React 等现代框架项目。

**Rollup**

- **作用：** 模块打包工具，擅长打包库和工具类代码。
- **特点：** 输出体积小、支持 ES 模块优化。
- **场景：** 用于打包 JS 库，如工具函数库。

---

**2. 编译与转译工具**

**Babel**

- **作用：** 将现代 JavaScript 转译为兼容旧浏览器的代码。
- **特点：** 支持最新 JS 特性的编译，如 ES6、TypeScript。
- **场景：** 需要兼容低版本浏览器的项目。

**SWC (Speedy Web Compiler)**

- **作用：** 超高速 JavaScript 和 TypeScript 编译器。
- **特点：** 性能比 Babel 高出数倍，基于 Rust 编写。
- **场景：** 追求编译速度的项目，如大型 React 应用。

**esbuild**

- **作用：** 超快速构建工具，支持打包与编译。
- **特点：** 性能极高，支持 TypeScript 和 JSX 转译。
- **场景：** 极简配置、需要高性能构建的项目。

---

**3. 包管理工具**

**npm (Node Package Manager)**

- **作用：** 管理项目依赖和包。
- **特点：** 官方 Node.js 包管理工具。

**Yarn**

- **作用：** 更高效、更安全的包管理工具。
- **特点：** 并行安装依赖，比 npm 更快。

**pnpm**

- **作用：** 高性能包管理工具。
- **特点：** 去重依赖管理，占用磁盘空间少。

---

**4. 静态代码检查与格式化**

**ESLint**

- **作用：** 检测和规范 JavaScript 代码风格。

**Prettier**

- **作用：** 自动格式化代码，保持一致的代码风格。

---

**5. 任务自动化工具**

**Gulp**

- **作用：** 自动化任务运行器，用于构建流程管理（如压缩、编译等）。
- **特点：** 基于流的构建方式。

**Parcel**

- **作用：** 零配置的打包工具。
- **特点：** 自动处理依赖关系，适合快速开发原型。

---

**6. 测试工具**

**Jest**

- **作用：** JavaScript 单元测试框架。

**Cypress**

- **作用：** 前端端到端测试工具。

---

**总结**

选择工具需要结合项目规模、性能要求和团队技术栈，例如：

- **快速开发：** 选择 Vite + esbuild。
- **大型复杂项目：** 使用 Webpack + Babel。
- **库开发：** Rollup 是不错的选择。
- **追求编译性能：** 考虑 SWC 或 esbuild。

:::
