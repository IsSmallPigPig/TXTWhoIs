// 完全重构的 result.js 文件

// 添加全局错误处理器
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    console.error('Error occurred at:', event.filename, 'line:', event.lineno, 'column:', event.colno);
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired in result.js');

    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const boundCard = urlParams.get('boundCard');
    console.log('userId:', userId);
    console.log('boundCard:', boundCard);

    // 如果没有ID参数但有boundCard参数，使用boundCard查找用户
    if (!userId && boundCard) {
        console.log('使用boundCard参数查找用户');
        // 我们会在数据加载后使用boundCard查找用户
    } else if (!userId) {
        showError('未提供用户ID或绑定卡片信息');
        return;
    }

    // 设置当前时间
    const now = new Date();
    
    // 格式化日期为 YYYY/MM/DD HH:MM:SS
    function formatDate(date) {
        if (!date || isNaN(date.getTime())) return '未知';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
    
    const queryTime = document.getElementById('query-time');
    if (queryTime) {
        queryTime.textContent = formatDate(now);
        console.log('Query time set successfully');
    } else {
        console.log('queryTime element not found');
    }

    // 设置返回按钮事件 - 增强版带详细日志
    function setupBackButton(attempt = 1) {
        console.log('setupBackButton attempt #' + attempt);
        const backBtn = document.querySelector('#back-btn');
        console.log('backBtn reference:', backBtn);
        console.log('backBtn is null?', backBtn === null);
        console.log('backBtn is undefined?', backBtn === undefined);

        if (backBtn) {
            try {
                console.log('Attempting to add event listeners to backBtn');
                backBtn.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'var(--primary-color)';
                    this.style.color = 'white';
                    this.style.transform = 'translateY(-2px)';
                });
                backBtn.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                    this.style.color = 'var(--text-color)';
                    this.style.transform = 'translateY(0)';
                });
                backBtn.addEventListener('click', function() {
                    window.location.href = 'index.html';
                });
                console.log('Successfully added event listeners to backBtn');
            } catch (error) {
                console.error('Error adding event listeners:', error);
            }
        } else {
            console.log('backBtn element not found, retrying...');
            // 限制重试次数，避免无限循环
            if (attempt < 10) {
                setTimeout(function() {
                    setupBackButton(attempt + 1);
                }, 500);
            } else {
                console.error('Failed to find backBtn after 10 attempts');
            }
        }
    }

    // 初始调用
    setupBackButton();

    // 加载数据
    // 加载数据和背景图片
    fetch('data/data.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('数据加载失败: ' + response.status);
            }
            return response.json();
        })
        .then(function(data) {
            console.log('data loaded:', data);
            // 检查数据结构是否正确
            if (!data || !data.users || !Array.isArray(data.users)) {
                showError('数据格式不正确');
                return;
            }
            
            // 初始化背景配置
            if (window.BackgroundManager) {
                window.BackgroundManager.initBackgroundConfig(data.config);
            }
            // 查找匹配的用户
            let matchedUser;
            if (boundCard) {
                console.log('使用boundCard查找用户:', boundCard);
                const lowerBoundCard = boundCard.toLowerCase();
                matchedUser = data.users.find(function(user) {
                    return user.boundCard && user.boundCard.toLowerCase().includes(lowerBoundCard);
                });
            } else {
                matchedUser = data.users.find(function(user) {
                    return user.id === userId;
                });
            }

            if (matchedUser) {
                console.log('found user:', matchedUser);
                // 显示用户信息
                showUserInfo(matchedUser);
            } else {
                showError('未找到用户信息');
            }
        })
        .catch(function(error) {
            console.error('加载数据出错:', error);
            showError('加载数据时出错: ' + error.message);
        });

    // 显示用户信息
    function showUserInfo(user) {
        // 获取DOM元素
        const infoCard = document.getElementById('info-card');
        if (!infoCard) {
            console.log('infoCard element not found');
            return;
        }

        // 移除JS动画控制，让CSS动画自然触发
        // 确保info-card元素有足够的时间应用CSS动画
        infoCard.style.opacity = '';
        infoCard.style.transform = '';

        // 获取其他DOM元素
        const cardOwner = document.getElementById('card-owner');
        const position = document.getElementById('position');
        const idNumber = document.getElementById('id-number');
        const cardNumber = document.getElementById('card-number');
        const currentJob = document.getElementById('current-job');
        const validityPeriod = document.getElementById('validity-period');
        const boundCard = document.getElementById('bound-card');
        const profilePhoto = document.getElementById('profile-photo');

        // 填充数据
        if (cardOwner) cardOwner.textContent = user.name || '未知';
        if (position) position.textContent = user.position || '未知';
        if (idNumber) idNumber.textContent = user.id || '未知';
        if (cardNumber) cardNumber.textContent = user.cardNumber || 'CARD-' + user.id;
        if (currentJob) currentJob.textContent = user.currentJob || '未知';

        // 修复日期处理 - 提取有效期结束日期
        let validityEnd = null;
        if (user.validityPeriod) {
            // 解析 'YYYY-MM-DD 至 YYYY-MM-DD' 格式
            const parts = user.validityPeriod.split('至');
            if (parts.length === 2) {
                validityEnd = new Date(parts[1].trim());
            } else {
                // 尝试直接解析
                validityEnd = new Date(user.validityPeriod);
            }
        }

        // 使用顶部定义的formatDate函数格式化日期

        if (validityPeriod) {
            validityPeriod.textContent = formatDate(validityEnd);
        }

        if (boundCard) boundCard.textContent = user.boundCard || '无';

        // 验证证件是否过期
        const validStamp = document.querySelector('.stamp-text') || document.createElement('div');
        validStamp.className = 'stamp-text';
        if (validityEnd && now > validityEnd) {
            validStamp.textContent = '无效';
            validStamp.style.color = 'red';
        } else {
            validStamp.textContent = '已验证';
            validStamp.style.color = 'green';
        }
        if (!document.querySelector('.stamp-text')) {
            infoCard.appendChild(validStamp);
        }

        // 设置照片
        if (profilePhoto) {
            const img = new Image();
            img.onload = function() {
                profilePhoto.src = user.photo;
                profilePhoto.alt = user.name;
                // 添加照片淡入效果
                profilePhoto.style.opacity = '0';
                setTimeout(function() {
                    profilePhoto.style.transition = 'opacity 0.5s ease';
                    profilePhoto.style.opacity = '1';
                }, 300);
            };
            // 处理照片加载失败的情况
            img.onerror = function() {
                profilePhoto.src = 'images/default-avatar.png';
                profilePhoto.alt = '默认头像';
            };
            // 设置图片源
            img.src = user.photo || 'images/default-avatar.png';
        }
    }
});

function showError(message) {
    // 错误处理函数
    message = message || '未找到相关信息';
    console.error('Error:', message);
    alert(message);
}

// 添加页面加载动画
document.body.classList.add('loading');
setTimeout(function() {
    document.body.classList.remove('loading');
}, 800);