function renderPortfolio(projects) {
    const container = document.getElementById('portfolio-container');
    const categories = [...new Set(projects.map(p => p.category))];

    categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category-row';
        section.innerHTML = `<h2 class="category-title">${category}</h2>`;

        const slider = document.createElement('div');
        slider.className = 'slider-container';

        // スライドさせるためのトラック要素を作成
        const track = document.createElement('div');
        track.className = 'slider-track';

        const filteredWorks = projects.filter(p => p.category === category);
        const cardsHtml = filteredWorks.map(work => {
            // ステータスに応じた出し分け
            const statusClass = work.isDeployed ? 'status-deployed' : 'status-pending';
            const statusText = work.isDeployed ? 'Deployed' : 'Local Only / Building';
            const cardClass = work.isDeployed ? '' : 'not-deployed';
            
            // 画像部分のリンク設定
            let imageHtml;
            if (work.image) {
                imageHtml = work.isDeployed 
                    ? `<a href="${work.link}" target="_blank" class="image-link"><img src="${work.image}" alt="${work.title}" class="work-image"></a>`
                    : `<img src="${work.image}" alt="${work.title}" class="work-image">`;
            } else {
                imageHtml = `<div class="no-image-placeholder">
                                <i class="far fa-image"></i>
                                <span>No Image</span>
                             </div>`;
            }

            // ボタンの有効・無効
            const projectBtn = work.isDeployed 
                ? `<a href="${work.link}" target="_blank" class="project-link">View Project</a>`
                : `<span class="project-link disabled">Not Deployed</span>`;

            // GitHubボタンの有効・無効
            const githubBtn = work.github
                ? `<a href="${work.github}" target="_blank" class="github-link" title="GitHub"><i class="fab fa-github"></i></a>`
                : `<span class="github-link disabled"><i class="fab fa-github"></i></span>`;

            return `
                <div class="work-card ${cardClass}">
                    ${imageHtml}
                    <div class="work-info">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <h3>${work.title}</h3>
                        <p>${work.description}</p>
                        <div class="links">
                            ${projectBtn}
                            ${githubBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Coming Soonカードの作成
        const comingSoonHtml = `
            <div class="work-card">
                <div class="coming-soon-img">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                <div class="work-info">
                    <span class="status-badge status-pending">Future</span>
                    <h3>Coming Soon...</h3>
                    <p>新しいプロジェクトを準備中です。</p>
                </div>
            </div>
        `;

        // 区切り線の作成
        const dividerHtml = `
            <div class="set-divider">
                <div class="divider-line"></div>
            </div>
        `;

        // 1セット分のHTMLを作成（作品リスト + Coming Soon + 区切り線）
        const fullSetHtml = cardsHtml + comingSoonHtml + dividerHtml;

        // カードの枚数（作品数 + Coming Soon）
        const totalCards = filteredWorks.length + 1;
        // ループに必要な幅を確保するため、カード枚数が少ない場合は繰り返し回数を増やす
        const repeatCount = totalCards <= 4 ? 4 : 2;

        track.innerHTML = fullSetHtml.repeat(repeatCount);
        
        slider.appendChild(track);
        section.appendChild(slider);
        container.appendChild(section);

        // --- 自動スクロールと手動操作の制御 ---
        let isInteracting = false;
        const scrollSpeed = 0.5; // スクロール速度（調整可能）

        const autoScroll = () => {
            // ユーザーが操作していない時だけ自動スクロール
            if (!isInteracting) {
                slider.scrollLeft += scrollSpeed;
                // 無限ループ処理: 1セット分を超えたら先頭に戻す
                if (slider.scrollLeft >= track.scrollWidth / repeatCount) {
                    slider.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll);
        };
        requestAnimationFrame(autoScroll);

        // ユーザー操作時は自動スクロールを停止
        const stop = () => isInteracting = true;
        const start = () => isInteracting = false;

        slider.addEventListener('mousedown', stop);
        slider.addEventListener('touchstart', stop, { passive: true });
        slider.addEventListener('mouseup', start);
        slider.addEventListener('mouseleave', start);
        slider.addEventListener('touchend', start);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => renderPortfolio(data))
        .catch(error => console.error('Error loading projects:', error));
});

// Contactボタンの一時的な未実装アラート（後で削除予定）
document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.querySelector('.btn-contact');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactBtn.classList.add('show-tooltip');
            setTimeout(() => {
                contactBtn.classList.remove('show-tooltip');
            }, 2000); // 2秒後に消える
        });
    }
});