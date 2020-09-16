// var inquirer = require("inquirer");
// var Manager = require("./lib/Manager");
// var Engineer = require("./lib/Engineer");
// var Intern = require("./lib/Intern");
// var render = require("./TeamRenderer");


// const teamMembers = []

// function createTeam() {

//     inquirer
//         .prompt([

//             {
//                 type: "list",
//                 name: "memberChoice",
//                 message: "What type of team member are you?",
//                 choices: [
//                     "Manager",
//                     "Engineer",
//                     "Intern",
//                     "No more employees"
//                 ]
//             }

//         ]).then(userChoice => {
//             // pass in the variable
//             switch (userChoice.memberChoice) {
//                 // in case userChoice
//                 case "Manager":
//                     addManager();
//                     break;

//                 case "Engineer":
//                     addEngineer();
//                     break;

//                 case "Intern":
//                     addIntern();
//                     break;

//                 case "No more employees":
//                     render(teamMembers);
//                     break

//             }
//         })


//     function addManager() {

//         inquirer
//             .prompt([

//                 {
//                     type: "input",
//                     message: "What is your first name?",
//                     name: "managerName"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your employee ID?",
//                     name: "managerID"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your email?",
//                     name: "managerEmail"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your office number?",
//                     name: "managerOfficeNumber"
//                 }

//             ]).then(userChoice => {
//                 console.log(userChoice);

//                 const manager = new Manager(userChoice.managerName, userChoice.managerID, userChoice.managerEmail, userChoice.managerOfficeNumber)

//                 teamMembers.push(manager)

//                 createTeam();

//             })


//     }


//     function addEngineer() {
//         inquirer
//             .prompt([

//                 {
//                     type: "input",
//                     message: "What is your first name?",
//                     name: "engineerName"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your employee ID?",
//                     name: "engineerID"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your email?",
//                     name: "engineerEmail"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your GitHub username?",
//                     name: "gitHubUsername"
//                 }
//             ]).then(userChoice => {
//                 console.log(userChoice);

//                 const engineer = new Engineer(userChoice.engineerName, userChoice.engineerID, userChoice.engineerEmail, userChoice.gitHubUsername)

//                 teamMembers.push(engineer)

//                 createTeam();

//             })
//     }




//     function addIntern() {

//         inquirer
//             .prompt([

//                 {
//                     type: "input",
//                     message: "What is your first name?",
//                     name: "internName"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your employee ID?",
//                     name: "internID"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your email?",
//                     name: "internEmail"
//                 },

//                 {
//                     type: "input",
//                     message: "What is your school?",
//                     name: "internSchool"
//                 }
//             ]).then(userChoice => {
//                 console.log(userChoice);

//                 const intern = new Intern(userChoice.internName, userChoice.internID, userChoice.internEmail, userChoice.internSchool)

//                 teamMembers.push(intern)

//                 createTeam();
//             })
//     }
// }

// module.exports = teamMembers

// createTeam();
const fs = require("fs");
	
const inquirer = require("inquirer");

const questions = require("./lib/questions");

let html = "";

const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");


function createEmployee() {
    inquirer
        .prompt(questions.empQuestions)
        .then(answers => {
            switch (answers.role) {
                case "Engineer":
                    inquirer.prompt(questions.engQuestion).then(engineerAnswers => {
                        const engineerData = new Engineer(
                            answers.name,
                            answers.id,
                            answers.email,
                            engineerAnswers.github
                        );
                        readEngFile(engineerData);


                        restartInquirer();
                    });
                    break;
                case "Manager":
                    inquirer.prompt(questions.mgmtQuestion).then(async managerAnswers => {
                        const managerData = await new Manager(
                            answers.name,
                            answers.id,
                            answers.email,
                            managerAnswers.officeNumber
                        );
                        readMgnFile(managerData);


                        restartInquirer();
                    });
                    break;
                case "Intern":
                    inquirer
                        .prompt(questions.internQuestion)
                        .then(async internAnswers => {
                            const internData = await new Intern(
                                answers.name,
                                answers.id,
                                answers.email,
                                internAnswers.internSchool
                            );
                            readInternFile(internData);


                            restartInquirer();
                        });
                    break;
            }
        })
        .catch(err => {
            throw err;
        });
}


function restartInquirer() {
    inquirer.prompt(questions.newQuestion).then(answer => {
        switch (answer.role) {
            case "YES!!!":
                createEmployee();
                break;


            case "NOPE, THATS EVERYONE!":
                createHTML();
                break;
        }
    });
}



function readEngFile(engineerData) {


    const icon = `<i class="fas fa-glasses fa-2x"></i>`;
    fs.readFile("./html/engineer.html", "utf8", function(error, data) {
        
        const newData = data
            .replace("Ename:", engineerData.name)
            .replace("Eicon:", icon)
            .replace("Eid", engineerData.id)
            .replace("Eemail", engineerData.email)
            .replace("Egighub", engineerData.github);



        html += newData;

    });
}

function readMgnFile(managerData) {

    const icon = `<i class="far fa-chart-bar fa-2x"></i>`;
    fs.readFile("./html/manager.html", "utf8", function(error, data) {
        const newData = data
            .replace("Mname:", managerData.name)
            .replace("Micon:", icon)
            .replace("Mid", managerData.id)
            .replace("Memail", managerData.email)
            .replace("Mphone", managerData.officeNumber);



        html += newData;
    });
}
// not working
function readInternFile(internData) {
    // data is my html string,
    const icon = `<i class="fas fa-eye fa-2x"></i>`;
    fs.readFile("./html/intern.html", "utf8", function(error, data) {
        const newData = data
            .replace("Iname:", internData.name)
            .replace("Iicon:", icon)
            .replace("Iid", internData.id)
            .replace("Iemail", internData.email)
            .replace("Ischool", internData.internSchool);



        html += newData;
    });
}


function createHTML() {
    fs.readFile("./html/main.html", "utf8", (err, data) => {
        const newData = data.replace("{{html}}", html);


        fs.writeFile("./output/index.html", newData, "utf8", err => {
            if (err) return console.log(err);
        });
        console.log(".html created");
    });
}


module.exports = {};


createEmployee();
