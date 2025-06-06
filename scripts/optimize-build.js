#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build optimization...');

// 1. Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true });
}

// 2. Set environment variables for optimization
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';  // Reduce build size
process.env.INLINE_RUNTIME_CHUNK = 'false';

// 3. Build with optimization
console.log('🔨 Building optimized bundle...');
try {
    execSync('npm run build', { 
        stdio: 'inherit',
        env: { ...process.env }
    });
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// 4. Analyze build size
console.log('📊 Analyzing build size...');
const buildDir = path.join(__dirname, '../build');
const staticDir = path.join(buildDir, 'static');

function getDirectorySize(dir) {
    let size = 0;
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                size += getDirectorySize(filePath);
            } else {
                size += fs.statSync(filePath).size;
            }
        }
    }
    return size;
}

const totalSize = getDirectorySize(buildDir);
const staticSize = getDirectorySize(staticDir);

console.log(`📦 Total build size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`📦 Static assets size: ${(staticSize / 1024 / 1024).toFixed(2)} MB`);

// 5. List largest files
console.log('📋 Largest files:');
function findLargeFiles(dir, threshold = 100000) { // 100KB threshold
    const largeFiles = [];
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                largeFiles.push(...findLargeFiles(filePath, threshold));
            } else {
                const size = fs.statSync(filePath).size;
                if (size > threshold) {
                    largeFiles.push({ 
                        path: filePath.replace(buildDir, ''), 
                        size: (size / 1024).toFixed(2) + ' KB' 
                    });
                }
            }
        }
    }
    return largeFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
}

const largeFiles = findLargeFiles(buildDir);
largeFiles.slice(0, 10).forEach(file => {
    console.log(`  ${file.path}: ${file.size}`);
});

// 6. Compress build for transfer
console.log('🗜️ Compressing build for transfer...');
try {
    execSync('tar -czf build.tar.gz build/', { stdio: 'inherit' });
    const compressedSize = fs.statSync('build.tar.gz').size;
    console.log(`📦 Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📈 Compression ratio: ${((1 - compressedSize / totalSize) * 100).toFixed(1)}%`);
} catch (error) {
    console.error('❌ Compression failed:', error.message);
}

console.log('✅ Build optimization completed!');

// 7. Suggestions for further optimization
if (totalSize > 5 * 1024 * 1024) { // > 5MB
    console.log('\n💡 Suggestions for reducing bundle size:');
    console.log('  - Consider code-splitting with React.lazy()');
    console.log('  - Use dynamic imports for large libraries');
    console.log('  - Remove unused dependencies');
    console.log('  - Optimize images and use WebP format');
    console.log('  - Consider using a CDN for large assets');
} 