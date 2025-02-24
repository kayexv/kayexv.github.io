// 缓存变量，用于存储已经读取过的书签数据
let cachedBookmarks = null;

// 从 GitHub 获取 bookmarks.html 文件
async function getBookmarksFromGitHub() {
    // 如果已经有缓存数据，直接返回缓存
    if (cachedBookmarks) {
        return cachedBookmarks;
    }

    try {
        const response = await fetch('https://raw.githubusercontent.com/kayexv/kayexv.github.io/main/bookmarks.html');
        if (!response.ok) {
            console.error(`请求失败，状态码: ${response.status}`);
            const loadingMessage = document.getElementById('loading-message');
            loadingMessage.textContent = `加载失败，状态码: ${response.status}`;
            return {};
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bookmarks = parseGoogleBookmarks(doc);
        // 将解析后的数据存入缓存
        cachedBookmarks = bookmarks;
        return bookmarks;
    } catch (error) {
        console.error('从 GitHub 获取书签数据时出错:', error);
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.textContent = '加载时出现错误，请稍后重试。';
        return {};
    }
}

// 解析谷歌浏览器书签文件（bookmarks.html）
function parseGoogleBookmarks(doc) {
    try {
        const groups = {};
        const folders = doc.querySelectorAll('dt > h3');
        folders.forEach(folder => {
            const groupName = folder.textContent;
            const links = [];
            const dtElements = folder.parentNode.querySelectorAll('dt > a');
            dtElements.forEach(link => {
                links.push({
                    name: link.textContent,
                    url: link.href
                });
            });
            groups[groupName] = links;
        });
        return groups;
    } catch (error) {
        console.error('解析书签文件时出错:', error);
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.textContent = '解析书签文件时出现错误。';
        return {};
    }
}

// 渲染书签
function renderBookmarks(bookmarks) {
    const container = document.getElementById('bookmark-container');
    const loadingMessage = document.getElementById('loading-message');
    container.removeChild(loadingMessage);
    container.innerHTML = '';

    // 渲染导入的书签
    for (const group in bookmarks) {
        const groupDiv = document.createElement('div');
        groupDiv.innerHTML = `<h2>${group}</h2>`;
        bookmarks[group].forEach(bookmark => {
            const link = document.createElement('a');
            link.href = bookmark.url;
            link.textContent = bookmark.name;
            link.target = '_blank';
            groupDiv.appendChild(link);
            groupDiv.appendChild(document.createElement('br'));
        });
        container.appendChild(groupDiv);
    }
}

// 初始化页面
async function init() {
    const bookmarks = await getBookmarksFromGitHub();
    renderBookmarks(bookmarks);
}

init();
