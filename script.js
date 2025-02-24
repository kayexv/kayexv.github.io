// 从 GitHub 获取 bookmarks.html 文件
async function getBookmarksFromGitHub() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/kayexv/kayexv.github.io/main/bookmarks.html');
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return parseGoogleBookmarks(doc);
        }
    } catch (error) {
        console.error('从 GitHub 获取书签数据时出错:', error);
    }
    return {};
}

// 解析谷歌浏览器书签文件（bookmarks.html）
function parseGoogleBookmarks(doc) {
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
}

// 渲染书签
function renderBookmarks(bookmarks) {
    const container = document.getElementById('bookmark-container');
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
