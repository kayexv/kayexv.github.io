// 从 GitHub 仓库获取书签文件
const githubUsername = 'kayexv';
const githubRepo = 'kayexv.github.io';
const bookmarksFilePath = 'bookmarks.html';
const apiUrl = `https://raw.githubusercontent.com/${githubUsername}/${githubRepo}/main/${bookmarksFilePath}`;

fetch(apiUrl)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');

        // 查找所有的文件夹（分组）
        const folders = htmlDoc.querySelectorAll('DT > H3');
        const bookmarkContainer = document.getElementById('bookmark-container');

        folders.forEach(folder => {
            const groupName = folder.textContent;
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('group');

            const groupTitle = document.createElement('h2');
            groupTitle.textContent = groupName;
            groupDiv.appendChild(groupTitle);

            const groupList = document.createElement('ul');
            const links = folder.nextElementSibling.querySelectorAll('A');
            links.forEach(link => {
                const listItem = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = link.href;
                anchor.textContent = link.textContent;
                listItem.appendChild(anchor);
                groupList.appendChild(listItem);
            });

            groupDiv.appendChild(groupList);
            bookmarkContainer.appendChild(groupDiv);

            // 为标题添加点击事件
            groupTitle.addEventListener('click', function () {
                groupDiv.classList.toggle('expanded');
            });
        });
    })
    .catch(error => {
        console.error('获取书签文件时出错:', error);
    });
