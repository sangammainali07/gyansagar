const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
      callback(path.join(dir, f));
    }
  });
}

walkDir('./app', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes('import { auth } from "@clerk/nextjs/server"')) {
    content = content.replace(/import \{ auth \} from "@clerk\/nextjs\/server";?/g, 'import { auth } from "@/lib/auth-helper";');
    modified = true;
  }
  
  if (content.includes('import { currentUser } from "@clerk/nextjs/server"')) {
    content = content.replace(/import \{ currentUser \} from "@clerk\/nextjs\/server";?/g, 'import { currentUser } from "@/lib/auth-helper";');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});

walkDir('./components', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (content.includes('import { auth } from "@clerk/nextjs/server"')) {
    content = content.replace(/import \{ auth \} from "@clerk\/nextjs\/server";?/g, 'import { auth } from "@/lib/auth-helper";');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
