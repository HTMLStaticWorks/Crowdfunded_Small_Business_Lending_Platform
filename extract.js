const fs = require('fs');

const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

const navItems = [
  ["index.html", "Home 1"],
  ["home-2.html", "Home 2"],
  ["about.html", "About Us"],
  ["borrow.html", "Borrow"],
  ["invest.html", "Invest"],
  ["contact.html", "Contact"]
];

function extractFunc(name) {
  const regex = new RegExp(`function ${name}\\(\\) \\{[\\s\\S]*?return (?:nav\\(\\) \\+ )?\`(.*?)\`(?: \\+ footer\\(\\))?;\\s*\\}`, 'g');
  const match = regex.exec(mainJs);
  if (match) return match[1];
  
  // if no match with \`... \`, try something else
  const regex2 = new RegExp(`function ${name}\\(\\) \\{[\\s\\S]*?return[\\s\\S]*?\`(.*?)\`[\\s\\S]*?;\\s*\\}`, 'g');
  const match2 = regex2.exec(mainJs);
  if (match2) return match2[1];
  
  console.log(`Could not extract ${name}`);
  return '';
}

const navMatch = /function nav\(\) \{[\s\S]*?return `([\s\S]*?)`;\s*\}/.exec(mainJs);
let navHtml = navMatch ? navMatch[1] : '';

const footerMatch = /function footer\(\) \{[\s\S]*?return `([\s\S]*?)`;\s*\}/.exec(mainJs);
const footerHtml = footerMatch ? footerMatch[1] : '';

const imagesMatch = /const images = \{[\s\S]*?\};/.exec(mainJs);
const imagesStr = imagesMatch ? imagesMatch[0] : '';
eval(imagesStr); // populates images object

// We need to replace ${images.xyz} with the actual image URL
function replaceImages(html) {
  return html.replace(/\$\{images\.([a-zA-Z0-9_]+)\}/g, (match, p1) => {
    return images[p1] || '';
  });
}

function updateNav(html, currentPath) {
  // replace navItems logic in navHtml
  let newNav = html;
  
  // we need to dynamically replace the navItems map in the navHtml
  // Original navHtml has: ${navItems.map... }
  const linksHtml = navItems.map(i => `<a href="${i[0]}" class="nav-link ${currentPath === i[0] ? 'active' : ''}">${i[1]}</a>`).join('');
  newNav = newNav.replace(/\$\{navItems.*?join\(''\)\}/, linksHtml);
  return newNav;
}

const pages = {
  "index.html": "home1",
  "home-2.html": "home2",
  "about.html": "about",
  "borrow.html": "borrow",
  "invest.html": "invest",
  "contact.html": "contact"
};

const headTpl = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="LendCircle — a fictional crowdfunded small business lending platform frontend concept connecting borrowers and lenders.">
<meta name="theme-color" content="#173f35">
<title>LendCircle — Crowdfunded Small Business Lending Platform</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23173f35'/%3E%3Cpath d='M16 38c12-2 19-9 29-23 1 12-3 24-13 29-7 3-12 0-16-6Z' fill='%23c9974d'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
`;

const tailTpl = `
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>`;

for (const [filename, funcName] of Object.entries(pages)) {
  const mainContent = extractFunc(funcName);
  const fullHtml = headTpl + updateNav(navHtml, filename) + mainContent + footerHtml + tailTpl;
  const processedHtml = replaceImages(fullHtml);
  
  fs.writeFileSync(filename, processedHtml);
  console.log(`Generated ${filename}`);
}

// Clean up main.js
let newMainJs = `
function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
}

document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  });
});
`;

fs.writeFileSync('assets/js/main.js', newMainJs);
console.log('Cleaned up main.js');

// Remove extra files
const toRemove = ['how-it-works.html', 'success-stories.html', 'login.html', 'signup.html', 'dashboard.html'];
for (const f of toRemove) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log(`Deleted ${f}`);
  }
}
