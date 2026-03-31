/* ================================================================
   practice-common.js — 动态渲染版
   适配 common.js V2.0 / window.SfiCore
   适配 HTML: sfi_practice_section1_cn_above_sv.html
   本版包含：
   1. 隐藏顶部灰色瑞典语答案行
   2. 多空题答错后自动定位到第一个错误输入框
   3. 多个错误输入框之间按空格顺序跳转并自动选中
   4. 保留回车判题 / 回车下一题 / 新题自动聚焦 / åäö 警告通过
   5. 基础/进阶模式按变形题严格分流
   6. 只认 slotLabels / labelScheme 显示标签，杜绝透题
================================================================ */

(function () {
  'use strict';

  const SfiCore = window.SfiCore;
  if (!SfiCore) {
    console.error('[practice-common] window.SfiCore 未找到');
    return;
  }

  const DEFAULT_PROPER_NAMES = [
    'Anna', 'Erik', 'Lars', 'Karl', 'Maria',
    'Lisa', 'Peter', 'Sven',
    'Sverige', 'Stockholm', 'Göteborg', 'Malmö'
  ];

  const STATE = {
    isCompleted: false,
    currentIndex: 0,
    currentMode: 'basic',
    questions: [],
    filteredQuestions: [],
    errorInputs: [],
    currentErrorIndex: -1,
    stats: {
      startTime: null,
      correctCount: 0,
      attemptedCount: 0
    }
  };

  const REVIEW_SCHEDULE_KEY = 'sfi_review_schedule_v1';
  const REVIEW_INTERVALS_DAYS = [1, 2, 4, 7, 15, 30, 45];
  const BASIC_REVIEW_TRIGGER_COUNT = 20;
  const DAY_MS = 24 * 60 * 60 * 1000;

  function readReviewScheduleStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(REVIEW_SCHEDULE_KEY) || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch (e) {
      return {};
    }
  }

  function writeReviewScheduleStore(store) {
    try {
      localStorage.setItem(REVIEW_SCHEDULE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function getCurrentUnitId() {
    const pageConfig = window.PAGE_CONFIG || {};
    const candidate = typeof pageConfig.unit === 'string' ? pageConfig.unit.trim() : '';
    if (candidate) return candidate.toLowerCase();

    const fileName = String((location.pathname || '').split('/').pop() || '');
    let m = fileName.match(/_([ABCD])_unit(\d+)/i);
    if (m) return `${m[1].toLowerCase()}${m[2]}`;

    m = fileName.match(/([abcd])(\d+)/i);
    if (m) return `${m[1].toLowerCase()}${m[2]}`;

    return '';
  }

  function updateReviewScheduleOnSessionComplete() {
    const unitId = getCurrentUnitId();
    if (!unitId) return;

    const now = Date.now();
    const store = readReviewScheduleStore();
    const record = store[unitId] && typeof store[unitId] === 'object' ? store[unitId] : {};

    if (STATE.currentMode === 'basic' &&
        !record.basicFirstCompletedAt &&
        STATE.filteredQuestions.length >= BASIC_REVIEW_TRIGGER_COUNT) {
      record.basicFirstCompletedAt = now;
      record.completedReviews = 0;
      record.nextReviewAt = now + REVIEW_INTERVALS_DAYS[0] * DAY_MS;
    }

    if (record.basicFirstCompletedAt && record.nextReviewAt && now >= record.nextReviewAt) {
      const completedReviews = Math.max(0, Number(record.completedReviews || 0)) + 1;
      record.completedReviews = completedReviews;
      const intervalIdx = Math.min(completedReviews, REVIEW_INTERVALS_DAYS.length - 1);
      record.nextReviewAt = now + REVIEW_INTERVALS_DAYS[intervalIdx] * DAY_MS;
    }

    if (record.basicFirstCompletedAt) {
      record.updatedAt = now;
      store[unitId] = record;
      writeReviewScheduleStore(store);
    }
  }


  function getProperNames() {
    const pageConfig = window.PAGE_CONFIG || {};
    return Array.isArray(pageConfig.properNames) && pageConfig.properNames.length
      ? pageConfig.properNames
      : DEFAULT_PROPER_NAMES;
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildVocabTemplate(answer) {
    const raw = String(answer || '').trim();
    if (!raw) return '{{}}';

    const parts = raw.match(/[\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}\s]+|\s+/gu) || [raw];
    return parts.map(part => {
      if (/^\s+$/u.test(part)) return part;
      if (/^[\p{L}\p{M}\p{N}]+$/u.test(part)) return `{{${part}}}`;
      return part;
    }).join('');
  }

  function expandTemplateBlanks(template) {
    return String(template || '').replace(/{{(.*?)}}/g, (_, content) => {
      return buildVocabTemplate(content);
    });
  }

  function transformBankToQuestions(bank) {
    const basicPool = Array.isArray(bank.basicPool) ? bank.basicPool : [];
    const advancedPool = Array.isArray(bank.advancedPool) ? bank.advancedPool : [];

    const basicQuestions = basicPool.map(item => {
      if (item.kind === 'vocab_spelling') {
        return {
          id: item.id,
          kind: item.kind,
          concept: item.concept || item.lemma || item.answer || '',
          source: item.source || 'vocab',
          lemma: item.lemma || item.answer || '',
          type: 'inline_fill',
          template: buildVocabTemplate(item.answer || ''),
          prompt: { zh: item?.prompt?.zh || '' },
          modes: ['basic']
        };
      }

      if (item.kind === 'phrase_fill') {
        return {
          id: item.id,
          kind: item.kind,
          concept: item.concept || item.lemma || item.template || '',
          source: item.source || 'phrase',
          lemma: item.lemma || '',
          type: 'inline_fill',
          template: item.template || buildVocabTemplate(item.answer || ''),
          prompt: { zh: item?.prompt?.zh || '' },
          modes: ['basic']
        };
      }

      if (item.kind === 'dialog_fill') {
        return {
          id: item.id,
          kind: item.kind,
          concept: item.concept || item.lemma || item.template || '',
          source: item.source || 'dialog',
          lemma: item.lemma || '',
          type: 'inline_fill',
          template: item.template || '',
          prompt: { zh: item?.prompt?.zh || item.sentenceZh || '' },
          modes: ['basic']
        };
      }

      if (item.kind === 'morphology') {
        return {
          id: item.id,
          kind: item.kind,
          concept: item.concept || item.lemma || item.id,
          source: item.source || 'vocab',
          lemma: item.lemma || '',
          labelScheme: item.labelScheme || null,
          slotLabels: Array.isArray(item.slotLabels) ? item.slotLabels : null,
          type: 'inline_fill',
          template: item.template || '',
          prompt: { zh: item?.prompt?.zh || '' },
          modes: ['basic']
        };
      }

      return null;
    }).filter(Boolean);

    const advancedQuestions = advancedPool.map(item => {
      const base = {
        id: item.id,
        kind: item.kind || 'morphology',
        concept: item.concept || item.lemma || item.id,
        source: item.source || 'morphology',
        lemma: item.lemma || '',
        labelScheme: item.labelScheme || null,
        slotLabels: Array.isArray(item.slotLabels) ? item.slotLabels : null,
        prompt: { zh: item?.prompt?.zh || '' },
        template: item.template || '',
        modes: ['advanced']
      };
      if (item.labelScheme === 'noun_forms' || item.source === 'noun_forms') {
        base.type = 'noun_paradigm';
      } else {
        base.type = 'inline_fill';
      }
      return base;
    });

    return [...basicQuestions, ...advancedQuestions];
  }

  function getQuestionsFromConfig() {
    const pageConfig = window.PAGE_CONFIG;

    if (Array.isArray(pageConfig)) return pageConfig;
    if (pageConfig && Array.isArray(pageConfig.questions)) return pageConfig.questions;
    if (pageConfig && (Array.isArray(pageConfig.basicPool) || Array.isArray(pageConfig.advancedPool))) {
      return transformBankToQuestions(pageConfig);
    }
    if (Array.isArray(window.questions)) return window.questions;

    return [];
  }

  function getDOM() {
    const inputs = Array.from(document.querySelectorAll('.practice-input, .inline-slot, .word-slot, input[data-role="answer"]'));

    return {
      wrap: document.getElementById('practiceWrap') || document.querySelector('.practice-container'),
      qCard: document.getElementById('qCard'),
      qPrompt: document.getElementById('qPrompt'),
      promptContent: document.getElementById('promptContent'),
      qInputArea: document.getElementById('qInputArea'),
      feedbackMsg: document.getElementById('feedbackMsg'),
      feedbackIcon: document.querySelector('#feedbackMsg .fb-icon'),
      feedbackText: document.querySelector('#feedbackMsg .fb-text'),
      nextBtn: document.getElementById('nextBtn'),
      qCur: document.getElementById('qCur'),
      qTotal: document.getElementById('qTotal'),
      qTypeLabel: document.getElementById('qTypeLabel'),
      progressBar: document.getElementById('progressBar'),
      completionScreen: document.getElementById('completionScreen'),
      statTotal: document.getElementById('stat-total'),
      statAcc: document.getElementById('stat-acc'),
      statTime: document.getElementById('stat-time'),
      modeBasicBtn: document.getElementById('modeBasicBtn'),
      modeAdvBtn: document.getElementById('modeAdvBtn'),
      answerReveal: document.getElementById('answerReveal'),
      arWords: document.getElementById('arWords'),
      inputs,
      input: inputs[0] || null
    };
  }

  function refreshDOM() {
    return getDOM();
  }

  function isAnswerRevealOpen() {
    const dom = getDOM();
    return !!(dom.answerReveal && dom.answerReveal.classList.contains('show'));
  }

  function closeAnswerReveal() {
    const dom = getDOM();
    if (dom.answerReveal) {
      dom.answerReveal.classList.remove('show');
    }
  }


  function normalizeText(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function stripSwedishToBase(value) {
    return normalizeText(value)
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o');
  }

  function hasSwedishSpecials(value) {
    return /[åäö]/i.test(value || '');
  }

  function isProperName(target) {
    const normalizedTarget = normalizeText(target);
    return getProperNames().some(name => normalizeText(name) === normalizedTarget);
  }

  function compare(input, target) {
    const rawInput = normalizeText(input);
    const rawTarget = normalizeText(target);

    if (!rawInput || !rawTarget) {
      return {
        status: 'error',
        exact: false,
        message: '请输入答案'
      };
    }

    if (rawInput === rawTarget) {
      return {
        status: 'perfect',
        exact: true,
        message: '正确'
      };
    }

    const inputBase = stripSwedishToBase(rawInput);
    const targetBase = stripSwedishToBase(rawTarget);

    const specialCaseMatched =
      inputBase === targetBase &&
      rawInput !== rawTarget &&
      hasSwedishSpecials(rawTarget);

    if (specialCaseMatched) {
      return {
        status: 'warn',
        exact: false,
        message: `拼写接近正确，但请注意变音符号：${target}`
      };
    }

    return {
      status: 'error',
      exact: false,
      message: '答案不正确'
    };
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function tokenizeTemplate(template) {
    const tokens = [];
    template = expandTemplateBlanks(template || '');
    const re = /{{(.*?)}}|([^\s]+)/g;
    let match;

    while ((match = re.exec(template || ''))) {
      if (match[1] !== undefined) {
        tokens.push({
          type: 'blank',
          value: match[1].trim()
        });
      } else if (match[2] !== undefined) {
        tokens.push({
          type: /^[.,!?;:·]$/.test(match[2]) ? 'punct' : 'word',
          value: match[2]
        });
      }
    }
    return tokens;
  }

  function getActiveQuestion() {
    return STATE.filteredQuestions[STATE.currentIndex] || null;
  }

  function getQuestionAnswers(question) {
    const template = STATE.currentMode === 'advanced' && question.template_adv
      ? question.template_adv
      : (question.template_basic || question.template || '');

    return tokenizeTemplate(template)
      .filter(t => t.type === 'blank')
      .map(t => t.value);
  }

  function getDisplayTemplate(question) {
    if (!question) return '';
    if (STATE.currentMode === 'advanced' && question.template_adv) return question.template_adv;
    if (STATE.currentMode === 'basic' && question.template_basic) return question.template_basic;
    return question.template || question.template_basic || question.template_adv || '';
  }

  function isMorphologyQuestion(q) {
    const schemes = ['noun_forms', 'verb_forms', 'adjective_forms'];
    return schemes.includes(q.labelScheme) || q.type === 'noun_paradigm';
  }

  function isQuestionVisibleInMode(question) {
    const modes = Array.isArray(question.modes) ? question.modes : [];

    if (STATE.currentMode === 'basic') {
      return !modes.includes('advanced');
    }

    if (STATE.currentMode === 'advanced') {
      return modes.includes('advanced');
    }

    return true;
  }

  function applyModeFilter() {
    const candidates = STATE.questions.filter(isQuestionVisibleInMode);

    if (STATE.currentMode === 'basic') {
      const unitKey = (window.PAGE_CONFIG && window.PAGE_CONFIG.unit) || 'default';
      const sessionKey = `sfi_session_${unitKey}_basic`;
      const byId = new Map(candidates.map(q => [q.id, q]));
      const stored = sessionStorage.getItem(sessionKey);

      let selectedIds = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.every(id => byId.has(id))) {
            selectedIds = parsed;
          }
        } catch (e) {}
      }

      if (!selectedIds.length) {
        const vocabItems = shuffleArray(candidates.filter(q => q.kind === 'vocab_spelling' || q.kind === 'morphology'));
        const phraseItems = shuffleArray(candidates.filter(q => q.kind === 'phrase_fill'));
        const dialogItems = shuffleArray(candidates.filter(q => q.kind === 'dialog_fill'));
        const chosen = [];
        const usedLemmas = new Set();
        const usedConcepts = new Set();

        const canUse = (item) => {
          if (chosen.some(q => q.id === item.id)) return false;

          const concept = (item.concept || '').toLowerCase();
          const lemma = (item.lemma || '').toLowerCase();

          if (concept && usedConcepts.has(concept)) return false;
          if (lemma && usedLemmas.has(lemma)) return false;

          return true;
        };

        const markUsed = (item) => {
          const concept = (item.concept || '').toLowerCase();
          const lemma = (item.lemma || '').toLowerCase();
          if (concept) usedConcepts.add(concept);
          if (lemma) usedLemmas.add(lemma);
        };

        const takeBucket = (items, count) => {
          let taken = 0;
          for (const item of items) {
            if (taken >= count || chosen.length >= 20) break;
            if (!canUse(item)) continue;
            chosen.push(item);
            markUsed(item);
            taken += 1;
          }
        };

        takeBucket(vocabItems, 8);
        takeBucket(phraseItems, 6);
        takeBucket(dialogItems, 6);

        if (chosen.length < 20) {
          const remaining = shuffleArray(candidates);
          for (const item of remaining) {
            if (chosen.length >= 20) break;
            if (!canUse(item)) continue;
            chosen.push(item);
            markUsed(item);
          }
        }

        selectedIds = shuffleArray(chosen.slice(0, 20)).map(q => q.id);
        sessionStorage.setItem(sessionKey, JSON.stringify(selectedIds));
      }

      STATE.filteredQuestions = selectedIds.map(id => byId.get(id)).filter(Boolean);
    } else {
      STATE.filteredQuestions = shuffleArray(candidates);
    }

    if (STATE.currentIndex >= STATE.filteredQuestions.length) {
      STATE.currentIndex = 0;
    }
  }

  function resetErrorNavigation() {
    STATE.errorInputs = [];
    STATE.currentErrorIndex = -1;
  }

  function setMode(mode) {
    STATE.currentMode = mode === 'advanced' ? 'advanced' : 'basic';

    const dom = getDOM();
    if (dom.modeBasicBtn && dom.modeAdvBtn) {
      dom.modeBasicBtn.textContent = '基础';
      dom.modeAdvBtn.textContent = '进阶';
      dom.modeBasicBtn.classList.toggle('active-mode', STATE.currentMode === 'basic');
      dom.modeAdvBtn.classList.toggle('active-mode', STATE.currentMode === 'advanced');
    }

    applyModeFilter();
    STATE.isCompleted = false;
    resetErrorNavigation();
    renderCurrentQuestion();
  }

  function getTypeLabel(question) {
    if (!question) return '—';
    if (question.labelScheme === 'noun_forms' || question.type === 'noun_paradigm') return '名词变形';
    if (question.labelScheme === 'verb_forms') return '动词变形';
    if (question.labelScheme === 'adjective_forms') return '形容词变形';
    if (question.kind === 'vocab_spelling') return '单词拼写';
    if (question.kind === 'dialog_fill') return '对话填空';
    return '填空';
  }

  function speakCurrentQuestion() {
    const q = getActiveQuestion();
    if (!q) return;

    function fallback(text) {
      if (text) SfiCore.tts.speak(text);
    }

    if (!SfiCore.audio) {
      fallback(q.audio || getQuestionAnswers(q).join(' '));
      return;
    }

    SfiCore.manifest.ensure(function () {
      var item = SfiCore.manifest.lookupByContentId(q.id);
      // Morphology with no manifest entry: TTS reads all forms
      if (!item && q.kind === 'morphology') {
        var forms = getQuestionAnswers(q);
        fallback(forms.length ? forms.join('  ') : (q.lemma || ''));
        return;
      }
      if (!item && (q.lemma || q.concept)) {
        item = SfiCore.manifest.lookupBySourceText(q.lemma || q.concept, 'vocab');
      }
      console.log('[SfiCore] speakQ:', q.id, '→', item ? (item.audioRefs ? 'audioRefs['+item.audioRefs.length+']' : item.audioRef || 'no ref') : 'NOT FOUND');
      const fallbackText = (item && item.sourceText) || q.lemma || q.audio || getQuestionAnswers(q).join(' ');

      if (!item) { fallback(fallbackText); return; }

      // Handle audioRefs array (dialogue items with multiple lines)
      if (item.audioRefs && item.audioRefs.length) {
        const paths = item.audioRefs.map(function (ref) {
          return SfiCore.manifest.getFilePath(ref);
        }).filter(Boolean);
        if (paths.length) {
          SfiCore.audio.playSequence(paths, null, function () { fallback(fallbackText); });
          return;
        }
      }

      // Handle single audioRef (vocab / question_prompt items)
      if (!item.audioRef) { fallback(fallbackText); return; }
      const path = SfiCore.manifest.getFilePath(item.audioRef);
      if (!path) { fallback(fallbackText); return; }
      SfiCore.audio.play(path, null, function () { fallback(fallbackText); });
    });
  }

  function updateAnswerReveal(question) {
    const dom = getDOM();
    if (!dom.arWords) return;

    const answers = getQuestionAnswers(question);
    dom.arWords.innerHTML = answers
      .map(ans => `<span class="ar-word">${escapeHtml(ans)}</span>`)
      .join('');
  }


  function injectInlineAlignmentStyles() {
    if (document.getElementById('sfi-inline-alignment-fix')) return;

    const style = document.createElement('style');
    style.id = 'sfi-inline-alignment-fix';
    style.textContent = `
      /* ================================================================
         COMPONENTS: Practice / Inline Fill Alignment Fix
         针对练习页填空题对齐问题的专项修复（从 alignment-fix.css 迁移）
      ================================================================ */
      .inline-sentence {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-end !important;
        gap: 8px 4px;
      }

      .word-slot-group {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-end !important;
      }

      .word-slot-label {
        font-size: 12px;
        color: #888;
        margin-bottom: 2px;
        line-height: 1.1;
        min-height: 1.1em;
      }

      .inline-word,
      .inline-punct {
        display: inline-flex;
        align-items: flex-end;
        position: relative;
        top: -6.3px;
      }
    `;
    document.head.appendChild(style);
  }

  function buildPromptHtml(question) {
    const zh = question?.prompt?.zh || '请完成当前题目';
    return `
      <div class="prompt-cn">${escapeHtml(zh)}</div>
    `;
  }

  function getSmartLabel(index, question) {
    if (Array.isArray(question.slotLabels) && question.slotLabels[index]) {
      return question.slotLabels[index];
    }

    if (question.labelScheme === 'noun_forms' || question.type === 'noun_paradigm') {
      return ['en/ett', '单数不定式', '单数定式', '复数不定式', '复数定式'][index] || '';
    }

    if (question.labelScheme === 'adjective_forms') {
      return ['原级', '比较级', '最高级'][index] || '';
    }

    if (question.labelScheme === 'verb_forms') {
      return ['原形', '现在时', '过去时', '完成时'][index] || '';
    }

    return '';
  }

  let __blankWidthCanvas = null;

  function getBlankWidthCanvas() {
    if (__blankWidthCanvas) return __blankWidthCanvas;
    __blankWidthCanvas = document.createElement('canvas');
    return __blankWidthCanvas;
  }

  function measureBlankTextWidth(text) {
    const canvas = getBlankWidthCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    ctx.font = '600 28px Inter, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    return Math.ceil(ctx.measureText(String(text || '')).width);
  }

  function getInlineBlankWidth(answer, question) {
    const raw = String(answer || '').trim();
    const measured = measureBlankTextWidth(raw);
    const fallback = raw.length * 18;

    if (question && question.kind === 'vocab_spelling') {
      return Math.max(96, measured + 28, fallback + 22);
    }

    return Math.max(60, measured + 18, fallback);
  }

  function buildInlineFillHtml(question) {
    const template = getDisplayTemplate(question);
    const tokens = tokenizeTemplate(template);
    let blankIndex = 0;

    const html = tokens.map((token) => {
      if (token.type === 'blank') {
        const label = getSmartLabel(blankIndex, question);
        const width = getInlineBlankWidth(token.value, question);
        const out = `
          <div class="word-slot-group">
            <div class="word-slot-label">${escapeHtml(label || '')}</div>
            <input
              class="practice-input inline-slot"
              data-role="answer"
              data-index="${blankIndex}"
              data-answer="${escapeHtml(token.value)}"
              data-label="${escapeHtml(label || '')}"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              style="width:${width}px"
              placeholder=""
            />
          </div>
        `;
        blankIndex += 1;
        return out;
      }

      if (token.type === 'punct') {
        return `<span class="inline-punct">${escapeHtml(token.value)}</span>`;
      }

      return `<span class="inline-word">${escapeHtml(token.value)}</span>`;
    }).join('');

    return `<div class="inline-sentence">${html}</div>`;
  }

  function buildNounParadigmHtml(question) {
    const template = getDisplayTemplate(question);
    const tokens = tokenizeTemplate(template);
    let blankIndex = 0;

    const html = tokens.map((token) => {
      if (token.type === 'blank') {
        const label = getSmartLabel(blankIndex, question);
        const width = Math.max(88, token.value.length * 20 + 12);
        const out = `
          <div class="word-slot-group">
            <div class="word-slot-label">${escapeHtml(label || '')}</div>
            <input
              class="practice-input word-slot"
              data-role="answer"
              data-index="${blankIndex}"
              data-answer="${escapeHtml(token.value)}"
              data-label="${escapeHtml(label || '')}"
              autocomplete="off"
              autocapitalize="none"
              spellcheck="false"
              style="width:${width}px"
              placeholder=""
            />
          </div>
        `;
        blankIndex += 1;
        return out;
      }

      if (token.value === '·') {
        return `<span class="word-slot-sep">·</span>`;
      }

      if (token.type === 'punct') {
        return `<span class="word-slot-sep">${escapeHtml(token.value)}</span>`;
      }

      return `<span class="inline-word">${escapeHtml(token.value)}</span>`;
    }).join('');

    return `<div class="word-slots-wrap">${html}</div>`;
  }

  function setFeedback(message, type) {
    const dom = getDOM();
    if (!dom.feedbackMsg || !dom.feedbackText || !dom.feedbackIcon) return;

    dom.feedbackText.textContent = message || '';
    dom.feedbackMsg.classList.remove('ok', 'err', 'show');
    dom.feedbackIcon.textContent = '';

    if (!message) return;

    dom.feedbackMsg.classList.add('show');

    if (type === 'perfect' || type === 'warn') {
      dom.feedbackMsg.classList.add('ok');
      dom.feedbackIcon.textContent = type === 'warn' ? '⚠' : '✓';
      return;
    }

    dom.feedbackMsg.classList.add('err');
    dom.feedbackIcon.textContent = '✕';
  }

  function setInputState(inputEl, type) {
    if (!inputEl) return;

    inputEl.classList.remove('warn-yellow', 'is-correct', 'is-error', 'correct', 'wrong');

    if (type === 'perfect') {
      inputEl.classList.add('is-correct', 'correct');
      return;
    }

    if (type === 'warn') {
      inputEl.classList.add('warn-yellow');
      return;
    }

    if (type === 'error') {
      inputEl.classList.add('is-error', 'wrong');
    }
  }

  function resetInputStates() {
    const dom = getDOM();
    dom.inputs.forEach(input => {
      input.disabled = false;
      input.classList.remove('warn-yellow', 'is-correct', 'is-error', 'correct', 'wrong', 'slot-locked');
    });
  }

  function lockInputs() {
    const dom = getDOM();
    dom.inputs.forEach(input => {
      input.disabled = true;
      input.classList.add('slot-locked');
    });
  }

  function showNextButton(show) {
    const dom = getDOM();
    if (!dom.nextBtn) return;
    dom.nextBtn.classList.toggle('show', !!show);
  }

  function updateProgress() {
    const dom = getDOM();
    const total = STATE.filteredQuestions.length;
    const currentDisplay = total ? STATE.currentIndex + 1 : 0;
    const pct = total ? Math.round((STATE.currentIndex / total) * 100) : 0;

    if (dom.qCur) dom.qCur.textContent = String(currentDisplay || 0);
    if (dom.qTotal) dom.qTotal.textContent = String(total || 0);
    if (dom.progressBar) dom.progressBar.style.width = `${pct}%`;
  }

  function focusAndSelect(inputEl) {
    if (!inputEl || inputEl.disabled) return;
    requestAnimationFrame(() => {
      inputEl.focus();
      if (typeof inputEl.select === 'function') {
        inputEl.select();
      }
    });
  }

  function focusFirstInput() {
    const dom = getDOM();
    const first = dom.inputs.find(input => !input.disabled);
    focusAndSelect(first);
  }

  function focusFirstErrorInput(firstErrorInput) {
    focusAndSelect(firstErrorInput);
  }

  function buildErrorNavigation(results, inputs) {
    STATE.errorInputs = results
      .map((result, index) => result.status === 'error' ? inputs[index] : null)
      .filter(Boolean);
    STATE.currentErrorIndex = STATE.errorInputs.length ? 0 : -1;
  }

  function focusNextErrorInputFrom(currentInput) {
    const errorInputs = STATE.errorInputs.filter(input => input && !input.disabled);
    if (!errorInputs.length) return false;

    const currentPos = errorInputs.indexOf(currentInput);
    const nextPos = currentPos >= 0
      ? (currentPos + 1) % errorInputs.length
      : 0;

    STATE.currentErrorIndex = nextPos;
    focusAndSelect(errorInputs[nextPos]);
    return true;
  }

  function renderCurrentQuestion() {
    const dom = refreshDOM();
    const question = getActiveQuestion();

    if (!dom.wrap || !dom.qCard) return;

    if (!question) {
      showCompletionScreen();
      return;
    }

    dom.wrap.style.display = 'flex';
    if (dom.completionScreen) dom.completionScreen.classList.remove('show');
    dom.qCard.style.display = 'flex';

    STATE.isCompleted = false;
    resetErrorNavigation();

    if (dom.qTypeLabel) {
      dom.qTypeLabel.textContent = getTypeLabel(question);
    }

    if (dom.promptContent) {
      dom.promptContent.innerHTML = buildPromptHtml(question);
    }

    if (dom.qPrompt) {
      dom.qPrompt.dataset.answer = getQuestionAnswers(question).join(' | ');
    }

    if (dom.qInputArea) {
      dom.qInputArea.dataset.answer = getQuestionAnswers(question).join(' | ');
      dom.qInputArea.innerHTML = question.type === 'noun_paradigm'
        ? buildNounParadigmHtml(question)
        : buildInlineFillHtml(question);
    }

    closeAnswerReveal();
    updateAnswerReveal(question);
    updateProgress();
    setFeedback('', 'idle');
    showNextButton(false);
    refreshDOM();
    resetInputStates();
    focusFirstInput();
    setTimeout(function () { speakCurrentQuestion(); }, 400);
  }

  function showCompletionScreen() {
    updateReviewScheduleOnSessionComplete();
    const dom = getDOM();
    if (dom.wrap) dom.wrap.style.display = 'none';
    if (dom.completionScreen) dom.completionScreen.classList.add('show');

    const total = STATE.filteredQuestions.length;
    const acc = STATE.stats.attemptedCount
      ? Math.round((STATE.stats.correctCount / STATE.stats.attemptedCount) * 100)
      : 100;
    const elapsedMs = STATE.stats.startTime ? Date.now() - STATE.stats.startTime : 0;
    const mins = Math.floor(elapsedMs / 60000);
    const secs = Math.floor((elapsedMs % 60000) / 1000);
    const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;

    if (dom.statTotal) dom.statTotal.textContent = String(total);
    if (dom.statAcc) dom.statAcc.textContent = `${acc}%`;
    if (dom.statTime) dom.statTime.textContent = timeStr;
  }

  function validateCurrentAnswer() {
    refreshDOM();
    const dom = getDOM();
    const question = getActiveQuestion();
    if (!question || !dom.inputs.length) return null;

    STATE.stats.attemptedCount += 1;

    let firstErrorInput = null;

    const results = dom.inputs.map((input) => {
      const target = input.dataset.answer || '';
      const result = compare(input.value, target);
      setInputState(input, result.status);

      if (result.status === 'error' && !firstErrorInput) {
        firstErrorInput = input;
      }

      return result;
    });

    const hasError = results.some(r => r.status === 'error');
    const hasWarn = !hasError && results.some(r => r.status === 'warn');

    if (!hasError) {
      STATE.isCompleted = true;
      resetErrorNavigation();
      STATE.stats.correctCount += 1;

      if (hasWarn) {
        setFeedback('答案通过，但请注意瑞典语变音符号。', 'warn');
        SfiCore.sfx.warn();
      } else {
        setFeedback('正确。', 'perfect');
        SfiCore.sfx.correct();
      }

      lockInputs();
      showNextButton(true);
      return {
        status: hasWarn ? 'warn' : 'perfect'
      };
    }

    buildErrorNavigation(results, dom.inputs);
    setFeedback('还有错误，请再检查一下。', 'error');
    SfiCore.sfx.error();
    focusFirstErrorInput(firstErrorInput);

    return {
      status: 'error'
    };
  }

  function nextQuestion() {
    if (!STATE.isCompleted) {
      return validateCurrentAnswer();
    }

    if (STATE.currentIndex < STATE.filteredQuestions.length - 1) {
      STATE.currentIndex += 1;
      renderCurrentQuestion();
      return;
    }

    showCompletionScreen();
  }

  function restartPractice() {
    STATE.currentIndex = 0;
    STATE.isCompleted = false;
    STATE.stats.startTime = Date.now();
    STATE.stats.correctCount = 0;
    STATE.stats.attemptedCount = 0;
    resetErrorNavigation();
    applyModeFilter();
    renderCurrentQuestion();
  }

  function bindEvents() {
    const dom = getDOM();

    if (dom.modeBasicBtn && !dom.modeBasicBtn.dataset.bound) {
      dom.modeBasicBtn.dataset.bound = '1';
      dom.modeBasicBtn.addEventListener('click', function () {
        setMode('basic');
      });
    }

    if (dom.modeAdvBtn && !dom.modeAdvBtn.dataset.bound) {
      dom.modeAdvBtn.dataset.bound = '1';
      dom.modeAdvBtn.addEventListener('click', function () {
        setMode('advanced');
      });
    }

    if (dom.qPrompt && !dom.qPrompt.dataset.bound) {
      dom.qPrompt.dataset.bound = '1';
      dom.qPrompt.addEventListener('click', function () {
        speakCurrentQuestion();
      });
    }

    if (!document.body.dataset.practiceBound) {
      document.body.dataset.practiceBound = '1';

      document.addEventListener('keydown', function (event) {
        const active = document.activeElement;
        const isAnswerInput = active && active.matches('.practice-input, .inline-slot, .word-slot, input[data-role="answer"]');

        if ((event.metaKey || event.ctrlKey) && event.key === ',') {
          event.preventDefault();
          speakCurrentQuestion();
          return;
        }

        if ((event.metaKey || event.ctrlKey) && event.key === '.') {
          event.preventDefault();
          const d = getDOM();
          if (d.answerReveal) {
            d.answerReveal.classList.toggle('show');
          }
          return;
        }

        if (event.key === 'Enter') {
          if (isAnswerRevealOpen()) {
            event.preventDefault();
            return;
          }

          if (STATE.isCompleted || isAnswerInput) {
            event.preventDefault();
            nextQuestion();
            return;
          }
        }

        if (isAnswerRevealOpen() && isAnswerInput) {
          event.preventDefault();
          return;
        }

        if (isAnswerInput && event.key === 'Backspace') {
          const inputs = getDOM().inputs;
          const idx = inputs.indexOf(active);
          const start = typeof active.selectionStart === 'number' ? active.selectionStart : null;
          const end = typeof active.selectionEnd === 'number' ? active.selectionEnd : null;
          const hasSelection = start !== null && end !== null && start !== end;

          if (!hasSelection && !active.value && idx > 0) {
            event.preventDefault();
            const prev = inputs[idx - 1];
            if (prev && !prev.disabled) {
              const prevVal = prev.value || '';
              prev.focus();
              const nextVal = prevVal.slice(0, -1);
              prev.value = nextVal;
              prev.dispatchEvent(new Event('input', { bubbles: true }));
              const caret = nextVal.length;
              try {
                prev.setSelectionRange(caret, caret);
              } catch (e) {}
            }
            return;
          }
        }

        if (isAnswerInput && event.key === 'ArrowLeft') {
          const inputs = getDOM().inputs;
          const idx = inputs.indexOf(active);
          const start = typeof active.selectionStart === 'number' ? active.selectionStart : null;
          const end = typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

          if (idx > 0 && start === 0 && end === 0) {
            event.preventDefault();
            const prev = inputs[idx - 1];
            if (prev && !prev.disabled) {
              prev.focus();
              const caret = (prev.value || '').length;
              try {
                prev.setSelectionRange(caret, caret);
              } catch (e) {}
            }
            return;
          }
        }

        if (isAnswerInput && event.key === 'ArrowRight') {
          const inputs = getDOM().inputs;
          const idx = inputs.indexOf(active);
          const start = typeof active.selectionStart === 'number' ? active.selectionStart : null;
          const end = typeof active.selectionEnd === 'number' ? active.selectionEnd : null;
          const len = (active.value || '').length;

          if (idx >= 0 && idx < inputs.length - 1 && start === len && end === len) {
            event.preventDefault();
            const next = inputs[idx + 1];
            if (next && !next.disabled) {
              next.focus();
              try {
                next.setSelectionRange(0, 0);
              } catch (e) {}
            }
            return;
          }
        }

        if (event.key === ' ' && isAnswerInput) {
          if (!STATE.isCompleted && STATE.errorInputs.length > 1) {
            event.preventDefault();
            focusNextErrorInputFrom(active);
            return;
          }

          const inputs = getDOM().inputs;
          const idx = inputs.indexOf(active);
          if (idx >= 0 && idx < inputs.length - 1 && active.value.trim()) {
            event.preventDefault();
            focusAndSelect(inputs[idx + 1]);
          }
        }
      }, true);

      document.addEventListener('beforeinput', function (event) {
        const target = event.target;
        if (!target.matches('.practice-input, .inline-slot, .word-slot, input[data-role="answer"]')) return;
        if (isAnswerRevealOpen()) {
          event.preventDefault();
        }
      }, true);

      document.addEventListener('focusin', function (event) {
        const target = event.target;
        if (!target.matches('.practice-input, .inline-slot, .word-slot, input[data-role="answer"]')) return;
        if (isAnswerRevealOpen()) {
          target.blur();
        }
      }, true);

      document.addEventListener('input', function (event) {
        const target = event.target;
        if (!target.matches('.practice-input, .inline-slot, .word-slot, input[data-role="answer"]')) return;
        if (isAnswerRevealOpen()) {
          return;
        }

        target.classList.remove('warn-yellow', 'is-correct', 'is-error', 'correct', 'wrong');

        if (STATE.errorInputs.length) {
          STATE.errorInputs = STATE.errorInputs.filter(input => input !== target);
          if (!STATE.errorInputs.length) {
            STATE.currentErrorIndex = -1;
          }
        }

        if (!STATE.isCompleted) {
          setFeedback('', 'idle');
          showNextButton(false);
        }
      }, true);
    }
  }

  function render() {
    refreshDOM();
    bindEvents();
    renderCurrentQuestion();
  }

  window.nextQuestion = nextQuestion;
  window.restartPractice = restartPractice;

  window.PracticeCommon = {
    compare,
    stripSwedishToBase,
    refreshDOM,
    render,
    renderCurrent: renderCurrentQuestion,
    renderCurrentQuestion,
    validate: validateCurrentAnswer,
    next: nextQuestion,
    restart: restartPractice,
    speakCurrent: speakCurrentQuestion,
    reset() {
      STATE.currentIndex = 0;
      STATE.isCompleted = false;
      resetErrorNavigation();
      refreshDOM();
      renderCurrentQuestion();
    },
    get state() {
      return {
        isCompleted: STATE.isCompleted,
        currentIndex: STATE.currentIndex,
        currentMode: STATE.currentMode,
        total: STATE.filteredQuestions.length
      };
    },
    isProperName
  };

  window.SFI_BOOT = function (config) {
    console.log('检测到旧版 SFI_BOOT 调用，正在自动适配并激活内容...');

    if (config) {
      if (Array.isArray(config)) {
        window.PAGE_CONFIG = { questions: config };
      } else {
        window.PAGE_CONFIG = config;
      }
    }

    STATE.questions = getQuestionsFromConfig();
    STATE.currentIndex = 0;
    STATE.isCompleted = false;
    resetErrorNavigation();
    STATE.stats.startTime = Date.now();
    STATE.stats.correctCount = 0;
    STATE.stats.attemptedCount = 0;

    const dom = refreshDOM();
    if (dom.wrap) {
      dom.wrap.style.display = 'flex';
    }

    applyModeFilter();
    render();

    console.log('练习引擎已就绪，请开始答题。');
  };

  function init() {
    injectInlineAlignmentStyles();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
