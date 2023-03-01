// const Razorpay = import("razorpay");

let amount = document.querySelector("#expense_input");
let desc = document.getElementById("description_input");
let cat = document.getElementById("category_input");
let btn = document.getElementById("add");
const token = localStorage.getItem("token");
let tbody = document.querySelector(".tbody");
//Add Expense
btn.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    let obj = {
      amount: amount.value,
      description: desc.value,
      category: cat.value,
    };
    if (!desc.title) {
      const expense = await axios.post("http://localhost:3000/expense/addexpense", obj, {
        headers: { Authorization: token },
      });
      await location.reload();
    }
  } catch (err) {
    console.log(err);
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
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const response = await axios
        .get("http://localhost:3000/expense/", {
          headers: { Authorization: token },
        });
      fetchExpenses(response);
    } else {
      location.replace('./signin.html');
    }
  } catch (err) {
    console.log(err);
  }
});

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
const fetchExpenses = (response) => {
  let expense = response.data.expenses;
  let premium = document.querySelector(".premium");
  let logout = document.createElement("button");
  logout.className = "btn leaderboard text-white logout";
  logout.appendChild(document.createTextNode("Logout"));

  if (response.data.isPremium === true) {
    let span = document.createElement("span");
    let report = document.createElement("a");
    report.setAttribute('href', "./report.html");
    report.className = "btn report text-white";
    report.appendChild(document.createTextNode("Report"));
    premium.appendChild(report);
    let btn = document.createElement("button");
    btn.className = "btn leaderboard text-white";
    btn.appendChild(document.createTextNode("Leaderboard"));
    premium.appendChild(btn);
    span.appendChild(document.createTextNode("You are a Premium Member"));
    premium.appendChild(span);
  } else {
    let btn = document.createElement("button");
    btn.className = "btn p-1 buy_premium";
    btn.appendChild(document.createTextNode("Buy Premium"));
    premium.appendChild(btn);
  }
  premium.appendChild(logout);
  for (let i = 0; i < expense.length; i++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let btn = document.createElement("button");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(i + 1));
    tr.appendChild(th);
    td.appendChild(document.createTextNode(expense[i].amount));
    tr.appendChild(td);
    td1.appendChild(document.createTextNode(expense[i].description));
    tr.appendChild(td1);
    td2.appendChild(document.createTextNode(expense[i].category));
    tr.appendChild(td2);
    btn.appendChild(document.createTextNode("Delete"));
    btn.className = "btn btn-secondary p-0 del";
    btn.setAttribute("id", expense[i].id);
    td3.classList = "del";
    td3.appendChild(btn);
    tr.appendChild(td3);
    tbody.appendChild(tr);
  }
};

//Delete Expense
tbody.addEventListener("click", async (e) => {
  try {
    if (e.target.classList.contains("del")) {
      const deletedExpense = await axios
        .delete("http://localhost:3000/expense/" + e.target.id, {
          headers: { Authorization: token },
        });
      await e.target.parentElement.parentElement.remove();
      await location.reload();
    }
  } catch (err) {
    console.log(err);
  }
});

