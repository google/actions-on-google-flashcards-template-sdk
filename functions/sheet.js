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

const util = require('./util');
const {Alias, TabType, SchemaType} = require('./constant.js');
const config = require('./config.js');

/**
 * Collection names.
 * @readonly
 */
const Collection = {
  QUIZ_Q_A: 'quiz_q_a',
  QUIZ_SETTINGS: 'quiz_settings',
};

/**
 * Document keys.
 * @readonly
 */
const Key = {
  QUIZ_Q_A: {
    QUESTION: 'question',
    ANSWERS: 'answers',
    HINT: 'hint',
    FOLLOW_UP: 'followUp',
  },
  QUIZ_SETTINGS: {
    TITLE: 'title',
    QUESTIONS_PER_GAME: 'questionsPerGame',
    QUESTION_TITLE: 'questionTitle',
    ANSWER_TITLE: 'answerTitle',
    AUDIO_DING: 'audioDing',
    AUDIO_GAME_INTRO: 'audioGameIntro',
    AUDIO_GAME_OUTRO: 'audioGameOutro',
    AUDIO_CORRECT: 'audioCorrect',
    AUDIO_INCORRECT: 'audioIncorrect',
    AUDIO_ROUND_END: 'audioRoundEnd',
    AUDIO_CALCULATING: 'audioCalculating',
    RANDOMIZE_QUESTIONS: 'randomizeQuestions',
    GOOGLE_ANALYTICS_TRACKING_ID: 'googleAnalyticsTrackingID',
    QUIT_PROMPT: 'quitPrompt',
    AUTO_ADD_ANSWER_SYNONYMS: 'autoAddAnswerSynonyms',
  },
};

/**
 * Field schema for transformation and validation of raw docs.
 * @readonly
 */
const Schema = {
  QUIZ_Q_A: {
    [Key.QUIZ_Q_A.QUESTION]: {
      alias: Alias.QUIZ_Q_A.QUESTION,
      type: SchemaType.STRING,
    },
    [Key.QUIZ_Q_A.ANSWERS]: {
      alias: Alias.QUIZ_Q_A.ANSWERS,
      type: SchemaType.STRING_LIST,
    },
    [Key.QUIZ_Q_A.HINT]: {
      alias: Alias.QUIZ_Q_A.HINT,
      type: SchemaType.STRING,
      optional: true,
    },
    [Key.QUIZ_Q_A.FOLLOW_UP]: {
      alias: Alias.QUIZ_Q_A.FOLLOW_UP,
      type: SchemaType.STRING,
      optional: true,
    },
  },
  QUIZ_SETTINGS: {
    [Key.QUIZ_SETTINGS.TITLE]: {
      alias: Alias.QUIZ_SETTINGS.TITLE,
      type: SchemaType.STRING,
      default: config.TITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.QUESTIONS_PER_GAME]: {
      alias: Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME,
      type: SchemaType.INTEGER,
      default: config.QUESTIONS_PER_GAME_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.QUESTION_TITLE]: {
      alias: Alias.QUIZ_SETTINGS.QUESTION_TITLE,
      type: SchemaType.STRING,
      default: config.QUESTION_TITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.ANSWER_TITLE]: {
      alias: Alias.QUIZ_SETTINGS.ANSWER_TITLE,
      type: SchemaType.STRING,
      default: config.ANSWER_TITLE_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.AUDIO_DING]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_DING,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_DING_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_GAME_INTRO]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_GAME_INTRO_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_GAME_OUTRO]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_GAME_OUTRO_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_CORRECT]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_CORRECT,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_CORRECT_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_INCORRECT]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_INCORRECT,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_INCORRECT_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_ROUND_END]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_ROUND_END,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_ROUND_END_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.AUDIO_CALCULATING]: {
      alias: Alias.QUIZ_SETTINGS.AUDIO_CALCULATING,
      type: SchemaType.URL_LIST,
      default: [...config.AUDIO_CALCULATING_DEFAULT],
    },
    [Key.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS]: {
      alias: Alias.QUIZ_SETTINGS.RANDOMIZE_QUESTIONS,
      type: SchemaType.BOOLEAN,
      default: config.RANDOMIZE_QUESTIONS_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID]: {
      alias: Alias.QUIZ_SETTINGS.GOOGLE_ANALYTICS_TRACKING_ID,
      type: SchemaType.STRING,
      default: config.GOOGLE_ANALYTICS_TRACKING_ID_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.QUIT_PROMPT]: {
      alias: Alias.QUIZ_SETTINGS.QUIT_PROMPT,
      type: SchemaType.STRING,
      default: config.QUIT_PROMPT_DEFAULT,
    },
    [Key.QUIZ_SETTINGS.AUTO_ADD_ANSWER_SYNONYMS]: {
      alias: Alias.QUIZ_SETTINGS.AUTO_ADD_ANSWER_SYNONYMS,
      type: SchemaType.STRING,
      default: config.AUTO_ADD_ANSWER_SYNONYMS_DEFAULT,
    },
  },
};

/**
 * Configuration and aliases for each sheet tab.
 * @readonly
 */
const Tab = {
  QUIZ_Q_A: {
    type: TabType.ARRAY,
    key: Key.QUIZ_Q_A,
    schema: Schema.QUIZ_Q_A,
  },
  QUIZ_SETTINGS: {
    type: TabType.DICTIONARY,
    key: Key.QUIZ_SETTINGS,
    valueKey: 'value',
    schema: Schema.QUIZ_SETTINGS,
    default: util.object.mapValues(Schema.QUIZ_SETTINGS, (val) => val.default),
  },
};

module.exports = {
  Collection,
  Key,
  Schema,
  Tab,
};
