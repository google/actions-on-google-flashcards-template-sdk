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

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const {expect} = chai;
chai.use(sinonChai);

const config = require('../config.js');
const {Action, Intent, Scene, Type, Alias, TypeOverrideMode, Prompt} = require('../constant.js');
const {Collection, Tab} = require('../sheet.js');
const logger = require('../analytics/logger.js');
const ConvHelper = require('../conv-helper.js');

describe('ConvHelper', function() {
  let fakeConv;
  let convHelper;

  before(function() {
    logger.transports.forEach((t) => (t.silent = true));
  });

  beforeEach(function() {
    sinon.stub(console, 'log');
    sinon.stub(console, 'error');

    fakeConv = {
      request: {},
      headers: {
        ['function-execution-id']: 'xyz123',
      },
      handler: {
        name: Action.LOAD_SETTINGS,
      },
      intent: {
        name: Intent.MAIN,
        params: {},
        query: 'Talk to test app',
      },
      scene: {
        name: Scene.WELCOME,
        slotFillingStatus: 'UNSPECIFIED',
        slots: {},
      },
      session: {
        id: 'abc123',
        params: {
          UserAnswer: 'apple',
          [Alias.QUIZ_SETTINGS.TITLE]: config.TITLE_DEFAULT,
          [Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME]: config.QUESTIONS_PER_GAME_DEFAULT,
          [Alias.QUIZ_SETTINGS.QUESTION_TITLE]: config.QUESTION_TITLE_DEFAULT,
          [Alias.QUIZ_SETTINGS.ANSWER_TITLE]: config.ANSWER_TITLE_DEFAULT,
          [Alias.QUIZ_SETTINGS.AUDIO_DING]: [...config.AUDIO_DING_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: [...config.AUDIO_GAME_INTRO_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: [...config.AUDIO_GAME_OUTRO_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_CORRECT]: [...config.AUDIO_CORRECT_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_INCORRECT]: [...config.AUDIO_INCORRECT_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_ROUND_END]: [...config.AUDIO_ROUND_END_DEFAULT],
          [Alias.QUIZ_SETTINGS.AUDIO_CALCULATING]: [...config.AUDIO_CALCULATING_DEFAULT],
          [Alias.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS]: config.RANDOMIZE_QUESTIONS_DEFAULT,
          [Alias.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID]:
            config.GOOGLE_ANALYTICS_TRACKING_ID_DEFAULT,
          [Alias.QUIZ_SETTINGS.QUIT_PROMPT]: config.QUIT_PROMPT_DEFAULT,
          [Alias.QUIZ_SETTINGS.AUTO_ADD_ANSWER_SYNONYMS]: config.AUTO_ADD_ANSWER_SYNONYMS_DEFAULT,
          questions: [
            {
              [Alias.QUIZ_Q_A.QUESTION]: 'question_1',
              [Alias.QUIZ_Q_A.ANSWERS]: ['a', 'b', 'c'],
            },
            {
              [Alias.QUIZ_Q_A.QUESTION]: 'question_2',
              [Alias.QUIZ_Q_A.ANSWERS]: ['d', 'e', 'f'],
            },
            {
              [Alias.QUIZ_Q_A.QUESTION]: 'question_3',
              [Alias.QUIZ_Q_A.ANSWERS]: ['g', 'h', 'i'],
            },
          ],
          currentQuestion: {
            [Alias.QUIZ_Q_A.QUESTION]: 'question_1',
            [Alias.QUIZ_Q_A.ANSWERS]: ['a', 'b', 'c'],
          },
          previousAnswer: '',
          limit: 3,
          count: 0,
          score: 0,
          attempts: 0,
          hinted: false,
          isNewUser: true,
        },
        typeOverrides: [],
        languageCode: '',
      },
      user: {
        locale: 'en-US',
        params: {},
        accountLinkingStatus: 'ACCOUNT_LINKING_STATUS_UNSPECIFIED',
        verificationStatus: 'VERIFIED',
        packageEntitlements: [],
        lastSeenTime: '2020-08-07T23:11:04Z',
      },
      home: {
        params: {},
      },
      device: {
        capabilities: ['SPEECH', 'RICH_RESPONSE', 'WEB_LINK', 'LONG_FORM_AUDIO'],
      },
      expected: {
        speech: [],
      },
      context: {},
      add: () => {},
      append: () => {},
      json: () => {},
      response: () => {},
      serialize: () => {},
    };

    convHelper = new ConvHelper(fakeConv);
    fakeConv.$helper = convHelper;
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('constructor', function() {
    it('is a function', function() {
      expect(ConvHelper).to.be.a('function');
    });

    it('returns an instance with defined methods', function() {
      expect(convHelper.getLocale).to.be.a('function');
      expect(convHelper.isNewConversation).to.be.a('function');
      expect(convHelper.getAllQuizQuestions).to.be.a('function');
      expect(convHelper.getQuizSettings).to.be.a('function');
      expect(convHelper.loadCompatibleSettings).to.be.a('function');
      expect(convHelper.loadSettings).to.be.a('function');
      expect(convHelper.getDefaultSessionParams).to.be.a('function');
      expect(convHelper.updateSessionParamsQuizSettings).to.be.a('function');
      expect(convHelper.getRandomSsmlAudio).to.be.a('function');
      expect(convHelper.getRoundTransitionPrompt).to.be.a('function');
      expect(convHelper.getOutcomeCorrectPrompt).to.be.a('function');
      expect(convHelper.getAndClearUserAnswer).to.be.a('function');
      expect(convHelper.resetCurrentQuestion).to.be.a('function');
      expect(convHelper.transitionScene).to.be.a('function');
      expect(convHelper.setupSessionTypeAndSpeechBiasing).to.be.a('function');
      expect(convHelper.addSessionType).to.be.a('function');
    });
  });

  describe('static create', function() {
    it('is a function', function() {
      expect(ConvHelper.create).to.be.a('function');
    });

    it('returns an instance of ConvHelper', function() {
      expect(ConvHelper.create(fakeConv)).to.be.instanceOf(ConvHelper);
    });
  });

  describe('getLocale', function() {
    it('returns locale of the conv', function() {
      expect(convHelper.getLocale()).to.equal(fakeConv.user.locale);
    });
  });

  describe('isNewUser', function() {
    it('returns true if verificationStatus is GUEST', function() {
      fakeConv.user.verificationStatus = 'GUEST';
      fakeConv.user.lastSeenTime = '2020-08-07T23:11:04Z';
      expect(convHelper.isNewUser()).to.be.true;
    });

    it('returns true if lastSeenTime is empty', function() {
      fakeConv.user.verificationStatus = 'VERIFIED';
      fakeConv.user.lastSeenTime = '';
      expect(convHelper.isNewUser()).to.be.true;
    });

    it('returns false if verificationStatus is not GUEST and lastSeenTime is not empty', function() {
      fakeConv.user.verificationStatus = 'VERIFIED';
      fakeConv.user.lastSeenTime = '2020-08-07T23:11:04Z';
      expect(convHelper.isNewUser()).to.be.false;
    });
  });

  describe('isNewConversation', function() {
    it('returns true if intent name is actions.intent.MAIN', function() {
      fakeConv.intent.name = Intent.MAIN;
      expect(convHelper.isNewConversation()).to.be.true;
    });

    it('returns true if intent name is actions.intent.PLAY_GAME', function() {
      fakeConv.intent.name = Intent.PLAY_GAME;
      expect(convHelper.isNewConversation()).to.be.true;
    });

    it('returns false if intent name is neither actions.intent.MAIN or actions.intent.PLAY_GAME', function() {
      fakeConv.intent.name = Intent.HELP;
      expect(convHelper.isNewConversation()).to.be.false;
    });
  });

  describe('getAllQuizQuestions', function() {
    it('returns array of quiz questions based on locale', function() {
      fakeConv.user.locale = 'en-US';
      const questions = convHelper.getAllQuizQuestions();
      expect(questions).to.be.an('array');
      for (const question of questions) {
        expect(question).to.have.property(Alias.QUIZ_Q_A.QUESTION);
        expect(question).to.have.property(Alias.QUIZ_Q_A.ANSWERS);
      }
    });

    it('throws an error if data does not exist for locale', function() {
      fakeConv.user.locale = 'xyz';
      expect(() => convHelper.getAllQuizQuestions()).to.throw();
    });
  });

  describe('getQuizSettings', function() {
    it('returns quiz settings based on locale', function() {
      fakeConv.user.locale = 'en-US';
      const quizSettings = convHelper.getQuizSettings();
      expect(quizSettings).to.be.an('object');
      expect(quizSettings).to.have.property(Alias.QUIZ_SETTINGS.TITLE);
      expect(quizSettings).to.have.property(Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME);
      expect(quizSettings).to.have.property(Alias.QUIZ_SETTINGS.QUESTION_TITLE);
      expect(quizSettings).to.have.property(Alias.QUIZ_SETTINGS.ANSWER_TITLE);
    });

    it('throws an error if data does not exist for locale', function() {
      fakeConv.user.locale = 'xyz';
      expect(() => convHelper.getQuizSettings()).to.throw();
    });
  });

  describe('loadCompatibleSettings', function() {
    it('loads compatible options only', function() {
      const settings = convHelper.loadCompatibleSettings(
        Collection.QUIZ_SETTINGS,
        Tab.QUIZ_SETTINGS.valueKey,
        [Tab.QUIZ_SETTINGS.key.TITLE, Tab.QUIZ_SETTINGS.key.QUESTIONS_PER_GAME]
      );
      expect(settings).to.be.an('object');
      expect(settings).to.have.property(Alias.QUIZ_SETTINGS.TITLE);
      expect(settings).to.have.property(Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME);
      expect(settings).to.not.have.property(Alias.QUIZ_SETTINGS.QUESTION_TITLE);
      expect(settings).to.not.have.property(Alias.QUIZ_SETTINGS.ANSWER_TITLE);
    });
  });

  describe('loadSettings', function() {
    it('loads settings based on locale', function() {
      const settings = convHelper.loadSettings(
        Collection.QUIZ_SETTINGS,
        Tab.QUIZ_SETTINGS.valueKey
      );
      expect(settings).to.be.an('object');
      expect(settings).to.have.property(Alias.QUIZ_SETTINGS.TITLE);
      expect(settings).to.have.property(Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME);
    });

    it('throws an error if data does not exist for locale', function() {
      fakeConv.user.locale = 'xyz';
      expect(() =>
        convHelper.loadSettings(Collection.QUIZ_SETTINGS, Tab.QUIZ_SETTINGS.valueKey)
      ).to.throw();
    });
  });

  describe('getDefaultSessionParams', function() {
    it('returns an object', function() {
      const output = convHelper.getDefaultSessionParams();
      expect(output).to.be.a('object');
    });
  });

  describe('updateSessionParamsQuizSettings', function() {
    it('updates conv.session.params props with matching letters input props', function() {
      const testTitle = 'great title';
      const settings = {[Alias.QUIZ_SETTINGS.TITLE]: testTitle};
      convHelper.updateSessionParamsQuizSettings(settings);
      expect(fakeConv.session.params[Alias.QUIZ_SETTINGS.TITLE]).to.equal(testTitle);
    });

    it('not updates conv.session.params props if not matched letters props', function() {
      const testTitle = 'another great title';
      const settings = {myTitle: testTitle};
      convHelper.updateSessionParamsQuizSettings(settings);
      expect(fakeConv.session.params.myTitle).to.not.equal(testTitle);
    });
  });

  describe('getRandomSsmlAudio', function() {
    it('returns a random selected SSML audio tag based on input key', function() {
      const output = convHelper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_CORRECT);
      expect(output).to.be.a('string');
      expect(output.includes('<audio src=')).to.be.true;
    });

    it('returns empty string if input key does not exist in conv.session.params', function() {
      const output = convHelper.getRandomSsmlAudio('xyz123');
      expect(output).to.be.a('string');
      expect(output).to.equal('');
    });

    it('returns empty string if input key is an empty array in conv.session.params', function() {
      fakeConv.session.params[Alias.QUIZ_SETTINGS.AUDIO_CORRECT_DEFAULT] = [];
      const output = convHelper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO);
      expect(output).to.be.a('string');
      expect(output).to.equal('');
    });
  });

  describe('getRoundTransitionPrompt', function() {
    it('returns Prompt.FIRST_ROUND is count is 0', function() {
      fakeConv.session.params.count = 0;
      expect(convHelper.getRoundTransitionPrompt()).to.eql(Prompt.FIRST_ROUND);
    });

    it('returns Prompt.FINAL_ROUND is count is limit-1', function() {
      fakeConv.session.params.count = 2;
      fakeConv.session.params.limit = 3;
      expect(convHelper.getRoundTransitionPrompt()).to.eql(Prompt.FINAL_ROUND);
    });

    it('returns Prompt.NEXT_QUESTION if count is in between 0 and limit-1', function() {
      fakeConv.session.params.count = 1;
      expect(convHelper.getRoundTransitionPrompt()).to.eql(Prompt.NEXT_QUESTION);
    });
  });

  describe('getOutcomeCorrectPrompt', function() {
    it('returns Prompt.NONE_CORRECT is score is 0', function() {
      fakeConv.session.params.score = 0;
      expect(convHelper.getOutcomeCorrectPrompt()).to.eql(Prompt.NONE_CORRECT);
    });

    it('returns Prompt.ALL_CORRECT is score equals limit', function() {
      fakeConv.session.params.score = 3;
      fakeConv.session.params.limit = 3;
      expect(convHelper.getOutcomeCorrectPrompt()).to.eql(Prompt.ALL_CORRECT);
    });

    it('returns Prompt.SOME_CORRECT if score is in between 0 and limit', function() {
      fakeConv.session.params.score = 1;
      expect(convHelper.getOutcomeCorrectPrompt()).to.eql(Prompt.SOME_CORRECT);
    });
  });

  describe('getAndClearUserAnswer', function() {
    it('returns conv.session.params.UserAnswer', function() {
      fakeConv.session.params.UserAnswer = 'abc';
      expect(convHelper.getAndClearUserAnswer()).to.eql('abc');
    });

    it('clears conv.session.params.UserAnswer', function() {
      fakeConv.session.params.UserAnswer = 'abc';
      convHelper.getAndClearUserAnswer();
      expect(fakeConv.session.params.UserAnswer).to.be.null;
    });
  });

  describe('resetCurrentQuestion', function() {
    it('update conv.session.params.currentQuestion based on current count', function() {
      fakeConv.session.params.count = 1;
      convHelper.resetCurrentQuestion();
      expect(fakeConv.session.params.currentQuestion).to.eql(fakeConv.session.params.questions[1]);
    });

    it('resets conv.session.params.attempts to 0', function() {
      fakeConv.session.params.attempts = 1;
      convHelper.resetCurrentQuestion();
      expect(fakeConv.session.params.attempts).to.equal(0);
    });

    it('resets conv.session.params.hinted to false', function() {
      fakeConv.session.params.hinted = true;
      convHelper.resetCurrentQuestion();
      expect(fakeConv.session.params.hinted).to.be.false;
    });
  });

  describe('transitionScene', function() {
    it('update conv.scene.next', function() {
      const testScene = 'abc123';
      convHelper.transitionScene(testScene);
      expect(fakeConv.scene.next.name).to.equal(testScene);
    });
  });

  describe('setupSessionTypeAndSpeechBiasing', function() {
    it('sets cleaned answers to conv.speechBiasing', function() {
      fakeConv.session.params.currentQuestion = {
        [Alias.QUIZ_Q_A.QUESTION]: 'question_1',
        [Alias.QUIZ_Q_A.ANSWERS]: ['a ', ' b ', 'c'],
      };
      convHelper.setupSessionTypeAndSpeechBiasing();
      expect(fakeConv.expected.speech)
        .to.be.a('array')
        .with.members(['a', 'b', 'c']);
    });

    it('invoke addSessionType with Type.ANSWER', function() {
      sinon.spy(convHelper, 'addSessionType');
      fakeConv.session.params.currentQuestion = {
        [Alias.QUIZ_Q_A.QUESTION]: 'question_1',
        [Alias.QUIZ_Q_A.ANSWERS]: ['a ', ' b ', 'c'],
      };
      convHelper.setupSessionTypeAndSpeechBiasing();
      expect(convHelper.addSessionType).to.have.been.calledWith(Type.ANSWER, ['a', 'b', 'c']);
    });
  });

  describe('addSessionType', function() {
    it('adds entity and synonyms entries to conv.session.typeOverrides', function() {
      convHelper.addSessionType('answer', ['a', 'b', 'c']);
      expect(fakeConv.session.typeOverrides).to.eql([
        {
          name: 'answer',
          mode: TypeOverrideMode.TYPE_REPLACE,
          synonym: {
            entries: [
              {
                name: 'a',
                synonyms: ['a', 'b', 'c'],
              },
            ],
          },
        },
      ]);
    });

    it('clean up duplicate, invalid and lowercase synonyms', function() {
      convHelper.addSessionType('answer', ['a', 'b', 'c', 'A ', '', ' B ']);
      expect(fakeConv.session.typeOverrides).to.eql([
        {
          name: 'answer',
          mode: TypeOverrideMode.TYPE_REPLACE,
          synonym: {
            entries: [
              {
                name: 'a',
                synonyms: ['a', 'b', 'c'],
              },
            ],
          },
        },
      ]);
    });

    it('update existing entry if exist', function() {
      convHelper.addSessionType('answer', ['a', 'b', 'c']);
      convHelper.addSessionType('answer', ['x', 'y', 'z']);
      expect(fakeConv.session.typeOverrides).to.eql([
        {
          name: 'answer',
          mode: TypeOverrideMode.TYPE_REPLACE,
          synonym: {
            entries: [
              {
                name: 'x',
                synonyms: ['x', 'y', 'z'],
              },
            ],
          },
        },
      ]);
    });

    it('adds multiple entries with different type names', function() {
      convHelper.addSessionType('answer1', ['a', 'b', 'c']);
      convHelper.addSessionType('answer2', ['x', 'y', 'z']);
      expect(fakeConv.session.typeOverrides).to.eql([
        {
          name: 'answer1',
          mode: TypeOverrideMode.TYPE_REPLACE,
          synonym: {
            entries: [
              {
                name: 'a',
                synonyms: ['a', 'b', 'c'],
              },
            ],
          },
        },
        {
          name: 'answer2',
          mode: TypeOverrideMode.TYPE_REPLACE,
          synonym: {
            entries: [
              {
                name: 'x',
                synonyms: ['x', 'y', 'z'],
              },
            ],
          },
        },
      ]);
    });
  });
});
