(async function() {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let deleted = 0;

  // 找菜单按钮，过滤掉已经打开的（aria-expanded=true）
  function findMenuButtons() {
    return [...document.querySelectorAll('button[data-testid="caret"], button[aria-label="更多"]')]
      .filter(btn => btn.getAttribute('aria-expanded') === 'false');
  }

  // 等待条件成立，timeout 毫秒超时
  async function waitFor(conditionFn, timeout = 1500, interval = 50) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = conditionFn();
      if (result) return result;
      await delay(interval);
    }
    return null;
  }

  // 等待菜单打开，判断菜单元素是否可见
  async function waitForMenuOpen(timeout = 1000) {
    return await waitFor(() => {
      const menu = document.querySelector('div[role="menu"]');
      return menu && menu.offsetParent !== null;
    }, timeout);
  }

  async function clickMenuAndDelete() {
    const buttons = findMenuButtons();
    console.log(`找到 ${buttons.length} 个菜单按钮`);

    for (const btn of buttons) {
      try {
        btn.scrollIntoView({ behavior: 'instant', block: 'center' });
        await delay(100);

        btn.click();
        await delay(100);

        let menuOpened = await waitForMenuOpen();
        if (!menuOpened) {
          // 关闭菜单，重试点击
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await delay(100);

          btn.click();
          await delay(200);

          menuOpened = await waitForMenuOpen();
        }

        if (!menuOpened) {
          console.log('❌ 菜单没打开，跳过该按钮');
          continue;
        }

        // 寻找删除相关菜单项
        let deleteItem = await waitFor(() => {
          return [...document.querySelectorAll('div[role="menuitem"]')]
            .find(el => {
              const text = el?.innerText?.toLowerCase() || '';
              return text.includes('删除') || text.includes('delete');
            });
        }, 1000);

        if (!deleteItem) {
          console.log('❌ 没找到“删除”按钮，关闭菜单并跳过');
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await delay(100);
          continue;
        }

        deleteItem.click();
        await delay(300);

        const confirmBtn = await waitFor(() =>
          document.querySelector('[data-testid="confirmationSheetConfirm"]'), 1500
        );

        if (confirmBtn) {
          confirmBtn.click();
          deleted++;
          console.log(`✅ 已删除第 ${deleted} 条`);
        } else {
          console.log('⚠️ 找不到确认按钮，可能已取消删除');
        }

        await delay(700); // 给页面反应时间
      } catch (e) {
        console.warn('❌ 删除失败:', e.message);
        await delay(500);
      }
    }
  }

  // 自动滚动并反复删除，最多循环次数限制防止死循环
  async function autoScrollAndDelete(maxLoops = 100) {
  for (let i = 0; i < maxLoops; i++) {
    await clickMenuAndDelete();

    // 计算滚动位置
    // 基础滚动到底部
    let baseScroll = document.body.scrollHeight;

    // 每删除5条，额外滚动1000px
    let extraScroll = Math.floor(deleted / 5) * 1000;

    window.scrollTo(0, baseScroll + extraScroll);

    await delay(1500); // 等待加载
  }
  console.log(`🎉 删除完成，已尝试删除 ${deleted} 条推文`);
}

  await autoScrollAndDelete();
})();