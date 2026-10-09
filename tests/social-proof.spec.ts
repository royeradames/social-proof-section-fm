import { expect, test } from "@playwright/test";

const names = ["Colton Smith", "Irene Roberts", "Anne Wallace"];

test("renders the supplied heading, ratings and testimonials", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Social proof section | Royer Adames");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("10,000+ of our users love our products.");
  await expect(page.getByText(/We only provide great products combined with excellent customer service/)).toBeVisible();
  await expect(page.getByRole("list", { name: "Ratings" }).getByRole("listitem")).toHaveText([
    "Rated 5 Stars in Reviews", "Rated 5 Stars in Report Guru", "Rated 5 Stars in BestTech",
  ]);
  const testimonials = page.getByRole("list", { name: "Testimonials" }).getByRole("listitem");
  await expect(testimonials).toHaveCount(3);
  for (const [index, name] of names.entries()) {
    const item = testimonials.nth(index);
    await expect(item.locator("figcaption")).toContainText(name);
    await expect(item.locator("figcaption")).toContainText("Verified Buyer");
    await expect(item.locator("blockquote")).toBeVisible();
    const portrait = item.getByRole("img", { name: `${name}'s profile photo` });
    expect(await portrait.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  }
  for (const star of await page.locator(".stars img").all()) {
    expect(await star.evaluate(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator(".stars img")).toHaveCount(15);
});

test("declares one site name in the footer, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-name")).toHaveText("Social proof section");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Social proof section");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Reviews, Report Guru and BestTech/);
  const jsonLd = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: "Social proof section", url: "https://social-proof-section-fm.royeradames.com" });
});

test("keeps the style guide palette with readable buyer labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(81, 32, 81)");
  await expect(page.locator(".rating").first()).toHaveCSS("background-color", "rgb(247, 242, 247)");
  await expect(page.locator(".testimonial figure").first()).toHaveCSS("background-color", "rgb(81, 32, 81)");
  await expect(page.locator(".verified").first()).toHaveCSS("color", "rgb(241, 119, 173)");
});

test("follows the Figma arrangement at mobile, tablet and desktop", async ({ page }) => {
  const boxes = (selector: string) => page.locator(selector).evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON() as DOMRect));
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  let ratings = await boxes(".rating");
  let cards = await boxes(".testimonial figure");
  for (const box of [...ratings, ...cards]) { expect(Math.round(box.width)).toBe(327); expect(Math.round(box.x)).toBe(24); }
  const stars = (await boxes(".rating:first-child .stars"))[0];
  const label = (await boxes(".rating:first-child .rating-text"))[0];
  expect(label.y).toBeGreaterThan(stars.y + stars.height);

  await page.setViewportSize({ width: 768, height: 1400 });
  ratings = await boxes(".rating");
  cards = await boxes(".testimonial figure");
  for (const box of [...ratings, ...cards]) { expect(Math.round(box.width)).toBe(453); expect(Math.round(box.x)).toBe(158); }
  const tabletStars = (await boxes(".rating:first-child .stars"))[0];
  const tabletLabel = (await boxes(".rating:first-child .rating-text"))[0];
  expect(tabletLabel.x).toBeGreaterThan(tabletStars.x + tabletStars.width);
  expect(Math.round(ratings[0].height)).toBe(49);

  await page.setViewportSize({ width: 1440, height: 800 });
  ratings = await boxes(".rating");
  cards = await boxes(".testimonial figure");
  expect(ratings.map(box => Math.round(box.x))).toEqual([733, 781, 829]);
  expect(ratings.every(box => Math.round(box.width) === 446)).toBe(true);
  expect(cards.map(box => Math.round(box.x))).toEqual([165, 545, 925]);
  expect(cards.every(box => Math.round(box.width) === 350)).toBe(true);
  expect(Math.round(cards[1].y - cards[0].y)).toBe(16);
  expect(Math.round(cards[2].y - cards[0].y)).toBe(32);
  const heading = (await boxes("h1"))[0];
  expect(Math.round(heading.x)).toBe(165);
  expect(Math.round(heading.y)).toBe(116);
});

test("fits narrow and enlarged layouts with the family text and target floors", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallText = await page.locator("h1, p, span, footer, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const link of await page.locator("a").all()) {
      expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("keyboard reaches the footer links with a visible focus ring", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const mentor = page.getByRole("link", { name: "Frontend Mentor", exact: true });
  await expect(mentor).toBeFocused();
  await expect(mentor).toHaveCSS("outline-style", "solid");
});
