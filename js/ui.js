function renderOnboarding() {

    const onboarding = document.getElementById("onboarding");
    const app = document.getElementById("app");

    app.classList.add("hidden");
    onboarding.classList.remove("hidden");

    onboarding.innerHTML = `
        <h1 class="text-3xl font-bold">
            Welcome to BunkSafe
        </h1>

        <p class="mt-2 text-slate-400">
            Add your first subject to get started.
        </p>
    `;
}