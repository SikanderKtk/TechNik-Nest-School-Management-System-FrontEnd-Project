/* ===================== ATTENDANCE MODULE ===================== */
const attDate = document.getElementById("attDate");
const attClass = document.getElementById("attClass");
const loadRosterBtn = document.getElementById("loadRoster");
const attendanceTable = document.getElementById("attendanceTable")?.querySelector("tbody");
const saveAttendanceBtn = document.getElementById("saveAttendance");

const markAllPresentBtn = document.getElementById("markAllPresent");
const markAllAbsentBtn = document.getElementById("markAllAbsent");

let attendance = getData("sms_attendance");
let classesList = getData("sms_classes");
let studentsList = getData("sms_students");

/* ========== Populate Class Dropdown ========== */
function populateClassesDropdown() {
  if (attClass) {
    attClass.innerHTML = `<option value="">-- Select Class --</option>`;
    classesList.forEach(c => {
      attClass.innerHTML += `<option value="${c.id}">${c.name} (${c.section})</option>`;
    });
  }
}
populateClassesDropdown();

/* ========== Load Roster ========== */
loadRosterBtn?.addEventListener("click", () => {
  if (!attDate.value || !attClass.value) {
    alert("Please select date and class!");
    return;
  }

  const classId = attClass.value;
  const classData = classesList.find(c => c.id === classId);
  if (!classData) return;

  attendanceTable.innerHTML = "";
  classData.studentIds.forEach((stuId, i) => {
    const student = studentsList.find(s => s.id === stuId);
    if (!student) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${student.name}</td>
      <td>${student.roll}</td>
      <td>
        <select data-student="${student.id}" class="statusSelect">
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </td>
    `;
    attendanceTable.appendChild(row);
  });
});

/* ========== Mark All Present / Absent ========== */
markAllPresentBtn?.addEventListener("click", () => {
  document.querySelectorAll(".statusSelect").forEach(sel => sel.value = "Present");
});
markAllAbsentBtn?.addEventListener("click", () => {
  document.querySelectorAll(".statusSelect").forEach(sel => sel.value = "Absent");
});

/* ========== Save Attendance ========== */
saveAttendanceBtn?.addEventListener("click", () => {
  if (!attDate.value || !attClass.value) {
    alert("Please select date and class!");
    return;
  }

  const records = [];
  document.querySelectorAll(".statusSelect").forEach(sel => {
    records.push({
      studentId: sel.dataset.student,
      status: sel.value
    });
  });

  const newAttendance = {
    id: generateId(),
    date: attDate.value,
    classId: attClass.value,
    records
  };

  // Remove any old attendance for same date/class
  attendance = attendance.filter(a => !(a.date === attDate.value && a.classId === attClass.value));
  attendance.push(newAttendance);

  saveData("sms_attendance", attendance);
  alert("Attendance saved successfully!");
});
