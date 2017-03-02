// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  expect
} from 'chai';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';

import {
  simulate
} from 'simulate-event';

import {
  Dialog, showDialog
} from '..';


/**
 * Accept a dialog.
 */
function acceptDialog(host: HTMLElement = document.body): void {
  let node = host.getElementsByClassName('jp-Dialog')[0];
  simulate(node as HTMLElement, 'keydown', { keyCode: 13 });
}


/**
 * Dismiss a dialog.
 */
function dismissDialog(host: HTMLElement = document.body): void {
  let node = host.getElementsByClassName('jp-Dialog')[0];
  simulate(node as HTMLElement, 'keydown', { keyCode: 27 });
}


class TestDialog extends Dialog {
  methods: string[] = [];
  events: string[] = [];

  handleEvent(event: Event): void {
    super.handleEvent(event);
    this.events.push(event.type);
  }

  protected onBeforeAttach(msg: Message): void {
    super.onBeforeAttach(msg);
    this.methods.push('onBeforeAttach');
  }

  protected onAfterDetach(msg: Message): void {
    super.onAfterDetach(msg);
    this.methods.push('onAfterDetach');
  }

  protected onCloseRequest(msg: Message): void {
    super.onCloseRequest(msg);
    this.methods.push('onCloseRequest');
  }
}


describe('@jupyterlab/domutils', () => {

  describe('showDialog()', () => {

    it('should accept zero arguments', () => {
      let promise = showDialog().then(result => {
        expect(result).to.equal(false);
      });
      dismissDialog();
      return promise;
    });

    it('should accept dialog options', () => {
      let node = document.createElement('div');
      document.body.appendChild(node);
      let options = {
        title: 'foo',
        body: 'Hello',
        host: node,
        buttons: [Dialog.okButton],
        okText: 'Yep'
      };
      let promise = showDialog(options).then(result => {
        expect(result).to.equal(false);
      });
      dismissDialog();
      return promise;
    });

    it('should call the given callback', () => {
      let called = false;
      let callback = () => {
        called = true;
      };
      let options = {
        buttons: [{
          label: 'foo',
          callback
        }]
      };
      let promise = showDialog(options).then(result => {
        expect(result).to.equal(true);
        expect(called).to.equal(true);
      });
      acceptDialog();
      return promise;
    });

    it('should accept an html body', () => {
      let body = document.createElement('div');
      let input = document.createElement('input');
      let select = document.createElement('select');
      body.appendChild(input);
      body.appendChild(select);
      let promise = showDialog({ body }).then(result => {
        expect(result).to.equal(true);
      });
      acceptDialog();
      return promise;
    });

    it('should accept a widget body', () => {
      let body = new Widget();
      let promise = showDialog({ body }).then(result => {
        expect(result).to.equal(true);
      });
      acceptDialog();
      return promise;
    });


    describe('Dialog', () => {

      let dialog: TestDialog;

      beforeEach(() => {
        dialog = new TestDialog();
      });

      afterEach(() => {
        dialog.dispose();
      });

      describe('#constructor()', () => {

      });

      describe('#show()', () => {

      });

      describe('#handleEvent()', () => {

        context('keydown', () => {

        });

        context('contextmenu', () => {

          it('should ignore context menu events', () => {
            let promise = dialog.show().then(result => {
              expect(result).to.equal(false);
            });
            let node = document.body.getElementsByClassName('jp-Dialog')[0];
            simulate(node as HTMLElement, 'contextmenu');
            simulate(node as HTMLElement, 'keydown', { keyCode: 27 });
            return promise;
          });

        });

        context('click', () => {

        });

        context('focus', () => {

        });

      });

      describe('#onBeforeAttach()', () => {

      });

      describe('#onAfterDetach()', () => {

      });

      describe('#onCloseRequest()', () => {

      });

    });

  });

});
