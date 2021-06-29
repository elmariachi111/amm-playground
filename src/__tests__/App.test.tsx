/// <reference types="cypress" />
import { mount } from '@cypress/react';
import React from 'react';

import App from '../App';

it('renders the app', () => {
  mount(<App />);
  cy.contains('Automated Market Maker').should('exist');
});
