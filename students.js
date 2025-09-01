const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function renderStudents() {
  const tbody = $('#studentsTable tbody');
  const students = SMS.getStudents();
  tbody.innerHTML = '';
  students.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>${s.className}</td>
      <td>${s.section}</td>
      <td>
        <button class="btn outline" data-edit="${s.id}">Edit</button>
        <button class="btn danger outline" data-del="${s.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  // wire buttons
  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', onEdit));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', onDelete));
}

function onEdit(e) {
  const id = e.currentTarget.getAttribute('data-edit');
  const s = SMS.getStudents().find(x => x.id === id);
  if (!s) return;
  $('#studentId').value = s.id;
  $('#studentName').value = s.name;
  $('#studentRoll').value = s.roll;
  $('#studentClass').value = s.className;
  $('#studentSection').value = s.section;
  window.scrollTo({top:0, behavior:'smooth'});
}

function onDelete(e) {
  const id = e.currentTarget.getAttribute('data-del');
  if (!confirm('Delete this student?')) return;
  const left = SMS.getStudents().filter(x => x.id !== id);
  SMS.setStudents(left);
  renderStudents();
}

function onSubmit(e) {
  e.preventDefault();
  const id = $('#studentId').value || SMS.uid();
  const entry = {
    id,
    name: $('#studentName').value.trim(),
    roll: $('#studentRoll').value.trim(),
    className: $('#studentClass').value.trim(),
    section: $('#studentSection').value.trim()
  };
  if (!entry.name || !entry.roll) return alert('Please fill required fields.');

  const all = SMS.getStudents();
  const exists = all.findIndex(x => x.id === id);
  if (exists >= 0) all[exists] = entry; else all.push(entry);
  SMS.setStudents(all);
  (document.getElementById('studentForm')).reset();
  $('#studentId').value = '';
  renderStudents();
}

document.addEventListener('DOMContentLoaded', () => {
  renderStudents();
  document.getElementById('studentForm').addEventListener('submit', onSubmit);
  document.getElementById('resetStudentForm').addEventListener('click', () => $('#studentId').value = '');
  document.getElementById('btnClearStudents').addEventListener('click', () => {
    if (confirm('Clear ALL students?')) { SMS.setStudents([]); renderStudents(); }
  });
});
