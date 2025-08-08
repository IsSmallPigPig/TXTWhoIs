document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // 加载数据
    let userData = [];

    

    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            userData = data.users || [];
            
            // 初始化背景配置
        if (window.BackgroundManager) {
            window.BackgroundManager.initBackgroundConfig(data.config);
        }
            
            // 添加加载完成动画
            document.body.classList.add('loaded');
        })
        .catch(error => {
            console.error('加载数据出错:', error);
            // 显示错误信息
            showError('数据加载失败，请稍后重试');
        });

    // 搜索功能
    function searchUser() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    console.log('搜索关键词:', searchTerm);
    if (!searchTerm) {
        // 显示错误信息
        showError('请输入姓名、ID、绑定卡片编号或人员性别');
        return;
    }

    // 检查数据是否加载完成
    if (userData.length === 0) {
        showError('数据加载中，请稍后重试');
        return;
    }

    console.log('开始搜索，用户数据数量:', userData.length);
    // 在数据中查找精确匹配项
    const matchedUsers = userData.filter(user => {
        const nameMatch = user.name.toLowerCase() === searchTerm;
        const idMatch = user.id.toLowerCase() === searchTerm;
        const boundCardMatch = user.boundCard.toLowerCase() === searchTerm;
        const cardNumberMatch = user.cardNumber.toLowerCase() === searchTerm;
        
        console.log(`检查用户 ${user.name}:`);
        console.log(`  姓名匹配: ${nameMatch}`);
        console.log(`  ID匹配: ${idMatch}`);
        console.log(`  绑定卡片匹配: ${boundCardMatch}`);
        console.log(`  卡号匹配: ${cardNumberMatch}`);
        
        return nameMatch || idMatch || boundCardMatch || cardNumberMatch;
    });

    console.log('搜索结果数量:', matchedUsers.length);

    if (matchedUsers.length === 0) {
        showError('未找到匹配的信息，请检查输入并重试');
    }

    if (matchedUsers.length > 0) {
        // 有匹配项，跳转到结果页面
        console.log('找到匹配项，跳转到结果页面');
        // 构建查询参数
        const searchTerm = searchInput.value.trim().toLowerCase();
        const firstMatch = matchedUsers[0];
        let queryParams = `id=${firstMatch.id}`;
        
        // 检查是否是通过boundCard匹配的
        if (firstMatch.boundCard.toLowerCase().includes(searchTerm)) {
            queryParams += `&boundCard=${encodeURIComponent(firstMatch.boundCard)}`;
        }
        
        // 如果只有一个匹配项，直接跳转
        if (matchedUsers.length === 1) {
            window.location.href = `result.html?${queryParams}`;
        } else {
            // 多个匹配项的处理逻辑可以在这里添加
            // 简单实现：取第一个匹配项
            window.location.href = `result.html?${queryParams}`;
        }
    } else {
        // 无匹配项
        showError('未找到匹配的信息，请检查输入并重试');
    }
}

    // 提交表单
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        searchUser();
    });

    // 点击搜索按钮
    searchBtn.addEventListener('click', function() {
        // 添加按钮点击动画
        searchBtn.classList.add('clicked');
        setTimeout(() => {
            searchBtn.classList.remove('clicked');
        }, 300);
    });

    // 添加输入框动画效果
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    searchInput.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.parentElement.classList.remove('focused');
        }
    });

    // 错误提示函数
    function showError(message) {
        // 创建错误提示元素
        let errorElement = document.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            searchForm.parentNode.appendChild(errorElement);
        }

        // 设置错误信息
        errorElement.textContent = message;
        errorElement.classList.add('show');

        // 3秒后隐藏错误信息
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 3000);
    }
});