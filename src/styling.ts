// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

/**
 * Style a node and its child elements with the default tag names.
 */
export
function styleNode(node: HTMLElement): void {
  styleNodeByTag(node, 'select');
  styleNodeByTag(node, 'input');
  styleNodeByTag(node, 'button');
}


/**
 * Style a node and its elements that have a given tag name.
 */
export
function styleNodeByTag(node: HTMLElement, tagName: string): void {
  node.classList.add('jp-mod-styled');
  let nodes = node.getElementsByTagName(tagName);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].classList.add('jp-mod-styled');
  }
}
