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
 * Wait for a dialog to be attached to an element.
 */
export
function waitForDialog(host: HTMLElement = document.body): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let refresh = () => {
      let node = host.getElementsByClassName('jp-Dialog')[0];
      if (node) {
        resolve(void 0);
        return;
      }
      setTimeout(refresh, 10);
    };
    refresh();
  });
}


/**
 * Accept a dialog after it is attached if it has an OK button.
 */
export
function acceptDialog(host: HTMLElement = document.body): Promise<void> {
  return waitForDialog(host).then(() => {
    let node = host.getElementsByClassName('jp-Dialog')[0];
    if (node) {
      simulate(node as HTMLElement, 'keydown', { keyCode: 13 });
    }
  });
}


/**
 * Dismiss a dialog after it is attached.
 */
export
function dismissDialog(host: HTMLElement = document.body): Promise<void> {
  return waitForDialog(host).then(() => {
    let node = host.getElementsByClassName('jp-Dialog')[0];
    if (node) {
      simulate(node as HTMLElement, 'keydown', { keyCode: 27 });
    }
  });
}


describe('@jupyterlab/domutils', () => {

  describe('showDialog()', () => {

    it('should accept zero arguments', (done) => {
      showDialog().then(result => {
        expect(result).to.equal(false);
        done();
      });
      dismissDialog();
    });

    it('should accept dialog options', (done) => {
      let node = document.createElement('div');
      document.body.appendChild(node);
      let options = {
        title: 'foo',
        body: 'Hello',
        host: node,
        buttons: [Dialog.okButton],
        okText: 'Yep'
      };
      showDialog(options).then(result => {
        expect(result).to.equal(false);
        done();
      });
      dismissDialog();
    });

    it('should accept an html body', (done) => {
      let body = document.createElement('div');
      let input = document.createElement('input');
      let select = document.createElement('select');
      body.appendChild(input);
      body.appendChild(select);
      showDialog({ body }).then(result => {
        expect(result).to.equal(true);
        done();
      });
      acceptDialog();
    });

    it('should accept a widget body', (done) => {
      let body = new Widget();
      showDialog({ body }).then(result => {
        expect(result).to.equal(true);
        done();
      });
      acceptDialog();
    });

    it('should ignore context menu events', (done) => {
      let body = document.createElement('div');
      showDialog({ body }).then(result => {
        expect(result).to.equal(false);
        done();
      });
      Promise.resolve().then(() => {
        let node = document.body.getElementsByClassName('jp-Dialog')[0];
        simulate(node as HTMLElement, 'contextmenu');
        simulate(node as HTMLElement, 'keydown', { keyCode: 27 });
      });
    });

    /**
     * Class to test that onAfterAttach is called
     */
    class TestWidget extends Widget {
      constructor(resolve: () => void) {
        super();
        this.resolve = resolve;
      }
      protected onAfterAttach(msg: Message): void {
        this.resolve();
      }

      resolve: () => void;
    }

    it('should fire onAfterAttach on widget body', (done) => {
      let promise = new Promise((resolve, reject) => {
        let body = new TestWidget(resolve);
        showDialog({ body });
      });
      promise.then(() => {
        dismissDialog();
        done();
      });
    });

  });

});
