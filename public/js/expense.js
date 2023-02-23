let amount = document.querySelector("#expense_input");
let desc = document.getElementById("description_input");
let cat = document.getElementById("category_input");
let btn = document.getElementById("btn");
let ul = document.querySelector(".lists");

//Add Expense

btn.addEventListener("click", (e) => {
  e.preventDefault();
  let obj = {
    amount: amount.value,
    description: desc.value,
    category: cat.value,
  };
 if(!desc.title){
    axios
    .post("http://localhost:3000/expense", obj)
    .then((data) => {
      let expense = data.data.result;
      let li = document.createElement("li");
      li.className = "li";
      li.appendChild(
        document.createTextNode(
          expense.amount +
            " " +
            "-" +
            " " +
            expense.description +
            " " +
            "-" +
            " " +
            "On" +
            " " +
            expense.category +
            " "
        )
      );
      let del = document.createElement("button");
      let edit = document.createElement("button");
      del.className = "btn btn-secondary p-0 del";
      edit.className = "btn btn-secondary p-0 edit";
      del.appendChild(document.createTextNode("Delete Expense"));
      edit.appendChild(document.createTextNode("Edit Expense"));
      li.appendChild(del);
      li.appendChild(edit);
      ul.appendChild(li);
    })
    .catch((err) => console.log(err));
 }else{
    axios.put("http://localhost:3000/"+desc.title,obj)
    .then((data) => {
      let expense = data.data.result;
        let li = document.createElement("li");
        li.className = "li";
        li.appendChild(
          document.createTextNode(
            expense.amount +
              " " +
              "-" +
              " " +
              expense.description +
              " " +
              "-" +
              " " +
              "On" +
              " " +
              expense.category +
              " "
          )
        );
        let del = document.createElement("button");
        let edit = document.createElement("button");
        del.className = "btn btn-secondary p-0 del";
        edit.className = "btn btn-secondary p-0 edit";
        del.appendChild(document.createTextNode("Delete Expense"));
        edit.appendChild(document.createTextNode("Edit Expense"));
        li.appendChild(del);
        li.appendChild(edit);
        ul.appendChild(li);
      })
      .catch((err) => console.log(err));
    
 }
  
});
//fetch expense
axios
  .get("http://localhost:3000")
  .then((data) => {
    let expenses = data.data.expenses;
    console.log("");
    for (let i = 0; i < expenses.length; i++) {
      let li = document.createElement("li");
      li.className = "li";
      li.setAttribute("id", expenses[i].id);
      li.appendChild(
        document.createTextNode(
          expenses[i].amount +
            " " +
            "-" +
            " " +
            expenses[i].description +
            " " +
            "-" +
            " " +
            "On" +
            " " +
            expenses[i].category +
            " "
        )
      );
      let del = document.createElement("button");
      let edit = document.createElement("button");
      del.className = "btn btn-secondary p-0 del";
      edit.className = "btn btn-secondary p-0 edit";
      del.appendChild(document.createTextNode("Delete Expense"));
      edit.appendChild(document.createTextNode("Edit Expense"));
      li.appendChild(del);
      li.appendChild(edit);
      ul.appendChild(li);
    }
  })
  .catch((err) => console.log(err));

//remove expense
ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    axios
      .delete("http://localhost:3000/" + e.target.parentElement.id)
      .then((res) => {
        ul.removeChild(e.target.parentElement);
      })
      .catch((err) => console.log(err));
  }
});
//edit expense
ul.addEventListener("click", editEvent);
function editEvent(e) {
  if (e.target.classList.contains("edit")) {
    axios
      .get("http://localhost:3000/" + e.target.parentElement.id)
      .then((data) => {
        let expense =data.data.expense;
        ul.removeChild(e.target.parentElement);
        amount.value = expense.amount;
        desc.value = expense.description;
        desc.title = expense.id;
        cat.value = expense.category;
      })
      .catch((err) => console.log(err));
  }
}
