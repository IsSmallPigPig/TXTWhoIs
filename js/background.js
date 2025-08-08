// background.js - 背景图片管理模块

// 全局背景配置对象
let backgroundConfig = null;

// 应用背景图片函数
function applyBackgroundImage() {
    // 确保在没有配置时使用默认背景
    if (!backgroundConfig) {
        // 默认背景配置
        backgroundConfig = {
            backgroundImage: 'images/background.webp',
            darkBackgroundImage: 'images/background-dark.webp'
        };
    }
    
    // 确保能正确获取当前主题
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const backgroundImage = isDarkMode ? 
        backgroundConfig.darkBackgroundImage : backgroundConfig.backgroundImage;
    
    if (backgroundImage) {
        document.body.style.backgroundImage = `url('${backgroundImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundRepeat = 'no-repeat';
    }
}

// 初始化背景配置
function initBackgroundConfig(config) {
    backgroundConfig = config;
    // 保存配置到localStorage
    try {
        localStorage.setItem('backgroundConfig', JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save background config:', e);
    }
    applyBackgroundImage();
}

// 监听主题切换事件
function setupThemeToggleListener() {
    // 监听data-theme属性变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                applyBackgroundImage();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true
    });

    // 备用的点击事件监听
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                applyBackgroundImage();
            }, 300); // 延迟执行以确保主题已切换
        });
    }
}

// 导出函数供其他模块使用
window.BackgroundManager = {
    applyBackgroundImage,
    initBackgroundConfig,
    setupThemeToggleListener
};

// 当DOM加载完成后应用背景
function applyBackgroundOnLoad() {
    // 尝试从localStorage加载配置
    const savedConfig = localStorage.getItem('backgroundConfig');
    if (savedConfig) {
        try {
            backgroundConfig = JSON.parse(savedConfig);
        } catch (e) {
            console.error('Failed to parse saved background config:', e);
            // 使用默认配置
            backgroundConfig = {
                backgroundImage: 'images/background.webp',
                darkBackgroundImage: 'images/background-dark.webp'
            };
        }
    } else {
        // 使用默认配置
        backgroundConfig = {
            backgroundImage: 'images/background.webp',
            darkBackgroundImage: 'images/background-dark.webp'
        };
    }

    // 应用背景
    applyBackgroundImage();
}

// 检查DOM是否已经加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBackgroundOnLoad);
} else {
    applyBackgroundOnLoad();
}

// DOM加载完成后设置监听器
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggleListener();
});