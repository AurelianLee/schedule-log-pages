# 日程日志：零条目日期检查报告

**检查时间**：2026-03-02  
**数据范围**：entries.csv 中 2021-12-26 ~ 2026-03-01

## 结论摘要

| 年份 | 零条目天数 | 说明 |
|------|------------|------|
| 2022 | **179 天** | 全部为 2022-07-03 ~ 2022-12-31（下半年缺数） |
| 2023 | 0 | 全年 365 天均有至少 1 条 |
| 2024 | 0 | 全年 366 天均有至少 1 条 |
| 2025 | 0 | 全年 365 天均有至少 1 条 |
| 2026 | 0 | 当前已有数据的日期均有至少 1 条 |

## 2022 年缺数原因

- **不是**周对齐（week0）问题：2022 年 CSV 只有 **28 个周表块**，按当前脚本最多覆盖到约 2022-07-09（或 2022-07-16，视 week0 约定）。
- **原因**：Numbers 导出的「2022年日程日志.csv」本身只包含约 28 周，**未包含 2022 年 7 月中旬之后**的周表，因此 2022-07-03 至 2022-12-31 在底仓中无对应导入数据。
- 若 Numbers 中 2022 年有下半年表格但未导出到该 CSV，需在 Numbers 中补全并重新导出后再导入。

## 前几年与 2026 的周对齐（week0）

- 2026 年已用 `--numbers-week0=jan1-after` 重新导入并修正 2 月底错位。
- 2023、2024、2025 当前**没有**「整天零条」的日期，说明当年导入的块与日期对应关系在可接受范围内；若某年发现整周错位，可对该年 CSV 单独加 `--numbers-week0=jan1-after` 重导并去重。

## 复检命令（项目根下执行）

```bash
python3 -c "
import csv
from collections import defaultdict
from datetime import datetime, timedelta
path = '.context/schedule_log/entries.csv'
by_date = defaultdict(int)
with open(path) as f:
    r = csv.reader(f); next(r)
    for row in r:
        if len(row) >= 1 and row[0]: by_date[row[0].strip()] += 1
start = datetime.strptime(min(by_date), '%Y-%m-%d')
end = datetime.strptime(max(by_date), '%Y-%m-%d')
missing = []
c = start
while c <= end:
    d = c.strftime('%Y-%m-%d')
    if by_date.get(d, 0) == 0: missing.append(d)
    c += timedelta(days=1)
by_year = defaultdict(list)
for d in missing: by_year[d[:4]].append(d)
for y in sorted(by_year): print(y, len(by_year[y]), 'zero-entry days')
"
```
