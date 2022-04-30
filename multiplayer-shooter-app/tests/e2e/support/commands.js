// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => { 
    cy.request({
      method: 'POST',
      url: 'https://shooter-api.herokuapp.com/users/login',
      body: {
        "userDisplayName": "Matt",
        "userPassword": "test12345"
      }
    }).its('body').then((body) => {
        console.log(body);
        window.localStorage.setItem('JWT', body.data.token);
        window.localStorage.setItem('userId', body.data._id);
    })
  
})
