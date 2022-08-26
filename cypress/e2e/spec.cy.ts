import {
    MOCK_API_SEARCH_RESPONSE,
    MOCK_API_VIDEO_RESOURCE,
    MOCK_API_VIDEO_RESPONSE,
    MOCK_THUMBNAIL
} from '../../src/app/mock-data';

describe('YouTube Search Example Test', () => {
    it('Visits the initial project page', () => {
        cy.visit('/');
        cy.contains('Search Example');
    });

    beforeEach(() => {
        cy.intercept(
            { method: 'GET', url: 'https://www.googleapis.com/youtube/v3/search?*' },
            { body: MOCK_API_SEARCH_RESPONSE }
        ).as('getSearchResults');

        cy.intercept(
            { method: 'GET', url: 'https://www.googleapis.com/youtube/v3/videos?*' },
            { body: MOCK_API_VIDEO_RESPONSE }
        ).as('getVideoResults');
    });

    context('Enters a short search term', () => {
        beforeEach(() => {
            cy.get('#searchTerm').type('t');
        });

        it('Should not see any result', () => {
            cy.get('#videoResults video-card').should('have.length', 0);
        });
    });

    context('Enters a long search term', () => {
        beforeEach(() => {
            cy.get('#searchTerm').type('the sandman');
        });

        it('Should not see any result', () => {
            cy.get('#videoResults video-card').should('have.length', 1);
        });
    });

    context('Result details', () => {
        beforeEach(() => {
            cy.get('#videoResults video-card').first().as('card');
        });

        it('Should show the correct thumbnail', () => {
            cy.get('@card').find('img', {includeShadowDom: true})
                .should('have.attr', 'src', MOCK_THUMBNAIL.url);
        });

        it('Should have the correct title', () => {
            cy.get('@card').find('a', {includeShadowDom: true})
                .should('contain.text', MOCK_API_VIDEO_RESOURCE.snippet.title);
        });

        it('Should have the correct link', () => {
            cy.get('@card').find('a', {includeShadowDom: true})
                .should('have.attr', 'href', `https://youtu.be/${MOCK_API_VIDEO_RESOURCE.id}`);
        });

        it('Should have the correct comment count', () => {
            cy.get('@card').find('.comments strong', {includeShadowDom: true})
                .should('contain.text', MOCK_API_VIDEO_RESOURCE.statistics.commentCount);
        });

        it('Should have the correct description', () => {
            cy.get('@card').find('.description', {includeShadowDom: true})
                .should('contain.text', MOCK_API_VIDEO_RESOURCE.snippet.description);
        });
    });

    context('Clear results', () => {
        before(() => {
            cy.get('#clearSearch').click({force: true});
        });

        it('Should clear search bar', () => {
            cy.get('#searchTerm').should('have.value', '');
        });

        it('Should empty search results', () => {
            cy.get('#videoResults video-card').should('have.length', 0);
        });
    });
});
