const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('route.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const funcRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)\s*\([\s\S]*?\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{([^}]+)\}\s*\}[\s\S]*?\)\s*\{/g;
  
  content = content.replace(funcRegex, (fullMatch, method, innerProps) => {
    const keys = innerProps.split(/[,;]/).map(s => s.split(':')[0].trim()).filter(Boolean);
    
    let newMatch = fullMatch.replace(/\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{([^}]+)\}\s*\}/, 
        `{ params }: { params: Promise<{ $1 }> }`);
        
    return newMatch + `\n  const { ${keys.join(', ')} } = await params;\n`;
  });
  
  if (content !== originalContent) {
    content = content.replace(/\bparams\./g, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", filePath);
  }
}

walkDir(path.join(__dirname, 'app'), processFile);
