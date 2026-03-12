const fs = require('fs');
for (let p of ['./src/components/Scene.tsx', './src/components/Portal.tsx']) {
    let content = fs.readFileSync(p, 'utf8');
    // Remove all existing font="..." attributes
    content = content.replace(/font="[^"]+"/g, '');
    // Insert new font attribute
    content = content.replace(/<Text\s+/g, '<Text font="/outfit.woff" ');
    fs.writeFileSync(p, content);
}
console.log("Fixed fonts");
