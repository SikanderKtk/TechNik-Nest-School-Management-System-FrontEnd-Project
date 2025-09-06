function populateAttClassSelect() {
  const sel = document.getElementById('attClass');
  const classes = SMS.getClasses();
  sel.innerHTML = classes.length ? '' : '<option value="">No classes — create some first</option>';
  classes.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = `${c.name}-${c.section}`;
    sel.appendChild(o);
  });
}

function loadRoster() {
  const classId = document.getElementById('attClass').value;
  const date = document.getElementById('attDate').value || new Date().toISOString().slice(0,10);
  document.getElementById('attDate').value = date;
  if (!classId) return alert('Please select a class.');

  const klass = SMS.getClasses().find(c => c.id === classId);
  if (!klass) return alert('Class not found.');

  const tbody = document.querySelector('#attendanceTable tbody');
  tbody.innerHTML = '';
  const students = SMS.getStudents().filter(s => klass.studentIds.includes(s.id));

  // Preload existing attendance for this date/class
  const all = SMS.getAttendance();
  const rec = all.find(a => a.date === date && a.classId === classId);
  const statusMap = {};
  if (rec) rec.records.forEach(r => { statusMap[r.studentId] = r.status; });

  students.forEach((s, i) => {
    const st = statusMap[s.id] || 'Present';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.roll}</td>
      <td>
        <select data-sid="${s.id}" class="attSel">
          <option ${st==='Present'?'selected':''}>Present</option>
          <option ${st==='Absent'?'selected':''}>Absent</option>
        </select>
      </td>`;
    tbody.appendChild(tr);
  });
}

function saveAttendance() {
  const date = document.getElementById('attDate').value || new Date().toISOString().slice(0,10);
  const classId = document.getElementById('attClass').value;
  if (!classId) return alert('Select a class.');
  const records = [...document.querySelectorAll('.attSel')].map(sel => ({
    studentId: sel.getAttribute('data-sid'),
    status: sel.value
  }));
  const all = SMS.getAttendance();
  const idx = all.findIndex(a => a.date === date && a.classId === classId);
  const entry = { date, classId, records };
  if (idx >= 0) all[idx] = entry; else all.push(entry);
  SMS.setAttendance(all);
  alert('Attendance saved.');
}

document.addEventListener('DOMContentLoaded', () => {
  // default date
  document.getElementById('attDate').value = new Date().toISOString().slice(0,10);
  populateAttClassSelect();

  document.getElementById('loadRoster').addEventListener('click', loadRoster);
  document.getElementById('saveAttendance').addEventListener('click', saveAttendance);

  document.getElementById('markAllPresent').addEventListener('click', () => {
    document.querySelectorAll('.attSel').forEach(s => s.value = 'Present');
  });
  document.getElementById('markAllAbsent').addEventListener('click', () => {
    document.querySelectorAll('.attSel').forEach(s => s.value = 'Absent');
  });
});
