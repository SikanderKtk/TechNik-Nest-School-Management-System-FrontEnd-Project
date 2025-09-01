// Helper to populate selects
function populateTeacherSelect() {
  const sel = document.getElementById('classTeacher');
  const teachers = SMS.getTeachers();
  sel.innerHTML = teachers.length ? '' : '<option value="">No teachers — add some first</option>';
  teachers.forEach(t => {
    const o = document.createElement('option');
    o.value = t.id; o.textContent = `${t.name} (${t.subject})`;
    sel.appendChild(o);
  });
}

function populateStudentMulti() {
  const sel = document.getElementById('classStudents');
  const students = SMS.getStudents();
  sel.innerHTML = students.length ? '' : '<option value="">No students — add some first</option>';
  students.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id; o.textContent = `${s.name} — ${s.className}${s.section ? '-' + s.section : ''} (${s.roll})`;
    sel.appendChild(o);
  });
}

function renderClasses() {
  const tbody = document.querySelector('#classesTable tbody');
  const list = SMS.getClasses();
  tbody.innerHTML = '';
  list.forEach((c, i) => {
    const tr = document.createElement('tr');
    const students = c.studentIds.map(SMS.studentName).join(', ') || '-';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.name}</td>
      <td>${c.section}</td>
      <td>${SMS.teacherName(c.teacherId)}</td>
      <td>${students}</td>
      <td>
        <button class="btn outline" data-edit="${c.id}">Edit</button>
        <button class="btn danger outline" data-del="${c.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', onEditClass));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', onDeleteClass));
}

function onEditClass(e) {
  const id = e.currentTarget.getAttribute('data-edit');
  const c = SMS.getClasses().find(x => x.id === id);
  if (!c) return;
  document.getElementById('classId').value = c.id;
  document.getElementById('className').value = c.name;
  document.getElementById('classSection').value = c.section;
  document.getElementById('classTeacher').value = c.teacherId || '';
  // set multiselect
  const sel = document.getElementById('classStudents');
  [...sel.options].forEach(o => o.selected = c.studentIds.includes(o.value));
  window.scrollTo({top:0, behavior:'smooth'});
}

function onDeleteClass(e) {
  const id = e.currentTarget.getAttribute('data-del');
  if (!confirm('Delete this class?')) return;
  SMS.setClasses(SMS.getClasses().filter(x => x.id !== id));
  renderClasses();
}

function onSubmitClass(e) {
  e.preventDefault();
  const id = document.getElementById('classId').value || SMS.uid();
  const studentIds = [...document.getElementById('classStudents').selectedOptions].map(o => o.value);
  const entry = {
    id,
    name: document.getElementById('className').value.trim(),
    section: document.getElementById('classSection').value.trim(),
    teacherId: document.getElementById('classTeacher').value || null,
    studentIds
  };
  if (!entry.name || !entry.section) return alert('Please fill required fields.');
  const all = SMS.getClasses();
  const idx = all.findIndex(x => x.id === id);
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  SMS.setClasses(all);
  (document.getElementById('classForm')).reset();
  document.getElementById('classId').value = '';
  renderClasses();
}

document.addEventListener('DOMContentLoaded', () => {
  populateTeacherSelect();
  populateStudentMulti();
  renderClasses();
  document.getElementById('classForm').addEventListener('submit', onSubmitClass);
  document.getElementById('resetClassForm').addEventListener('click', () => document.getElementById('classId').value = '');
  document.getElementById('btnClearClasses').addEventListener('click', () => {
    if (confirm('Clear ALL classes?')) { SMS.setClasses([]); renderClasses(); }
  });
});
