/* ===================== CLASSES MODULE ===================== */
const classForm = document.getElementById("classForm");
const classesTable = document.getElementById("classesTable")?.querySelector("tbody");

const teacherSelect = document.getElementById("classTeacher");
const studentsSelect = document.getElementById("classStudents");

let classes = getData("sms_classes");
let teachersList = getData("sms_teachers");
let studentsList = getData("sms_students");

/* ========== Populate Dropdowns ========== */
function populateDropdowns() {
  if (teacherSelect) {
    teacherSelect.innerHTML = `<option value="">-- Select Teacher --</option>`;
    teachersList.forEach(t => {
      teacherSelect.innerHTML += `<option value="${t.id}">${t.name} (${t.subject})</option>`;
    });
  }

  if (studentsSelect) {
    studentsSelect.innerHTML = "";
    studentsList.forEach(s => {
      studentsSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.roll})</option>`;
    });
  }
}
populateDropdowns();

/* ========== Render Classes ========== */
function renderClasses() {
  if (!classesTable) return;
  classesTable.innerHTML = "";
  classes.forEach((c, i) => {
    const teacher = teachersList.find(t => t.id === c.teacherId);
    const studentNames = c.studentIds.map(id => {
      const stu = studentsList.find(s => s.id === id);
      return stu ? stu.name : "Unknown";
    }).join(", ");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td>${c.section}</td>
      <td>${teacher ? teacher.name : "-"}</td>
      <td>${studentNames || "-"}</td>
      <td>
        <button class="btn small" onclick="editClass('${c.id}')">✏️</button>
        <button class="btn small" onclick="deleteClass('${c.id}')">🗑</button>
      </td>
    `;
    classesTable.appendChild(row);
  });
}
renderClasses();

/* ========== Add / Edit Class ========== */
classForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("classId").value || generateId();

  const newClass = {
    id,
    name: document.getElementById("className").value.trim(),
    section: document.getElementById("classSection").value.trim(),
    teacherId: teacherSelect.value,
    studentIds: Array.from(studentsSelect.selectedOptions).map(opt => opt.value)
  };

  const existingIndex = classes.findIndex(c => c.id === id);
  if (existingIndex >= 0) {
    classes[existingIndex] = newClass;
  } else {
    classes.push(newClass);
  }

  saveData("sms_classes", classes);
  classForm.reset();
  document.getElementById("classId").value = "";
  renderClasses();
});

/* ========== Edit Class ========== */
function editClass(id) {
  const c = classes.find(cl => cl.id === id);
  if (!c) return;

  document.getElementById("classId").value = c.id;
  document.getElementById("className").value = c.name;
  document.getElementById("classSection").value = c.section;
  teacherSelect.value = c.teacherId;

  // Select students
  Array.from(studentsSelect.options).forEach(opt => {
    opt.selected = c.studentIds.includes(opt.value);
  });
}

/* ========== Delete Class ========== */
function deleteClass(id) {
  if (!confirm("Delete this class?")) return;
  classes = classes.filter(c => c.id !== id);
  saveData("sms_classes", classes);
  renderClasses();
}
