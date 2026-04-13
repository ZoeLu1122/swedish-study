/* ================================================================
   common.js — SFI 核心基础设施层 (V2.0)
   1. 命名空间隔离：所有 API 挂载在 window.SfiCore
   2. 统一音效服务：sfx.play(), sfx.correct(), sfx.warn(), sfx.error()
   3. 统一 TTS 拦截与增强：支持全局倍速控制
   4. UI 自动化注入：导航栏、倍速菜单、生词本入口
   5. 鲁棒性：防御性 DOM 操作，确保不干扰业务逻辑
================================================================ */

(function () {
  'use strict';

  const RATE_KEY = 'sfi_tts_rate';
  const DEFAULT_RATE = 0.75;
  const RATES = [
    { v: 0.5,  label: '0.5×'  },
    { v: 0.75, label: '0.75×' },
    { v: 1,    label: '1×'    },
    { v: 1.25, label: '1.25×' }
  ];

  window.SfiCore = {
    version: '2.0.0-architect',

    state: {
      ttsRate: parseFloat(localStorage.getItem(RATE_KEY)) || DEFAULT_RATE,
      isSoundOn: true
    },

    ui: {
      inject(selector, html, position = 'afterbegin') {
        const el = document.querySelector(selector);
        if (el) {
          el.insertAdjacentHTML(position, html);
          return true;
        }
        return false;
      },
      toast(msg, type = 'info') {
        console.log(`[SfiToast] ${type}: ${msg}`);
      },
      initNav() {
        const config = window.PAGE_CONFIG || {};
        const tabs = Array.isArray(config.tabs) ? config.tabs : null;
        const container = document.getElementById('unit-nav-container');

        if (!tabs || !container) return;

        container.innerHTML = tabs.map((tab, index) => `
          <button class="nav-tab ${index === 0 ? 'active' : ''}" data-tab-id="${tab.id}">
            ${tab.label}
          </button>
        `).join('');

        container.querySelectorAll('.nav-tab').forEach(btn => {
          btn.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-tab-id');
            if (typeof window.showSection === 'function') {
              window.showSection(sectionId, this);
            }
          });
        });

        if (config.defaultTab && typeof window.showSection === 'function') {
          const defaultBtn = container.querySelector(`[data-tab-id="${config.defaultTab}"]`);
          window.showSection(config.defaultTab, defaultBtn);
        }
      },
      goToSection(sectionId) {
        const btn =
          document.querySelector(`[data-tab-id="${sectionId}"]`) ||
          document.querySelector(`.nav-tab[onclick*="'${sectionId}'"]`) ||
          document.querySelector(`.nav-tab[onclick*='"${sectionId}"']`);

        if (typeof window.showSection === 'function') {
          window.showSection(sectionId, btn);
        }
      }
    },

    sfx: {
      _ctx: null,
      _getContext() {
        if (!this._ctx) {
          this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this._ctx.state === 'suspended') this._ctx.resume();
        return this._ctx;
      },
      play(freq, duration, type = 'sine', gain = 0.06, decay = 0.001) {
        if (!window.SfiCore.state.isSoundOn) return;
        try {
          const ctx = this._getContext();
          const osc = ctx.createOscillator();
          const env = ctx.createGain();
          osc.connect(env);
          env.connect(ctx.destination);
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          env.gain.setValueAtTime(gain, ctx.currentTime);
          env.gain.exponentialRampToValueAtTime(decay, ctx.currentTime + duration);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + duration);
        } catch (e) {
          console.warn('Audio play failed', e);
        }
      },
      key() { this.play(1200, 0.05, 'sine', 0.05, 0.001); },
      delete() { this.play(600, 0.07, 'triangle', 0.05, 0.001); },
      correct() {
        this.play(880, 0.1, 'sine', 0.08, 0.001);
        setTimeout(() => this.play(1100, 0.08, 'sine', 0.06, 0.001), 60);
      },
      warn() {
        this.play(440, 0.15, 'triangle', 0.08, 0.001);
        setTimeout(() => this.play(440, 0.15, 'triangle', 0.08, 0.001), 180);
      },
      error() { this.play(150, 0.2, 'sawtooth', 0.1, 0.001); }
    },

    tts: {
      speak(text, onEnd) {
        if (!text) return;
        window.speechSynthesis.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'sv-SE';
        ut.rate = window.SfiCore.state.ttsRate;
        if (onEnd) ut.onend = onEnd;
        window.speechSynthesis.speak(ut);
      },
      setRate(val) {
        window.SfiCore.state.ttsRate = val;
        localStorage.setItem(RATE_KEY, val);
        window.sfiTTSRate = val;
        if (window.SfiCore.audio && window.SfiCore.audio._el) {
          window.SfiCore.audio._el.playbackRate = val;
        }
      }
    },

    manifest: {
      _byContentId: {},
      _bySourceText: {},
      _audioById: {},
      _state: 'idle',
      _queue: [],
      // Remove all non-letter/non-number/non-space characters, collapse whitespace
      _normalize(text) {
        return String(text || '').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
      },
      _getBase() {
        const uk = window.sfiUnitKey || '';
        const m = uk.match(/sfi_([a-z])(\d+)_unit(\d+)/i);
        if (m) return 'audio/sv/' + m[1].toLowerCase() + m[2] + '/unit' + m[3];
        const pc = (window.PAGE_CONFIG && window.PAGE_CONFIG.unit) || '';
        const m2 = pc.match(/^([a-z])(\d+)$/i);
        if (m2) return 'audio/sv/' + m2[1].toLowerCase() + m2[2] + '/unit' + m2[2];
        return null;
      },
      ensure(cb) {
        if (this._state === 'ready' || this._state === 'error') { cb(); return; }
        this._queue.push(cb);
        if (this._state === 'loading') return;
        this._state = 'loading';
        const self = this;
        const base = this._getBase();
        if (!base) { self._state = 'error'; self._flush(); return; }
        const manifestVersion = window.SFI_MANIFEST_VERSION || window.SFI_ASSET_VERSION || '';
        const manifestSuffix = manifestVersion ? '?v=' + encodeURIComponent(manifestVersion) : '';
        Promise.all([
          fetch(base + '/content-manifest.json' + manifestSuffix, { cache: 'no-cache' }).then(r => r.json()),
          fetch(base + '/audio-manifest.json' + manifestSuffix, { cache: 'no-cache' }).then(r => r.json())
        ]).then(function (results) {
          const rawContent = results[0];
          const rawAudio = results[1];
          const contentList = Array.isArray(rawContent) ? rawContent
            : (rawContent && Array.isArray(rawContent.items) ? rawContent.items : []);
          const audioList = Array.isArray(rawAudio) ? rawAudio
            : (rawAudio && Array.isArray(rawAudio.items) ? rawAudio.items : []);
          audioList.forEach(function (a) {
            if (a.audioId) self._audioById[a.audioId] = a;
          });
          contentList.forEach(function (item) {
            if (item.contentId) self._byContentId[item.contentId] = item;
            if (item.sourceText) {
              const key = self._normalize(item.sourceText);
              if (!self._bySourceText[key]) self._bySourceText[key] = [];
              self._bySourceText[key].push(item);
            }
          });
          self._state = 'ready';
          self._flush();
        }).catch(function () {
          self._state = 'error';
          self._flush();
        });
      },
      _flush() {
        const q = this._queue.splice(0);
        q.forEach(function (fn) { try { fn(); } catch (e) { console.error('[SfiCore] manifest callback error:', e); } });
      },
      getFilePath(audioId) {
        const a = this._audioById[audioId];
        if (!a || !a.filePath) return null;
        // Strip leading slash so path is relative (works in subdirectory deploys like GitHub Pages /swedish-study/)
        return a.filePath.replace(/^\//, '');
      },
      lookupByContentId(cid) {
        return this._byContentId[cid] || null;
      },
      lookupBySourceText(text, audioType) {
        const key = this._normalize(text);
        // Direct match first; if not found, try with Swedish article prefixes
        // (manifest sourceText may include "ett"/"en", vocab page may pass bare word)
        const arr = this._bySourceText[key]
          || this._bySourceText['ett ' + key]
          || this._bySourceText['en ' + key]
          || [];
        if (!audioType) return arr[0] || null;
        return arr.find(function (i) { return i.audioType === audioType; }) || null;
      }
    },

    audio: {
      _el: null,
      _getEl() {
        if (!this._el) {
          this._el = new Audio();
          this._el.playbackRate = window.SfiCore.state.ttsRate;
        }
        return this._el;
      },
      stop() {
        if (this._el) {
          this._el.onended = null;
          this._el.onerror = null;
          this._el.pause();
          this._el.src = '';
        }
      },
      play(src, onEnd, onFallback) {
        const el = this._getEl();
        this.stop();
        el.src = src;
        el.onended = function () { if (onEnd) onEnd(); };
        el.onerror = function () {
          console.warn('[SfiCore] audio error, falling back. src:', src);
          if (onFallback) onFallback();
        };
        el.load();
        el.playbackRate = window.SfiCore.state.ttsRate; // set AFTER load() to prevent reset
        el.play().catch(function (err) {
          if (err.name === 'NotAllowedError') {
            console.info('[SfiCore] audio autoplay blocked. Use the prompt replay button.');
            return;
          }
          console.warn('[SfiCore] audio play() rejected:', err);
          if (onFallback) onFallback();
        });
      },
      playSequence(paths, onEnd, onFallback) {
        const self = this;
        const queue = paths.slice();
        function next() {
          if (!queue.length) { if (onEnd) onEnd(); return; }
          self.play(queue.shift(), next, function () { if (onFallback) onFallback(); });
        }
        next();
      }
    }
  };


  if (typeof window.initTTS !== 'function') {
    window.initTTS = function () {
      if (window.SfiCore && window.SfiCore.tts) {
        console.log('[SfiCore] TTS Ready');
      }
    };
  }

  if (typeof window.stopFullDialogueAction !== 'function' ||
      typeof window.speak !== 'function' ||
      typeof window.speakWord !== 'function' ||
      typeof window.speakDialogWord !== 'function' ||
      typeof window.toggleFull !== 'function') {
    const ttsUiState = {
      isFullSpeaking: false,
      currentFullDialogueId: null,
      activeButton: null
    };

    function clearActiveButton() {
      if (ttsUiState.activeButton && ttsUiState.activeButton.classList) {
        ttsUiState.activeButton.classList.remove('speaking');
      }
      ttsUiState.activeButton = null;
    }

    window.stopFullDialogueAction = function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (window.SfiCore && window.SfiCore.audio) window.SfiCore.audio.stop();
      clearActiveButton();
      if (ttsUiState.isFullSpeaking && ttsUiState.currentFullDialogueId !== null) {
        const oldBtn = document.getElementById(`btn-full${ttsUiState.currentFullDialogueId}`);
        if (oldBtn) oldBtn.textContent = '▶ 朗读整段对话';
      }
      ttsUiState.isFullSpeaking = false;
      ttsUiState.currentFullDialogueId = null;
    };

    window.speak = function (text, btn) {
      window.stopFullDialogueAction();
      if (!window.SfiCore || !window.SfiCore.tts) return;
      if (btn && btn.classList) {
        clearActiveButton();
        btn.classList.add('speaking');
        ttsUiState.activeButton = btn;
      }
      function onDone() {
        if (btn && btn.classList) {
          btn.classList.remove('speaking');
          if (ttsUiState.activeButton === btn) ttsUiState.activeButton = null;
        }
      }
      function fallback() {
        if (!text) { onDone(); return; }
        window.SfiCore.tts.speak(text, onDone);
      }
      if (!window.SfiCore.audio) { fallback(); return; }
      const cid = btn && btn.dataset && btn.dataset.contentId;
      window.SfiCore.manifest.ensure(function () {
        const item = cid
          ? window.SfiCore.manifest.lookupByContentId(cid)
          : window.SfiCore.manifest.lookupBySourceText(text, 'dialogue_line_group');
        if (!item) { fallback(); return; }
        if (item.audioRefs && item.audioRefs.length) {
          const paths = item.audioRefs.map(function (id) {
            return window.SfiCore.manifest.getFilePath(id);
          }).filter(Boolean);
          if (!paths.length) { fallback(); return; }
          window.SfiCore.audio.playSequence(paths, onDone, fallback);
        } else if (item.audioRef) {
          const path = window.SfiCore.manifest.getFilePath(item.audioRef);
          if (!path) { fallback(); return; }
          window.SfiCore.audio.play(path, onDone, fallback);
        } else {
          fallback();
        }
      });
    };

    window.speakWord = function (word, btn) {
      if (!window.SfiCore || !window.SfiCore.tts) return;
      if (btn && btn.classList) {
        clearActiveButton();
        btn.classList.add('speaking');
        ttsUiState.activeButton = btn;
      }
      function onDone() {
        if (btn && btn.classList) {
          btn.classList.remove('speaking');
          if (ttsUiState.activeButton === btn) ttsUiState.activeButton = null;
        }
      }
      function fallback() {
        if (!word) { onDone(); return; }
        window.SfiCore.tts.speak(word, onDone);
      }
      if (!window.SfiCore.audio) { fallback(); return; }
      window.SfiCore.manifest.ensure(function () {
        const item = window.SfiCore.manifest.lookupBySourceText(word, 'vocab');
        if (!item || !item.audioRef) { fallback(); return; }
        const path = window.SfiCore.manifest.getFilePath(item.audioRef);
        if (!path) { fallback(); return; }
        window.SfiCore.audio.play(path, onDone, fallback);
      });
    };

    window.speakDialogWord = function (word, btn) {
      window.speak(word, btn || null);
    };

    window.toggleFull = function (dialogueId) {
      if (!window.SfiCore || !window.SfiCore.tts) {
        console.warn('TTS engine not ready.');
        return;
      }
      const lines = window.dialogues && window.dialogues[dialogueId];
      if (!lines || !lines.length) return;
      const clickedBtn = document.getElementById(`btn-full${dialogueId}`);
      if (ttsUiState.isFullSpeaking && ttsUiState.currentFullDialogueId === dialogueId) {
        window.stopFullDialogueAction();
        return;
      }
      window.stopFullDialogueAction();
      ttsUiState.isFullSpeaking = true;
      ttsUiState.currentFullDialogueId = dialogueId;
      if (clickedBtn) clickedBtn.textContent = '⏹ 停止播放';

      function onFullEnd() {
        if (ttsUiState.currentFullDialogueId === dialogueId) {
          ttsUiState.isFullSpeaking = false;
          ttsUiState.currentFullDialogueId = null;
          if (clickedBtn) clickedBtn.textContent = '▶ 朗读整段对话';
        }
      }
      function fallbackTTS() {
        window.SfiCore.tts.speak(lines.join(' '), onFullEnd);
      }

      // 优先用 mp3 顺序播放，降级到 TTS
      if (!window.SfiCore.audio) { fallbackTTS(); return; }
      window.SfiCore.manifest.ensure(function () {
        // lines 是对话文本数组；对每行用 dialogue_line_group 匹配 contentId
        // 需要从 window.dialogueContentIds[dialogueId] 取 contentId 列表
        // 若页面未提供则降级 TTS
        const cidList = window.dialogueContentIds && window.dialogueContentIds[dialogueId];
        if (!cidList || !cidList.length) { fallbackTTS(); return; }

        const allPaths = [];
        for (const cid of cidList) {
          const item = window.SfiCore.manifest.lookupByContentId(cid);
          if (!item) { fallbackTTS(); return; }
          if (item.audioRefs && item.audioRefs.length) {
            const paths = item.audioRefs.map(id => window.SfiCore.manifest.getFilePath(id)).filter(Boolean);
            if (!paths.length) { fallbackTTS(); return; }
            allPaths.push(...paths);
          } else if (item.audioRef) {
            const path = window.SfiCore.manifest.getFilePath(item.audioRef);
            if (!path) { fallbackTTS(); return; }
            allPaths.push(path);
          } else {
            fallbackTTS(); return;
          }
        }
        window.SfiCore.audio.playSequence(allPaths, onFullEnd, fallbackTTS);
      });
    };
  }

  const _origSpeak = window.speechSynthesis.speak;
  window.speechSynthesis.speak = function (utterance) {
    if (utterance instanceof SpeechSynthesisUtterance) {
      utterance.rate = window.SfiCore.state.ttsRate;
    }
    return _origSpeak.call(window.speechSynthesis, utterance);
  };

  window.setSound = function (value, triggerEl) {
    if (!window.SfiCore || !window.SfiCore.state) return false;

    let targetState;
    if (value === 'on') targetState = true;
    else if (value === 'off') targetState = false;
    else if (typeof value === 'boolean') targetState = value;
    else targetState = !window.SfiCore.state.isSoundOn;

    window.SfiCore.state.isSoundOn = targetState;

    const soundButtons = document.querySelectorAll('[onclick*="setSound"]');
    soundButtons.forEach(btn => {
      const onClickAttr = btn.getAttribute('onclick') || '';

      const isOnBtn =
        onClickAttr.includes("'on'") ||
        onClickAttr.includes('"on"') ||
        onClickAttr.includes('true');

      const isOffBtn =
        onClickAttr.includes("'off'") ||
        onClickAttr.includes('"off"') ||
        onClickAttr.includes('false');

      if (isOnBtn) {
        btn.classList.toggle('active-sound', targetState);
        btn.style.opacity = targetState ? '1' : '0.5';
      } else if (isOffBtn) {
        btn.classList.toggle('active-sound', !targetState);
        btn.style.opacity = !targetState ? '1' : '0.5';
      }
    });

    console.log('[SfiCore] 声音已切换为:', targetState ? '开启' : '关闭');

    if (targetState) {
      window.SfiCore.sfx.correct();
    }

    return targetState;
  };

  function initCommonUI() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    if (!document.body.classList.contains('is-home') && !document.querySelector('.tb-home, .nav-home-btn')) {
      window.SfiCore.ui.inject('nav', `
        <a href="index.html" class="tb-home nav-home-btn" title="返回首页">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </a>
      `);
    }

    // Only inject once (guard against double-injection)
    let menu = null;
    if (!document.getElementById('sfiSpeedCtrl')) {
      const speedHtml = `
        <div class="nav-speed-ctrl nav-speed-wrap" id="sfiSpeedCtrl">
          <button class="nav-speed-btn" id="speedBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span class="speed-val">${window.SfiCore.state.ttsRate}×</span>
          </button>
          <div class="speed-dropdown" id="speedMenu">
            ${RATES.map(r => `<div class="speed-opt${r.v === window.SfiCore.state.ttsRate ? ' active' : ''}" data-v="${r.v}">${r.label}</div>`).join('')}
          </div>
        </div>
      `;
      window.SfiCore.ui.inject('nav', speedHtml, 'beforeend');

      const btn = document.getElementById('speedBtn');
      menu = document.getElementById('speedMenu');
      if (btn && menu) {
        btn.onclick = (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        };
        menu.querySelectorAll('.speed-opt').forEach(opt => {
          opt.onclick = function () {
            const val = parseFloat(this.dataset.v);
            window.SfiCore.tts.setRate(val);
            const valDisplay = document.querySelector('.speed-val');
            if (valDisplay) valDisplay.textContent = val + '×';
            // Update active highlight in dropdown
            menu.querySelectorAll('.speed-opt').forEach(o => o.classList.toggle('active', parseFloat(o.dataset.v) === val));
            menu.style.display = 'none';
          };
        });
      }
    }

    document.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
    });

    if (window.SfiCore && window.SfiCore.ui && typeof window.SfiCore.ui.initNav === 'function') {
      window.SfiCore.ui.initNav();
    }

    injectSectionNextButtons();
  }

  function injectSectionNextButtons() {
    const steps = [
      { from: 'grammar', to: 'vocab', label: '下一节：词汇表 →' },
      { from: 'vocab', to: 'dialogue', label: '下一节：对话练习 →' },
      { from: 'dialogue', to: 'quiz', label: '下一节：单元测验 →' }
    ];

    if (!steps.every(step => document.getElementById(step.from)) || !document.getElementById('quiz')) {
      return;
    }

    injectSectionNextStyles();

    steps.forEach(step => {
      const section = document.getElementById(step.from);
      if (!section || section.querySelector('.section-footer')) return;

      const footer = document.createElement('div');
      footer.className = 'section-footer sfi-auto-section-footer';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sec-next-btn';
      button.textContent = step.label;
      button.addEventListener('click', function () {
        window.SfiCore.ui.goToSection(step.to);
      });

      footer.appendChild(button);
      section.appendChild(footer);
    });
  }

  function injectSectionNextStyles() {
    if (document.getElementById('sfi-section-next-styles')) return;

    const style = document.createElement('style');
    style.id = 'sfi-section-next-styles';
    style.textContent = `
      .section-footer {
        margin: 1.6rem 0 0;
        display: flex;
        justify-content: center;
      }

      .sec-next-btn {
        border: none;
        border-radius: 999px;
        padding: .72rem 1.35rem;
        background: var(--ac, #315f8c);
        color: #fff;
        font-family: 'Noto Sans SC', sans-serif;
        font-size: .88rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 6px 16px rgba(0,0,0,.12);
        transition: transform .16s ease, box-shadow .16s ease, opacity .16s ease;
      }

      .sec-next-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(0,0,0,.16);
      }

      .sec-next-btn:active {
        transform: translateY(0);
        opacity: .9;
      }
    `;
    document.head.appendChild(style);
  }

  function injectPracticeFeedbackStyles() {
    if (document.getElementById('sfi-practice-feedback-styles')) return;

    const style = document.createElement('style');
    style.id = 'sfi-practice-feedback-styles';
    style.textContent = `
      .is-correct,
      input.is-correct {
        border-color: #28a745 !important;
        background-color: rgba(40, 167, 69, 0.1) !important;
      }

      .warn-yellow,
      input.warn-yellow {
        border-color: #ffc107 !important;
        background-color: rgba(255, 193, 7, 0.1) !important;
        box-shadow: 0 0 8px rgba(255, 193, 7, 0.4);
        transition: all 0.3s ease;
      }

      .is-error,
      input.is-error {
        border-color: #dc3545 !important;
        background-color: rgba(220, 53, 69, 0.1) !important;
      }

      [data-role="feedback"].is-perfect { color: #28a745; }
      [data-role="feedback"].is-warn { color: #d39e00; font-weight: bold; }
      [data-role="feedback"].is-error { color: #dc3545; }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('keydown', function (e) {
    const t = e.target;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) {
      if (e.key === 'Backspace') window.SfiCore.sfx.delete();
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) window.SfiCore.sfx.key();
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonUI);
  } else {
    initCommonUI();
  }

  injectPracticeFeedbackStyles();

})();
