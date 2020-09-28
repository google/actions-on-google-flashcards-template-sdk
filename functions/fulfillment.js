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

const {Simple, Suggestion} = require('@assistant/conversation');

const util = require('./util');
const config = require('./config.js');
const {Action, Scene, Alias, Prompt} = require('./constant.js');

/**
 * Fulfillment class to handle supported ConversationV3 actions.
 */
class Fulfillment {
  /**
   * @return {Fulfillment}
   */
  static create() {
    return new Fulfillment();
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.LOAD_SETTINGS](conv) {
    const defaultSessionParams = conv.$helper.getDefaultSessionParams();
    conv.session.params = {...conv.session.params, ...defaultSessionParams};
    conv.session.params.isNewUser = conv.$helper.isNewUser();
    const quizSettings = conv.$helper.getQuizSettings();
    conv.$helper.updateSessionParamsQuizSettings(quizSettings);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.SETUP_QUIZ](conv) {
    const questions = conv.$helper.getAllQuizQuestions();
    const questionsPerGame = Math.min(
      conv.session.params[Alias.QUIZ_SETTINGS.QUESTIONS_PER_GAME],
      questions.length,
      config.MAX_QUESTIONS_PER_GAME
    );
    conv.session.params.questions = util.array.shuffle(questions).slice(0, questionsPerGame);
    conv.session.params.currentQuestion = {};
    conv.session.params.previousAnswer = '';
    conv.session.params.limit = questionsPerGame;
    conv.session.params.count = 0;
    conv.session.params.score = 0;
    conv.session.params.attempts = 0;
    conv.session.params.hinted = false;
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.START_CONFIRMATION](conv) {
    const audioGameIntro = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO);
    const speeches = [audioGameIntro, Prompt.GREETING_1, Prompt.INSTRUCTION, Prompt.LETS_PLAY];
    conv.add(new Simple(util.ssml.merge(speeches)));
    conv.add(new Suggestion({title: Prompt.YES_CHIP}));
    conv.add(new Suggestion({title: Prompt.NO_CHIP}));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.START_YES](conv) {
    conv.$helper.resetCurrentQuestion();
    this.question(conv, [conv.$helper.getRoundTransitionPrompt()]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.START_NO](conv) {
    const quitPrompt = conv.session.params[Alias.QUIZ_SETTINGS.QUIT_PROMPT] || Prompt.QUIT;
    const audioGameOutro = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO);
    conv.add(new Simple(util.ssml.merge([quitPrompt, audioGameOutro])));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.START_SKIP_CONFIRMATION](conv) {
    conv.$helper.resetCurrentQuestion();
    const audioGameIntro = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_INTRO);
    const speeches = [
      audioGameIntro,
      Prompt.GREETING_2,
      Prompt.INTRODUCTION,
      Prompt.INSTRUCTION,
      conv.$helper.getRoundTransitionPrompt(),
    ];
    this.question(conv, speeches);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER](conv) {
    const userAnswer = conv.$helper.getAndClearUserAnswer();
    const currentQuestion = conv.session.params.currentQuestion;
    const matchedAnswer = currentQuestion[Alias.QUIZ_Q_A.ANSWERS].find(
      (ans) => ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
    );
    if (matchedAnswer) {
      const audioCorrect = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_CORRECT);
      const speeches = [audioCorrect, Prompt.RIGHT_ANSWER];
      if (currentQuestion[Alias.QUIZ_Q_A.FOLLOW_UP]) {
        speeches.push(currentQuestion[Alias.QUIZ_Q_A.FOLLOW_UP]);
      }
      conv.session.params.score += 1;
      this.nextQuestion(conv, speeches);
    } else {
      this[Action.WRONG_ANSWER];
    }
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_NO_MATCH_1](conv) {
    this[Action.WRONG_ANSWER](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.WRONG_ANSWER](conv) {
    const currentQuestion = conv.session.params.currentQuestion;
    conv.session.params.attempts += 1;
    if (conv.session.params.attempts === 1) {
      if (currentQuestion[Alias.QUIZ_Q_A.HINT] && !conv.session.params.hinted) {
        conv.$helper.transitionScene(Scene.ASK_HINT_OR_TRY_AGAIN);
        conv.add(new Simple(util.ssml.merge([Prompt.WRONG_ANSWER_1, Prompt.AGAIN_HINT])));
        conv.add(new Suggestion({title: Prompt.HINT_CHIP}));
        conv.add(new Suggestion({title: Prompt.TRY_AGAIN_CHIP}));
      } else {
        conv.$helper.transitionScene(Scene.ASK_QUESTION);
        conv.add(new Simple(util.ssml.merge([Prompt.WRONG_ANSWER_1, Prompt.HINT_QUESTION])));
      }
    } else {
      this.nextQuestion(conv, [Prompt.WRONG_ANSWER_1, Prompt.WRONG_ANSWER_2]);
    }
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_HINT](conv) {
    const currentQuestion = conv.session.params.currentQuestion;
    const speeches = [];
    if (!currentQuestion[Alias.QUIZ_Q_A.HINT]) {
      speeches.push(Prompt.NO_HINT, currentQuestion[Alias.QUIZ_Q_A.QUESTION]);
    } else if (conv.session.params.hinted) {
      speeches.push(Prompt.NO_MORE_HINT, currentQuestion[Alias.QUIZ_Q_A.QUESTION]);
    } else {
      speeches.push(Prompt.CONFIRMATION, Prompt.HINT, Prompt.HINT_QUESTION);
      conv.session.params.hinted = true;
    }
    conv.add(new Simple(util.ssml.merge(speeches)));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_TRY_AGAIN](conv) {
    this.question(conv, [Prompt.REPEAT]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_DONT_KNOW](conv) {
    this.nextQuestion(conv, [Prompt.I_DONT_KNOW, Prompt.WRONG_ANSWER_2]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_SKIP](conv) {
    this.nextQuestion(conv, [Prompt.I_DONT_KNOW, Prompt.WRONG_ANSWER_2]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.ANSWER_HELP](conv) {
    conv.add(new Simple(Prompt.HELP));
    conv.add(new Suggestion({title: Prompt.YES_CHIP}));
    conv.add(new Suggestion({title: Prompt.NO_CHIP}));
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUESTION_REPEAT](conv) {
    this.question(conv, [Prompt.REPEAT]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.CONTINUE_YES](conv) {
    this.question(conv, [Prompt.REPEAT]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.CONTINUE_NO](conv) {
    this[Action.START_NO](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PLAY_AGAIN_YES](conv) {
    this[Action.SETUP_QUIZ](conv);
    conv.$helper.resetCurrentQuestion();
    this.question(conv, [Prompt.RE]);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.PLAY_AGAIN_NO](conv) {
    this[Action.START_NO](conv);
  }

  /**
   * @param {ConversationV3} conv
   */
  [Action.QUIT](conv) {
    const audioGameOutro = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_GAME_OUTRO);
    conv.add(new Simple(util.ssml.merge([Prompt.END, audioGameOutro])));
  }

  /**
   * @param {ConversationV3} conv
   * @param {string[]} [speeches=[]]
   */
  nextQuestion(conv, speeches = []) {
    const currentQuestion = conv.session.params.currentQuestion;
    conv.session.params.previousAnswer = currentQuestion[Alias.QUIZ_Q_A.ANSWERS][0];
    conv.session.params.count += 1;
    if (conv.session.params.count < conv.session.params.limit) {
      conv.$helper.resetCurrentQuestion();
      conv.$helper.transitionScene(Scene.ASK_QUESTION);
      speeches.push(conv.$helper.getRoundTransitionPrompt());
      this.question(conv, speeches);
    } else {
      conv.$helper.transitionScene(Scene.ASK_PLAY_AGAIN);
      this.outcome(conv, speeches);
    }
  }

  /**
   * @param {ConversationV3} conv
   * @param {string[]} [speeches=[]]
   */
  question(conv, speeches = []) {
    conv.$helper.setupSessionTypeAndSpeechBiasing();
    speeches.push(conv.session.params.currentQuestion[Alias.QUIZ_Q_A.QUESTION]);
    conv.add(new Simple(util.ssml.merge(speeches)));
  }

  /**
   * @param {ConversationV3} conv
   * @param {string[]} [speeches=[]]
   */
  outcome(conv, speeches = []) {
    const audioRoundEnd = conv.$helper.getRandomSsmlAudio(Alias.QUIZ_SETTINGS.AUDIO_ROUND_END);
    const correctPrompt = conv.$helper.getOutcomeCorrectPrompt();
    speeches.push(audioRoundEnd, correctPrompt, Prompt.PLAY_AGAIN_QUESTION);
    conv.add(new Simple(util.ssml.merge(speeches)));
    conv.add(new Suggestion({title: Prompt.YES_CHIP}));
    conv.add(new Suggestion({title: Prompt.NO_CHIP}));
  }
}

module.exports = Fulfillment;
