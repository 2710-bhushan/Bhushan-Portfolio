# Himanshu Kawale — Personal Portfolio

A stunning 3D animated portfolio built with Next.js 14, featuring:

- 🌌 Interactive 3D particle canvas with mouse repulsion
- 🔮 Animated 3D orbital sphere with floating tech labels
- ✨ Custom magnetic cursor with trail effect
- 📝 Typewriter effect with multiple role titles
- 🃏 3D tilt project cards with perspective transforms
- 📊 Animated skill progress bars triggered on scroll
- 🌊 Reveal-on-scroll animations throughout
- 💎 Glassmorphism UI with cyber/neon aesthetic
- 🎨 Cyberpunk color palette (cyan + purple + pink)
- 📱 Responsive design with mobile support

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to portfolio folder
cd himanshu-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

Deploy to **Vercel** (recommended) for best performance:

```bash
npm install -g vercel
vercel
```

## Customization

### Update Project Links
In `components/Projects.tsx`, update the `demo` and `github` fields for each project:

```tsx
demo: 'https://your-project-demo.com',
github: 'https://github.com/yourusername/project-repo',
```

### Update Social Links
In `components/Hero.tsx`, update the href values for LinkedIn and GitHub social buttons.

### Update Contact Links
In `components/Contact.tsx`, update the LinkedIn and GitHub href values.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Pure CSS with CSS Variables + Inline Styles
- **Animations**: Pure CSS + Vanilla JS (no extra libraries needed)
- **Fonts**: Syne (display) + Space Mono (code) + Outfit (body) via Google Fonts

## File Structure

```
himanshu-portfolio/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page assembling all sections
│   └── globals.css         # Global styles, animations, CSS variables
├── components/
│   ├── CustomCursor.tsx    # Magnetic cursor with trail
│   ├── Navbar.tsx          # Fixed navbar with active section tracking
│   ├── Hero.tsx            # Hero with 3D orb + particle canvas
│   ├── About.tsx           # About section with stat cards
│   ├── Experience.tsx      # Work & education timeline
│   ├── Projects.tsx        # 3D tilt project cards
│   ├── Skills.tsx          # Animated skill bars + tech cloud
│   └── Contact.tsx         # Contact form + info cards
├── package.json
├── tsconfig.json
└── next.config.js
```
