(async function () {
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	let deleted = 0;

	// 更稳健的从页面读取用户名（带@）
	function getMyUsernameFromPage() {
		const spans = document.querySelectorAll("span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3");
		for (const span of spans) {
			const text = span.innerText?.trim();
			if (text && text.startsWith("@")) {
				return text;
			}
		}
		return null;
	}

	// 删除所有侧边栏元素
	document
		.querySelectorAll('div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1hycxz[data-testid="sidebarColumn"]')
		.forEach((el) => el.remove());

	const myUsername = getMyUsernameFromPage();
	if (!myUsername) {
		console.error("❌ 无法获取用户名，请检查页面结构 / ❌ Unable to get username, please check page structure");
		return;
	}
	console.log("✅ 识别用户名: " + myUsername + " / ✅ Username detected: " + myUsername);

	function findOwnTweetMenuButtons() {
		const buttons = [...document.querySelectorAll('button[data-testid="caret"], button[aria-label="更多"]')];

		return buttons.filter((btn) => {
			if (btn.getAttribute("aria-expanded") !== "false") return false;

			const article = btn.closest("article");
			if (!article) return false;

			const userNameDiv = article.querySelector('div[data-testid="User-Name"]');
			if (!userNameDiv) return false;

			const userLink = userNameDiv.querySelector('a[href^="/"]');
			if (!userLink) return false;

			const usernameFromHref = userLink.getAttribute("href").replace(/^\/+/, "").toLowerCase();

			return usernameFromHref === myUsername.replace(/^@/, "").toLowerCase();
		});
	}

	async function waitFor(conditionFn, timeout = 1500, interval = 50) {
		const start = Date.now();
		while (Date.now() - start < timeout) {
			const result = conditionFn();
			if (result) return result;
			await delay(interval);
		}
		return null;
	}

	async function waitForMenuOpen(timeout = 1000) {
		return await waitFor(() => {
			const menu = document.querySelector('div[role="menu"]');
			return menu && menu.offsetParent !== null;
		}, timeout);
	}

	async function clickMenuAndDelete() {
		let consecutiveMenuFails = 0;

		const buttons = findOwnTweetMenuButtons();
		console.log(`🔍 找到 ${buttons.length} 个属于自己的菜单按钮 / Found ${buttons.length} own tweet menu buttons`);

		for (const btn of buttons) {
			try {
				btn.scrollIntoView({ behavior: "instant", block: "center" });
				await delay(100);

				btn.click();
				await delay(100);

				let menuOpened = await waitForMenuOpen();
				if (!menuOpened) {
					document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
					await delay(100);

					btn.click();
					await delay(200);

					menuOpened = await waitForMenuOpen();
				}

				if (!menuOpened) {
					consecutiveMenuFails++;
					console.log(
						`❌ 菜单没打开，跳过该按钮 (连续失败次数: ${consecutiveMenuFails}) / Menu not opened, skipping this button (consecutive fails: ${consecutiveMenuFails})`
					);

					if (consecutiveMenuFails >= 3) {
						console.log(
							"⚠️ 连续3次菜单没打开，触发滚动加载更多推文 / 3 consecutive menu open fails, triggering scroll to load more tweets"
						);
						return false;
					}

					continue;
				} else {
					consecutiveMenuFails = 0;
				}

				let deleteItem = await waitFor(() => {
					return [...document.querySelectorAll('div[role="menuitem"]')].find((el) => {
						const text = el?.innerText?.toLowerCase() || "";
						return text.includes("删除") || text.includes("delete");
					});
				}, 1000);

				if (!deleteItem) {
					console.log(
						'❌ 没找到“删除”按钮，关闭菜单并跳过 / "Delete" option not found, closing menu and skipping'
					);
					document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
					await delay(100);
					continue;
				}

				deleteItem.click();
				await delay(300);

				const confirmBtn = await waitFor(
					() => document.querySelector('[data-testid="confirmationSheetConfirm"]'),
					1500
				);
				if (confirmBtn) {
					confirmBtn.click();
					deleted++;
					console.log(`✅ 已删除第 ${deleted} 条 / Deleted tweet #${deleted}`);
				} else {
					console.log(
						"⚠️ 找不到确认按钮，可能已取消删除 / Confirmation button not found, maybe deletion was cancelled"
					);
				}

				await delay(700);
			} catch (e) {
				console.warn(`❌ 删除失败: ${e.message} / Deletion failed: ${e.message}`);
				await delay(500);
			}
		}

		return true;
	}

	async function autoScrollAndDelete(maxLoops = 100) {
		for (let i = 0; i < maxLoops; i++) {
			const result = await clickMenuAndDelete();

			if (!result) {
				let baseScroll = document.body.scrollHeight;
				let extraScroll = Math.floor(deleted / 5) * 1000;
				window.scrollTo(0, baseScroll + extraScroll);
				console.log(`⬇️ 页面滚动以加载更多推文 / Scrolling down to load more tweets`);
				await delay(1500);
			}
		}

		console.log(`🎉 删除完成，已尝试删除 ${deleted} 条推文 / Done! Attempted to delete ${deleted} tweets`);
	}

	await autoScrollAndDelete();
})();
