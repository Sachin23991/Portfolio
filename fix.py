import os

for filename in ['./src/components/Scene.tsx', './src/components/Portal.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    content = content.replace("<Text\n", "<Text font=\"/outfit.woff\"\n")
    content = content.replace("<Text ", "<Text font=\"/outfit.woff\" ")
    
    with open(filename, 'w') as f:
        f.write(content)
print("Fix applied")
