let state = {
    studentName: '',
    subjects: [],
};

function persist() {
    saveData({ profile: { name: state.studentName }, subjects: state.subjects });
}

function goToDashboard() {
    renderDashboard(state);
}

function goToOnboarding() {
    renderOnboarding();
}

function handleStart(name) {
    state.studentName = name;
    persist();
    goToDashboard();
}

function handleAddSubject(subject) {
    state.subjects.push({ ...subject, id: crypto.randomUUID() });
    persist();
    goToDashboard();
}

function handleMark(id, type) {
    state.subjects = state.subjects.map(s => {
        if (s.id !== id) return s;
        return type === 'attend'
            ? { ...s, attended: s.attended + 1, total: s.total + 1 }
            : { ...s, total: s.total + 1 };
    });
    persist();
    goToDashboard();
}

function handleRemove(id) {
    state.subjects = state.subjects.filter(s => s.id !== id);
    persist();
    goToDashboard();
}

function submitAddSubjectForm() {
    const name = document.getElementById('modal-name').value;
    const attended = parseInt(document.getElementById('modal-attended').value) || 0;
    const total = parseInt(document.getElementById('modal-total').value) || 0;
    const targetRaw = parseInt(document.getElementById('modal-target').value) || 75;
    const target = Math.min(100, Math.max(1, targetRaw));

    if (!name.trim()) {
        showModalError('GIVE THE SUBJECT A NAME FIRST.');
        return;
    }
    if (total > 0 && attended > total) {
        showModalError("ATTENDED CAN'T BE MORE THAN TOTAL.");
        return;
    }

    closeAddSubjectModal();
    handleAddSubject({ name: name.trim(), attended, total, target });
}

// ── Event delegation: one listener per container, since content re-renders ──

document.addEventListener('DOMContentLoaded', () => {
    const stored = loadData();

    if (stored && stored.profile && stored.profile.name) {
        state.studentName = stored.profile.name;
        state.subjects = stored.subjects || [];
        goToDashboard();
    } else {
        goToOnboarding();
    }

    // Onboarding: name input + start button
    document.getElementById('onboarding').addEventListener('input', (e) => {
        if (e.target.id !== 'name-input') return;
        const hasName = e.target.value.trim().length > 0;
        document.getElementById('start-btn').disabled = !hasName;
        document.getElementById('start-hint').classList.toggle('hidden', hasName);
    });

    document.getElementById('onboarding').addEventListener('keydown', (e) => {
        if (e.target.id === 'name-input' && e.key === 'Enter' && e.target.value.trim()) {
            handleStart(e.target.value.trim());
        }
    });

    document.getElementById('onboarding').addEventListener('click', (e) => {
        if (e.target.id === 'start-btn' && !e.target.disabled) {
            const name = document.getElementById('name-input').value.trim();
            if (name) handleStart(name);
        }
    });

    // Dashboard: add button, mark attend/miss, remove
    document.getElementById('app').addEventListener('click', (e) => {
        if (e.target.id === 'add-subject-btn') {
            openAddSubjectModal();
            return;
        }
        const markBtn = e.target.closest('.mark-btn');
        if (markBtn) {
            handleMark(markBtn.dataset.id, markBtn.dataset.type);
            return;
        }
        const removeBtn = e.target.closest('.remove-btn');
        if (removeBtn) {
            handleRemove(removeBtn.dataset.id);
        }
    });

    // Modal: delegate on the modal container since it's rebuilt each open
    document.getElementById('add-subject-modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay' || e.target.id === 'modal-close') {
            closeAddSubjectModal();
            return;
        }
        if (e.target.id === 'modal-submit') {
            submitAddSubjectForm();
        }
    });

    document.getElementById('add-subject-modal').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id === 'modal-name') {
            submitAddSubjectForm();
        }
    });
});