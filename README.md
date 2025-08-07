# 🧹 自动批量删除推文脚本 / Auto Bulk Tweet Deletion Script

> 一个自动在网页端批量删除原创推文的脚本，支持自动点击菜单、删除推文、确认操作，并且每删除 5 条，自动加大页面滚动范围以加快加载更多推文。  
> An automated script to bulk delete original tweets via browser console, supporting auto-clicking menus, confirming deletions, and increasing scroll range every 5 deletions to improve tweet loading.

---

## 🈶 中文说明 / 中文版 Usage (Chinese)

### 🧩 功能特色

- ✅ 自动查找每条推文右上角菜单按钮  
- ✅ 自动点击“删除”按钮并确认  
- 🔁 每删除 5 条，页面滚动范围自动增加  
- ⚙️ 出错自动重试，跳过无法处理的推文  
- 🔍 支持中英文 Twitter 界面

### 🌐 使用环境

- Twitter 网页端（desktop web）
- 需要登录你的账号，并访问自己的主页（https://twitter.com/你的用户名）
- 浏览器需支持 JavaScript ES6+

### 🚀 使用方法

1. 打开浏览器，登录你的 Twitter 账号  
2. 访问你的个人主页，确保页面展示了你发布的推文  
3. 按 `F12` 或 `Cmd+Option+I` 打开开发者工具，切换到「Console 控制台」  
4. 将脚本完整粘贴进去并回车执行  
5. 等待脚本自动删除推文，控制台将打印详细进度日志（中英双语）

### ⚠️ 注意事项

- 本脚本**目前仅支持删除原创推文**，无法删除转推（Retweet）与回复（Reply）
- 删除操作不可撤销，请谨慎使用
- 执行期间请保持页面不要刷新或跳转
- 删除速度过快可能造成页面响应延迟，可在脚本中适当增加 `delay` 值
- Twitter UI 更新可能导致脚本失效，如遇问题请更新选择器

---

## 🌍 English Usage / English Version

### 🧩 Features

- ✅ Automatically finds the menu button for each tweet  
- ✅ Clicks the "Delete" option and confirms it  
- 🔁 After every 5 deletions, increases scroll distance  
- ⚙️ Skips and retries tweets if deletion fails  
- 🌐 Supports both English and Chinese Twitter UI

### 🌐 Environment

- Twitter desktop web interface  
- You must be logged into your account and on your profile page  
- Browser must support JavaScript ES6+

### 🚀 How to Use

1. Log in to Twitter in your browser  
2. Go to your profile page where tweets are listed  
3. Open DevTools (press `F12` or `Cmd+Option+I`) and go to the Console tab  
4. Paste the full script and press Enter to run  
5. Script will auto-delete tweets and log bilingual progress messages

### ⚠️ Notes

- Currently supports **original tweets only** (no Retweets or Replies)  
- Deletions are permanent – use responsibly  
- Do not refresh or leave the page during execution  
- Adjust delays in the script if Twitter responds too slowly  
- Twitter UI changes might require updates to this script

---

## ✅ DONE

- [x] 支持自动批量删除原创推文  
- [x] 每删除 5 条自动提升页面滚动距离  
- [x] 中英双语日志提示  
- [x] 异常处理与跳过失败项  
- [x] 支持桌面端浏览器，兼容中英文界面

---

## 🔧 TODO（待办事项）

- [ ] ❌ 目前无法识别并删除**转推（Retweets）**
- [ ] ❌ 目前无法识别并删除**评论/回复（Replies）**
- [ ] ❌ 暂不支持**取消点赞（Unlike Tweets）**
- [ ] [可选] 增加“选择删除类型”的交互（原创 / 回复 / 转推）
- [ ] [可选] 增加可视化 UI 面板运行脚本

---

## ⚖️ Disclaimer

This script is intended for **personal use only**. Deleting tweets is an irreversible action.  
Use with caution. The author is not responsible for any data loss or misuse.

---