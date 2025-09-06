/* Simple, reusable storage helpers and shared UI bits */
const SMS = (() => {
  const KEYS = {
    students: 'sms_students',
    teachers: 'sms_teachers',
    classes: 'sms_classes',
    attendance: 'sms_attendance' // array of {date,classId,records:[{studentId,status}]}
  };

  // ---- LocalStorage helpers ----
  const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
  const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const uid = () => Math.random().toString(36).slice(2, 10);

  // ---- Public getters/setters ----
  const getStudents = () => read(KEYS.students);
  const setStudents = (arr) => write(KEYS.students, arr);

  const getTeachers = () => read(KEYS.teachers);
  const setTeachers = (arr) => write(KEYS.teachers, arr);

  const getClasses = () => read(KEYS.classes);
  const setClasses = (arr) => write(KEYS.classes, arr);

  const getAttendance = () => read(KEYS.attendance);
  const setAttendance = (arr) => write(KEYS.attendance, arr);

  // ---- KPI updater for Dashboard ----
  const updateKPIs = () => {
    const s = getStudents().length;
    const t = getTeachers().length;
    const c = getClasses().length;
    const today = new Date().toISOString().slice(0,10);
    const todays = getAttendance().filter(a => a.date === today);
    let presentCount = 0;
    todays.forEach(rec => rec.records.forEach(r => { if (r.status === 'Present') presentCount++; }));
    const $ = (id) => document.getElementById(id);
    if ($('kpiStudents')) $('kpiStudents').textContent = s;
    if ($('kpiTeachers')) $('kpiTeachers').textContent = t;
    if ($('kpiClasses')) $('kpiClasses').textContent = c;
    if ($('kpiAttendance')) $('kpiAttendance').textContent = presentCount;
  };

  // ---- Lookups ----
  const teacherName = (id) => {
    const t = getTeachers().find(x => x.id === id);
    return t ? t.name : '-';
  };
  const studentName = (id) => {
    const s = getStudents().find(x => x.id === id);
    return s ? s.name : '-';
  };

  // ---- Exposed API ----
  return {
    KEYS, read, write, uid,
    getStudents, setStudents,
    getTeachers, setTeachers,
    getClasses, setClasses,
    getAttendance, setAttendance,
    teacherName, studentName,
    updateKPIs
  };
})();

// Small nicety: show today's date pill on Attendance
document.addEventListener('DOMContentLoaded', () => {
  const pill = document.getElementById('todayPill');
  if (pill) pill.textContent = new Date().toDateString();
});
