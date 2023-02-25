let amount = document.querySelector("#expense_input");
let desc = document.getElementById("description_input");
let cat = document.getElementById("category_input");
let btn = document.getElementById("add");

//Add Expense
btn.addEventListener("click", (e) => {
  e.preventDefault();
  let obj = {
    amount: amount.value,
    description: desc.value,
    category: cat.value,
  };
  if (!desc.title) {
    axios
      .post("http://localhost:3000/expense", obj)
      .then((data) => {
        let expense = data.data.expenses;
        for (let i = 0; i < expense.length; i++) {
          let tbody = document.querySelector(".tbody");
          let tr = document.createElement("tr");
          let th = document.createElement("th");
          let td = document.createElement("td");
          let td1 = document.createElement("td");
          let td2 = document.createElement("td");
          let td3 = document.createElement("td");
          let btn = document.createElement("button");
          th.setAttribute("scope", "row");
          th.appendChild(document.createTextNode(i+1));
          tr.appendChild(th);
          td.appendChild(document.createTextNode(expense[i].amount));
          tr.appendChild(td);
          td1.appendChild(document.createTextNode(expense[i].description));
          tr.appendChild(td1);
          td2.appendChild(document.createTextNode(expense[i].category));
          tr.appendChild(td2);
          btn.appendChild(document.createTextNode("Delete"));
          btn.className ="btn btn-secondary p-0";
          btn.setAttribute('id',expense[i].id);
          td3.appendChild(btn);
          tr.appendChild(td3);
          tbody.appendChild(tr);
        }
        // li.className = "li";
        // li.appendChild(
        //   document.createTextNode(
        //     expense.amount +
        //       " " +
        //       "-" +
        //       " " +
        //       expense.description +
        //       " " +
        //       "-" +
        //       " " +
        //       "On" +
        //       " " +
        //       expense.category +
        //       " "
        //   )
        // );
        // let del = document.createElement("button");
        // let edit = document.createElement("button");
        // del.className = "btn btn-secondary p-0 del";
        // edit.className = "btn btn-secondary p-0 edit";
        // del.appendChild(document.createTextNode("Delete Expense"));
        // edit.appendChild(document.createTextNode("Edit Expense"));
        // li.appendChild(del);
        // li.appendChild(edit);
        // ul.appendChild(li);
      })
      .catch((err) => console.log(err));
  }
});
// else{
//     axios.put("http://localhost:3000/"+desc.title,obj)
//     .then((data) => {
//       let expense = data.data.result;
//         let li = document.createElement("li");
//         li.className = "li";
//         li.appendChild(
//           document.createTextNode(
//             expense.amount +
//               " " +
//               "-" +
//               " " +
//               expense.description +
//               " " +
//               "-" +
//               " " +
//               "On" +
//               " " +
//               expense.category +
//               " "
//           )
//         );
//         let del = document.createElement("button");
//         let edit = document.createElement("button");
//         del.className = "btn btn-secondary p-0 del";
//         edit.className = "btn btn-secondary p-0 edit";
//         del.appendChild(document.createTextNode("Delete Expense"));
//         edit.appendChild(document.createTextNode("Edit Expense"));
//         li.appendChild(del);
//         li.appendChild(edit);
//         ul.appendChild(li);
//       })
//       .catch((err) => console.log(err));

//  }

// });
//fetch expense
// axios
//   .get("http://localhost:3000")
//   .then((data) => {
//     let expenses = data.data.expenses;
//     for (let i = 0; i < expenses.length; i++) {
//       let li = document.createElement("li");
//       li.className = "li";
//       li.setAttribute("id", expenses[i].id);
//       li.appendChild(
//         document.createTextNode(
//           expenses[i].amount +
//             " " +
//             "-" +
//             " " +
//             expenses[i].description +
//             " " +
//             "-" +
//             " " +
//             "On" +
//             " " +
//             expenses[i].category +
//             " "
//         )
//       );
//       let del = document.createElement("button");
//       let edit = document.createElement("button");
//       del.className = "btn btn-secondary p-0 del";
//       edit.className = "btn btn-secondary p-0 edit";
//       del.appendChild(document.createTextNode("Delete Expense"));
//       edit.appendChild(document.createTextNode("Edit Expense"));
//       li.appendChild(del);
//       li.appendChild(edit);
//       ul.appendChild(li);
//     }
//   })
//   .catch((err) => console.log(err));

// //remove expense
// ul.addEventListener("click", (e) => {
//   if (e.target.classList.contains("del")) {
//     axios
//       .delete("http://localhost:3000/" + e.target.parentElement.id)
//       .then((res) => {
//         ul.removeChild(e.target.parentElement);
//       })
//       .catch((err) => console.log(err));
//   }
// });
// //edit expense
// ul.addEventListener("click", editEvent);
// function editEvent(e) {
//   if (e.target.classList.contains("edit")) {
//     axios
//       .get("http://localhost:3000/" + e.target.parentElement.id)
//       .then((data) => {
//         let expense =data.data.expense;
//         ul.removeChild(e.target.parentElement);
//         amount.value = expense.amount;
//         desc.value = expense.description;
//         desc.title = expense.id;
//         cat.value = expense.category;
//       })
//       .catch((err) => console.log(err));
//   }
// }
//