//buy premium
const premium = document.querySelector(".nav");
premium.addEventListener("click", async (e) => {
  if (e.target.classList.contains("buy_premium")) {
    const response = await axios.get("http://localhost:3000/order/buypremium", {
      headers: { Authorization: token },
    });
    console.log("response", response);
    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        await axios.post(
          "http://localhost:3000/order/updatestatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("You are a Premium member now");
        location.reload();
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on("payment.failed", function (response) {
      console.log(response.error.reason, response.error.metadata.order_id);
      axios.post(
        "http://localhost:3000/order/updatestatus",
        {
          order_id: response.error.metadata.order_id,
          payment_id: response.error.metadata.payment_id,
          reason: response.error.reason,
        },
        { headers: { Authorization: token } }
      );
      alert("Something went Wrong");
    });
  }
});

//leaderboard
const leaderboard = document.querySelector(".nav");
leaderboard.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("leaderboard")) {
    axios
      .get("http://localhost:3000/expense/leaderboard", {
        headers: { Authorization: token },
      })
      .then((res) => {
        console.log(res)
        let data = res.data.userLeaderboard;
        const ldata = document.querySelector(".ldata");
        ldata.className = "mt-5 p-3 border-top border-secondary";
        const table = document.querySelector(".leaderboard-table");
        const h3 = document.createElement("h3");
        h3.className = "text-center text-secondary";
        h3.appendChild(document.createTextNode("Expense Leaderboard"));
        ldata.appendChild(h3);
        const thead = document.createElement("thead");
        const headtr = document.createElement("tr");
        const sn = document.createElement("th");
        sn.setAttribute("scope", "col");
        sn.appendChild(document.createTextNode("S/N."));
        headtr.appendChild(sn);
        const name = document.createElement("th");
        name.setAttribute("scope", "col");
        name.appendChild(document.createTextNode("Name"));
        headtr.appendChild(name);
        const expense = document.createElement("th");
        expense.setAttribute("scope", "col");
        expense.appendChild(document.createTextNode("Expenses"));
        headtr.appendChild(expense);
        thead.appendChild(headtr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        table.appendChild(tbody)
        for (let i = 0; i < data.length; i++) {
          let tr = document.createElement("tr");
          let th = document.createElement("th");
          let td = document.createElement("td");
          let td1 = document.createElement("td");
          th.setAttribute("scope", "row");
          th.appendChild(document.createTextNode(i + 1));
          tr.appendChild(th);
          td.appendChild(document.createTextNode(data[i].name));
          tr.appendChild(td);
          td1.appendChild(document.createTextNode(data[i].totalExpenses || 0));
          tr.appendChild(td1);
          tbody.appendChild(tr);
        }
      })
      .catch((err) => console.log(err));
  }
});
//report
const expenseTable = document.querySelector('.tableExpense');
leaderboard.addEventListener("click", async (e) => {
  try {
    if (e.target.classList.contains("report")) {
      expenseTable.style.display = 'none';
      const div = document.querySelector('.report-table');
      //Daily table
      const dayTable = document.createElement('table');
      dayTable.className = "table table-hover text-secondary";
      const theadDay = document.createElement("thead");
      const trDay = document.createElement("tr");
      trDay.className = "bg-success text-white";
      const tbodyDay = document.createElement('tbody');


      const dat = document.createElement("th");
      dat.setAttribute('scope', 'col');
      dat.appendChild(document.createTextNode("Date"));
      trDay.appendChild(dat);

      const description = document.createElement("th");
      description.setAttribute('scope', 'col');
      description.appendChild(document.createTextNode("Description"));
      trDay.appendChild(description);

      const category = document.createElement("th");
      category.setAttribute('scope', 'col');
      category.appendChild(document.createTextNode("Category"));
      trDay.appendChild(category);

      const expense = document.createElement("th");
      expense.setAttribute('scope', 'col');
      expense.appendChild(document.createTextNode("expense"));
      trDay.appendChild(expense);

      const income = document.createElement("th");
      income.setAttribute('scope', 'col');
      income.appendChild(document.createTextNode("Income"));
      trDay.appendChild(income);
      theadDay.appendChild(trDay);
      dayTable.appendChild(theadDay);

      let tr = document.createElement("tr");
      let th = document.createElement("th");
      let td = document.createElement("td");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode("01-01-2023"));
      tr.appendChild(th);
      td.appendChild(document.createTextNode("Milk"));
      tr.appendChild(td);
      td1.appendChild(document.createTextNode("Grocerry"));
      tr.appendChild(td1);
      td2.appendChild(document.createTextNode("60"));
      tr.appendChild(td2);
      td3.appendChild(document.createTextNode("0"));
      tr.appendChild(td3);
      tbodyDay.appendChild(tr);


      dayTable.appendChild(tbodyDay);
      div.appendChild(dayTable);
      //Yearly Table
      const yearlyTable = document.createElement('table');
      yearlyTable.className = "table table-hover text-secondary";
      const theadYearly = document.createElement("thead");
      const trYearly = document.createElement("tr");
      trYearly.className = "bg-success text-white";
      const tbodyYearly = document.createElement('tbody');


      const month = document.createElement("th");
      month.setAttribute('scope', 'col');
      month.appendChild(document.createTextNode("Month"));
      trYearly.appendChild(month);

      const inc = document.createElement("th");
      inc.setAttribute('scope', 'col');
      inc.appendChild(document.createTextNode("Income"));
      trYearly.appendChild(inc);

      const exp = document.createElement("th");
      exp.setAttribute('scope', 'col');
      exp.appendChild(document.createTextNode("Expense"));
      trYearly.appendChild(exp);

      const savings = document.createElement("th");
      savings.setAttribute('scope', 'col');
      savings.appendChild(document.createTextNode("Savings"));
      trYearly.appendChild(savings);
      theadYearly.appendChild(trYearly);

      let tr1 = document.createElement("tr");
      let th1 = document.createElement("th");
      let td4 = document.createElement("td");
      let td5 = document.createElement("td");
      let td6 = document.createElement("td");
      th1.setAttribute("scope", "row");
      th1.appendChild(document.createTextNode("Total"));
      tr1.appendChild(th1);
      td4.appendChild(document.createTextNode(60));
      td4.className="text-success"
      tr1.appendChild(td4);
      td5.appendChild(document.createTextNode(40));
      td5.className="text-danger"
      tr1.appendChild(td5);
      td6.appendChild(document.createTextNode(20));
      td6.className="text-success";
      tr1.appendChild(td6);
      tbodyYearly.appendChild(tr1);

      yearlyTable.appendChild(theadYearly);
      yearlyTable.appendChild(tbodyYearly);
      div.appendChild(yearlyTable);
      //Notes Table
      const notesTable = document.createElement('table');
      notesTable.className = "table table-hover text-secondary";
      const theadNotes = document.createElement("thead");
      theadNotes.className = "table table-hover text-secondary";
      const trNotes = document.createElement("tr");
      trNotes.className = "bg-success text-white";
      const tbodyNotes = document.createElement('tbody');

      const dateNotes = document.createElement("th");
      dateNotes.className = "w-25";
      dateNotes.setAttribute('scope', 'col');
      dateNotes.appendChild(document.createTextNode("Date"));
      trNotes.appendChild(dateNotes);

      const notes = document.createElement("th");
      notes.setAttribute('scope', 'col');
      notes.appendChild(document.createTextNode("Notes"));
      trNotes.appendChild(notes);
      theadNotes.appendChild(trNotes);

      let tr2 = document.createElement("tr");
      let th2 = document.createElement("th");
      let td7 = document.createElement("td");
      th2.setAttribute("scope", "row");
      th2.appendChild(document.createTextNode("Total"));
      tr2.appendChild(th2);
      td7.appendChild(document.createTextNode(60));
      td7.className="text-success"
      tr2.appendChild(td7);
      tbodyNotes.appendChild(tr2);

      notesTable.appendChild(theadNotes);
      notesTable.appendChild(tbodyNotes)
      div.appendChild(notesTable);

const token = localStorage.getItem('token');
      const data = await axios.get('http://localhost:3000/user/reports',{headers:{'Authorization':token}});
      const report = data.data.report;
      console.log(report);
    }
  } catch (err) {
    console.log(err)
  }
});
//Logout
const signout = document.querySelector(".nav");
signout.addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.classList.contains("logout")) {
    await localStorage.removeItem('token');
    await location.replace('./signin.html');
  }
});