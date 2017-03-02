// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  expect
} from 'chai';

import {
  hitTestNodes
} from '..';


function createDiv(): HTMLElement {
  let div = document.createElement('div');
  div.style.height = '100px';
  div.style.width = '100px';
  document.body.appendChild(div);
  return div;
}


describe('@jupyterlab/domutils', () => {

  describe('hitTestNodes()', () => {
    let divs = [createDiv(), createDiv()];
    let rect = divs[0].getBoundingClientRect();
    let x = rect.left + 1;
    let y = rect.top;
    expect(hitTestNodes(document.body.children, x, y)).to.equal(0);
    expect(hitTestNodes(divs, -1, -1)).to.equal(-1);
    document.body.removeChild(divs[0]);
    document.body.removeChild(divs[1]);
  });

});

