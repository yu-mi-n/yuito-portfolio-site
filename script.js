function renderPortfolio(projects) {
    const container = document.getElementById('portfolio-container');
    const categories = [...new Set(projects.map(p => p.category))];

    categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category-row';
        section.innerHTML = `<h2 class="category-title">${category}</h2>`;

        const slider = document.createElement('div');
        slider.className = 'slider-container';

        const track = document.createElement('div');
        track.className = 'slider-track';

        const filteredWorks = projects.filter(p => p.category === category);
        const cardsHtml = filteredWorks.map(work => {
            const statusClass = work.isDeployed ? 'status-deployed' : 'status-pending';
            const statusText = work.isDeployed ? 'Deployed' : 'Local Only / Building';
            const cardClass = work.isDeployed ? '' : 'not-deployed';
            
            // 画像部分のリンク
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

            const projectBtn = work.isDeployed 
                ? `<a href="${work.link}" target="_blank" class="project-link">View Project</a>`
                : `<span class="project-link disabled">Not Deployed</span>`;

            // GitHubボタン
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

        // Coming Soonカード
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

        const dividerHtml = `
            <div class="set-divider">
                <div class="divider-line"></div>
            </div>
        `;

        // 1セット分のHTML（作品リスト + Coming Soon + 区切り線）
        const fullSetHtml = cardsHtml + comingSoonHtml + dividerHtml;
        const totalCards = filteredWorks.length + 1;
        const repeatCount = totalCards <= 4 ? 4 : 2;

        track.innerHTML = fullSetHtml.repeat(repeatCount);
        
        slider.appendChild(track);
        section.appendChild(slider);
        container.appendChild(section);

        let isInteracting = false;
        const scrollSpeed = 0.5;

        const autoScroll = () => {
            if (!isInteracting) {
                slider.scrollLeft += scrollSpeed;
                if (slider.scrollLeft >= track.scrollWidth / repeatCount) {
                    slider.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScroll);
        };
        requestAnimationFrame(autoScroll);

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

// ーーーーーーーーーーーーーーContactボタンの未実装アラートーーーーーーーーーー「「「「「「「実装後、削除」」」」」」」」」」」
document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.querySelector('.btn-contact');
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactBtn.classList.add('show-tooltip');
            setTimeout(() => {
                contactBtn.classList.remove('show-tooltip');
            }, 2000);
        });
    }
});