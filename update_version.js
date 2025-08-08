#!/usr/bin/env node

/**
 * 版本号更新工具
 * 用于自动更新HTML文件中静态资源的版本号
 * 使用方法: node update_version.js
 */

const fs = require('fs');
const path = require('path');

// 配置项
const config = {
  htmlFiles: [
    'index.html',
    'result.html'
  ],
  versionPattern: /\?v=\d+\.\d+\.\d+/g,
  currentVersion: '1.0.3',
  newVersion: ''
};

// 生成新版本号
function generateNewVersion(currentVersion) {
  const parts = currentVersion.split('.');
  const patch = parseInt(parts[2]) + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}

// 更新文件中的版本号
function updateFile(filePath, oldVersion, newVersion) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 使用字符串替换代替正则表达式，避免转义问题
    const newContent = content.split(`?v=${oldVersion}`).join(`?v=${newVersion}`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`已更新 ${filePath} 中的版本号: ${oldVersion} -> ${newVersion}`);
  } catch (error) {
    console.error(`更新 ${filePath} 时出错:`, error);
  }
}

// 执行更新
function run() {
  config.newVersion = generateNewVersion(config.currentVersion);
  console.log(`当前版本: ${config.currentVersion}`);
  console.log(`新版本: ${config.newVersion}`);

  config.htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    updateFile(filePath, config.currentVersion, config.newVersion);
  });

  // 更新脚本中的当前版本
  const scriptPath = path.join(__dirname, 'update_version.js');
  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  const newScriptContent = scriptContent.replace(
    `currentVersion: '${config.currentVersion}'`,
    `currentVersion: '${config.newVersion}'`
  );
  fs.writeFileSync(scriptPath, newScriptContent, 'utf8');
  console.log(`已更新脚本中的当前版本: ${config.currentVersion} -> ${config.newVersion}`);

  console.log('版本号更新完成!');
}

// 运行脚本
run();