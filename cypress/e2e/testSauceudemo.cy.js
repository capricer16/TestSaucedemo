
// cypress/e2e/testSaucedemo.cy.js
describe('E2e test purchase flow with different users', { testIsolation: false }, () => {

  const users = [
    { username: 'standard_user', password: 'secret_sauce' },
    { username: 'problem_user', password: 'secret_sauce' }
  ];

  users.forEach(user => {
    describe(`Test con usuario ${user.username}`, () => {

      // Limpiar el storage del navegador
      it('Limpiar storage del navegador', () => {
        cy.window().then((window) => {
          window.sessionStorage.clear();
          window.localStorage.clear();
        });
      });

      // Login con usuario
      it(`Login con ${user.username}`, () => {
        cy.login(user.username, user.password); // Usar el comando personalizado
      });

      // Agregar productos al carrito
      it('Agregar al carrito', () => {
        cy.get('.inventory_item').each(($el, index, $list) => {
          cy.wrap($el).find('button').click();
        });
      });

      // Hacer el checkout
      it('Hacer el checkout', () => {
        // Ir al carrito
        cy.get('.shopping_cart_link').click();

        // Verificar que los productos estén en el carrito
        cy.get('.cart_item').should('have.length', 6); // Asegúrate de que 6 productos estén en el carrito

        // Proceder al checkout
        cy.get('#checkout').click();

        // Completar los datos de pago
        cy.get('#first-name').type('Juan Francisco');
        cy.get('#last-name').type('García Flores');
        cy.get('#postal-code').type('11001');
        cy.get('#continue').click();

        // Revisar el resumen de la compra
        cy.get('.summary_info').should('be.visible');

        // Finalizar la compra
        cy.get('#finish').click();
      });

      // Validar el checkout
      it('Validar que se haya realizado el checkout', () => {
        // Verificar que se haya llegado a la página de confirmación
        cy.url().should('include', '/checkout-complete.html');

        // Verificar que haya un mensaje de éxito
        cy.get('#checkout_complete_container').should('contain.text', 'Thank you for your order');
      });

      // Realizar logout
      it('Realizar logout', () => {
        // Hacer clic en el menú del usuario
        cy.get('.bm-burger-button').click();

        // Hacer clic en "Logout"
        cy.get('#logout_sidebar_link').click();

        // Verificar que redirige a la página de login
        cy.url().should('eq', 'https://www.saucedemo.com/');
      });
    });
  });
});


