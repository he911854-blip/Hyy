export type ProjectStatus = '进行中' | '规划中' | '已完成'
export type TaskStatus = '进行中' | '待开始' | '已完成' | '风险'

export const projects = [
  { name: '智慧商城 APP', status: '进行中' as ProjectStatus, progress: 72, updatedAt: '今天更新' },
  { name: '官网重构项目', status: '进行中' as ProjectStatus, progress: 45, updatedAt: '昨天更新' },
  { name: 'CRM 系统升级', status: '规划中' as ProjectStatus, progress: 18, updatedAt: '2 天前更新' },
  { name: '数据中台一期', status: '已完成' as ProjectStatus, progress: 100, updatedAt: '上周更新' },
  { name: '客户门户优化', status: '进行中' as ProjectStatus, progress: 68, updatedAt: '上周更新' },
]

export const tasks = [
  { title: '完成商品详情页交互设计', project: '智慧商城 APP', status: '进行中' as TaskStatus, priority: '高' },
  { title: '梳理 CRM 数据迁移方案', project: 'CRM 系统升级', status: '待开始' as TaskStatus, priority: '高' },
  { title: '部署预发布环境', project: '官网重构项目', status: '风险' as TaskStatus, priority: '紧急' },
  { title: '验收首页视觉稿', project: '官网重构项目', status: '已完成' as TaskStatus, priority: '中' },
  { title: '定义客户中心核心指标', project: '客户门户优化', status: '进行中' as TaskStatus, priority: '中' },
]

export const dashboardStats = [
  { label: '项目数量', value: '5', detail: '较上周新增 1 个项目' },
  { label: '进行中任务', value: '12', detail: '其中 2 个需要重点关注' },
  { label: '整体完成率', value: '68%', detail: '较上周提升 6%' },
  { label: 'AI 建议', value: '4', detail: '发现 2 项延期风险' },
]
