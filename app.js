const API_URL = "https://script.google.com/macros/s/AKfycbw_UiQf5EJTJuKeFN21Xg4YkLo6O5je2iuj--BXjoJQQfuLGrd1L1hrcKtv1ZoMdpA/exec";

const form       = document.getElementById("supportForm");
const submitBtn  = document.getElementById("submitBtn");
const messageBox = document.getElementById("messageBox");

function calcTotal() {
  const travel = parseFloat(form.travelExpense.value) || 0;
  const parts  = parseFloat(form.partsExpense.value)  || 0;
  const other  = parseFloat(form.otherExpense.value)  || 0;
  const total  = travel + parts + other;
  document.getElementById("totalExpense").value = total > 0 ? "₹" + total.toFixed(2) : "";
}

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  submitBtn.disabled  = true;
  submitBtn.innerText = "Submitting...";
  messageBox.className    = "";
  messageBox.style.display = "none";

  const travel = parseFloat(form.travelExpense.value) || 0;
  const parts  = parseFloat(form.partsExpense.value)  || 0;
  const other  = parseFloat(form.otherExpense.value)  || 0;

  const data = {
    technicianName:   form.technicianName.value.trim(),
    technicianMobile: form.technicianMobile.value.trim(),
    customerName:     form.customerName.value.trim(),
    customerMobile:   form.customerMobile.value.trim(),
    location:         form.location.value.trim(),
    batteryModel:     form.batteryModel.value.trim(),
    serialNumber:     form.serialNumber.value.trim(),
    problemType:      form.problemType.value,
    problemDetails:   form.problemDetails.value.trim(),
    priority:         form.priority.value,
    travelExpense:    travel,
    partsExpense:     parts,
    otherExpense:     other,
    totalExpense:     travel + parts + other
  };

  try {
    const res    = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();
    if (result.success) {
      messageBox.className = "success";
      messageBox.innerHTML = `
        Ticket Created: <b>${result.ticketId}</b><br/>
        <a href="update.html?id=${result.ticketId}" style="color:#15803d;font-weight:800;text-decoration:underline;font-size:13px;">
          → Update this ticket later
        </a>
      `;
      form.reset();
      document.getElementById("totalExpense").value = "";
    } else {
      throw new Error(result.message || "Something went wrong");
    }
  } catch(error) {
    messageBox.className = "error";
    messageBox.innerText = "Error: " + error.message;
  }

  submitBtn.disabled  = false;
  submitBtn.innerText = "Submit Support Ticket";
});
