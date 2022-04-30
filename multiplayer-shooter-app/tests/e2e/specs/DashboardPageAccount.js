var chai = require('chai')
var expect = chai.expect;

describe('Account Page Test', () => {

    // Rendirect to login page
    beforeEach(() => {
        cy.login()
        cy.visit("/dashboard/account"); 
        cy.wait(1000);
    });

    // Test entering log in details
    context("Viewing Account Page", () => {

        it("should find a logout button with a 'Log Out' label", () => {
            cy.get('#logoutButton').should('have.text', "Log Out");
        });
        
        it("should remove local storage items when clicked", () => {
            cy.get('#logoutButton').trigger('click');
            cy.wait(200);
            cy.url().should("not.include", "dashboard", ()=> {
                expect(window.localStorage.getItem("JWT")).to.be.undefined;
                expect(window.localStorage.getItem("userId")).to.be.undefined;
            });
        });
    });

});
