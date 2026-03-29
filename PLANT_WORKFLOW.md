# 植物卡片自动化工作流

## 添加新植物（全自动）

只需告诉 Claude：

```
添加植物: Wild Bergamot (Monarda fistulosa)
```

或批量：
```
添加以下植物:
- Wild Bergamot (Monarda fistulosa)
- Cardinal Flower (Lobelia cardinalis)
- Blue Wild Indigo (Baptisia australis)
```

Claude 会自动完成：
1. ✅ 从 iNaturalist 获取物种信息 + 下载照片
2. ✅ 调研生长条件（光照、水分、土壤、花色、花期、高度）
3. ✅ 选择 3-4 个标准化 badges（selling_points + cautions + facts）
4. ✅ 撰写 fun_facts、wildlife、companions、planting_steps
5. ✅ 写入 plants.json
6. ✅ 生成网页 + 印刷卡片 + PNG 截图
7. ✅ 输出最终链接

## 工作流协议

Claude 添加新植物时必须遵循以下步骤：

### Step 1: 获取 iNaturalist 数据 + 照片
```bash
node tools/add-plant.js "Common Name" "Scientific Name"
```

### Step 2: 用 AI 知识填充所有 `__NEEDS_RESEARCH__` 字段
直接编辑 `data/plants.json`，填入以下数据（基于 Capital Region NY 环境）：

**Growing conditions:**
- light: Full Sun / Sun to Part / Part Shade / Full Shade
- moisture: Dry / Mesic to Dry / Mesic / Mesic to Wet / Wet
- soil: 描述土壤偏好
- bloom_color: 花色（不加括号技术术语）
- bloom_months: 如 "Jun - Aug"
- height: 如 "2-4'"
- pollinators: 从 [bees, butterflies, hummingbirds, moths, beetles] 选

**Badges (3-4个):**
- selling_points: 从标准词汇表选
- cautions: 如有风险特征则添加
- facts: 独特趣味 badge

**Rich content:**
- fun_facts: 3条（HTML格式，用 `<strong>` 标记关键词）
- wildlife: 2条（与该植物相关的重要动物互动）
- companions: 3种搭配植物（从现有 146 种中优先选）
- planting_steps: 3条种植建议
- notes: 一句话总结

### Step 3: 构建输出
```bash
node tools/pipeline.js build <plant-id>
```

### Step 4: 验证
```bash
node tools/pipeline.js verify
```

## 标准化词汇表

### Selling Points（23种）
Caterpillar Host, Deer Resistant, Drought Tolerant, Early Bloomer,
Easy to Grow, Erosion Control, Fall Color, Fast Growing, Fragrant,
Fragrant Foliage, Ground Cover, Late Bloomer, Long Blooming,
Nitrogen Fixing, Pollinator Magnet, Rabbit Resistant, Rain Garden,
Rock Garden, Self-Seeding, Shade Garden, Shade Tolerant, Wildlife Food,
Winter Interest

### Cautions（7种）
Deep Roots, Late to Emerge, Needs Male & Female, Spreads by Root,
Spreads by Seed, Thorns, Toxic to Humans

### Facts（独特 badge）
每个植物一个唯一的趣味标签，如：Monarch Host, Hummingbird Beacon, Tea Plant 等
