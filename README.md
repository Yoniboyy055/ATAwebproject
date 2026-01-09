# Amanual Travel Agency — Next.js App Router (TypeScript + Tailwind)

A minimal, performance-minded starter tailored for low-bandwidth users and WhatsApp-first contact.

## Local run

1. Install dependencies

   npm install

2. Start development server

   npm run dev

3. Build production

   npm run build
   npm start

## Recommendations for production

- Deploy to Vercel for best Next.js support (App Router + image optimization).
- Use environment variables to store the WhatsApp phone number (e.g. `WHATSAPP=+291...`) and any other secret.
- Replace placeholder images in `/public/images/` with optimized WebP/AVIF images at multiple sizes and add OpenGraph images.

### Generating optimized images (recommended)

Use an image tool like `sharp` or Squoosh CLI to create WebP and AVIF variants at multiple sizes. Example using `sharp` (Node):

```js
// generate-sizes.js
const sharp = require('sharp')
const sizes = [400, 800]
const src = 'public/images/source/asmara.jpg'
sizes.forEach(s => {
  sharp(src).resize(s).toFile(`public/images/asmara-${s}.webp`)
  sharp(src).resize(s).toFile(`public/images/asmara-${s}.avif`)
})
```

For low-bandwidth users, generate 400px (grid) and 800px (large) variants and use `next/image` with `sizes` so the browser requests the smallest needed asset.

- Add a blurred tiny placeholder (or use `sharp` to generate a very small base64 blurDataURL) and pass it to `Image`'s `blurDataURL` prop. You can use the included script `npm run images:optimize` to generate AVIF/WebP sizes and `public/images/blur.json` (the project will read `blur.json` automatically for `next/image` placeholders where available).
- For a dry run that only prints which images would be produced, run `npm run images:optimize:dry`.
- The project now enforces image variant checks during build and in CI: `check:variants` ensures every image base has `-400` and `-800` AVIF/WEBP variants and will fail the build/CI if they are missing. Run `npm run images:optimize` after adding better raster sources to generate those variants.
- Deploy to Vercel for optimized delivery (AVIF/WebP handled by Next image optimization).

## Deploy to Vercel (quick)

1. Push the repository to GitHub.
2. Sign in to Vercel and "New Project" -> import the GitHub repo.
3. Set Environment Variables in Vercel dashboard (e.g. `WHATSAPP` if you wire it into `lib/config.ts`).
4. Deploy — Vercel will build and serve the App Router automatically.

Note: Vercel provides image optimization and edge caching which helps low-bandwidth users.

## Performance notes

- Uses system fonts for minimal network cost.
- Uses `next/image` everywhere and lazy-loads below-the-fold images.
- Small client-side JS: only small interactions and IntersectionObserver for subtle entry animations.

## File highlights

- `app/` - App Router pages
- `components/` - Reusable minimal components: `Navbar`, `Footer`, `Card`, `Button`, etc.
- `public/images/` - lightweight svg placeholders to be replaced with real media

