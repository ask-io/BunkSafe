// ── PWA install prompt: header CTA + fallback banner (iOS/unsupported browsers) ──

let deferredInstallPrompt = null;
const INSTALL_DISMISS_KEY = 'bunksafe_install_dismissed';

function isStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function installDismissed() {
    return localStorage.getItem(INSTALL_DISMISS_KEY) === '1';
}

function setInstallDismissed() {
    localStorage.setItem(INSTALL_DISMISS_KEY, '1');
}

function showHeaderInstallBtn() {
    const btn = document.getElementById('install-header-btn');
    if (btn) btn.classList.remove('hidden');
}

function hideHeaderInstallBtn() {
    const btn = document.getElementById('install-header-btn');
    if (btn) btn.classList.add('hidden');
}

function hideInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) banner.classList.add('hidden');
}

function showInstallBanner(mode) {
    if (isStandaloneMode() || installDismissed()) return;

    const banner = document.getElementById('install-banner');
    const sub = document.getElementById('install-banner-sub');
    const actionBtn = document.getElementById('install-banner-btn');
    if (!banner || !sub || !actionBtn) return;

    if (mode === 'ios') {
        sub.textContent = 'TAP SHARE ⬆ THEN "ADD TO HOME SCREEN"';
        actionBtn.classList.add('hidden');
    } else {
        sub.textContent = 'INSTALL BUNKSAFE FOR QUICK ACCESS';
        actionBtn.classList.remove('hidden');
    }
    banner.classList.remove('hidden');
}

async function triggerInstallPrompt() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideHeaderInstallBtn();
    hideInstallBanner();
}

// Native install support (Chrome/Edge/Android)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (isStandaloneMode()) return;
    showHeaderInstallBtn();
    showInstallBanner('native');
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hideHeaderInstallBtn();
    hideInstallBanner();
    setInstallDismissed();
});

// Delegated clicks — works across ui.js re-renders since #app is only ever emptied, not replaced
document.addEventListener('click', (e) => {
    if (e.target.id === 'install-header-btn') {
        if (deferredInstallPrompt) {
            triggerInstallPrompt();
        } else if (isIOSDevice()) {
            showInstallBanner('ios');
        }
        return;
    }
    if (e.target.id === 'install-banner-btn') {
        triggerInstallPrompt();
        return;
    }
    if (e.target.id === 'install-banner-dismiss') {
        setInstallDismissed();
        hideInstallBanner();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (isStandaloneMode()) return;
    if (isIOSDevice()) {
        showHeaderInstallBtn();
        showInstallBanner('ios');
    }
    // Non-iOS browsers without beforeinstallprompt support (e.g. Firefox Android)
    // simply never show the CTA — no native install path exists there.
});