/* ===================== FEES MODULE ===================== */
const feeForm = document.getElementById("feeForm");
const feesTable = document.getElementById("feesTable")?.querySelector("tbody");
const feeStudentSelect = document.getElementById("feeStudent");

let fees = getData("sms_fees");
let studentsList = getData("sms_students");

/* ========== Populate Student Dropdown ========== */
function populateFeeStudents() {
  if (feeStudentSelect) {
    feeStudentSelect.innerHTML = `<option value="">-- Select Student --</option>`;
    studentsList.forEach(s => {
      feeStudentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.roll})</option>`;
    });
  }
}
populateFeeStudents();

/* ========== Render Fee Records ========== */
function renderFees() {
  if (!feesTable) return;
  feesTable.innerHTML = "";
  fees.forEach((f, i) => {
    const student = studentsList.find(s => s.id === f.studentId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${student ? student.name : "Unknown"}</td>
      <td>${f.amount}</td>
      <td>${f.status}</td>
    `;
    feesTable.appendChild(row);
  });
}
renderFees();

/* ========== Add Fee Payment ========== */
feeForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const newFee = {
    id: generateId(),
    studentId: feeStudentSelect.value,
    amount: document.getElementById("feeAmount").value,
    status: document.getElementById("feeStatus").value
  };

  fees.push(newFee);
  saveData("sms_fees", fees);
  feeForm.reset();
  renderFees();
  renderFeesChart();
  alert("Fee record saved!");
});

/* ========== Chart.js for Fees ========== */
function renderFeesChart() {
  const paid = fees.filter(f => f.status === "Paid").reduce((sum, f) => sum + parseFloat(f.amount), 0);
  const pending = fees.filter(f => f.status === "Pending").reduce((sum, f) => sum + parseFloat(f.amount), 0);

  const ctx1 = document.getElementById("feesReport")?.getContext("2d");
  if (ctx1) {
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: ["Paid", "Pending"],
        datasets: [{
          data: [paid, pending],
          backgroundColor: ["#27ae60", "#e74c3c"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Dashboard chart
  const ctx2 = document.getElementById("feesChart")?.getContext("2d");
  if (ctx2) {
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Paid", "Pending"],
        datasets: [{
          label: "Fees Overview",
          data: [paid, pending],
          backgroundColor: ["#2980b9", "#f39c12"]
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        animation: { duration: 0 }
      }
    });
  }
}
renderFeesChart();
