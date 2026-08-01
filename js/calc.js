function currentPercent(attended, total) {
    if (total === 0) {
        return 0;
    } else {
        return (attended / total) * 100;
    }
}
function safeBunks(attended, total, target){

     if (currentPercent(attended, total) < target) {
        return 0;
    }

    let bunks = 0;

    while ((attended / (total + bunks + 1)) * 100 >= target) {
        bunks++;
    }

    return bunks;
}

function classesNeeded(attended, total, target) {
    if (currentPercent(attended, total) >= target) {
        return 0;
    }

    let extra = 0;

    while (((attended + extra) / (total + extra)) * 100 < target) {
        extra++;
    }

    return extra;
}

function getStatus(attended, total, target) {
    let percent = currentPercent(attended, total);

    if (total === 0) {
        return {
            status: "No Classes",
            percentage: 0,
            message: "No classes conducted yet"
        };
    }

    if (percent >= target) {
        return {
            status: "Safe",
            percentage: percent,
            bunkAvailable: safeBunks(attended, total, target)
        };
    }

    return {
        status: "Danger",
        percentage: percent,
        classesRequired: classesNeeded(attended, total, target)
    };
}

export {
    currentPercent,
    classesNeeded,
    safeBunks,
    getStatus
};