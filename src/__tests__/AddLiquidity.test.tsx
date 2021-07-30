/// <reference types="cypress" />
import { mount } from '@cypress/react';
import React from 'react';

import AddLiquidityForm from '../components/organisms/AddLiquidityForm';
import { Pool } from '../lib/Pool';
import { Token } from '../lib/Token';

describe('liquidity form', () => {
  context('simple defaults', () => {
    let tokens: Token[] = [];
    let pools: Pool[] = [];

    const poolAdded = (p: Pool) => {
      //cy.log('pool', p);
      pools.push(p);
    };

    beforeEach(() => {
      pools = [];
      const eth = new Token('eth', 'Ethereum');
      const dai = new Token('dai', 'Dai');
      eth.setMarketPrice(2000);
      dai.setMarketPrice(1);
      eth.mint(100, 'alice');
      dai.mint(100_000, 'alice');
      tokens = [eth, dai];
      mount(
        <AddLiquidityForm
          account="alice"
          tokens={tokens}
          pools={[]}
          poolAdded={poolAdded}
        />,
      );
    });

    it('adds a new pool', () => {
      cy.get('select')
        .first()
        .then(($select) => {
          expect($select.find('option')).to.contain('eth');
          //get('option').should('have.length', 2);
        });
      cy.get('.chakra-button').should('be.disabled');
      cy.get('select').first().select('eth');
      cy.get('select').last().select('dai');
      cy.get('#amount1').clear().type('10').blur();
      cy.get('#amount2').invoke('val').should('equal', '20000');
      cy.get('.chakra-radio-group > .chakra-stack > :nth-child(4)').click();
      cy.get('.chakra-button').should('not.be.disabled');
      cy.get('.chakra-button')
        .click()
        .then(() => {
          expect(pools.length).to.eq(1);
        });
    });

    it('shows a warning when market price is not met', () => {
      expect(pools.length).to.eq(0);
      cy.get('select').first().select('eth');
      cy.get('select').last().select('dai');
      cy.get('#amount1').clear().type('10').blur();
      cy.get('#amount2').clear().type('10000').blur();
      cy.contains('arbitrage').should('exist');
      cy.get('.chakra-button').should('not.be.disabled');
    });

    it('shows a warning when funds arent sufficient', () => {
      expect(pools.length).to.eq(0);
      cy.get('select').first().select('eth');
      cy.get('select').last().select('dai');
      cy.get('#amount1').clear().type('101').blur();
      cy.contains('insufficient').should('exist');
      cy.get('.chakra-button').should('be.disabled');
    });
  });
});
