// Copyright 2020, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const rewire = require('rewire');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {expect} = chai;
chai.use(sinonChai);

const app = rewire('../app.js');
const logger = require('../analytics/logger.js');

describe('app', function() {
  before(function() {
    logger.transports.forEach((t) => (t.silent = true));
  });

  beforeEach(function() {
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('exports', function() {
    it('exports a ConversationV3 app', function() {
      expect(app).to.be.a('function');
      expect(app.middleware).to.be.a('function');
      expect(app.catch).to.be.a('function');
    });
  });
});
