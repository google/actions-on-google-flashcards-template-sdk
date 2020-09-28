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

/**
 * @fileoverview Schema constants for Flash Cards data sheet.
 */

/**
 * Spreadsheet tab Types
 * ARRAY: each row is an independent doc
 * DICTIONARY: rows are grouped together by a key column
 */
const TabType = {
  ARRAY: 'ARRAY',
  DICTIONARY: 'DICTIONARY',
};

/**
 * Converted output type
 */
const OutputType = {
  JSON: 'json',
  YAML: 'yaml',
};

/**
 * Spreadsheet tab definitions
 */
const Tab = {
  QUIZ_Q_A: {
    name: 'quiz_q_a',
    displayName: 'Questions & Answers',
    type: TabType.ARRAY,
    outputType: OutputType.JSON,
    excludeRows: [1, 2, 3, 4, 5, 6],
    columns: [
      {
        name: 'question',
        displayName: 'Question',
        isRequired: true,
      },
      {
        name: 'answers',
        displayName: 'Answer',
        isRequired: true,
        isRepeated: true,
      },
      {
        name: 'hint',
        displayName: 'Hint',
      },
      {
        name: 'followUp',
        displayName: 'Follow Up',
      },
    ],
  },
  QUIZ_SETTINGS: {
    name: 'quiz_settings',
    displayName: 'Configuration',
    type: TabType.DICTIONARY,
    outputType: OutputType.JSON,
    excludeRows: [1, 2, 3, 4, 5, 6],
    columns: [
      {
        name: 'key',
        displayName: 'Key',
        isKey: true,
      },
      {
        name: 'value',
        displayName: 'Value',
        isRequired: ['title', 'questionsPerGame', 'questionTitle', 'answerTitle'],
        isRepeated: [
          'audioDing',
          'audioGameIntro',
          'audioGameOutro',
          'audioCorrect',
          'audioIncorrect',
          'audioRoundEnd',
          'audioCalculating',
        ],
      },
    ],
    keys: [
      {
        name: 'title',
        displayName: 'Title',
      },
      {
        name: 'questionsPerGame',
        displayName: 'QuestionsPerGame',
      },
      {
        name: 'questionTitle',
        displayName: 'QuestionTitle',
      },
      {
        name: 'answerTitle',
        displayName: 'AnswerTitle',
      },
      {
        name: 'audioDing',
        displayName: 'AudioDing',
      },
      {
        name: 'audioGameIntro',
        displayName: 'AudioGameIntro',
      },
      {
        name: 'audioGameOutro',
        displayName: 'AudioGameOutro',
      },
      {
        name: 'audioCorrect',
        displayName: 'AudioCorrect',
      },
      {
        name: 'audioIncorrect',
        displayName: 'AudioIncorrect',
      },
      {
        name: 'audioRoundEnd',
        displayName: 'AudioRoundEnd',
      },
      {
        name: 'audioCalculating',
        displayName: 'AudioCalculating',
      },
      {
        name: 'randomizeQuestions',
        displayName: 'RandomizeQuestions',
      },
      {
        name: 'googleAnalyticsTrackingID',
        displayName: 'GoogleAnalyticsTrackingID',
      },
      {
        name: 'quitPrompt',
        displayName: 'QuitPrompt',
      },
      {
        name: 'autoAddAnswerSynonyms',
        displayName: 'AutoAddAnswerSynonyms',
      },
    ],
  },
};

/**
 * Resource strings mapping
 */
const Prompt = {
  GREETING_1: 'GREETING_PROMPTS_1',
  GREETING_2: 'GREETING_PROMPTS_2',
  INTRODUCTION: 'INTRODUCTION_PROMPTS',
  INSTRUCTION: 'INSTRUCTION_PROMPTS',
  FIRST_ROUND: 'FIRST_ROUND_PROMPTS',
  NEXT_QUESTION: 'NEXT_QUESTION_PROMPTS',
  I_DONT_KNOW: 'I_DONT_KNOW_PROMPTS',
  WRONG_ANSWER_1: 'WRONG_ANSWER_PROMPTS_1',
  WRONG_ANSWER_2: 'WRONG_ANSWER_PROMPTS_2',
  CONFIRMATION: 'CONFIRMATION_PROMPTS',
  HINT: 'HINT_PROMPTS',
  HINT_QUESTION: 'HINT_QUESTION_PROMPTS',
  RE: 'RE_PROMPTS',
  WRONG_ANSWER_FOR_QUESTION: 'WRONG_ANSWER_FOR_QUESTION_PROMPTS',
  QUIT: 'QUIT_PROMPTS',
  PLAY_AGAIN_QUESTION: 'PLAY_AGAIN_QUESTION_PROMPTS',
  NO_MATCH_2: 'NO_MATCH_PROMPTS_2',
  NO_MATCH_3: 'NO_MATCH_PROMPTS_3',
  REPEAT: 'REPEAT_PROMPTS',
  SKIP: 'SKIP_PROMPTS',
  FEELING_LUCKY_1: 'FEELING_LUCKY_PROMPTS_1',
  FEELING_LUCKY_2: 'FEELING_LUCKY_PROMPTS_2',
  TRY_OR_HINT: 'TRY_OR_HINT_PROMPTS',
  AGAIN_HINT: 'AGAIN_HINT_PROMPTS',
  NO_HINT: 'NO_HINT_PROMPTS',
  NO_MORE_HINT: 'NO_MORE_HINT_PROMPTS',
  SILLY_ANSWER: 'SILLY_ANSWER_PROMPTS',
  RIGHT_ANSWER: 'RIGHT_ANSWER_PROMPTS_1',
  DISAGREE: 'DISAGREE_PROMPTS',
  NONE_CORRECT: 'NONE_CORRECT_PROMPTS',
  SOME_CORRECT: 'SOME_CORRECT_PROMPTS',
  ALL_CORRECT: 'ALL_CORRECT_PROMPTS',
  END: 'END_PROMPTS',
  HELP: 'HELP_PROMPTS',
  LETS_PLAY: 'LETS_PLAY_PROMPTS',
  FINAL_ROUND: 'FINAL_ROUND_PROMPTS',
  NO_INPUT_1: 'NO_INPUT_PROMPTS_1',
  NO_INPUT_2: 'NO_INPUT_PROMPTS_2',
  NO_INPUT_3: 'NO_INPUT_PROMPTS_3',
  FALLBACK: 'FALLBACK_PROMPTS_1',
  YES_CHIP: 'YES_CHIPS',
  NO_CHIP: 'NO_CHIPS',
  TRUE_CHIP: 'TRUE_CHIPS',
  FALSE_CHIP: 'FALSE_CHIPS',
  HINT_CHIP: 'HINT_CHIPS',
  TRY_AGAIN_CHIP: 'TRY_AGAIN_CHIPS',
};

module.exports = {
  TabType,
  OutputType,
  Tab,
  Prompt,
};
