/* ========== LocalStorage Helpers ========== */
function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/* ========== Theme Toggle ========== */
const toggleBtn = document.getElementById("toggleTheme");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

/* ========== Dashboard KPIs ========== */
function updateKPIs() {
  if (!document.body.dataset.page === "dashboard") return;

  const students = getData("sms_students");
  const teachers = getData("sms_teachers");
  const classes = getData("sms_classes");
  const attendance = getData("sms_attendance");

  document.getElementById("kpiStudents").textContent = students.length;
  document.getElementById("kpiTeachers").textContent = teachers.length;
  document.getElementById("kpiClasses").textContent = classes.length;

  // Attendance count today
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = attendance.filter(a => a.date === today);
  let presentCount = 0;
  todayRecords.forEach(rec => {
    rec.records.forEach(r => { if (r.status === "Present") presentCount++; });
  });
  document.getElementById("kpiAttendance").textContent = presentCount;
}
if (document.body.dataset.page === "dashboard") updateKPIs();

/* ========== CSV Export Helper ========== */
function exportToCSV(filename, rows) {
  if (!rows.length) return;
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) + "\n" +
    rows.map(row => keys.map(k => `"${row[k] || ""}"`).join(separator)).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ========== CSV Import Helper ========== */
function importFromCSV(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const [headerLine, ...lines] = text.split("\n").filter(l => l.trim() !== "");
    const headers = headerLine.split(",").map(h => h.replace(/"/g, "").trim());
    const data = lines.map(line => {
      const values = line.split(",").map(v => v.replace(/"/g, "").trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      obj.id = generateId(); // regenerate ids
      return obj;
    });
    callback(data);
  };
  reader.readAsText(file);
}

// ====== HAMBURGER MENU TOGGLE ======
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  // Optional: close sidebar when a link is clicked (good UX)
  document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });
});
