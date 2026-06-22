const calculateBtn = document.querySelector(".calculate-btn");

calculateBtn.addEventListener("click", () => {
    const required = Number(document.getElementById("requiredPercentage").value);
    const present = Number(document.getElementById("presentClasses").value);
    const total = Number(document.getElementById("totalClasses").value);

    const resultBox = document.getElementById("resultBox");
    const attendanceText = document.getElementById("currentAttendance");
    const bunkText = document.getElementById("bunkResult");

    //  validation
    if (present < 0 || total <= 0 || present > total) {
        resultBox.style.display = "block";
        attendanceText.textContent = "Invalid input values";
        bunkText.textContent = "";
        return;
    }

    //  current attendance
    const currentAttendance = (present / total) * 100;

    attendanceText.textContent =
        `📈Current Attendance: ${currentAttendance.toFixed(2)}%`;

    //  bunk logic
    if (currentAttendance < required) {
        const neededClasses =
            Math.ceil((required * total - 100 * present) / (100 - required));

        bunkText.textContent =
            `❌ You cannot bunk. You need to attend next ${neededClasses} classes to reach ${required}%.`;
    } else {
        const maxBunks =
            Math.floor((present * 100 - required * total) / required);

        bunkText.textContent =
            `You can bunk ${maxBunks} more classes and still maintain ${required}%.`;
    }

    // show result
    resultBox.style.display = "block";
});