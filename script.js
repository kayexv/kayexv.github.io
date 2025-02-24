// 设定密码
const correctPassword = '111111111';
// 登录按钮和输入框的 DOM 元素
const loginButton = document.getElementById('login-button');
const passwordInput = document.getElementById('password-input');
const loginSection = document.getElementById('login-section');
const bookmarkSection = document.getElementById('bookmark-section');
const bookmarkList = document.getElementById('bookmark-list');

// 登录按钮点击事件处理函数
loginButton.addEventListener('click', function() {
    const inputPassword = passwordInput.value;
    if (inputPassword === correctPassword) {
        loginSection.style.display = 'none';
        bookmarkSection.style.display = 'block';
        fetchBookmarks();
    } else {
        alert('密码错误，请重新输入。');
    }
});

// 从 GitHub 仓库获取书签文件的函数
function fetchBookmarks() {
    const githubUsername = 'kayexv';
    const githubRepo = 'kayexv.github.io';
    const filePath = 'bookmarks.html';
    const url = `https://raw.githubusercontent.com/${githubUsername}/${githubRepo}/main/${filePath}`;

    fetch(url)
      .then(response => response.text())
      .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const links = htmlDoc.querySelectorAll('a');
            links.forEach(link => {
                const listItem = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = link.href;
                anchor.textContent = link.textContent;
                listItem.appendChild(anchor);
                bookmarkList.appendChild(listItem);
            });
        })
      .catch(error => {
            console.error('获取书签文件时出错:', error);
            alert('无法获取书签文件，请稍后再试。');
        });
}
