const API_URL = "https://script.google.com/macros/s/AKfycbwL58wSLfqUc8wqTLmVoP0iJhgN64U2YkVrB-J7P4eMikxR50MmlK6yv2NoRaFRyVc3/exec";

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
        ✅ Ticket Created: <b>${result.ticketId}</b><br/>
        <a href="index.html?id=${result.ticketId}"
           style="color:#15803d;font-weight:800;text-decoration:underline;font-size:13px;display:inline-block;margin-top:6px;">
          → Update this ticket now
        </a>
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
