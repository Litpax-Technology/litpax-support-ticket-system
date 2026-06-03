const API_URL = "https://script.google.com/macros/s/AKfycbyyIc_pU_oW9R0DUmFEHizHJrDCSMFipcBgqw6CcdPihomFHCuAyTXlk-j8Xezbpjg/exec";

const form = document.getElementById("supportForm");
const submitBtn = document.getElementById("submitBtn");
const messageBox = document.getElementById("messageBox");

form.addEventListener("submit", async function(e){
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  messageBox.className = "";
  messageBox.style.display = "none";

  const data = {
    technicianName: form.technicianName.value.trim(),
    technicianMobile: form.technicianMobile.value.trim(),
    customerName: form.customerName.value.trim(),
    customerMobile: form.customerMobile.value.trim(),
    location: form.location.value.trim(),
    batteryModel: form.batteryModel.value.trim(),
    serialNumber: form.serialNumber.value.trim(),
    problemType: form.problemType.value,
    problemDetails: form.problemDetails.value.trim(),
    priority: form.priority.value
  };

  try{
    const res = await fetch(API_URL,{
      method:"POST",
      body:JSON.stringify(data)
    });

    const result = await res.json();

    if(result.success){
      messageBox.className = "success";
      messageBox.innerHTML = `Ticket Created Successfully: <b>${result.ticketId}</b>`;
      form.reset();
    }else{
      throw new Error(result.message || "Something went wrong");
    }

  }catch(error){
    messageBox.className = "error";
    messageBox.innerText = "Error: " + error.message;
  }

  submitBtn.disabled = false;
  submitBtn.innerText = "Submit Support Ticket";
});
