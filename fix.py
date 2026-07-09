import os
import re

nav_path = r'd:\1 - Projects\robuzta\components\nav.html'
with open(nav_path, 'r', encoding='utf-8') as f:
    nav_content = f.read().strip()
    
nav_content = re.sub(r'<!-- Unified site navigation.*?-->\s*', '', nav_content)
nav_content = f'\n<!-- Top Navigation Bar -->\n{nav_content}\n'

files = [
    'index.html', 'blog.html', 'laptop-repair.html', 
    'mobile-repair.html', 'macbook-repair.html', 
    'gaming-pc.html', 'surface-repair.html', 'home.html'
]

for file in files:
    path = os.path.join(r'd:\1 - Projects\robuzta\pages', file)
    if not os.path.exists(path): continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    pattern = re.compile(
        r'(?:<!-- TopNavBar -->\s*|<!-- Top Navigation Bar -->\s*)?'
        r'(?:<header[^>]*>\s*)?'
        r'<nav[^>]*>.*?</nav>'
        r'(?:\s*</header>)?'
        r'(?:\s*<!-- Mobile Menu -->\s*<div[^>]*id=[\'"]mobileMenu[\'"][^>]*>.*?</div>)?', 
        re.DOTALL | re.IGNORECASE
    )
    
    new_content = pattern.sub(nav_content, content, count=1)
    
    if '<script src="../js/nav.js"></script>' not in new_content:
        new_content = re.sub(r'(</body>)', r'<script src="../js/nav.js"></script>\n\1', new_content, flags=re.IGNORECASE)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
print('Updated successfully')
