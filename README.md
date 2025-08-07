# 自动批量删除推文脚本 / Auto Bulk Tweet Deletion Script

> 一个自动在网页端批量删除推文的脚本，支持自动点击菜单、删除推文、确认操作，并且每删除 5 条，自动加大页面滚动范围以加快加载更多推文。  
> An automated script to bulk delete tweets on the web, supporting auto-clicking menus, deleting tweets, confirming actions, and increasing scroll range every 5 deletions to speed up loading more tweets.

---

## 中文说明 / 中文版 Usage (Chinese)

### 脚本功能

- 自动查找每条推文右上角菜单按钮  
- 点击菜单后自动寻找“删除”选项并点击  
- 自动点击删除确认按钮完成删除  
- 删除过程中自动滚动页面加载更多推文  
- 每删除 5 条，滚动距离加大 1000px，提高加载效率  
- 错误自动重试，尽量保证删除成功率

### 使用环境

- 适用于 Twitter 网页端（浏览器控制台执行）  
- 需要登录并能正常浏览需要删除的推文  
- 浏览器支持 JavaScript ES6+ 语法

### 使用方法

1. 打开浏览器，登录你的 Twitter 账号  
2. 进入你的推文列表页（Profile 页面）  
3. 打开浏览器控制台 (F12 或 Cmd+Option+I)  
4. 将完整脚本复制粘贴到控制台，按回车执行  
5. 脚本会自动开始删除推文，控制台会输出日志信息

### 注意事项

- 脚本依赖页面元素结构和文本，若 Twitter UI 更新，可能导致失效，需要调整选择器或逻辑  
- 删除推文操作不可逆，请谨慎执行  
- 建议先测试删除几条，确认效果后再批量运行  
- 执行期间请勿刷新或跳转页面，保持页面稳定  
- 若删除速度过快导致页面响应慢，可以适当增加等待时间

---

## English Usage / 英文版说明

### Features

- Automatically finds each tweet’s menu button on top right  
- Clicks menu and searches for the “Delete” option, then clicks it  
- Automatically clicks the confirmation button to complete deletion  
- Scrolls the page to load more tweets during deletion  
- Increases scroll distance by 1000px every 5 deleted tweets to improve loading speed  
- Retries on errors to ensure maximum deletion success rate

### Environment

- Designed for Twitter Web (run inside browser console)  
- Requires logged-in user and visible tweets for deletion  
- Browser supporting JavaScript ES6+ syntax

### How to Use

1. Open browser and log in to your Twitter account  
2. Navigate to your tweets page (Profile)  
3. Open the browser console (F12 or Cmd+Option+I)  
4. Paste the entire script into the console and press Enter  
5. The script will start deleting tweets automatically with logs printed in console

### Notes

- The script depends on page elements and text; Twitter UI changes might break it  
- Deletion is irreversible, use with caution  
- Test on a few tweets before batch deleting  
- Do not refresh or navigate away during execution to keep the page stable  
- If deletion is too fast and slows page, increase delay times in the script

---

## Disclaimer

This script is intended for learning and personal use only. Use responsibly. The author is not responsible for any consequences caused by misuse.

---

## 语言切换建议 / Language Switch Suggestion

在 GitHub README 中，你可以用类似下面的格式，提供语言切换链接：

```markdown
# Auto Bulk Tweet Deletion Script

[🇨🇳 中文说明](./README.zh.md) | [🇺🇸 English Instructions](./README.md)