/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {string|string[]} classNames  - list or name of CSS classname(s)
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export function make(
  tagName,
  classNames,
  attributes = {}
) {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, attrName)) {
      continue;
    }

    el[attrName] = attributes[attrName];
  }

  return el;
}

/**
 * Get item position relative to document
 *
 * @param {HTMLElement} elem - item
 * @returns {{x1: number, y1: number, x2: number, y2: number}} coordinates of the upper left (x1,y1) and lower right(x2,y2) corners
 */
export function getCoords(elem) {
  const rect = elem.getBoundingClientRect();

  return {
    y1: Math.floor(rect.top + window.pageYOffset),
    x1: Math.floor(rect.left + window.pageXOffset),
    x2: Math.floor(rect.right + window.pageXOffset),
    y2: Math.floor(rect.bottom + window.pageYOffset)
  };
}

/**
 * Calculate paddings of the first element relative to the second
 *
 * @param {HTMLElement} firstElem - outer element, if the second element is inside it, then all padding will be positive
 * @param {HTMLElement} secondElem - inner element, if its borders go beyond the first, then the paddings will be considered negative
 * @returns {{fromTopBorder: number, fromLeftBorder: number, fromRightBorder: number, fromBottomBorder: number}}
 */
export function getRelativeCoordsOfTwoElems(firstElem, secondElem) {
  const firstCoords = getCoords(firstElem);
  const secondCoords = getCoords(secondElem);

  return {
    fromTopBorder: secondCoords.y1 - firstCoords.y1,
    fromLeftBorder: secondCoords.x1 - firstCoords.x1,
    fromRightBorder: firstCoords.x2 - secondCoords.x2,
    fromBottomBorder: firstCoords.y2 - secondCoords.y2
  };
}

/**
 * Get the width and height of an element and the position of the cursor relative to it
 *
 * @param {HTMLElement} elem - element relative to which the coordinates will be calculated
 * @param {Event} event - mouse event
 */
export function getCursorPositionRelativeToElement(elem, event) {
  const rect = elem.getBoundingClientRect();
  const { width, height, x, y } = rect;
  const { clientX, clientY } = event;

  return {
    width,
    height,
    x: clientX - x,
    y: clientY - y
  };
}

/**
 * Insert element after the referenced
 *
 * @param {HTMLElement} newNode
 * @param {HTMLElement} referenceNode
 * @returns {HTMLElement}
 */
export function insertAfter(newNode, referenceNode) {
  return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Insert element after the referenced
 *
 * @param {HTMLElement} newNode
 * @param {HTMLElement} referenceNode
 * @returns {HTMLElement}
 */
export function insertBefore(newNode, referenceNode) {
  return referenceNode.parentNode.insertBefore(newNode, referenceNode);
}


/**
 * Set focus to contenteditable or native input element
 *
 * @param {Element} element - element where to set focus
 * @param {boolean} atStart - where to set focus: at the start or at the end
 *
 * @returns {void}
 */
export function focus(element, atStart = true) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(atStart);

  selection.removeAllRanges();
  selection.addRange(range);
}
