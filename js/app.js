import { currentPercent, safeBunks, classesNeeded, getStatus } from "./calc.js";

const STORAGE_KEY = "bunksafe.subjects";

const form = document.getElementById("subject");
const attendedInput = document.getElementById("attended");
const totalInput = document.getElementById("total");
const targetInput = document.getElementById("target");
const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");
const listEl = document.getElementById("subjectList");

function loadSubjects() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

function showResult(attended, total, target) {
    if (!total || total <= 0) {
        resultEl.textContent = "Total classes has to be more than zero.";
        resultEl.className = "warn";
        return;
    }
    if (attended > total) {
        resultEl.textContent = "Attended can't be more than total.";
        resultEl.className = "warn";
        return;
    }

    resultEl.textContent = getStatus(attended, total, target);
    resultEl.className = currentPercent(attended, total) >= target ? "safe" : "risk";
}

function renderSubjects() {
    const subjects = loadSubjects();
    listEl.innerHTML = "";

    if (subjects.length === 0) {
        listEl.innerHTML = `<p class="empty">No subjects saved yet. Add one above.</p>`;
        return;
    }

    subjects.forEach((s, i) => {
        const percent = currentPercent(s.attended, s.total);
        const safe = percent >= s.target;
        const card = document.createElement("div");
        card.className = "card";

        const bunked = s.total - s.attended;

        card.innerHTML = `
        <div class="card-top">
            <span class="card-name">${s.name}</span>
            <button class="removeBtn" data-index="${i}">×</button>
        </div>

        <div class="card-percent ${safe ? "safe" : "risk"}">
            ${percent.toFixed(1)}%
        </div>

        <div class="card-stats">
            <span>✅ Attended: <strong>${s.attended}</strong></span>
            <span>❌ Bunked: <strong>${bunked}</strong></span>
            <span>📚 Total: <strong>${s.total}</strong></span>
        </div>

        <div class="card-detail">
            ${getStatus(s.attended, s.total, s.target)}
        </div>

        <div class="card-actions">
            <button class="attendBtn" data-index="${i}">
                + Attended
            </button>
            <button class="bunkBtn" data-index="${i}">
                − Bunked
            </button>
        </div>
    `;
        listEl.appendChild(card);
    });

    listEl.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const subjects = loadSubjects();
            subjects.splice(Number(btn.dataset.index), 1);
            saveSubjects(subjects);
            renderSubjects();
        });
    });
    
    listEl.querySelectorAll(".attendBtn").forEach(btn =>{
        btn.addEventListener("click", () => {
            const subjects = loadSubjects();
            const subject = subjects[Number(btn.dataset.index)];

            subject.attended++;
            subject.total++;

            saveSubjects(subjects);
            renderSubjects()
        });
    });

    listEl.querySelectorAll(".bunkBtn").forEach(btn =>{
        btn.addEventListener("click", () => {
            const subjects = loadSubjects();
            const subject = subjects[Number(btn.dataset.index)];

            subject.total++;

            saveSubjects(subjects);
            renderSubjects()
        });
    });
}


calculateBtn.addEventListener("click", () => {
    const name = form.value.trim();
    const attended = Number(attendedInput.value);
    const total = Number(totalInput.value);
    const target = Number(targetInput.value);

    if (!name) {
        resultEl.textContent = "Give the subject a name first.";
        resultEl.className = "warn";
        return;
    }

    showResult(attended, total, target);

    if (total > 0 && attended <= total) {
        const subjects = loadSubjects();
        subjects.push({ name, attended, total, target });
        saveSubjects(subjects);
        renderSubjects();

        form.value = "";
        attendedInput.value = "";
        totalInput.value = "";
    }
});

renderSubjects();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {
            // offline support is a nice-to-have, not worth failing loudly over
        });
    });
}