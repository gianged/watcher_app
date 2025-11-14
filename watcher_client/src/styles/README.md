# Watcher App - SCSS 7-1 Architecture

This project follows the industry-standard **7-1 pattern** for organizing SCSS files.

## 📁 Folder Structure

```
styles/
├── abstracts/
│   ├── _variables.scss    # Variables (colors, fonts, spacing, etc.)
│   ├── _mixins.scss       # Mixins and reusable functions
│   └── _functions.scss    # SCSS functions
├── base/
│   ├── _reset.scss        # CSS reset and normalization
│   └── _typography.scss   # Typography rules
├── components/
│   ├── _buttons.scss      # Button styles
│   ├── _forms.scss        # Form controls
│   ├── _cards.scss        # Card components
│   ├── _badges.scss       # Badge/tag components
│   ├── _tables.scss       # Table styles
│   ├── _modals.scss       # Modal and panel styles
│   └── _utilities.scss    # Utility classes
├── layout/
│   ├── _navbar.scss       # Top navigation bar
│   ├── _sidebar.scss      # Sidebar navigation
│   ├── _container.scss    # Main content container
│   └── _grid.scss         # Grid system
├── pages/
│   ├── _login.scss        # Login page styles
│   ├── _dashboard.scss    # Dashboard page
│   ├── _management.scss   # Management pages (users, tickets, etc.)
│   └── _profile.scss      # Profile page
├── themes/
│   └── _dark.scss         # Dark theme (optional)
├── vendors/
│   └── (third-party CSS)
└── main.scss              # Main file that imports all partials
```

## 🎨 Design System

### Colors

The design system uses a comprehensive color palette:

**Primary Colors:**
- Primary: `#6a11cb` (Purple)
- Secondary: `#2575fc` (Blue)

**Semantic Colors:**
- Success: `#28a745` (Green)
- Danger: `#dc3545` (Red)
- Warning: `#ffc107` (Yellow)
- Info: `#17a2b8` (Cyan)

