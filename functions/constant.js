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

/**
 * @module constant
 * @desc Common enumeration constants.
 */

/**
 * Action names from ConversationV3 handlers.
 * @readonly
 */
const Action = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  SETUP_QUIZ: 'SETUP_QUIZ',
  START_CONFIRMATION: 'START_CONFIRMATION',
  START_YES: 'START_YES',
  START_NO: 'START_NO',
  START_SKIP_CONFIRMATION: 'START_SKIP_CONFIRMATION',
  ANSWER: 'ANSWER',
  ANSWER_NO_MATCH_1: 'ANSWER_NO_MATCH_1',
  WRONG_ANSWER: 'WRONG_ANSWER',
  ANSWER_HINT: 'ANSWER_HINT',
  ANSWER_TRY_AGAIN: 'ANSWER_TRY_AGAIN',
  ANSWER_DONT_KNOW: 'ANSWER_DONT_KNOW',
  ANSWER_SKIP: 'ANSWER_SKIP',
  ANSWER_HELP: 'ANSWER_HELP',
  QUESTION_REPEAT: 'QUESTION_REPEAT',
  CONTINUE_YES: 'CONTINUE_YES',
  CONTINUE_NO: 'CONTINUE_NO',
  PLAY_AGAIN_YES: 'PLAY_AGAIN_YES',
  PLAY_AGAIN_NO: 'PLAY_AGAIN_NO',
  QUIT: 'QUIT',
};

/**
 * ConversationV3 intents.
 * @readonly
 */
const Intent = {
  MAIN: 'actions.intent.MAIN',
  PLAY_GAME: 'actions.intent.PLAY_GAME',
  NO_MATCH: 'actions.intent.NO_MATCH',
  NO_INPUT: 'actions.intent.NO_INPUT',
  CANCEL: 'actions.intent.CANCEL',
  DONT_KNOW: 'DontKnow',
  HELP: 'Help',
  HINT: 'Hint',
  NO: 'No',
  QUIT: 'Quit',
  REPEAT: 'Repeat',
  RESTART: 'Restart',
  SKIP: 'Skip',
  START: 'Start',
  TRY_AGAIN: 'TryAgain',
  YES: 'Yes',
};

/**
 * ConversationV3 scenes.
 * @readonly
 */
const Scene = {
  END_CONVERSATION: 'actions.scene.END_CONVERSATION',
  ASK_CONTINUE: 'AskContinue',
  ASK_HINT_OR_TRY_AGAIN: 'AskHintOrTryAgain',
  ASK_PLAY_AGAIN: 'AskPlayAgain',
  ASK_QUESTION: 'AskQuestion',
  ASK_START: 'AskStart',
  PROCESS_ANSWER: 'ProcessAnswer',
  START_QUIZ: 'StartQuiz',
  WELCOME: 'Welcome',
};

/**
 * ConversationV3 types.
 * @readonly
 */
const Type = {
  ANSWER: 'answer',
};

/**
 * Spreadsheet tab Types
 * Array: each row is an independent doc
 * Dictionary: rows are grouped together by a key column
 * @readonly
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Type override mode.
 * @readonly
 */
const TypeOverrideMode = {
  TYPE_MERGE: 'TYPE_MERGE',
  TYPE_REPLACE: 'TYPE_REPLACE',
  TYPE_UNSPECIFIED: 'TYPE_UNSPECIFIED',
};

/**
 * Validation schema types.
 * @readonly
 */
const SchemaType = {
  CUSTOM: 'CUSTOM',
  BOOLEAN: 'BOOLEAN',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  SSML: 'SSML',
  STRING: 'STRING',
  STRING_LIST: 'STRING_LIST',
  IMAGE: 'IMAGE',
  URL: 'URL',
  URL_LIST: 'URL_LIST',
  GOOGLE_FONT: 'GOOGLE_FONT',
  COLOR_HEX: 'COLOR_HEX',
  DATE: 'DATE',
};

