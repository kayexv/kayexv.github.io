// 获取北京时间时钟
function getBeijingTime() {
    const now = new Date();
    const offset = 8; // 北京时间为 UTC+8
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const beijingTime = new Date(utc + (3600000 * offset));
    const hours = String(beijingTime.getHours()).padStart(2, '0');
    const minutes = String(beijingTime.getMinutes()).padStart(2, '0');
    const seconds = String(beijingTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// 更新时钟显示
function updateClock() {
    const clockElement = document.getElementById('clock');
    clockElement.textContent = `北京时间: ${getBeijingTime()}`;
}

// 每秒更新一次时钟
setInterval(updateClock, 1000);
updateClock();

// 加载书签文件
fetch('https://raw.githubusercontent.com/kayexv/kayexv.github.io/main/bookmarks.html')
   .then(response => response.text())
   .then(data => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const folders = htmlDoc.querySelectorAll('dl');

        const bookmarksContainer = document.getElementById('bookmarks-container');

        folders.forEach(folder => {
            const folderTitle = folder.previousElementSibling.textContent;
            const h2 = document.createElement('h2');
            h2.textContent = folderTitle;
            bookmarksContainer.appendChild(h2);

            const ul = document.createElement('ul');
            const links = folder.querySelectorAll('a');
            links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.textContent;
                li.appendChild(a);
                ul.appendChild(li);
            });
            bookmarksContainer.appendChild(ul);
        });
    })
   .catch(error => {
        console.error('加载书签文件时出错:', error);
    });
