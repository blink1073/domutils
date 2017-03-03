// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  expect
} from 'chai';

import {
  VirtualDOM, h
} from '@phosphor/virtualdom';

import {
  styleNode, styleNodeByTag
} from '..';


describe('@jupyterlab/domutils', () => {

  describe('styleNode()', () => {

    it('should style descendant nodes for select, input and button', () => {
      let vnode = h.div({}, [h.button(), h.select(), h.input()]);
      let node = VirtualDOM.realize(vnode);
      styleNode(node);
      expect(node.querySelectorAll('.jp-mod-styled').length).to.equal(3);
    });

  });

  describe('styleNodeByTag()', () => {

    it('should style descendant nodes for the given tag', () => {
      let vnode = h.div({}, [h.span(), h.div({}, h.span())]);
      let node = VirtualDOM.realize(vnode);
      styleNodeByTag(node, 'span');
      expect(node.querySelectorAll('.jp-mod-styled').length).to.equal(2);
    });

    it('should style the node itself', () => {
      let div = document.createElement('div');
      styleNodeByTag(div, 'div');
      expect(div.className).to.contain('jp-mod-styled');
    });

  });

});
