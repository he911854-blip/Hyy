import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { prisma } from '../config/prisma.js'
import { uploadDirectory } from '../config/upload.js'

const demoProjects = [
  { name: '演示｜智慧商城移动端', description: '面向移动端的商城体验升级与核心下单链路优化。', status: 'RUNNING' as const, progress: 25, document: '商城移动端需求说明.md', documentContent: '# 智慧商城移动端\n\n演示项目资料：核心用户流程与需求说明。', tasks: [{ title: '梳理核心购买流程', status: 'DONE' as const, priority: 'HIGH' as const, assignee: '林然' }, { title: '完成商品详情页设计', status: 'DOING' as const, priority: 'HIGH' as const, assignee: '张晓' }, { title: '接入购物车接口', status: 'TODO' as const, priority: 'MEDIUM' as const, assignee: '陈晨' }, { title: '准备可用性测试', status: 'TODO' as const, priority: 'LOW' as const, assignee: '王芳' }] },
  { name: '演示｜企业官网改版', description: '企业品牌官网的信息架构、视觉与发布流程改版。', status: 'RUNNING' as const, progress: 33, document: '官网改版发布计划.md', documentContent: '# 企业官网改版\n\n演示项目资料：发布节奏与验收清单。', tasks: [{ title: '确认品牌视觉方向', status: 'DONE' as const, priority: 'MEDIUM' as const, assignee: '周宁' }, { title: '开发首页响应式布局', status: 'DOING' as const, priority: 'HIGH' as const, assignee: '李雷' }, { title: '部署预发布环境', status: 'TODO' as const, priority: 'HIGH' as const, assignee: '赵强' }] },
  { name: '演示｜客户数据平台', description: '统一客户数据指标与运营数据看板，支持团队决策。', status: 'COMPLETED' as const, progress: 100, document: '客户数据平台复盘.md', documentContent: '# 客户数据平台\n\n演示项目资料：项目复盘与交付摘要。', tasks: [{ title: '定义核心数据指标', status: 'DONE' as const, priority: 'MEDIUM' as const, assignee: '周宁' }, { title: '搭建运营数据看板', status: 'DONE' as const, priority: 'HIGH' as const, assignee: '陈晨' }, { title: '完成交付复盘', status: 'DONE' as const, priority: 'LOW' as const, assignee: '林然' }] },
]

export async function seedDemoData() {
  const existingNames = new Set((await prisma.project.findMany({ where: { name: { in: demoProjects.map((project) => project.name) } }, select: { name: true } })).map((project) => project.name))
  let projects = 0
  let tasks = 0
  let documents = 0

  for (const demo of demoProjects) {
    if (existingNames.has(demo.name)) continue
    const storedFilename = `demo-${demo.document}`
    const content = demo.documentContent
    await writeFile(path.join(uploadDirectory, storedFilename), content, 'utf8')
    await prisma.project.create({ data: { name: demo.name, description: demo.description, status: demo.status, progress: demo.progress, tasks: { create: demo.tasks.map((task) => ({ ...task, description: 'GeekFlow 演示数据任务。' })) }, documents: { create: { filename: demo.document, filepath: path.posix.join('uploads', storedFilename), type: 'text/markdown', size: Buffer.byteLength(content) } } } })
    projects += 1
    tasks += demo.tasks.length
    documents += 1
  }

  return { projects, tasks, documents }
}
