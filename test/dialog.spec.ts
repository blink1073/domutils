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
 * Reject a dialog.
 */
function rejectDialog(host: HTMLElement = document.body): void {
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
        expect(result.action).to.equal('reject');
      });
      rejectDialog();
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
      };
      let promise = showDialog(options).then(result => {
        expect(result.action).to.equal('reject');
      });
      rejectDialog();
      return promise;
    });

    it('should accept an html body', () => {
      let body = document.createElement('div');
      let input = document.createElement('input');
      let select = document.createElement('select');
      body.appendChild(input);
      body.appendChild(select);
      let promise = showDialog({ body }).then(result => {
        expect(result.action).to.equal('accept');
      });
      acceptDialog();
      return promise;
    });

    it('should accept a widget body', () => {
      let body = new Widget();
      let promise = showDialog({ body }).then(result => {
        expect(result.action).to.equal('accept');
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

        it('should create a new dialog', () => {
          expect(dialog).to.be.an.instanceof(Dialog);
        });

        it('should accept options', () => {
          dialog = new TestDialog({
            title: 'foo',
            body: 'Hello',
            buttons: [Dialog.okButton]
          });
          expect(dialog).to.be.an.instanceof(Dialog);
        });

      });

      describe('#show()', () => {

        it('should attach the dialog to the host', () => {
          let host = document.createElement('div');
          document.body.appendChild(host);
          dialog = new TestDialog({ host });
          dialog.show();
          expect(host.firstChild).to.equal(dialog.node);
          dialog.dispose();
          document.body.removeChild(host);
        });

        it('should resolve with `true` when accepted', () => {
          let promise = dialog.show().then(result => {
            expect(result.action).to.equal('accept');
          });
          dialog.resolve();
          return promise;
        });

        it('should resolve with `false` when accepted', () => {
          let promise = dialog.show().then(result => {
            expect(result.action).to.equal('reject');
          });
          dialog.reject();
          return promise;
        });

        it('should resolve with `false` when closed', () => {
          let promise = dialog.show().then(result => {
            expect(result.action).to.equal('reject');
          });
          dialog.close();
          return promise;
        });

        it('should return focus to the original focused element', () => {
          let input = document.createElement('input');
          document.body.appendChild(input);
          input.focus();
          expect(document.activeElement).to.equal(input);
          let promise = dialog.show().then(() => {
            expect(document.activeElement).to.equal(input);
            document.body.removeChild(input);
          });
          expect(document.activeElement).to.not.equal(input);
          dialog.resolve();
          return promise;
        });

      });

      describe('#resolve()', () => {

      });

      describe('#reject()', () => {

      });

      describe('#handleEvent()', () => {

        context('keydown', () => {

          it('should reject on escape key', () => {
            let promise = dialog.show().then(result => {
              expect(result.action).to.equal('reject');
            });
            simulate(dialog.node, 'keydown', { keyCode: 27 });
            return promise;
          });

          it('should accept on enter key', () => {
            let promise = dialog.show().then(result => {
              expect(result.action).to.equal('accept');
            });
            simulate(dialog.node, 'keydown', { keyCode: 13 });
            return promise;
          });

          it('should cycle to the first button on a tab key', () => {
            let promise = dialog.show().then(result => {
              expect(result.action).to.equal('reject');
            });
            let node = document.activeElement;
            expect(node.className).to.contain('jp-mod-accept');
            simulate(dialog.node, 'keydown', { keyCode: 9 });
            node = document.activeElement;
            expect(node.className).to.contain('jp-mod-reject');
            simulate(node, 'click');
            return promise;
          });

        });

        context('contextmenu', () => {

          it('should ignore context menu events', () => {
            let promise = dialog.show().then(result => {
              expect(result.action).to.equal('reject');
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
