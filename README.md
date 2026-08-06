# GeekFlow MVP

GeekFlow 是一个 AI 辅助项目管理工作台。MVP 聚焦项目、任务、看板、资料与规则型 AI 洞察，适合用于产品演示和小团队协作验证。

## 功能

- 项目 CRUD、进度自动计算与项目详情
- 项目内任务 CRUD、状态切换与 Kanban 拖拽
- 本地文件资料上传、列表与删除
- 规则型 AI 项目分析与项目周报
- 实时 Dashboard：统计、最近项目/任务、风险提醒
- 幂等加载演示数据：3 个项目、10 个任务、3 份资料

## 技术栈

- 前端：React、TypeScript、Vite、Tailwind CSS、React Router、dnd-kit
- 后端：Node.js、Express、TypeScript
- 数据库：SQLite、Prisma
- 文件：本地持久化目录（生产环境挂载磁盘）
- AI：规则型 Mock AI，未接入真实 LLM

## 项目结构

```text
GeekFlow-MVP/
├── frontend/                     # React + Vite 前端
│   ├── src/components/            # UI、Kanban、AI、资料等组件
│   ├── src/pages/                 # 页面路由
│   ├── src/services/api.ts        # 统一 API 请求
│   ├── .env.example               # 本地前端变量模板
│   ├── .env.production.example    # 生产前端变量模板
│   └── vercel.json                # Vercel SPA 路由回退
├── backend/                       # Express + Prisma 后端
│   ├── prisma/                    # SQLite Schema 与迁移
│   ├── src/controllers/           # API 控制器
│   ├── src/services/              # 业务、AI、统计、演示数据服务
│   ├── src/routes/                # API 路由
│   ├── uploads/                   # 本地上传文件（生产环境挂载磁盘）
│   ├── .env.example               # 本地后端变量模板
│   └── .env.production.example    # 生产后端变量模板
└── render.yaml                    # Render 后端部署清单
```

## 本地运行

要求：Node.js 20+、npm。

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

新开一个终端：

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

访问 `http://localhost:5173`。首次体验可在 Dashboard 点击“加载演示数据”。

## 环境变量

前端：

| 变量 | 说明 | 本地示例 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 后端 API 基础地址，构建时注入 | `http://localhost:3000` |

后端：

| 变量 | 说明 | 本地示例 |
| --- | --- | --- |
| `PORT` | Express 监听端口 | `3000` |
| `DATABASE_URL` | SQLite 数据库文件地址 | `file:./dev.db` |
| `CLIENT_ORIGIN` | 允许访问 API 的前端域名；多个值用逗号分隔 | `http://localhost:5173,http://127.0.0.1:5173` |
| `UPLOAD_DIR` | 上传文件保存目录 | `./uploads` |
| `NODE_ENV` | 运行环境 | `production`（仅生产） |

不要提交真实 `.env` 文件。生产变量参考对应的 `.env.production.example`。

## 生产构建与启动

```bash
cd frontend && npm run build
cd backend && npm run build
cd backend && npm run start
```

前端构建产物在 `frontend/dist/`。后端 `npm run start` 会先执行 `prisma migrate deploy`，再启动编译后的 Express 服务。

## 部署方案：Vercel + Render

前端部署到 Vercel，后端部署到 Render。当前 `render.yaml` 配置为 **Render Free 演示环境**，不需要付款方式；SQLite 数据与上传资料会在 Render 服务重启、休眠或重新部署后丢失，仅适合短期在线演示。

如需长期保存项目数据与上传文件，请将 `render.yaml` 的 `plan` 改为 `starter`，并挂载 `/var/data` 持久磁盘；Render 默认文件系统是临时的，持久磁盘可保存指定路径的数据。[Render 持久磁盘文档](https://render.com/docs/disks)

### 1. 部署后端到 Render

1. 将仓库推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Render 使用仓库根目录的 `render.yaml` 创建 Blueprint。
3. 为服务配置 `CLIENT_ORIGIN`，值为 Vercel 生产域名，例如 `https://your-geekflow.vercel.app`。
4. Free 演示环境保留 `DATABASE_URL=file:./geekflow-demo.db` 与 `UPLOAD_DIR=./uploads`。
5. 部署完成后访问 `https://<render-service>.onrender.com/api/health`，应返回数据库连接正常状态。

`render.yaml` 的启动脚本会在运行时执行 Prisma 迁移。

### 2. 部署前端到 Vercel

1. 在 Vercel 导入同一个仓库，**Root Directory** 设为 `frontend`。
2. 设置环境变量：`VITE_API_BASE_URL=https://<render-service>.onrender.com`。
3. 使用默认 Vite 构建命令 `npm run build` 与输出目录 `dist`。
4. 部署后，将生成的 Vercel 域名回填到 Render 的 `CLIENT_ORIGIN`，然后触发一次后端重新部署。

`frontend/vercel.json` 已配置 React Router 的 SPA 路由回退，支持直接访问项目详情等深层链接。[Vercel Vite 部署文档](https://vercel.com/docs/frameworks/frontend/vite)

## API 概览

- `GET /api/health`
- `GET /api/dashboard/stats`、`POST /api/demo/seed`
- `GET/POST /api/projects`、`GET/PUT/DELETE /api/projects/:id`
- `GET/POST /api/projects/:projectId/tasks`、`GET /api/tasks`、`GET/PUT/DELETE /api/tasks/:id`
- `GET/POST /api/projects/:projectId/documents`、`DELETE /api/documents/:id`
- `POST /api/ai/project-analysis`、`POST /api/ai/project-report`
