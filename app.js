const API_URL = "https://script.google.com/macros/s/AKfycbyyIc_pU_oW9R0DUmFEHizHJrDCSMFipcBgqw6CcdPihomFHCuAyTXlk-j8Xezbpjg/exec";

const form = document.getElementById("ticketForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");
const refreshBtn = document.getElementById("refreshBtn");
const ticketTable = document.getElementById("ticketTable");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  showMessage("", "");

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Ticket submit nahi hua");

    showMessage(`Ticket created successfully: ${data.ticketId}`, "success");
    form.reset();
    loadTickets();
  } catch (err) {
    showMessage("Error: " + err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Ticket";
  }
});

refreshBtn.addEventListener("click", loadTickets);

async function loadTickets() {
  ticketTable.innerHTML = `<tr><td colspan="9" class="empty">Loading tickets...</td></tr>`;

  try {
    const res = await fetch(`${API_URL}?action=getTickets`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Tickets load nahi hue");

    renderTickets(data.tickets || []);
  } catch (err) {
    ticketTable.innerHTML = `<tr><td colspan="9" class="empty">${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderTickets(tickets) {
  updateCounts(tickets);

  if (!tickets.length) {
    ticketTable.innerHTML = `<tr><td colspan="9" class="empty">No tickets found</td></tr>`;
    return;
  }

  const rows = tickets.reverse().map(t => `
    <tr>
      <td><b>${escapeHtml(t.ticketId)}</b></td>
      <td>${escapeHtml(t.requestTime)}</td>
      <td>${escapeHtml(t.technicianName)}</td>
      <td>${escapeHtml(t.customerName)}<br><small>${escapeHtml(t.customerMobile)}</small></td>
      <td><b>${escapeHtml(t.problemType)}</b><br><small>${escapeHtml(t.problemDetails)}</small></td>
      <td class="${escapeHtml(t.priority)}">${escapeHtml(t.priority)}</td>
      <td><span class="badge ${escapeHtml(t.status)}">${escapeHtml(t.status)}</span></td>
      <td>${escapeHtml(t.assignedTo || "-")}</td>
      <td>${escapeHtml(t.responseTime || "-")}</td>
    </tr>
  `).join("");

  ticketTable.innerHTML = rows;
}

function updateCounts(tickets) {
  document.getElementById("totalCount").textContent = tickets.length;
  document.getElementById("openCount").textContent = tickets.filter(t => t.status === "Open").length;
  document.getElementById("assignedCount").textContent = tickets.filter(t => t.status === "Assigned").length;
  document.getElementById("closedCount").textContent = tickets.filter(t => t.status === "Closed").length;
}

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `message ${type}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadTickets();
