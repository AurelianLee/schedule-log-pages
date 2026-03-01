# 日程日志 · 网页与 PWA

- **index.html**：入口页。手机/触屏或视口 &lt;1280px 时自动跳转「填写今日」；否则跳转「查看总览」。需手动选择时可打开 `index.html?choose`。主屏图标（PWA start_url）直接打开编辑页，进总览需在编辑页点「总览」。
- **schedule_edit.html**：今日编辑页（PWA 主入口），填写 7:00～23:00 日程，可保存到本地、导出 CSV。支持「添加到主屏幕/程序坞」当轻量 app 用。
- **schedule.html**：总览页，年度/月度切换查看日程。**月度表**为每小时任务概况（严格最多 10 字）；**点击有内容的格子**可弹出该小时详细内容，支持在弹层内修改「概况」与「详细内容」并保存到本机（localStorage），手机/电脑均可用。首次打开使用构建时注入的数据；**「刷新」**从 `../entries.csv` 拉取并重绘（需 HTTP 打开）。
- **index.html**：入口页，提供「填写今日」「查看总览」两个入口。
- **manifest.json** + **icon.svg** + **sw.js**：PWA 配置与离线缓存。定时提醒与安装方式见上级目录 `README_remind.md`。

- **年度**：按 12 个月展示，每月下列出各周及该周记录条数。
- **月度**：选择某年某月后，按周表展示（行=7:00～23:00，列=周日～周六），与 Numbers 周表一致。
- **大屏直跳当月**：当视口宽度 ≥1024px（如 Mac 桌面）时，首次打开总览页会直接进入「当日所在月」的月度视图，便于大屏快速查看本周/本月日程。

## 更新数据后（开发改动后前端同步）

- **「刷新」按钮**：通过本地服务（如 `schedule_log_serve.sh`）打开总览页时，点击「刷新」会请求 `../entries.csv` 并重绘，无需重新跑构建脚本。以 file:// 打开时刷新会整页重载（数据仍为构建时嵌入）。
- **仅重建**：`./scripts/schedule_log_refresh.sh`
- **重建并打开（file://）**：`./scripts/schedule_log_refresh.sh --open`
- **重建 + 本地服务 + 自动刷新**：`./scripts/schedule_log_refresh.sh --serve`  
  用本地 HTTP 打开展示页后，之后每次运行 `schedule_log_refresh.sh` 重建，页面会在约 3 秒内**自动刷新**，无需手动 F5。
- 若已安装 pre-commit，提交时若暂存了 `entries.csv` 或相关脚本，会自动重建并纳入本次提交。

会覆盖 `schedule.html` 与 `schedule_edit.html`；通过 `--serve` 打开时，改动后跑一次 refresh 即可自动看到最新。
