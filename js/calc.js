function currentPercent(attended, total){
    if (total === 0) {
        return 0;
    }

    return (attended / total) * 100;
}
function safeBunks(attended, total, target){

    let bunks = 0;

    while(currentPercent(attended, total + 1) >= target){

        total++;
        bunks++;

    }

    return bunks;
}
function classesNeeded(attended, total, target){

    if(total === 0){
        return 0;
    }

    let needed = 0;

    while(currentPercent(attended, total) < target){

        attended++;
        total++;
        needed++;

    }

    return needed;
}
function getStatus(attended, total, target){

    let percent = currentPercent(attended, total);

    if(total === 0){
        return "No classes conducted yet";
    }

    if(percent >= target){

        return {
            status: "Safe",
            percentage: percent,
            bunkAvailable: safeBunks(attended, total, target)
        };

    }
    else{

        return {
            status: "Danger",
            percentage: percent,
            classesRequired: classesNeeded(attended, total, target)
        };

    }
}