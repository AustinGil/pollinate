import { test, expect } from '@playwright/test';
import { URL, REDDIT_USERNAME, REDDIT_PASSWORD } from '../config.js';
import { getMetadata } from '../utils/index.js';

test('thing', async ({ page }) => {
  await page.goto(
    'https://www.reddit.com/login/?dest=https%3A%2F%2Fwww.reddit.com%2Fr%2Fprogramming%2Fsubmit%3Furl'
  );

  await page.getByLabel('Username').fill(REDDIT_USERNAME);
  await page.getByLabel('Password').first().fill(REDDIT_PASSWORD);
  await page.getByRole('button').filter({ hasText: 'Log in' }).click();

  // await page.goto('https://www.reddit.com/r/programming/submit?url');

  const { title } = await getMetadata(URL);

  await page.getByPlaceholder('Title').fill(title);
  await page.getByPlaceholder('Url').fill(URL);
  // await page.getByText('Post').click();

  await new Promise((r) => setTimeout(r, 2000));
});
