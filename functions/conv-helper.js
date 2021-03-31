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

const config = require('./config.js');
const util = require('./util');
const {Collection, Schema, Tab} = require('./sheet.js');
const {Intent, Type, Alias, TypeOverrideMode, Prompt} = require('./constant.js');
const sheetData = require('./sheet-data.js');

/**
 * Helper methods for AoG Conversation conv object.
 */
class ConvHelper {
  /**
   * @param {ConversationV3} conv - ConversationV3 instance.
   */
  constructor(conv) {
    this.conv = conv;
  }

  /**
   * Creates a ConvHelper instance.
   * @param {ConversationV3} conv - ConversationV3 instance.
   * @return {ConvHelper} - ConvHelperV3 instance.
   */
  static create(conv) {
    return new ConvHelper(conv);
  }

  /**
   * Get locale from request info.
   * @return {string} - Conv locale.
   */
  getLocale() {
    return this.conv.user.locale;
  }

  /**
   * Check whether current conv is by a new user.
   * @return {boolean} - True if current conv is by a new user.
   */
  isNewUser() {
    return this.conv.user.verificationStatus === 'GUEST' || !this.conv.user.lastSeenTime;
  }

  /**
   * Check whether current conv is a new conversation.
   * @return {boolean} - True if current conv is a new conversation.
   */
  isNewConversation() {
    const intent = this.conv.intent.name;
    return intent === Intent.MAIN || intent === Intent.PLAY_GAME;
  }

  /**
   * Loads all validated quiz question docs.
   * @return {Array<Question>} - Validated quiz questions docs.
   */
  getAllQuizQuestions() {
    const docs = sheetData.byLocale(this.getLocale())[Collection.QUIZ_Q_A];
    return util.schema.validateCollection(docs, Schema.QUIZ_Q_A);
  }

  /**
   * Loads quiz config settings and validates through FieldSchema.
   * @return {QuizSettings} - Validated quiz config settings.
   */
  getQuizSettings() {
    const collection = Collection.QUIZ_SETTINGS;
    const valueKey = Tab.QUIZ_SETTINGS.valueKey;
    const options = Object.values(Tab.QUIZ_SETTINGS.key);
    const settings = Object.assign(
      {},
      JSON.parse(JSON.stringify(Tab.QUIZ_SETTINGS.default)),
      this.loadCompatibleSettings(collection, valueKey, options)
    );
    return util.schema.validateObject(settings, Schema.QUIZ_SETTINGS);
  }

  /**
   * Loads parameter settings, then filter by matching setting options.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @param {Array<string>} options - Compatible settings options.
   * @return {Object} - Compatible settings object.
   */
  loadCompatibleSettings(collection, valueKey, options) {
    const lowerCaseOptions = new Set(options.map((s) => s.toLowerCase()));
    const hasMatchKey = (_, key) => lowerCaseOptions.has(key.toLowerCase());
    const settings = this.loadSettings(collection, valueKey);
    return util.object.pickBy(settings, hasMatchKey);
  }

  /**
   * Loads parameter settings, then map values to valueKey property of value object.
   * @param {string} collection - Collection name.
   * @param {string} valueKey - Database value object key that maps to actual value.
   * @return {Object} - Settings object.
   */
  loadSettings(collection, valueKey) {
    const getValueCol = (target) => (util.object.isObject(target) ? target[valueKey] : target);
    const settings = sheetData.byLocale(this.getLocale())[collection];
    return util.object.mapValues(settings, getValueCol);
  }

  /**
   * Get default session params for the conversation.
   * @return {Object<string, any>} - Default session params.
   */
  getDefaultSessionParams() {
    return {
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
      questions: [],
      currentQuestion: {},
      previousAnswer: '',
      limit: config.MAX_QUESTIONS_PER_GAME,
      count: 0,
      score: 0,
      attempts: 0,
      hinted: false,
      isNewUser: true,
    };
  }

