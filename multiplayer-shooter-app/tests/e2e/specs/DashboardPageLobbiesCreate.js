// https://docs.cypress.io/api/introduction/api.html
import moment from 'moment';

describe('Create Lobby Page Test', () => {

    // Rendirect to login page
    beforeEach(() => {
        cy.login()
        cy.visit("/dashboard/lobbies/create"); 
        cy.wait(1000);
    });

    // Test entering log in details
    context("Create a lobby", () => {

        /*it("should default to todays date", () => {
            cy.get('#startDate label').should('have.text', moment().format('DD/MM/YYYY').toString());
        });

        it("should default to todays current time", () => {
            cy.wait(500);
            cy.get('#startTime label').should('have.text', moment().format('HH:mm').toString());
        });*/


        it("should not allow submission if map is not selected", () => {
            cy.wait(500);
            cy.get('#createLobbyForm').submit();
            cy.get('#mapSelection').should('have.class', 'is-invalid');
        });
        
        it("should not allow submission if gamemode is not selected", () => {
            cy.wait(500);
            cy.get('#createLobbyForm').submit();
            cy.get('#gameModeSelection').should('have.class', 'is-invalid');
        });

        it("should not allow submission start time is less than now", () => {
            cy.get('#startTime label').then(($el) => {
                var now = moment(moment().format('HH:mm'), 'HH:mm');
                var selected = moment($el.text(), 'HH:mm');
                if (now.isAfter(selected)) {
                    cy.get('#startTime label').should('have.class', 'is-invalid');
                }
            });
        });
        
    });

});
