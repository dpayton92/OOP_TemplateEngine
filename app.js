const fs = require("fs");
const inquirer = require("inquirer");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

let employeeID = 1;
let employeeList = [];

function managerPrompts() {
   inquirer
      .prompt([
         {
            type: "input",
            message: "Manager name: ",
            name: "managerName"
         },
         {
            type: "input",
            message: "What is your email address?",
            name: "managerEmail"
         },
         {
            type: "input",
            message: "What is your office number?",
            name: "managerOffice"
         }
      ])
      .then(function(response) {
         let managerName = response.managerName;
         let managerEmail = response.managerEmail;
         let managerOffice = response.managerOffice;
         let manager = new Manager(
            managerName,
            employeeID,
            managerEmail,
            managerOffice
         );

         employeeList.push(manager);

         employeeID++;

         console.log(`
         ~~~~~~~~~~~~~~
         Now we'll collect information from you about your employees
         ~~~~~~~~~~~~~~
         `);

         employeePrompts();
      });
}

function employeePrompts() {
   inquirer
      .prompt([
         {
            type: "list",
            message: "What is the employee's role?",
            choices: ["Engineer", "Intern"],
            name: "employeeType"
         },
         {
            type: "input",
            message: "What is the employee's name?",
            name: "employeeName"
         },
         {
            type: "input",
            message: "What is the employee's email address?",
            name: "employeeEmail"
         }
      ])
      .then(function(response) {
         let employeeType = response.employeeType;
         let employeeName = response.employeeName;
         let employeeEmail = response.employeeEmail;

         if (employeeType === "Engineer") {
            inquirer
               .prompt([
                  {
                     type: "input",
                     message: "What is your employee's GitHub username?",
                     name: "gitHubUN"
                  },
                  {
                     type: "list",
                     message: "Do you have more employees you'd like to add?",
                     choices: ["Yes", "No"],
                     name: "moreEmployees"
                  }
               ])
               .then(function(response) {
                  let employeeGitHub = response.gitHubUN;

                  let engineer = new Engineer(
                     employeeName,
                     employeeID,
                     employeeEmail,
                     employeeGitHub
                  );

                  employeeList.push(engineer);
                  employeeID++;

                  if (response.moreEmployees === "Yes") {
                     employeePrompts();
                  } else {
                     generatePage();
                     return;
                  }
               });
         } else {
            inquirer
               .prompt([
                  {
                     type: "input",
                     message: "Where does the intern go to school?",
                     name: "internSchool"
                  },
                  {
                     type: "list",
                     message: "Do you have more employees you'd like to add?",
                     choices: ["Yes", "No"],
                     name: "moreEmployees"
                  }
               ])
               .then(function(response) {
                  let employeeSchool = response.internSchool;

                  let intern = new Intern(
                     employeeName,
                     employeeID,
                     employeeEmail,
                     employeeSchool
                  );

                  employeeList.push(intern);

                  employeeID++;

                  if (response.moreEmployees === "Yes") {
                     employeePrompts();
                  } else {
                     generatePage();
                     return;
                  }
               });
         }
      });
   // console.log(employeeList);
}

function generatePage() {
   let allCards = "";

   employeeList.forEach(item => {
      let cardString = item.createCard();
      allCards += cardString;
   });

   let fullHTML = `
   <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link
         rel="stylesheet"
         href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
         integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
         crossorigin="anonymous"
      />
      <script
         src="https://kit.fontawesome.com/ab3fd93a87.js"
         crossorigin="anonymous"
      ></script>
      <title>My Team Roster</title>
   </head>
   <body>
      <div
         class="container-fluid bg-danger text-center d-flex align-items-center justify-content-center"
         style="height: 20vh"
      >
         <div class="h1 text-white" style="display: inline-block;">
            My Team
         </div>
      </div>
      <div class="container mt-5">
         <!-- start of card group -->
         <div class="card-deck d-inline-flex justify-content-center">
            ${allCards}
         </div>
         <!-- end of card group -->
      </div>
   </body>
</html>
   `;

   fs.writeFile("./output/roster.html", fullHTML, function(err) {
      if (err) {
         return console.log(err);
      }
   });
}

managerPrompts();