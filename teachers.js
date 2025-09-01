const T$ = (sel) => document.querySelector(sel);

function renderTeachers() {
  const tbody = document.querySelector('#teachersTable tbody');
  const teachers = SMS.getTeachers();
  tbody.innerHTML = '';
  teachers.forEach((t, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.name}</td>
      <td>${t.subject}</td>
      <td>${t.email}</td>
      <td>${t.phone}</td>
      <td>
        <button class="btn outline" data-edit="${t.id}">Edit</button>
        <button class="btn danger outline" data-del="${t.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', onEditT));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', onDeleteT));
}

function onEditT(e) {
  const id = e.currentTarget.getAttribute('data-edit');
  const t = SMS.getTeachers().find(x => x.id === id);
  if (!t) return;
  T$('#teacherId').value = t.id;
  T$('#teacherName').value = t.name;
  T$('#teacherSubject').value = t.subject;
  T$('#teacherEmail').value = t.email;
  T$('#teacherPhone').value = t.phone;
  window.scrollTo({top:0, behavior:'smooth'});
}

function onDeleteT(e) {
  const id = e.currentTarget.getAttribute('data-del');
  if (!confirm('Delete this teacher?')) return;
  const left = SMS.getTeachers().filter(x => x.id !== id);
  SMS.setTeachers(left);
  renderTeachers();
}

function onSubmitT(e) {
  e.preventDefault();
  const id = T$('#teacherId').value || SMS.uid();
  const entry = {
    id,
    name: T$('#teacherName').value.trim(),
    subject: T$('#teacherSubject').value.trim(),
    email: T$('#teacherEmail').value.trim(),
    phone: T$('#teacherPhone').value.trim()
  };
  if (!entry.name || !entry.subject) return alert('Please fill required fields.');

  const all = SMS.getTeachers();
  const idx = all.findIndex(x => x.id === id);
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  SMS.setTeachers(all);
  (document.getElementById('teacherForm')).reset();
  T$('#teacherId').value = '';
  renderTeachers();
}

document.addEventListener('DOMContentLoaded', () => {
  renderTeachers();
  document.getElementById('teacherForm').addEventListener('submit', onSubmitT);
  document.getElementById('resetTeacherForm').addEventListener('click', () => T$('#teacherId').value = '');
  document.getElementById('btnClearTeachers').addEventListener('click', () => {
    if (confirm('Clear ALL teachers?')) { SMS.setTeachers([]); renderTeachers(); }
  });
});
