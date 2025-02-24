// 从GitHub仓库加载书签文件
fetch('https://raw.githubusercontent.com/kayexv/kayexv.github.io/main/bookmarks.html')
  .then(response => response.text())
  .then(data => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');

        const dlElements = htmlDoc.getElementsByTagName('DL');
        const container = document.getElementById('bookmark-container');

        // 遍历每个DL元素，处理书签分组
        for (let i = 0; i < dlElements.length; i++) {
            const dt = dlElements[i].previousElementSibling;
            if (dt && dt.tagName === 'DT') {
                const h3 = dt.querySelector('H3');
                if (h3) {
                    const groupTitle = h3.textContent;
                    const groupDiv = document.createElement('div');
                    groupDiv.classList.add('group');

                    const titleDiv = document.createElement('div');
                    titleDiv.classList.add('group-title');
                    titleDiv.textContent = groupTitle;
                    titleDiv.addEventListener('click', function () {
                        const contentDiv = this.nextElementSibling;
                        contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
                    });
                    groupDiv.appendChild(titleDiv);

                    const contentDiv = document.createElement('div');
                    contentDiv.classList.add('group-content');
                    const links = dlElements[i].getElementsByTagName('A');
                    for (let j = 0; j < links.length; j++) {
                        const link = document.createElement('a');
                        link.href = links[j].href;
                        link.textContent = links[j].textContent;
                        contentDiv.appendChild(link);
                    }
                    groupDiv.appendChild(contentDiv);

                    container.appendChild(groupDiv);
                }
            }
        }
    })
  .catch(error => console.error('加载书签文件时出错:', error));
