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
 * @typedef {import('../conv-helper')} ConvHelper
 */

/**
 * Format arguments as replacement strings for prompts.
 * @typedef {Object} FormatArgs
 * @property {Array<string|Object>} textArgs - Replacement args for text property.
 * @property {Array<string|Object>} speechArgs - Replacement args for speech property.
 */

/**
 * @typedef {Object} ValidatorSchema
 * @property {string} type - One of supported SchemaType.
 * @property {Function} process - Preprocessor function before apply Joi validation.
 * @property {Joi} validate - Joi schema validation object.
 * @property {*} [default] - Default value to use if validation failed.
 * @property {Boolean} [optional] - True to not validate if value is an empty string.
 * @property {string} [alias] - Alias key to replace the original field key.
 */

/**
 * @typedef {Object} RichBasicCard
 * @property {string} display - Image display options, one of DEFAULT, WHITE, CROPPED.
 * @property {string} [text] - Body text.
 * @property {string} [title] - Title text.
 * @property {Image} [image] - Card image.
 */

/**
 * @typedef {Object} Question
 * @property {string} question - Question text.
 * @property {Array<string>} answers - Acceptable answers.
 * @property {string} [hint] - Question hint.
 * @property {string} [followUp] - Question follow up text.
 */

/**
 * @typedef {Object} QuizSettings
 * @property {string} title - Quiz title.
 * @property {number} questionsPerGame - Number of questions per game.
 * @property {string} questionTitle - Question title.
 * @property {string} answerTitle - Answer title.
 * @property {Array<string>} [audioDing] - Custom audio ding urls.
 * @property {Array<string>} [audioGameIntro] - Custom audio game intro urls.
 * @property {Array<string>} [audioGameOutro] - Custom audio game outro urls.
 * @property {Array<string>} [audioCorrect] - Custom audio correct urls.
 * @property {Array<string>} [audioIncorrect] - Custom audio incorrect urls.
 * @property {Array<string>} [audioRoundEnd] - Custom audio round end urls.
 * @property {Array<string>} [audioCalculating] - Custom audio calculating urls.
 * @property {boolean} [randomizeQuestions] - Randomize questions mode.
 * @property {string} [googleAnalyticsTrackingID] - Google analytics tracking id.
 * @property {string} [quitPrompt] - Custom quit prompt.
 * @property {string} [autoAddAnswerSynonyms] - Auto add answer synonyms mode.
 */

