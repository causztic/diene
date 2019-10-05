'use strict';

var _diene = require('../diene');

var _diene2 = _interopRequireDefault(_diene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('it should get the latest posts', async () => {
  const results = await new _diene2.default('rrreol999').getPosts();
  console.log(results);
});