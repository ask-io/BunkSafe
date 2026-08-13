function renderOnboarding() {
    const onboarding = document.getElementById('onboarding');
    const app = document.getElementById('app');

    app.classList.add('hidden');
    onboarding.classList.remove('hidden');

    onboarding.innerHTML = `
        <canvas id="pixel-canvas" class="pixel-canvas"></canvas>
        <div class="onboarding-wrap">
            <div class="onboarding-card">
                <div class="version-tag">v1.0.0</div>
                <h1 class="logo">BUNK<br>SAFE</h1>
                <div class="subtitle">ATTENDANCE TRACKER</div>
                <div class="divider-dashed"></div>

                <div class="field-group">
                    <label class="field-label">► CALLSIGN</label>
                    <input id="name-input" class="px-input" placeholder="ENTER NAME..." autocomplete="off" />
                </div>

                <button id="start-btn" class="px-btn px-btn-primary" disabled>START &gt;&gt;</button>
                <div id="start-hint" class="hint-text">ENTER NAME TO CONTINUE<br></div>
                
                <div class="divider-dashed"></div>
                <div class="developer-tag"><br>DEVELOPED BY ABHIJIT SMIJU KUNNEL</div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('pixel-canvas');
    if (canvas) initPixelCanvas(canvas);
}

function renderDashboard(state) {
    const onboarding = document.getElementById('onboarding');
    const app = document.getElementById('app');

    onboarding.classList.add('hidden');
    app.classList.remove('hidden');

    const subjects = state.subjects;
    const safeCount = subjects.filter(s => statusClass(s.attended, s.total, s.target) === 'safe').length;
    const warnCount = subjects.filter(s => statusClass(s.attended, s.total, s.target) === 'warning').length;
    const riskCount = subjects.filter(s => statusClass(s.attended, s.total, s.target) === 'risk').length;
    const overallPct = subjects.length === 0
        ? 100
        : subjects.reduce((acc, s) => acc + currentPercent(s.attended, s.total), 0) / subjects.length;

    app.innerHTML = `
        <canvas id="pixel-canvas" class="pixel-canvas"></canvas>
        <div class="dashboard-wrap">
            <div class="dashboard-inner">
                <header class="app-header">
                    <div class="app-logo">BUNKSAFE</div>
                    <div class="header-right">
                        <button id="install-header-btn" class="px-btn-small px-btn-ghost hidden" type="button">⭳ INSTALL</button>
                        <div class="greeting">HI, ${escapeHtml(state.studentName.toUpperCase())}</div>
                    </div>
                </header>

                ${subjects.length > 0 ? `
                <div class="summary-card">
                    <div>
                        <div class="summary-label">OVERALL AVG</div>
                        <div class="summary-percent ${overallPct >= 75 ? 'safe' : 'risk'}">${overallPct.toFixed(1)}%</div>
                    </div>
                    <div class="summary-counts">
                        ${safeCount > 0 ? `<div class="stat-count-wrap"><div class="stat-count" style="color:var(--green)">${safeCount}</div><div class="stat-count-label">SAFE</div></div>` : ''}
                        ${warnCount > 0 ? `<div class="stat-count-wrap"><div class="stat-count" style="color:var(--warn)">${warnCount}</div><div class="stat-count-label">WARN</div></div>` : ''}
                        ${riskCount > 0 ? `<div class="stat-count-wrap"><div class="stat-count" style="color:var(--red)">${riskCount}</div><div class="stat-count-label">RISK</div></div>` : ''}
                    </div>
                </div>` : ''}

                <div class="subjects-heading">── SUBJECTS (${subjects.length}) ──────────────</div>

                ${subjects.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">📚</div>
                    <div class="empty-state-text">NO SUBJECTS ADDED YET.<br />HIT + TO GET STARTED.</div>
                </div>` : subjects.map(renderSubjectCard).join('')}

                <div class="fab-wrap">
                    <button id="add-subject-btn" class="px-btn px-btn-primary">+ ADD SUBJECT</button>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('pixel-canvas');
    if (canvas) initPixelCanvas(canvas);
}

function renderSubjectCard(subject) {
    const pct = currentPercent(subject.attended, subject.total);
    const status = statusClass(subject.attended, subject.total, subject.target);
    const label = STATUS_LABEL[status];
    const statusText = getStatus(subject.attended, subject.total, subject.target);
    const bunked = subject.total - subject.attended;

    return `
        <div class="card status-${status}" data-id="${subject.id}">
            <div class="card-top">
                <div class="card-name">${escapeHtml(subject.name.toUpperCase())}</div>
                <div class="card-top-right">
                    <span class="status-badge status-${status}">${label}</span>
                    <button class="px-btn px-btn-danger px-btn-small remove-btn" data-id="${subject.id}">✕</button>
                </div>
            </div>

            <span class="card-percent status-${status}">${pct.toFixed(1)}%</span>

            <div class="card-stats">
                <div class="stat-box"><span class="stat-label">ATND</span><span class="stat-value">${subject.attended}</span></div>
                <div class="stat-box"><span class="stat-label">BUNK</span><span class="stat-value">${bunked}</span></div>
                <div class="stat-box"><span class="stat-label">TOTL</span><span class="stat-value">${subject.total}</span></div>
                <div class="stat-box"><span class="stat-label">MIN%</span><span class="stat-value">${subject.target}</span></div>
            </div>

            <div class="status-message status-${status}">► ${statusText}</div>

            <div class="card-actions">
                <button class="px-btn px-btn-bunk mark-btn" data-id="${subject.id}" data-type="miss">✕ BUNK</button>
                <button class="px-btn px-btn-attend mark-btn" data-id="${subject.id}" data-type="attend">✓ ATTEND</button>
            </div>
        </div>
    `;
}

function openAddSubjectModal() {
    const modal = document.getElementById('add-subject-modal');
    modal.classList.remove('hidden');
    modal.innerHTML = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal-panel">
                <div class="modal-header">
                    <div class="modal-title">[ ADD SUBJECT ]</div>
                    <button class="px-btn px-btn-danger px-btn-small" id="modal-close">✕</button>
                </div>

                <div id="modal-error" class="error-box hidden"></div>

                <div class="field-group">
                    <label class="field-label small">SUBJECT NAME</label>
                    <input id="modal-name" class="px-input" placeholder="E.G. DATA STRUCTURES" autocomplete="off" />
                </div>

                <div class="field-row-3">
                    <div>
                        <label class="field-label small">ATTENDED</label>
                        <input id="modal-attended" class="px-input" type="number" placeholder="0" />
                    </div>
                    <div>
                        <label class="field-label small">TOTAL</label>
                        <input id="modal-total" class="px-input" type="number" placeholder="0" />
                    </div>
                    <div>
                        <label class="field-label small">TARGET %</label>
                        <input id="modal-target" class="px-input" type="number" placeholder="75" />
                    </div>
                </div>

                <button id="modal-submit" class="px-btn px-btn-primary">+ ADD SUBJECT</button>
            </div>
        </div>
    `;
    document.getElementById('modal-name').focus();
}

function closeAddSubjectModal() {
    const modal = document.getElementById('add-subject-modal');
    modal.classList.add('hidden');
    modal.innerHTML = '';
}

function showModalError(message) {
    const box = document.getElementById('modal-error');
    box.textContent = `⚠ ${message}`;
    box.classList.remove('hidden');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}