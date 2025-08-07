(async function () {
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	let deleted = 0;

	function findVisibleTweetMenuButtons() {
		const tweetArticles = [...document.querySelectorAll("article")];
		const buttons = [];

		tweetArticles.forEach((article) => {
			const menuBtn = article.querySelector('button[data-testid="caret"], button[aria-label="更多"]');
			if (menuBtn && menuBtn.getAttribute("aria-expanded") === "false") {
				buttons.push({ article, menuBtn });
			}
		});

		return buttons;
	}

	async function waitFor(conditionFn, timeout = 2000, interval = 50) {
		const start = Date.now();
		while (Date.now() - start < timeout) {
			const result = conditionFn();
			if (result) return result;
			await delay(interval);
		}
		return null;
	}

	async function waitForMenuOpen(timeout = 1500) {
		return await waitFor(() => {
			const menu = document.querySelector('div[role="menu"]');
			return menu && menu.offsetParent !== null;
		}, timeout);
	}

	async function clickMenuAndDelete() {
		const tweetButtons = findVisibleTweetMenuButtons();
		console.log(`📍 找到 ${tweetButtons.length} 个推文菜单按钮`);

		for (const { article, menuBtn } of tweetButtons) {
			try {
				article.scrollIntoView({ behavior: "instant", block: "center" });
				await delay(80);

				// 清除焦点避免干扰菜单
				document.activeElement?.blur?.();
				menuBtn.click();
				await delay(150);

				let menuOpened = await waitForMenuOpen(1500);
				if (!menuOpened) {
					// 第一次失败后尝试关闭菜单重新点击
					document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
					await delay(150);
					menuBtn.click();
					await delay(200);
					menuOpened = await waitForMenuOpen(1500);
				}

				if (!menuOpened) {
					console.log("❌ 菜单没打开，跳过该推文");
					continue;
				}

				const deleteItem = await waitFor(
					() =>
						[...document.querySelectorAll('div[role="menuitem"]')].find((el) =>
							/删除|delete/i.test(el.innerText)
						),
					1200
				);

				if (!deleteItem) {
					console.log("❌ 没找到“删除”按钮，关闭菜单并跳过");
					document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
					await delay(100);
					continue;
				}

				// 尝试点击删除
				deleteItem.click?.();
				await delay(300);

				const confirmBtn = await waitFor(
					() => document.querySelector('[data-testid="confirmationSheetConfirm"]'),
					1500
				);

				if (confirmBtn) {
					confirmBtn.click();
					deleted++;
					console.log(`✅ 已删除第 ${deleted} 条`);
				} else {
					console.log("⚠️ 找不到确认按钮，可能已取消删除");
				}

				await delay(600);
			} catch (err) {
				console.warn("❌ 删除失败：", err.message);
				await delay(500);
			}
		}
	}

	async function autoScrollAndDelete(maxLoops = 100) {
		for (let i = 0; i < maxLoops; i++) {
			await clickMenuAndDelete();

			// 每删除 5 条推文，滚动更多防止卡住加载
			const baseScroll = document.body.scrollHeight;
			const extraScroll = Math.floor(deleted / 5) * 1000;

			window.scrollTo(0, baseScroll + extraScroll);
			await delay(1500);
		}

		console.log(`🎉 删除完成，已尝试删除 ${deleted} 条推文`);
	}

	await autoScrollAndDelete();
})();
