import glob, re
js=open(glob.glob('dist/assets/*.js')[0]).read()
css=open(glob.glob('dist/assets/*.css')[0]).read()
assert '</script' not in js.lower()
p='web/sangdaeroun.html'; s=open(p).read()
s=re.sub(r'<style>.*?\nbody\{', lambda m: '<style>'+css+'\nbody{', s, count=1, flags=re.S)
s=re.sub(r'<script type="module">.*</script>', lambda m: '<script type="module">'+js+'</script>', s, count=1, flags=re.S)
open(p,'w').write(s); print(len(s))
