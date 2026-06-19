protectPage();

let attendance =
    getData("attendance");


// ------Calculate Percentage -----
function calculateAttendance(attended,conducted) {
    if (conducted === 0) {

        return 0;

    }

    return (
        (attended / conducted) * 100
    ).toFixed(2);

}

// ---- Add Attendance ----
function addAttendance(subject, conducted, attended){

    const percentage =
        calculateAttendance(
            attended,
            conducted
        );

    const record = {

        id: Date.now(),

        subject,

        conducted,

        attended,

        percentage,

        status:
            percentage >= 75? "Safe": "Low"
    };

    attendance.push(record);

    saveData(
        "attendance",
        attendance
    );

}

// ---- Render Attendance ----
function renderAttendance(){

    const attendanceList =
        document.getElementById(
            "attendanceList"
        );

    attendanceList.innerHTML = "";

    attendance.forEach(function(record){

        attendanceList.innerHTML += `

        <div class="card">

            <h3>${record.subject}</h3>

            <p>
                Conducted :
                ${record.conducted}
            </p>

            <p>
                Attended :
                ${record.attended}
            </p>

            <p>
                Attendance :
                ${record.percentage}%
            </p>

            <p>
                Status :
                ${record.status}
            </p>

            <button
                class="deleteBtn"
                onclick="deleteAttendance(${record.id})"
            >
                Delete
            </button>

        </div>

        `;

    });

}

// ---- Delete Attendance ----
function deleteAttendance(id) {

    if (
        !confirm(
            "Delete this attendance record?"
        )
    ) {

        return;

    }

    attendance =
        attendance.filter(
            record =>
                record.id !== id
        );

    saveData(
        "attendance",
        attendance
    );

    renderAttendance();

}

// ---- Form Submit ----
const attendanceForm =
    document.getElementById(
        "attendanceForm"
    );

if (attendanceForm) {

    attendanceForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();

            const subject =
                document.getElementById(
                    "subject"
                ).value;

            const conducted =
                Number(
                    document.getElementById(
                        "conducted"
                    ).value
                );

            const attended =
                Number(
                    document.getElementById(
                        "attended"
                    ).value
                );

            if (attended > conducted) {

                alert(
                    "Attended lectures cannot exceed conducted lectures!"
                );

                return;

            }

            addAttendance(
                subject,
                conducted,
                attended
            );

            renderAttendance();

            attendanceForm.reset();

        }
    );

}
renderAttendance();