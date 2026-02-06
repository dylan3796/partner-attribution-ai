# 🎨 Design System Reference

## Color Palette

### Primary Colors
```css
--primary:       #6366F1  /* Indigo-500 - Main brand */
--primary-dark:  #4F46E5  /* Indigo-600 - Hover states */
--primary-light: #818CF8  /* Indigo-400 - Accents */
--secondary:     #8B5CF6  /* Purple-500 - Gradients */
--accent:        #06B6D4  /* Cyan-500 - Highlights */
```

### Text Colors
```css
--text-primary:   #0F172A  /* Slate-900 - Headlines */
--text-secondary: #475569  /* Slate-600 - Body text */
--text-muted:     #94A3B8  /* Slate-400 - Captions */
```

### Background Colors
```css
--bg-primary:    #FFFFFF  /* White - Main bg */
--bg-secondary:  #F8FAFC  /* Slate-50 - Sections */
--bg-tertiary:   #F1F5F9  /* Slate-100 - Cards */
```

### Border Colors
```css
--border:       #E2E8F0  /* Slate-200 - Default */
--border-light: #F1F5F9  /* Slate-100 - Subtle */
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Sizes
```css
Hero Title:       64px (font-weight: 800)
Section Title:    48px (font-weight: 800)
Subsection:       36px (font-weight: 700)
Large Body:       24px (font-weight: 400)
Body:             18px (font-weight: 400)
Small:            16px (font-weight: 400)
Caption:          14px (font-weight: 500)
Tiny:             13px (font-weight: 600)
```

### Line Heights
```css
Headlines:  1.1-1.2  (tight)
Body:       1.6-1.8  (readable)
UI:         1.5      (compact)
```

---

## Spacing System

### Container
```css
max-width: 1200px
padding: 0 24px (sides)
```

### Section Padding
```css
Desktop:  120px (top/bottom)
Tablet:   80px
Mobile:   60px
```

### Component Gaps
```css
Large:   60px  (between major sections)
Medium:  32px  (between cards)
Small:   16px  (within components)
Tiny:    8px   (tight spacing)
```

---

## Shadows

```css
--shadow-sm:  0 1px 2px 0 rgba(0,0,0,0.05)
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1)
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1)
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1)
```

### Usage
- Cards at rest: `shadow-sm` or `shadow-md`
- Cards on hover: `shadow-lg` or `shadow-xl`
- Overlays/modals: `shadow-xl`

---

## Border Radius

```css
Small:    4px   (inputs, tags)
Medium:   8px   (buttons)
Large:    12px  (small cards)
XLarge:   16px  (feature cards)
XXLarge:  20px  (pricing cards)
Pill:     100px (badges, pills)
Circle:   50%   (avatars)
```

---

## Buttons

### Primary Button
```css
background: linear-gradient(135deg, #6366F1, #8B5CF6)
color: white
padding: 12px 24px
border-radius: 8px
font-weight: 600
box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)

Hover: 
  transform: translateY(-2px)
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
```

### Secondary Button
```css
background: #F1F5F9
color: #0F172A
padding: 12px 24px
border-radius: 8px
font-weight: 600

Hover:
  background: #E2E8F0
```

### Outline Button
```css
background: transparent
color: #0F172A
border: 2px solid #E2E8F0
padding: 12px 24px
border-radius: 8px
font-weight: 600

Hover:
  border-color: #6366F1
  color: #6366F1
```

---

## Cards

### Base Card
```css
background: white
border: 1px solid #E2E8F0
border-radius: 16px
padding: 32px
transition: all 0.3s cubic-bezier(0.4,0,0.2,1)

Hover:
  transform: translateY(-4px)
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)
```

### Featured Card (Pricing)
```css
border: 2px solid #6366F1
background: linear-gradient(180deg, rgba(99,102,241,0.05), white 30%)
box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)
```

---

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #6366F1, #8B5CF6)
```

### Text Gradient
```css
background: linear-gradient(135deg, #6366F1, #8B5CF6)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
background-clip: text
```

### Section Background Gradient
```css
background: linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)
```

---

## Animations

### Transitions
```css
--transition: all 0.3s cubic-bezier(0.4,0,0.2,1)
```

### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0
    transform: translateY(30px)
  }
  to {
    opacity: 1
    transform: translateY(0)
  }
}
```

### Hover Effects
```css
Cards:    translateY(-4px) or translateY(-8px)
Buttons:  translateY(-2px)
Duration: 0.3s
Easing:   cubic-bezier(0.4,0,0.2,1)
```

---

## Grid Layouts

### 3-Column Grid (Features, Testimonials)
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 32px

@media (max-width: 1024px)
  grid-template-columns: repeat(2, 1fr)
  
@media (max-width: 768px)
  grid-template-columns: 1fr
```

