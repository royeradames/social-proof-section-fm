import { expect, test } from "@playwright/test";

test("buyer labels and introductory copy meet normal text contrast", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const ratios = await page.locator(".verified, .intro p").evaluateAll(labels => {
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
        if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color ${color}`);
        const linear = channels.map(channel => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      return labels.map(label => {
        const card = label.closest("figure");
        
        const foreground = luminance(getComputedStyle(label).color);
        const background = luminance(getComputedStyle(card ?? document.body).backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      });
    });
    expect(ratios).toHaveLength(4);
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
});

test("footer links retain readable contrast on hover", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Frontend Mentor", exact: true });
  await link.hover();
  const ratio = await link.evaluate(element => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color ${color}`);
      const linear = channels.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const foreground = luminance(getComputedStyle(element).color);
    const background = luminance(getComputedStyle(document.body).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});
