import { getStatus } from "./calc.js";

const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", () => {

    const subject = document.getElementById("subject").value;

    const attended = Number(document.getElementById("attended").value);

    const total = Number(document.getElementById("total").value);

    const target = Number(document.getElementById("target").value);

    const result = getStatus(attended, total, target);

    let html = `
        <h2>${subject}</h2>
        <p>Attendance: ${result.percentage.toFixed(2)}%</p>
        <p>Status: ${result.status}</p>
    `;

    if(result.status === "Safe"){

        html += `<p>Safe Bunks: ${result.bunkAvailable}</p>`;

    }
    else if(result.status === "Danger"){

        html += `<p>Classes Needed: ${result.classesRequired}</p>`;

    }
    else{

        html += `<p>${result.message}</p>`;

    }

    document.getElementById("result").innerHTML = html;

});