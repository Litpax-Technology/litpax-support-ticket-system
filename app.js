const API_URL = "https://script.google.com/macros/s/AKfycbwKxl2zKmbbfHnvgTlIHkyRfz54yYA0mopQHRf3zoSR5jFzLJgegQVwNQ7xDlPq8g0/exec";

const form       = document.getElementById("supportForm");
const submitBtn  = document.getElementById("submitBtn");
const messageBox = document.getElementById("messageBox");

form.addEventListener("submit", async function(e) {
  e.preventDefault();
  submitBtn.disabled  = true;
  submitBtn.innerText = "Submitting...";
  messageBox.className     = "";
  messageBox.style.display = "none";

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
    travelExpense:    0,
    partsExpense:     0,
    otherExpense:     0,
    totalExpense:     0
  };

  try {
    const res    = await fetch(API_URL, { method: "POST", body: JSON.stringify(data) });
    const result = await res.json();
    if (result.success) {
      messageBox.className = "success";
      messageBox.innerHTML = `
        ✅ Ticket Created Successfully: <b>${result.ticketId}</b>
        <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
          <a href="index.html?id=${result.ticketId}"
             style="flex:1;min-width:140px;text-align:center;padding:12px 16px;background:linear-gradient(135deg,#0f172a,#1e3a8a);color:#fff;font-weight:800;font-size:13px;border-radius:12px;text-decoration:none;">
            ✏️ Update This Ticket
          </a>
          <a href="update.html"
             style="flex:1;min-width:140px;text-align:center;padding:12px 16px;background:linear-gradient(135deg,#14532d,#15803d);color:#fff;font-weight:800;font-size:13px;border-radius:12px;text-decoration:none;">
            ➕ Create New Ticket
          </a>
        </div>
      `;
      form.reset();
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
