function currentPercent(attended, total) {
    if (!total || total <= 0) return 0;
    return (attended / total) * 100;
}

function safeBunks(attended, total, target) {
    if (!target || target <= 0) return 0;
    if (currentPercent(attended, total) < target) return 0;
    const safe = (attended * 100 - target * total) / target;
    return Math.max(0, Math.floor(safe));
}

function classesNeeded(attended, total, target) {
    if (target >= 100) return Math.max(0, total - attended);
    if (currentPercent(attended, total) >= target) return 0;
    const needed = (target * total - 100 * attended) / (100 - target);
    return Math.max(0, Math.ceil(needed));
}

function getStatus(attended, total, target) {
    const percent = currentPercent(attended, total);
    const rounded = percent.toFixed(1);
    if (percent >= target) {
        const bunks = safeBunks(attended, total, target);
        if (bunks <= 0) return `${rounded}% — right on the edge. One more miss drops you below ${target}%.`;
        return `${rounded}% — you can skip ${bunks} more class${bunks === 1 ? '' : 'es'} and stay above ${target}%.`;
    }
    const needed = classesNeeded(attended, total, target);
    return `${rounded}% — attend the next ${needed} class${needed === 1 ? '' : 'es'} in a row to hit ${target}%.`;
}

function statusClass(attended, total, target) {
    if (total === 0) return 'safe';
    const pct = currentPercent(attended, total);
    if (pct >= target) return 'safe';
    if (pct >= target - 8) return 'warning';
    return 'risk';
}

const STATUS_LABEL = {
    safe: '● SAFE',
    warning: '● WARN',
    risk: '● RISK',
};