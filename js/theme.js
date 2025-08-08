// 主题切换功能 - 立即应用无延迟
function setTheme(theme) {
    // 直接应用主题，不添加过渡效果以避免页面切换时的闪烁
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // 延迟处理图标切换和过渡效果
    setTimeout(() => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }, 100);
}

// 立即初始化主题（无需等待DOM加载完成）
function initThemeImmediately() {
    // 直接在函数执行时应用主题
    try {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 优先级: 保存的主题 > 系统偏好 > 默认浅色
        let themeToApply = 'light';
        if (savedTheme === 'dark') {
            themeToApply = 'dark';
        } else if (savedTheme === 'light') {
            themeToApply = 'light';
        } else if (prefersDark) {
            themeToApply = 'dark';
        }

        // 立即应用主题
        document.documentElement.setAttribute('data-theme', themeToApply);
        localStorage.setItem('theme', themeToApply);

        // 异步更新图标
        setTimeout(() => {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (themeToApply === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }, 0);
    } catch (error) {
        console.error('初始化主题出错:', error);
        // 出错时默认使用浅色模式
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// 初始化主题切换按钮
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

// 立即应用主题（在脚本加载后立即执行）
initThemeImmediately();

// DOM加载完成后设置按钮事件
document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
});