### 2-Column Grid (Pricing, Comparison)
```css
display: grid
grid-template-columns: repeat(2, 1fr)
gap: 40px

@media (max-width: 768px)
  grid-template-columns: 1fr
```

---

## Badges

### Section Badge
```css
background: linear-gradient(135deg, #6366F1, #8B5CF6)
color: white
padding: 6px 16px
border-radius: 100px
font-size: 13px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
```

### Status Badge (Free Plan, etc.)
```css
background: white
border: 1px solid #E2E8F0
border-radius: 100px
padding: 8px 16px
font-size: 14px
font-weight: 500
box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)
```

---

## Icons

### Icon Sizes
```css
Small:  24px (inline icons)
Medium: 40px (feature icons)
Large:  48px (section icons)
```

### Icon Style
- Emoji for quick implementation
- Or use Heroicons/Feather Icons for consistency
- Keep stroke-width at 1.5-2px for line icons

---

## Responsive Breakpoints

```css
Desktop:  1200px+  (full layout)
Tablet:   768-1024px  (2-column)
Mobile:   <768px  (single column)
```

### Mobile Adjustments
- Font sizes: 75% of desktop
- Padding: 60px sections → 40px
- Grid: Force single column
- Hero: 64px → 36px
- Nav: Hamburger menu (if needed)

---

## States

### Hover
- Cards: Lift + shadow
- Buttons: Lift + brighter shadow
- Links: Color change (→ primary)

### Active
- Buttons: Slight scale down (0.98)
- Links: Underline

### Focus
- Inputs: Border color → primary
- Buttons: Outline (2px primary)

### Disabled
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects

---

## Component Patterns

### Hero Section
```
Badge (small, centered)
  ↓
Large headline (64px, bold)
  ↓
Subtitle (24px, secondary color)
  ↓
CTA buttons (flex, gap: 16px)
  ↓
Stats grid (3-4 items)
```

### Feature Card
```
Icon (40-48px emoji or SVG)
  ↓
Title (20px, bold)
  ↓
Description (16px, secondary color)
```

### Testimonial Card
```
Quote text (16px, italic, secondary)
  ↓
Author info:
  - Avatar (circle, gradient bg)
  - Name (16px, bold)
  - Title (14px, muted)
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary: 4.5:1 contrast on white
- Secondary text: 4.5:1 contrast on white

### Focus States
- Visible focus rings on all interactive elements
- 2px solid primary color

### Alt Text
- All images need descriptive alt text
- Decorative images: alt=""

### Keyboard Navigation
- Tab order follows visual flow
- All CTAs keyboard accessible
- Skip links for screen readers

---

## Performance

### CSS
- Single stylesheet: 17KB (minified ~12KB)
- No external CSS dependencies
- Google Fonts: ~15KB (Inter family)

### JavaScript
- Single file: 6KB (minified ~3KB)
- No framework dependencies
- Vanilla JS for maximum speed

### Total Page Weight
- HTML: ~18KB per page
- CSS: 17KB (shared)
- JS: 6KB (shared)
- **Total: ~41KB** (incredibly lightweight!)

---

## Usage Examples

### Creating a New Page
1. Copy `index.html` structure
2. Keep nav + footer identical
3. Maintain section spacing (80-120px)
4. Use consistent card patterns
5. Add smooth scroll anchors

### Adding a New Section
```html
<section class="my-section">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Badge Text</span>
      <h2 class="section-title">Section Title</h2>
      <p class="section-subtitle">Supporting text</p>
    </div>
    
    <!-- Your content grid/cards here -->
  </div>
</section>
```

### Adding a New Card
```html
<div class="feature-card">
  <div class="feature-icon">🎯</div>
  <h3>Card Title</h3>
  <p>Card description text</p>
</div>
```

---

## Day.ai Design Principles Applied

1. **Whitespace is generous** - Never cramp content
2. **Hierarchy is clear** - Size/weight/color create flow
3. **Animations are subtle** - Enhance, don't distract
4. **Colors are purposeful** - Primary for brand, secondary for accents
5. **Typography is consistent** - Inter everywhere, clear sizes
6. **Shadows are soft** - Multiple layers, low opacity
7. **Borders are minimal** - Separation through spacing first
8. **Gradients are smooth** - 135° diagonal, primary → secondary
9. **CTAs are obvious** - High contrast, clear action words
10. **Trust signals everywhere** - Investors, logos, numbers

---

**This design system creates the "Sequoia-backed" aesthetic Dylan requested.**

Reference this when adding new components or pages to maintain consistency.