  /**
   * Updates conv.session.params values with sheet settings for existing keys only.
   * @param {!Object} sheetSettings - Sheet settings to update conv.session.params fields.
   */
  updateSessionParamsQuizSettings(sheetSettings) {
    for (const [key, val] of Object.entries(sheetSettings)) {
      if (this.conv.session.params.hasOwnProperty(key)) {
        this.conv.session.params[key] = val;
      }
    }
  }

  /**
   * Get a random audio source from conv.session.params in SSML audio tag.
   * @param {string} key - Audio key in conv.session.params
   * @return {string} - Randomly selected SSML audio tag.
   */
  getRandomSsmlAudio(key) {
    const audioSources = this.conv.session.params[key];
    if (!Array.isArray(audioSources) || audioSources.length === 0) return '';
    return util.ssml.audioTag(util.array.randomPick(audioSources));
  }

  /**
   * Get round transition prompt based on current asked questions.
   * @return {string} - Round transition prompt.
   */
  getRoundTransitionPrompt() {
    const {count, limit} = this.conv.session.params;
    if (count === 0) return Prompt.FIRST_ROUND;
    if (count === limit - 1) return Prompt.FINAL_ROUND;
    return Prompt.NEXT_QUESTION;
  }

  /**
   * Get outcome correct prompt based on the number of questions user answered correctly.
   * @return {string} - Outcome correct prompt.
   */
  getOutcomeCorrectPrompt() {
    const {score, limit} = this.conv.session.params;
    if (score === 0) return Prompt.NONE_CORRECT;
    if (score === limit) return Prompt.ALL_CORRECT;
    return Prompt.SOME_CORRECT;
  }

  /**
   * Get UserAnswer and clear it in session params.
   * @return {string} - Captured value of 'answer' type.
   */
  getAndClearUserAnswer() {
    const userAnswer = this.conv.session.params.UserAnswer;
    this.conv.session.params.UserAnswer = null;
    return String(userAnswer);
  }

  /**
   * Reset params for current question.
   */
  resetCurrentQuestion() {
    const index = this.conv.session.params.count;
    this.conv.session.params.currentQuestion = this.conv.session.params.questions[index];
    this.conv.session.params.attempts = 0;
    this.conv.session.params.hinted = false;
  }

  /**
   * Transition next scene.
   * @param {string} scene - Next scene name.
   */
  transitionScene(scene) {
    this.conv.scene.next = {name: scene};
  }

  /**
   * Builds session type and speech biasing for answer type.
   */
  setupSessionTypeAndSpeechBiasing() {
    const clean = (synonyms) => [...new Set(synonyms.map((s) => util.string.stripEmoji(s).trim()))];
    const question = this.conv.session.params.currentQuestion;
    const answers = clean(question[Alias.QUIZ_Q_A.ANSWERS]);
    this.conv.expected.speech = [...answers];
    this.addSessionType(Type.ANSWER, answers);
  }

  /**
   * Add entry to session type.
   * @param {string} typeName - Session type name.
   * @param {Array<Array<string>>} synonymsEntries - List of synonyms for session type.
   */
  addSessionType(typeName, ...synonymsEntries) {
    const entries = synonymsEntries.map((synonyms) => {
      synonyms = synonyms.map((tokens) => tokens.toLowerCase().trim()).filter(Boolean);
      return {name: synonyms[0], synonyms: [...new Set(synonyms)]};
    });
    const sessionType = {
      name: typeName,
      mode: TypeOverrideMode.TYPE_REPLACE,
      synonym: {entries},
    };
    const index = this.conv.session.typeOverrides.findIndex((ele) => ele.name === sessionType.name);

    if (index === -1) {
      this.conv.session.typeOverrides.push(sessionType);
    } else {
      this.conv.session.typeOverrides[index] = sessionType;
    }
  }
}

module.exports = ConvHelper;
