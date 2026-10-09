# Social proof section

An implementation of the [Frontend Mentor social proof section challenge](https://www.frontendmentor.io/challenges/social-proof-section-6e0qTv_bA), using its supplied portraits, star icon, background patterns, copy and design references.

The ratings and testimonials are the challenge's sample content, shown as static text. There are no forms, accounts or network writes.

## Development

Node 22.13 or later. Use `npm ci`, `npm run dev`, `npm run lint`, `npm run build`, `npm run typecheck` and `npm test`. Browser tests use installed Chrome and own port 4514.

Next 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 are pinned to the family baseline. The page is a server component.

## Sources

Original challenge files are preserved under `reference/`; supplied images moved byte-for-byte to `public/images/`. League Spartan 400/500/700 is served through `next/font`.

## Implementation choices

- Where the Figma frames and the supplied JPGs disagree, the decoded Figma wins: 327px stacks at 375 with stars above each rating label, 453px stacks with stars beside the label on tablet, and the staggered 446px ratings and 350px testimonials on desktop.
- The desktop arrangement starts at 1160px, the narrowest width that holds the 1110px Figma container with 24px gutters; narrower screens keep the tablet stack.
- All design text is already 16px or larger. The intro copy uses a darker grey-magenta (#806c7f) so its normal-size text reaches WCAG AA on the paper background.
- Verified Buyer uses a slightly lighter pink (#f177ad) for normal-text contrast on the dark cards. Footer hover and focus use a darker pink (#a82565) against the paper background.
- Portrait alt text names the buyer; stars are decorative because each rating label already says "Rated 5 Stars".
- One site name, "Social proof section", appears in the footer, `og:site_name` and `WebSite` JSON-LD. The canonical URL is the planned `social-proof-section-fm.royeradames.com` production domain, which isn't attached yet.
