/* ===================== STUDENTS MODULE ===================== */
const studentForm = document.getElementById("studentForm");
const studentsTable = document.getElementById("studentsTable")?.querySelector("tbody");
const searchInput = document.getElementById("studentSearch");

let students = getData("sms_students");

/* ========== Render Students ========== */
function renderStudents(list = students) {
  if (!studentsTable) return;
  studentsTable.innerHTML = "";
  list.forEach((s, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.className}</td>
      <td>${s.section}</td>
      <td>
        <button class="btn small" onclick="editStudent('${s.id}')">✏️</button>
        <button class="btn small" onclick="deleteStudent('${s.id}')">🗑</button>
      </td>
    `;
    studentsTable.appendChild(row);
  });
}
renderStudents();

/* ========== Add / Edit Student ========== */
studentForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value || generateId();
  const newStudent = {
    id,
    name: document.getElementById("studentName").value.trim(),
    roll: document.getElementById("studentRoll").value.trim(),
    className: document.getElementById("studentClass").value.trim(),
    section: document.getElementById("studentSection").value.trim()
  };

  // Edit
  const existingIndex = students.findIndex(s => s.id === id);
  if (existingIndex >= 0) {
    students[existingIndex] = newStudent;
  } else {
    students.push(newStudent);
  }

  saveData("sms_students", students);
  studentForm.reset();
  document.getElementById("studentId").value = "";
  renderStudents();
});

/* ========== Edit Student ========== */
function editStudent(id) {
  const s = students.find(stu => stu.id === id);
  if (!s) return;
  document.getElementById("studentId").value = s.id;
  document.getElementById("studentName").value = s.name;
  document.getElementById("studentRoll").value = s.roll;
  document.getElementById("studentClass").value = s.className;
  document.getElementById("studentSection").value = s.section;
}

/* ========== Delete Student ========== */
function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;
  students = students.filter(s => s.id !== id);
  saveData("sms_students", students);
  renderStudents();
}

/* ========== Search Students ========== */
searchInput?.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.roll.toLowerCase().includes(query) ||
    s.className.toLowerCase().includes(query) ||
    s.section.toLowerCase().includes(query)
  );
  renderStudents(filtered);
});

/* ========== Export Students ========== */
document.getElementById("exportStudents")?.addEventListener("click", () => {
  exportToCSV("students.csv", students);
});

/* ========== Import Students ========== */
const importBtn = document.getElementById("importStudentsBtn");
const importFile = document.getElementById("importStudents");

importBtn?.addEventListener("click", () => importFile.click());
importFile?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  importFromCSV(file, (data) => {
    students = [...students, ...data];
    saveData("sms_students", students);
    renderStudents();
    alert("Students imported successfully!");
  });
});
