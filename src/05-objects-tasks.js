/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const res = JSON.parse(json);
  Object.setPrototypeOf(res, proto);
  return res;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Select {
  constructor(element) {
    this.element_prop = '';
    this.id_prop = '';
    this.class_prop = [];
    this.attr_prop = [];
    this.pseudoClass_prop = [];
    this.pseudoElement_prop = '';

    if (element.slice(0, 1) === '#') {
      this.id_prop = element;
    } else if (element.slice(0, 2) === '::') {
      this.pseudoElement_prop = element;
    } else if (element.slice(0, 1) === '.') {
      this.class_prop.push(element);
    } else if (element.slice(0, 1) === '[') {
      this.attr_prop.push(element);
    } else if (element.slice(0, 1) === ':') {
      this.pseudoClass_prop.push(element);
    } else {
      this.element_prop = element;
    }
  }

  stringify() {
    return this.element_prop
      .concat(this.id_prop)
      .concat(...this.class_prop)
      .concat(...this.attr_prop)
      .concat(...this.pseudoClass_prop)
      .concat(this.pseudoElement_prop);
  }

  element() {
    if (this.element_prop) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.id_prop || this.class_prop.length > 0 || this.attr_prop.length > 0
      || this.pseudoClass_prop.length > 0 || this.pseudoElement_prop) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }

  id(value) {
    if (this.id_prop) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.class_prop.length > 0 || this.attr_prop.length > 0
      || this.pseudoClass_prop.length > 0 || this.pseudoElement_prop) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.id_prop = '#'.concat(value);
    return this;
  }

  class(value) {
    if (this.attr_prop.length > 0
      || this.pseudoClass_prop.length > 0 || this.pseudoElement_prop) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.class_prop.push('.'.concat(value));
    return this;
  }

  attr(value) {
    if (this.pseudoClass_prop.length > 0 || this.pseudoElement_prop) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.attr_prop.push('['.concat(value, ']'));
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoElement_prop) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.pseudoClass_prop.push(':'.concat(value));
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoElement_prop) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElement_prop = '::'.concat(value);
    return this;
  }

  combine(selector1, combinator, selector2) {
    const sel1 = selector1.stringify();

    const sel2 = selector2.stringify();

    this.selector = this.selector
      ? this.selector += `${sel1} ${combinator} ${sel2}`
      : `${sel1} ${combinator} ${sel2}`;
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Select(value);
  },

  id(value) {
    return new Select('#'.concat(value));
  },

  class(value) {
    return new Select('.'.concat(value));
  },

  attr(value) {
    return new Select('['.concat(value, ']'));
  },

  pseudoClass(value) {
    return new Select(':'.concat(value));
  },

  pseudoElement(value) {
    return new Select('::'.concat(value));
  },

  combine(selector1, combinator, selector2) {
    const sel1 = selector1.stringify();

    const sel2 = selector2.stringify();

    this.selector = `${sel1} ${combinator} ${sel2}`;
    // this.selector = this.selector
    //   ? this.selector += `${sel1} ${combinator} ${sel2}`
    //   : `${sel1} ${combinator} ${sel2}`;
    return this;
  },

  stringify() {
    return this.selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
