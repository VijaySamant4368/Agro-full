# AgroSafe Travel — Frontend

Responsive Next.js 15 (App Router) frontend built from the mockups in this folder.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run check   # assert-based self-check for the pricing maths
```

## Structure

```
src/
  app/
    layout.tsx                  root shell (html/body + globals.css)
    globals.css                 Tailwind v4 + design tokens (@theme)
    (site)/                     signed-in chrome: SiteHeader + SiteFooter
      layout.tsx
      page.tsx                  Homepage & search
      farms/[slug]/page.tsx     Farm details & booking  (SSG per farm)
      checkout/page.tsx         Payment gateway
      report/page.tsx           Landslide reporting portal
      settings/page.tsx         Settings & profile
      safety/, live/, bookings/ nav routes not in the mockups
    (auth)/                     signed-out chrome: AuthHeader + SiteFooter
      layout.tsx
      login/page.tsx            Login & signup
  components/
    layout/                     site-header, auth-header, site-footer
    ui/                         button, field (label/input/select/textarea), card, safety-badge
    home/  farm/  checkout/  report/  settings/  auth/     feature components
  lib/
    types.ts  utils.ts  pricing.ts
    data/farms.ts  data/locations.ts   static fixtures standing in for the API
```

Route groups `(site)` and `(auth)` only change the chrome — URLs are unaffected
(`/login`, not `/auth/login`).

## Notes

- **Data is static fixtures** in `src/lib/data/`. Page components already treat them
  as a data layer, so swapping in `fetch()` calls touches only those files.
- **Pricing lives in `src/lib/pricing.ts`** and is shared by the booking card and
  checkout so the two can never quote different totals. `npm run check` guards it.
- **Images** come from `picsum.photos` placeholders with `images.unoptimized = true`,
  so nothing depends on sharp or an image CDN. Replace the `img()` helper in
  `data/farms.ts` and drop `unoptimized` when real assets land.
- **No auth, no backend.** Forms validate client-side and render a success state.
