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
 * Project configuration settings
 */
const config = {
  // Webhook config
  FUNCTION_NAME: 'flashcards',
  FUNCTION_VERSION: 'v1',
  FUNCTION_MEMORY: '1GB',
  FUNCTION_REGION: 'us-central1',
  FUNCTION_TIMEOUT: 60, // seconds
  ENABLE_DEBUG: true,
  DEBUG_KEY: 'DedicatedDebugInfo',
  SSML_BREAK_TIME: 500, // milliseconds
  MAX_QUESTIONS_PER_GAME: 10,

  // Default values for Quiz settings in the data sheet
  TITLE_DEFAULT: 'The Flash Cards Game',
  QUESTIONS_PER_GAME_DEFAULT: 5,
  QUESTION_TITLE_DEFAULT: 'Question Title',
  ANSWER_TITLE_DEFAULT: 'Answer Title',
  AUDIO_DING_DEFAULT: ['https://actions.google.com/sounds/v1/cartoon/instrument_strum.ogg'],
  AUDIO_GAME_INTRO_DEFAULT: [],
  AUDIO_GAME_OUTRO_DEFAULT: [],
  AUDIO_CORRECT_DEFAULT: ['https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'],
  AUDIO_INCORRECT_DEFAULT: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'],
  AUDIO_ROUND_END_DEFAULT: [],
  AUDIO_CALCULATING_DEFAULT: ['https://actions.google.com/sounds/v1/cartoon/woodpecker.ogg'],
  RANDOMIZE_QUESTIONS_DEFAULT: true,
  GOOGLE_ANALYTICS_TRACKING_ID_DEFAULT: '',
  QUIT_PROMPT_DEFAULT: '',
  AUTO_ADD_ANSWER_SYNONYMS_DEFAULT: 'no',
};

module.exports = config;