/**
 * Alias keys for Spreadsheet data. Fulfillment will refer fetched doc by alias keys.
 * @readonly
 */
const Alias = {
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
 * General prompt to resource strings key mapping.
 * @readonly
 */
const Prompt = {
  GREETING_1: '$resources.strings.main.GREETING_1',
  GREETING_2: '$resources.strings.main.GREETING_2',
  INTRODUCTION: '$resources.strings.main.INTRODUCTION',
  INSTRUCTION: '$resources.strings.main.INSTRUCTION',
  FIRST_ROUND: '$resources.strings.main.FIRST_ROUND',
  NEXT_QUESTION: '$resources.strings.main.NEXT_QUESTION',
  I_DONT_KNOW: '$resources.strings.main.I_DONT_KNOW',
  WRONG_ANSWER_1: '$resources.strings.main.WRONG_ANSWER_1',
  WRONG_ANSWER_2: '$resources.strings.main.WRONG_ANSWER_2',
  CONFIRMATION: '$resources.strings.main.CONFIRMATION',
  HINT: '$resources.strings.main.HINT',
  HINT_QUESTION: '$resources.strings.main.HINT_QUESTION',
  RE: '$resources.strings.main.RE',
  WRONG_ANSWER_FOR_QUESTION: '$resources.strings.main.WRONG_ANSWER_FOR_QUESTION',
  QUIT: '$resources.strings.main.QUIT',
  PLAY_AGAIN_QUESTION: '$resources.strings.main.PLAY_AGAIN_QUESTION',
  NO_MATCH_2: '$resources.strings.main.NO_MATCH_2',
  NO_MATCH_3: '$resources.strings.main.NO_MATCH_3',
  REPEAT: '$resources.strings.main.REPEAT',
  SKIP: '$resources.strings.main.SKIP',
  FEELING_LUCKY_1: '$resources.strings.main.FEELING_LUCKY_1',
  FEELING_LUCKY_2: '$resources.strings.main.FEELING_LUCKY_2',
  TRY_OR_HINT: '$resources.strings.main.TRY_OR_HINT',
  AGAIN_HINT: '$resources.strings.main.AGAIN_HINT',
  NO_HINT: '$resources.strings.main.NO_HINT',
  NO_MORE_HINT: '$resources.strings.main.NO_MORE_HINT',
  SILLY_ANSWER: 'SILLY_ANSWER',
  RIGHT_ANSWER: '$resources.strings.main.RIGHT_ANSWER',
  DISAGREE: '$resources.strings.main.DISAGREE',
  NONE_CORRECT: '$resources.strings.main.NONE_CORRECT',
  SOME_CORRECT: '$resources.strings.main.SOME_CORRECT',
  ALL_CORRECT: '$resources.strings.main.ALL_CORRECT',
  END: '$resources.strings.main.END',
  HELP: '$resources.strings.main.HELP',
  LETS_PLAY: '$resources.strings.main.LETS_PLAY',
  FINAL_ROUND: '$resources.strings.main.FINAL_ROUND',
  NO_INPUT_1: '$resources.strings.main.NO_INPUT_1',
  NO_INPUT_2: '$resources.strings.main.NO_INPUT_2',
  NO_INPUT_3: '$resources.strings.main.NO_INPUT_3',
  FALLBACK: '$resources.strings.main.FALLBACK',
  YES_CHIP: '$resources.strings.main.YES_CHIP',
  NO_CHIP: '$resources.strings.main.NO_CHIP',
  TRUE_CHIP: '$resources.strings.main.TRUE_CHIP',
  FALSE_CHIP: '$resources.strings.main.FALSE_CHIP',
  HINT_CHIP: '$resources.strings.main.HINT_CHIP',
  TRY_AGAIN_CHIP: '$resources.strings.main.TRY_AGAIN_CHIP',
};

module.exports = {
  Action,
  Intent,
  Scene,
  Type,
  TabType,
  TypeOverrideMode,
  SchemaType,
  Alias,
  Prompt,
};
