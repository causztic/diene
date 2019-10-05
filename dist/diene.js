'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// const INSTAGRAM_AGENT = 'Instagram 10.26.0 (iPhone7,2; iOS 10_1_1; en_US; en-US; scale=2.00; gamut=normal; 750x1334) AppleWebKit/420+';
const fetch = require('node-fetch');
const parse5 = require('parse5');

class Diene {
  constructor(name) {
    this.name = name;
  }

  async getPosts(count = 3) {
    const response = await fetch(`https://www.instagram.com/${this.name}`);
    const text = await response.text();
    console.log(text);
    const document = parse5.parse(text);

    return document.childNodes;
  }
}
exports.default = Diene;