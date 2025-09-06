/* ===================== TEACHERS MODULE ===================== */
const teacherForm = document.getElementById("teacherForm");
const teachersTable = document.getElementById("teachersTable")?.querySelector("tbody");
const teacherSearch = document.getElementById("teacherSearch");

let teachers = getData("sms_teachers");

/* ========== Render Teachers ========== */
function renderTeachers(list = teachers) {
  if (!teachersTable) return;
  teachersTable.innerHTML = "";
  list.forEach((t, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.name}</td>
      <td>${t.subject}</td>
      <td>${t.email}</td>
      <td>${t.phone}</td>
      <td>
        <button class="btn small" onclick="editTeacher('${t.id}')">✏️</button>
        <button class="btn small" onclick="deleteTeacher('${t.id}')">🗑</button>
      </td>
    `;
    teachersTable.appendChild(row);
  });
}
renderTeachers();

/* ========== Add / Edit Teacher ========== */
teacherForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("teacherId").value || generateId();
  const newTeacher = {
    id,
    name: document.getElementById("teacherName").value.trim(),
    subject: document.getElementById("teacherSubject").value.trim(),
    email: document.getElementById("teacherEmail").value.trim(),
    phone: document.getElementById("teacherPhone").value.trim()
  };

  // Edit
  const existingIndex = teachers.findIndex(t => t.id === id);
  if (existingIndex >= 0) {
    teachers[existingIndex] = newTeacher;
  } else {
    teachers.push(newTeacher);
  }

  saveData("sms_teachers", teachers);
  teacherForm.reset();
  document.getElementById("teacherId").value = "";
  renderTeachers();
});

/* ========== Edit Teacher ========== */
function editTeacher(id) {
  const t = teachers.find(tc => tc.id === id);
  if (!t) return;
  document.getElementById("teacherId").value = t.id;
  document.getElementById("teacherName").value = t.name;
  document.getElementById("teacherSubject").value = t.subject;
  document.getElementById("teacherEmail").value = t.email;
  document.getElementById("teacherPhone").value = t.phone;
}

/* ========== Delete Teacher ========== */
function deleteTeacher(id) {
  if (!confirm("Delete this teacher?")) return;
  teachers = teachers.filter(t => t.id !== id);
  saveData("sms_teachers", teachers);
  renderTeachers();
}

/* ========== Search Teachers ========== */
teacherSearch?.addEventListener("input", () => {
  const query = teacherSearch.value.toLowerCase();
  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.subject.toLowerCase().includes(query) ||
    t.email.toLowerCase().includes(query) ||
    t.phone.toLowerCase().includes(query)
  );
  renderTeachers(filtered);
});
