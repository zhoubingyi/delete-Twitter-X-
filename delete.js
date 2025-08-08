(async function () {
	// 删除所有侧边栏元素
	const sidebars = document.querySelectorAll(
		'div.css-175oi2r.r-aqfbo4.r-1l8l4mf.r-1hycxz[data-testid="sidebarColumn"]'
	);
	sidebars.forEach((el) => el.remove());

	// 延迟函数，方便控制异步等待时间 / Delay function to await for given milliseconds
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	let deleted = 0; // 记录已删除的推文数量 / Count of deleted tweets

	// 找到所有未展开的菜单按钮（推文右上角的更多按钮） / Find all unopened menu buttons (tweet "More" buttons)
	function findMenuButtons() {
		return [...document.querySelectorAll('button[data-testid="caret"], button[aria-label="更多"]')].filter(
			(btn) => btn.getAttribute("aria-expanded") === "false"
		); // 过滤掉已经展开的菜单按钮 / Filter out buttons that are already expanded
	}

	// 等待条件成立，超时则返回 null / Wait until conditionFn returns truthy or timeout (ms) expires
	async function waitFor(conditionFn, timeout = 1500, interval = 50) {
		const start = Date.now();
		while (Date.now() - start < timeout) {
			const result = conditionFn();
			if (result) return result;
			await delay(interval);
		}
		return null;
	}

	// 等待菜单弹出，判断菜单是否可见 / Wait for the menu to open (visible in DOM)
	async function waitForMenuOpen(timeout = 1000) {
		return await waitFor(() => {
			const menu = document.querySelector('div[role="menu"]');
			return menu && menu.offsetParent !== null; // 判断元素是否可见 / Check if element is visible
		}, timeout);
	}

	// 主操作函数：依次点击菜单按钮，点击删除，确认删除 / Main operation: click menu, select delete, confirm deletion
	async function clickMenuAndDelete() {
		const buttons = findMenuButtons();
		console.log(`🔍 找到 ${buttons.length} 个菜单按钮 / Found ${buttons.length} menu buttons`);

		for (const btn of buttons) {
			try {
				// 滚动到按钮，确保可见 / Scroll button into view
				btn.scrollIntoView({ behavior: "instant", block: "center" });
				await delay(100);

				btn.click(); // 点击菜单按钮 / Click menu button
				await delay(100);

				let menuOpened = await waitForMenuOpen(); // 等待菜单展开 / Wait for menu to open
				if (!menuOpened) {
					// 菜单没打开，先发 Escape 关闭可能的其他弹窗，然后重试点击 / If menu not opened, send Escape to close overlays, then retry click
					document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
					await delay(100);

					btn.click();
					await delay(200);

					menuOpened = await waitForMenuOpen();
				}

				if (!menuOpened) {
					console.log("❌ 菜单没打开，跳过该按钮 / Menu not opened, skipping this button");
					continue;
				}

				// 寻找包含“删除”或“delete”字样的菜单项 / Find menu item with "删除" or "delete"
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

				deleteItem.click(); // 点击“删除” / Click delete option
				await delay(300);

				// 等待确认删除按钮出现 / Wait for confirmation button
				const confirmBtn = await waitFor(
					() => document.querySelector('[data-testid="confirmationSheetConfirm"]'),
					1500
				);

				if (confirmBtn) {
					confirmBtn.click(); // 确认删除 / Confirm deletion
					deleted++;
					console.log(`✅ 已删除第 ${deleted} 条 / Deleted tweet #${deleted}`);
				} else {
					console.log(
						"⚠️ 找不到确认按钮，可能已取消删除 / Confirmation button not found, maybe deletion was cancelled"
					);
				}

				await delay(700); // 给页面反应时间 / Wait some time for page to react
			} catch (e) {
				console.warn(`❌ 删除失败: ${e.message} / Deletion failed: ${e.message}`);
				await delay(500);
			}
		}
	}

	// 自动循环执行删除和滚动，最多循环 maxLoops 次 / Auto scroll and delete up to maxLoops times
	async function autoScrollAndDelete(maxLoops = 100) {
		for (let i = 0; i < maxLoops; i++) {
			await clickMenuAndDelete();

			// 计算滚动位置，基础滚动到底部 + 每删除5条增加1000px / Calculate scroll position: base scroll + 1000px per 5 deletions
			let baseScroll = document.body.scrollHeight;
			let extraScroll = Math.floor(deleted / 5) * 1000;

			window.scrollTo(0, baseScroll + extraScroll);

			console.log(`⬇️ 页面滚动以加载更多推文 / Scrolling down to load more tweets`);
			await delay(1500); // 等待加载新推文 / Wait for new tweets to load
		}

		console.log(`🎉 删除完成，已尝试删除 ${deleted} 条推文 / Done! Attempted to delete ${deleted} tweets`);
	}

	// 启动脚本 / Start script
	await autoScrollAndDelete();
})();
