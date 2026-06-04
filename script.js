const ticketTableBody = document.getElementById("ticketTableBody");

const ticketModal = document.getElementById("ticketModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

const createTicketBtn = document.getElementById("createTicketBtn");

const customerInput = document.getElementById("customerInput");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const priorityInput = document.getElementById("priorityInput");
const statusInput = document.getElementById("statusInput");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const progressTickets = document.getElementById("progressTickets");
const closedTickets = document.getElementById("closedTickets");

const themeBtn = document.getElementById("themeBtn");

let editTicketId = null;

let tickets =
JSON.parse(localStorage.getItem("tickets")) || [

{
id: 1001,
customer: "Telekom",
title: "Login Problem",
description: "Customer cannot access account.",
priority: "High",
status: "Open",
created: "2026-06-04"
},

{
id: 1002,
customer: "Vodafone",
title: "Server Error",
description: "Internal server error reported.",
priority: "Medium",
status: "In Progress",
created: "2026-06-04"
}

];

function saveTickets() {
localStorage.setItem(
"tickets",
JSON.stringify(tickets)
);
}

function updateStats() {

totalTickets.textContent = tickets.length;

openTickets.textContent =
tickets.filter(
t => t.status === "Open"
).length;

progressTickets.textContent =
tickets.filter(
t => t.status === "In Progress"
).length;

closedTickets.textContent =
tickets.filter(
t => t.status === "Closed"
).length;
}

function getPriorityClass(priority){

return priority.toLowerCase();

}

function getStatusClass(status){

if(status === "Open"){
return "open";
}

if(status === "In Progress"){
return "progress";
}

return "closed";
}

function renderTickets(data){

ticketTableBody.innerHTML = "";

data.forEach(ticket => {

const row = document.createElement("tr");

row.innerHTML = `

<td>${ticket.id}</td>

<td>${ticket.customer}</td>

<td>${ticket.title}</td>

<td>
<span class="priority ${getPriorityClass(ticket.priority)}">
${ticket.priority}
</span>
</td>

<td>
<span class="status ${getStatusClass(ticket.status)}">
${ticket.status}
</span>
</td>

<td>${ticket.created}</td>

<td>

<button
class="edit-btn"
onclick="editTicket(${ticket.id})">
Edit
</button>

<button
class="delete-btn"
onclick="deleteTicket(${ticket.id})">
Delete
</button>

</td>

`;

ticketTableBody.appendChild(row);

});

updateStats();
}

function generateTicketId(){

return Math.floor(
1000 + Math.random() * 9000
);

}

function openModal(){

ticketModal.style.display = "flex";

}

function closeModal(){

ticketModal.style.display = "none";

customerInput.value = "";
titleInput.value = "";
descriptionInput.value = "";

priorityInput.value = "Low";
statusInput.value = "Open";

editTicketId = null;

createTicketBtn.textContent =
"Create Ticket";
}

openModalBtn.addEventListener(
"click",
openModal
);

closeModalBtn.addEventListener(
"click",
closeModal
);

window.addEventListener("click",(e)=>{

if(e.target === ticketModal){
closeModal();
}

});

createTicketBtn.addEventListener(
"click",
()=>{

const customer =
customerInput.value.trim();

const title =
titleInput.value.trim();

const description =
descriptionInput.value.trim();

const priority =
priorityInput.value;

const status =
statusInput.value;

if(
customer === "" ||
title === "" ||
description === ""
){
alert("Please fill all fields.");
return;
}

if(editTicketId){

const ticket =
tickets.find(
t => t.id === editTicketId
);

ticket.customer = customer;
ticket.title = title;
ticket.description = description;
ticket.priority = priority;
ticket.status = status;

}else{

tickets.push({

id: generateTicketId(),

customer,
title,
description,
priority,
status,

created:
new Date()
.toISOString()
.split("T")[0]

});

}

saveTickets();
renderTickets(tickets);

closeModal();

}
);

function deleteTicket(id){

const confirmed =
confirm(
"Delete this ticket?"
);

if(!confirmed){
return;
}

tickets = tickets.filter(
ticket => ticket.id !== id
);

saveTickets();
renderTickets(tickets);

}

window.deleteTicket = deleteTicket;

function editTicket(id){

const ticket =
tickets.find(
t => t.id === id
);

editTicketId = id;

customerInput.value =
ticket.customer;

titleInput.value =
ticket.title;

descriptionInput.value =
ticket.description;

priorityInput.value =
ticket.priority;

statusInput.value =
ticket.status;

createTicketBtn.textContent =
"Update Ticket";

openModal();

}

window.editTicket = editTicket;

searchInput.addEventListener(
"input",
filterTickets
);

statusFilter.addEventListener(
"change",
filterTickets
);

function filterTickets(){

const searchValue =
searchInput.value
.toLowerCase();

const selectedStatus =
statusFilter.value;

let filtered =
tickets.filter(ticket => {

const matchesSearch =

ticket.customer
.toLowerCase()
.includes(searchValue)

||

ticket.title
.toLowerCase()
.includes(searchValue);

const matchesStatus =

selectedStatus === "all"

||

ticket.status === selectedStatus;

return matchesSearch &&
matchesStatus;

});

renderTickets(filtered);

}

themeBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"light-theme"
);

localStorage.setItem(
"theme",
document.body.classList.contains(
"light-theme"
)
);

}
);

if(
localStorage.getItem("theme")
=== "true"
){
document.body.classList.add(
"light-theme"
);
}

renderTickets(tickets);