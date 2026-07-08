const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'pages');

const links = [
  { href: 'laptop-repair.html', label: 'Laptop' },
  { href: 'mobile-repair.html', label: 'Mobile' },
  { href: 'macbook-repair.html', label: 'MacBook' },
  { href: 'gaming-pc.html', label: 'Gaming PC' },
  { href: 'surface-repair.html', label: 'Surface' },
  { href: 'blog.html', label: 'Blog' },
];

function buildNav(activePage) {
  const navLinks = links.map(({ href, label }) => {
    const isActive = href === activePage;
    const cls = isActive
      ? 'nav-link nav-link-active font-label-md text-label-md'
      : 'nav-link text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-md text-label-md';
    const aria = isActive ? ' aria-current="page"' : '';
    return `            <a class="${cls}" href="${href}" data-nav="${href}"${aria}>${label}</a>`;
  }).join('\n');

  return `<nav id="mainNav" class="site-nav" aria-label="Main navigation">
    <div class="site-nav__inner">
        <a class="site-nav__logo flex items-center gap-2" href="index.html">
            <img alt="Robuzta Techlabs Logo" class="h-8 w-auto" src="../images/robuzta_logo_scaled.png"/>
        </a>
        <div class="site-nav__links hidden md:flex items-center gap-gutter">
${navLinks}
        </div>
        <div class="site-nav__actions flex items-center gap-4">
            <button class="btn btn-primary font-label-md text-label-md" type="button">Get Free Quote</button>
            <button id="mobileMenuBtn" class="site-nav__menu-btn md:hidden text-primary" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu">
                <span class="material-symbols-outlined">menu</span>
            </button>
        </div>
    </div>
</nav>

<div id="mobileMenu" class="mobile-menu hidden" role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden="true">
    <button id="mobileMenuClose" class="mobile-menu__close" type="button" aria-label="Close navigation menu">
        <span class="material-symbols-outlined">close</span>
    </button>
    <div class="mobile-menu__links">
        <a class="mobile-menu__link font-headline-md text-headline-md" href="laptop-repair.html">Laptop</a>
        <a class="mobile-menu__link font-headline-md text-headline-md" href="mobile-repair.html">Mobile</a>
        <a class="mobile-menu__link font-headline-md text-headline-md" href="macbook-repair.html">MacBook</a>
        <a class="mobile-menu__link font-headline-md text-headline-md" href="gaming-pc.html">Gaming PC</a>
        <a class="mobile-menu__link font-headline-md text-headline-md" href="surface-repair.html">Surface</a>
        <a class="mobile-menu__link font-headline-md text-headline-md" href="blog.html">Blog</a>
        <button class="btn btn-primary-lg mobile-menu__cta" type="button">Get Free Quote</button>
    </div>
</div>`;
}

const pageActive = {
  'index.html': null,
  'home.html': null,
  'laptop-repair.html': 'laptop-repair.html',
  'mobile-repair.html': 'mobile-repair.html',
  'macbook-repair.html': 'macbook-repair.html',
  'gaming-pc.html': 'gaming-pc.html',
  'surface-repair.html': 'surface-repair.html',
  'blog.html': 'blog.html',
};

for (const [file, active] of Object.entries(pageActive)) {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, 'utf8');
  const nav = buildNav(active);

  html = html.replace(
    /<div id="site-header"><\/div>\s*<script src="\.\.\/js\/nav\.js"><\/script>\s*/g,
    nav + '\n\n    '
  );

  // Remove any top-of-body nav.js injection
  html = html.replace(/<script src="\.\.\/js\/nav\.js"><\/script>\s*(?=\s*(?:<!--|<section|<main|<footer|<nav))/g, '');

  // Ensure nav.js at bottom
  html = html.replace(/\s*<script src="\.\.\/js\/nav\.js"><\/script>/g, '');
  html = html.replace(
    /(<script src="\.\.\/js\/animations\.js"><\/script>)/,
    '$1\n    <script src="../js/nav.js"></script>'
  );

  fs.writeFileSync(fp, html);
  console.log('Updated', file, active ? `(active: ${active})` : '(no active link)');
}
