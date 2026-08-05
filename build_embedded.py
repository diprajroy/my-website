import os
import re

def inline_file(match, base_dir, tag_type):
    filepath = match.group(1)
    if filepath.startswith('http') or filepath.startswith('//'):
        return match.group(0) # Keep external links as is
    
    full_path = os.path.normpath(os.path.join(base_dir, filepath))
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            if tag_type == 'css':
                return f'<style>\n/* Inlined from {filepath} */\n{content}\n</style>'
            elif tag_type == 'js':
                return f'<script>\n/* Inlined from {filepath} */\n{content}\n</script>'
    return match.group(0)

def build_embedded(src_dir, dest_dir, base_url="https://diprajroy.com/"):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    for filename in os.listdir(src_dir):
        if filename.endswith('.html'):
            with open(os.path.join(src_dir, filename), 'r', encoding='utf-8') as f:
                html = f.read()
                
            # Inline CSS
            # Pattern for <link rel="stylesheet" href="...">
            html = re.sub(r'<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>', 
                          lambda m: inline_file(m, src_dir, 'css'), html)
            html = re.sub(r'<link\s+[^>]*href="([^"]+)"[^>]*rel="stylesheet"[^>]*>', 
                          lambda m: inline_file(m, src_dir, 'css'), html)
                          
            # Inline JS
            # Pattern for <script src="..."></script>
            html = re.sub(r'<script\s+[^>]*src="([^"]+)"[^>]*>\s*</script>', 
                          lambda m: inline_file(m, src_dir, 'js'), html)
                          
            # Replace local assets with absolute URLs
            html = html.replace('href="assets/', f'href="{base_url}assets/')
            html = html.replace('src="assets/', f'src="{base_url}assets/')
            
            # For a proper Google Sites embed, you usually want links to open in the parent window.
            # We add target="_parent" to all <a> tags that don't already have a target.
            html = re.sub(r'<a(?![^>]*\btarget=)([^>]+)>', r'<a target="_parent"\1>', html)
            
            # Write to dest
            with open(os.path.join(dest_dir, filename), 'w', encoding='utf-8') as f:
                f.write(html)
                
if __name__ == "__main__":
    src = r"d:\My website"
    dest = r"d:\My website\google_sites_embedded"
    build_embedded(src, dest)
    print(f"Successfully generated embedded files in: {dest}")