**Neutral Grays:** (100-900 scale)
- From light (#f8f9fa) to dark (#212529)

**Status Colors:**
- Open: Info blue
- In Progress: Warning yellow
- Resolved: Success green
- Closed: Gray
- Rejected: Danger red

### Typography

- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Font Sizes**: xs (12px) to 4xl (36px)
- **Font Weights**: Light (300) to Bold (700)

### Spacing

Consistent spacing scale based on 16px base:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Shadows

Pre-defined shadow levels from xs to 2xl for depth and hierarchy.

### Border Radius

- sm: 0.2rem
- md: 0.375rem
- lg: 0.5rem
- xl: 1rem
- full: 9999px (circular)

## 🔧 Mixins

### Responsive Breakpoints

```scss
@include respond-to('sm') { /* styles */ }
@include respond-to('md') { /* styles */ }
@include respond-to('lg') { /* styles */ }
@include respond-to('xl') { /* styles */ }
```

### Flexbox Utilities

```scss
@include flex-center;      // Center items
@include flex-between;     // Space between
@include flex-column;      // Column direction
```

### Gradients

```scss
@include gradient-primary;         // Primary gradient
@include gradient-primary-reverse; // Reversed gradient
@include gradient-bg;              // Background gradient
```

### Custom Scrollbar

```scss
@include custom-scrollbar(8px, $track-color, $thumb-color);
```

### Button Variants

```scss
@include button-variant($bg-color, $text-color, $hover-darken);
```

### Badge Variants

```scss
@include badge-variant($bg-color, $text-color);
```

## 📦 Components

### Buttons

- `.btn` - Base button
- `.btn-primary`, `.btn-secondary`, etc. - Colored buttons
- `.btn-outline-primary` - Outline button
- `.btn-sm`, `.btn-lg` - Size variants
- `.btn-block` - Full-width button
- `.btn-icon` - Icon-only button

### Forms

- `.form-group` - Form field container
- `.form-label` - Field label
- `.form-control` - Input, textarea, select
- `.form-check` - Checkbox/radio wrapper
- `.invalid-feedback` - Error message
- `.is-invalid` - Error state

### Cards

- `.card` - Card container
- `.card-header`, `.card-body`, `.card-footer`
- `.card-clickable` - Interactive card

### Badges

- `.badge` - Base badge
- `.badge-primary`, `.badge-success`, etc. - Colored badges
- `.badge-open`, `.badge-in-progress`, etc. - Status badges
- `.badge-sm`, `.badge-lg` - Size variants

### Tables

- `.table` - Base table
- `.table-striped` - Alternating row colors
- `.table-hover` - Hover effect

### Modals

- `.backdrop` - Modal overlay
- `.modal` - Modal container
- `.modal-sm`, `.modal-md`, `.modal-lg`, `.modal-xl` - Size variants
- `.right-panel` - Slide-in side panel

## 🎯 Utility Classes

### Spacing

- Margin: `.m-{0-5}`, `.mt-{0-5}`, `.mb-{0-5}`, `.ml-{0-5}`, `.mr-{0-5}`
- Padding: `.p-{0-5}`, `.pt-{0-5}`, `.pb-{0-5}`, `.pl-{0-5}`, `.pr-{0-5}`

### Display

- `.d-none`, `.d-block`, `.d-inline`, `.d-inline-block`
- `.d-flex`, `.flex-column`, `.flex-row`

### Flexbox

- `.justify-content-{start|end|center|between|around}`
- `.align-items-{start|end|center|stretch}`
- `.gap-{sm|md|lg|xl}`

### Sizing

- `.w-{25|50|75|100}` - Width percentages
- `.h-{25|50|75|100}` - Height percentages

### Borders

- `.border`, `.border-{top|bottom|left|right}`, `.border-0`
- `.rounded`, `.rounded-{sm|lg|xl|full}`

### Shadows

- `.shadow-{sm|md|lg|xl}`, `.shadow-none`

### Colors

- Text: `.text-{primary|secondary|success|danger|warning|info|muted|dark|white}`
- Background: `.bg-{primary|secondary|success|danger|warning|info|light|dark|white}`

### Typography

- `.text-{xs|sm|md|lg|xl|2xl}`
- `.font-{light|normal|medium|semibold|bold}`
- `.text-{left|center|right}`
- `.truncate` - Text ellipsis

## 📱 Layout

### Navbar

Fixed top navigation bar with:
- Brand logo
- Navigation items
- Icon notifications with badges
- User avatar dropdown

### Sidebar

Collapsible sidebar with:
- Navigation links
- Active state indication
- Icon + text layout
- Section grouping

### Content Area

Main content area that adjusts based on sidebar state:
- Fixed positioning
- Custom scrollbar
- Responsive padding

### Grid System

12-column grid system:
- `.row` - Row container
- `.col-{1-12}` - Column widths
- `.no-gutters` - Remove spacing

## 🌙 Theming

Optional dark theme available:

```scss
// Add to body element
<body class="theme-dark">
```

## 🚀 Usage

Import the main stylesheet in your entry file:

```tsx
import './styles/main.scss';
```

All component styles will be available globally.

## 📝 Best Practices

1. **Use variables** - Always use design tokens from `_variables.scss`
2. **Use mixins** - Leverage existing mixins for consistency
3. **BEM naming** - Use Block Element Modifier for component classes
4. **Mobile-first** - Use responsive mixins for breakpoints
5. **Utility-first** - Use utility classes where appropriate
6. **Nested limit** - Keep nesting to 3 levels maximum
7. **Partials** - Break large files into smaller, focused partials

## 🎨 Customization

To customize the design system:

1. Edit variables in `abstracts/_variables.scss`
2. Add custom mixins to `abstracts/_mixins.scss`
3. Create new components in `components/`
4. Add page-specific styles to `pages/`
5. Import new files in `main.scss`

## 📚 Resources

- [Sass Guidelines](https://sass-guidelin.es/)
- [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern)
- [BEM Methodology](http://getbem.com/)

---

**Note**: This architecture is designed to scale with your application while maintaining clean, organized, and maintainable styles.
