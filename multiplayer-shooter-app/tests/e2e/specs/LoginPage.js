// https://docs.cypress.io/api/introduction/api.html

describe('Login Page Test', () => {

    // Rendirect to login page
    beforeEach(() => {
        cy.visit("/"); 
    });

    // Test entering log in details
    context("Enter log in details", () => {

        it("should warn me about empty display name", () => {
            cy.get('input[name="userDisplayName"]').clear();
            cy.get('input[name="userDisplayName"]').invoke('val');
            cy.get('#userDisplayNameFeedback').should('have.text', "This is a required field.");
        });
        
        it("should warn me about empty password", () => {
            cy.get('input[name="userPassword"]').clear();
            cy.get('input[name="userPassword"]').invoke('val');
            cy.get('#userPasswordFeedback').should('have.text', "This is a required field.");

        });

        it("should give the display name field the valid class when a display name has been entered", () => {
            cy.get('input[name="userDisplayName"]').clear();
            cy.get('input[name="userDisplayName"]').type("Matt");
            cy.get('input[name="userDisplayName"]').invoke('val');
            cy.get('input[name="userDisplayName"]').should('have.class', 'is-valid');
        });
        
        it("should give the password field the valid class when a password has been entered", () => {
            cy.get('input[name="userPassword"]').clear();
            cy.get('input[name="userPassword"]').type("test12345");
            cy.get('input[name="userPassword"]').invoke('val');
            cy.get('input[name="userPassword"]').should('have.class', 'is-valid');
        });

    });

    // Test entering register details
    context("Enter register details", () => {

        beforeEach(() => {
            cy.get('.nav-tabs>li:nth-child(2) a').trigger('click');
        });

        it("should warn me about empty display name", () => {
            cy.get('input[name="registerUserDisplayName"]').clear();
            cy.get('input[name="registerUserDisplayName"]').invoke('val');
            cy.get('#registerUserDisplayNameFeedback').should('have.text', "This is a required field.");
        });
        
        it("should warn me about empty password", () => {
            cy.get('input[name="registerUserPassword"]').clear();
            cy.get('input[name="registerUserPassword"]').invoke('val');
            cy.get('#registerUserPasswordFeedback').should('have.text', "This is a required field and must be at least 6 characters long.");
        });

        it("should warn me if password do not match", () => {
            cy.get('input[name="registerUserPassword"]').clear();
            cy.get('input[name="registerUserPassword"]').type("test123");
            cy.get('input[name="registerUserPassword"]').invoke('val');
            cy.get('input[name="registerUserConfirmPassword"]').clear();
            cy.get('input[name="registerUserConfirmPassword"]').type("test12345");
            cy.get('input[name="registerUserConfirmPassword"]').invoke('val');
            cy.get('#registerUserConfirmPasswordFeedback').should('have.text', "Passwords must match.");
        });

        it("should give the display name field the valid class when a display name has been entered", () => {
            cy.get('input[name="registerUserDisplayName"]').clear();
            cy.get('input[name="registerUserDisplayName"]').type("Matt");
            cy.get('input[name="registerUserDisplayName"]').invoke('val');
            cy.get('input[name="registerUserDisplayName"]').should('have.class', 'is-valid');
        });
        
        it("should give the password field the valid class when a password has been entered", () => {
            cy.get('input[name="registerUserPassword"]').clear();
            cy.get('input[name="registerUserPassword"]').type("test12345");
            cy.get('input[name="registerUserPassword"]').invoke('val');
            cy.get('input[name="registerUserPassword"]').should('have.class', 'is-valid');
        });

    });

});
