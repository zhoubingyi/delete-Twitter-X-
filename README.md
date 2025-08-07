📄 This README is available in: [中文 (简体)](./README.zh.md) | English (current)

# 🧹 Auto Bulk Tweet Deletion Script

> A browser script for automatically deleting tweets and replies on Twitter Web.  
> Supports menu clicking, delete confirmation, auto-scrolling, and scroll-boosting every 5 deletions to load more content efficiently.

---

## 🧩 Features

- ✅ Automatically finds the menu button on tweets or replies  
- ✅ Clicks the "Delete" option and confirms it  
- 🔁 Scrolls further every 5 deletions to load more content  
- ⚙️ Auto-retries and skips tweets if deletion fails  
- 🌐 Works with both English and Chinese Twitter interfaces

---

## 🧭 Supported Deletion Types

| Type           | Supported | Run Script on Page     |
|----------------|-----------|------------------------|
| Original Tweets | ✅ Yes    | Profile page           |
| Replies         | ✅ Yes    | Replies tab (Profile)  |
| Retweets        | ❌ No     | —                      |
| Likes (Unlike)  | ❌ No     | —                      |

> To delete replies, go to your **Replies tab** under your Twitter profile, then run the script there.

---

## 🌐 Requirements

- Twitter on desktop browser  
- Logged-in account  
- JavaScript-enabled browser (ES6+)

---

## 🚀 How to Use

1. Open Twitter and log in to your account  
2. For original tweets: go to your **Profile** page  
3. For replies: go to your **Replies** tab under Profile  
4. Open Developer Tools (`F12` or `Cmd+Option+I`), then go to Console  
5. Paste the script and press Enter – deletion will start automatically  

> You’ll see bilingual logs in the console showing deletion progress.

---

## ⚠️ Notes

- Deletion is **irreversible** – use with caution  
- Retweets and Likes are **not yet supported**  
- Don’t refresh or navigate away while the script runs  
- Increase the delay in the script if your page loads slowly  

---

## ✅ DONE

- [x] Support for deleting original tweets  
- [x] Support for deleting replies (run from Replies tab)  
- [x] Scroll distance increases after every 5 deletions  
- [x] Bilingual (English + Chinese) log output  
- [x] Auto-skip and retry on errors  
- [x] UI support for both English and Chinese Twitter

---

## 🔧 TODO

- [ ] ❌ Support deleting **Retweets**  
- [ ] ❌ Support unliking **Liked Tweets**  
- [ ] ⏳ Auto-detect current content type (tweet/reply/retweet)  
- [ ] ⏳ Provide UI panel to select deletion mode  
- [ ] ⏳ Convert to browser extension

---

## ⚖️ Disclaimer

This script is for **educational and personal use only**.  
Deleting tweets or replies is **permanent and irreversible**.  
Use responsibly. The author is not liable for any data loss or misuse.

---