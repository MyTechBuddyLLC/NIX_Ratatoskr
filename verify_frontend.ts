
import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Set dark theme and bypass welcome screen by adding a mock API key
  await page.goto('http://localhost:5173/');

  // Set theme to dark in localStorage
  await page.evaluate(() => {
    // We need to simulate the AppContext state.
    // Usually it's better to do it via UI if possible, or direct localStorage if we know the keys.
    // Based on memory: 'ratatoskr-settings' contains encrypted data.
    // Let's try to set it via the UI to be safe.
  });

  // Navigate to Config
  await page.click('text=Config');

  // Set theme to Dark
  await page.click('text=Dark');

  // Take screenshot of Dashboard
  await page.click('text=Dashboard');
  await page.screenshot({ path: 'dashboard-dark.png' });

  // Take screenshot of Tasks
  await page.click('text=Tasks');
  await page.screenshot({ path: 'tasks-dark.png' });

  // Take screenshot of Repos
  await page.click('text=Repos');
  await page.screenshot({ path: 'repos-dark.png' });

  // Take screenshot of Queue
  await page.click('text=Queue');
  await page.screenshot({ path: 'queue-dark.png' });

  await browser.close();
}

verify().catch(console.error);
