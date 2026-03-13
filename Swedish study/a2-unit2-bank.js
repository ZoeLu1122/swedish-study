window.UNIT_BANK_A2 = {
  unit: 'a2',
  unitTitle: '数字、时间与日期',

  // 基础模式：全量入库；后续由练习页按规则随机抽题
  basicPool: [
    // ===== 单词题 =====
    { id: 'a2_vocab_elva', kind: 'vocab_spelling', concept: 'elva', lemma: 'elva', source: 'vocab', prompt: { zh: '十一' }, answer: 'elva' },
    { id: 'a2_vocab_tolv', kind: 'vocab_spelling', concept: 'tolv', lemma: 'tolv', source: 'vocab', prompt: { zh: '十二' }, answer: 'tolv' },
    { id: 'a2_vocab_tretton', kind: 'vocab_spelling', concept: 'tretton', lemma: 'tretton', source: 'vocab', prompt: { zh: '十三' }, answer: 'tretton' },
    { id: 'a2_vocab_fjorton', kind: 'vocab_spelling', concept: 'fjorton', lemma: 'fjorton', source: 'vocab', prompt: { zh: '十四' }, answer: 'fjorton' },
    { id: 'a2_vocab_femton', kind: 'vocab_spelling', concept: 'femton', lemma: 'femton', source: 'vocab', prompt: { zh: '十五' }, answer: 'femton' },
    { id: 'a2_vocab_tjugo', kind: 'vocab_spelling', concept: 'tjugo', lemma: 'tjugo', source: 'vocab', prompt: { zh: '二十' }, answer: 'tjugo' },
    { id: 'a2_vocab_trettio', kind: 'vocab_spelling', concept: 'trettio', lemma: 'trettio', source: 'vocab', prompt: { zh: '三十' }, answer: 'trettio' },
    { id: 'a2_vocab_fyrtio', kind: 'vocab_spelling', concept: 'fyrtio', lemma: 'fyrtio', source: 'vocab', prompt: { zh: '四十' }, answer: 'fyrtio' },
    { id: 'a2_vocab_femtio', kind: 'vocab_spelling', concept: 'femtio', lemma: 'femtio', source: 'vocab', prompt: { zh: '五十' }, answer: 'femtio' },
    { id: 'a2_vocab_sextio', kind: 'vocab_spelling', concept: 'sextio', lemma: 'sextio', source: 'vocab', prompt: { zh: '六十' }, answer: 'sextio' },
    { id: 'a2_vocab_sjuttio', kind: 'vocab_spelling', concept: 'sjuttio', lemma: 'sjuttio', source: 'vocab', prompt: { zh: '七十' }, answer: 'sjuttio' },
    { id: 'a2_vocab_attio', kind: 'vocab_spelling', concept: 'attio', lemma: 'åttio', source: 'vocab', prompt: { zh: '八十' }, answer: 'åttio' },
    { id: 'a2_vocab_nittio', kind: 'vocab_spelling', concept: 'nittio', lemma: 'nittio', source: 'vocab', prompt: { zh: '九十' }, answer: 'nittio' },
    { id: 'a2_vocab_hundra', kind: 'vocab_spelling', concept: 'hundra', lemma: 'hundra', source: 'vocab', prompt: { zh: '一百' }, answer: 'hundra' },
    { id: 'a2_vocab_tjugofem', kind: 'vocab_spelling', concept: 'tjugofem', lemma: 'tjugofem', source: 'vocab', prompt: { zh: '二十五' }, answer: 'tjugofem' },
    { id: 'a2_vocab_trettiofem', kind: 'vocab_spelling', concept: 'trettiofem', lemma: 'trettiofem', source: 'vocab', prompt: { zh: '三十五' }, answer: 'trettiofem' },

    { id: 'a2_vocab_klockan', kind: 'vocab_spelling', concept: 'klockan', lemma: 'klockan', source: 'vocab', prompt: { zh: '钟；几点' }, answer: 'klockan' },
    { id: 'a2_vocab_timme', kind: 'vocab_spelling', concept: 'timme', lemma: 'timme', source: 'vocab', prompt: { zh: '小时' }, answer: 'timme' },
    { id: 'a2_vocab_minut', kind: 'vocab_spelling', concept: 'minut', lemma: 'minut', source: 'vocab', prompt: { zh: '分钟' }, answer: 'minut' },
    { id: 'a2_vocab_kvart', kind: 'vocab_spelling', concept: 'kvart', lemma: 'kvart', source: 'vocab', prompt: { zh: '一刻钟' }, answer: 'kvart' },
    { id: 'a2_vocab_halv', kind: 'vocab_spelling', concept: 'halv', lemma: 'halv', source: 'vocab', prompt: { zh: '半' }, answer: 'halv' },
    { id: 'a2_vocab_formiddag', kind: 'vocab_spelling', concept: 'formiddag', lemma: 'förmiddag', source: 'vocab', prompt: { zh: '上午' }, answer: 'förmiddag' },
    { id: 'a2_vocab_eftermiddag', kind: 'vocab_spelling', concept: 'eftermiddag', lemma: 'eftermiddag', source: 'vocab', prompt: { zh: '下午' }, answer: 'eftermiddag' },

    { id: 'a2_vocab_mandag', kind: 'vocab_spelling', concept: 'mandag', lemma: 'måndag', source: 'vocab', prompt: { zh: '星期一' }, answer: 'måndag' },
    { id: 'a2_vocab_tisdag', kind: 'vocab_spelling', concept: 'tisdag', lemma: 'tisdag', source: 'vocab', prompt: { zh: '星期二' }, answer: 'tisdag' },
    { id: 'a2_vocab_onsdag', kind: 'vocab_spelling', concept: 'onsdag', lemma: 'onsdag', source: 'vocab', prompt: { zh: '星期三' }, answer: 'onsdag' },
    { id: 'a2_vocab_torsdag', kind: 'vocab_spelling', concept: 'torsdag', lemma: 'torsdag', source: 'vocab', prompt: { zh: '星期四' }, answer: 'torsdag' },
    { id: 'a2_vocab_fredag', kind: 'vocab_spelling', concept: 'fredag', lemma: 'fredag', source: 'vocab', prompt: { zh: '星期五' }, answer: 'fredag' },
    { id: 'a2_vocab_lordag', kind: 'vocab_spelling', concept: 'lordag', lemma: 'lördag', source: 'vocab', prompt: { zh: '星期六' }, answer: 'lördag' },
    { id: 'a2_vocab_sondag', kind: 'vocab_spelling', concept: 'sondag', lemma: 'söndag', source: 'vocab', prompt: { zh: '星期日' }, answer: 'söndag' },

    { id: 'a2_vocab_januari', kind: 'vocab_spelling', concept: 'januari', lemma: 'januari', source: 'vocab', prompt: { zh: '一月' }, answer: 'januari' },
    { id: 'a2_vocab_februari', kind: 'vocab_spelling', concept: 'februari', lemma: 'februari', source: 'vocab', prompt: { zh: '二月' }, answer: 'februari' },
    { id: 'a2_vocab_mars', kind: 'vocab_spelling', concept: 'mars', lemma: 'mars', source: 'vocab', prompt: { zh: '三月' }, answer: 'mars' },
    { id: 'a2_vocab_april', kind: 'vocab_spelling', concept: 'april', lemma: 'april', source: 'vocab', prompt: { zh: '四月' }, answer: 'april' },
    { id: 'a2_vocab_maj', kind: 'vocab_spelling', concept: 'maj', lemma: 'maj', source: 'vocab', prompt: { zh: '五月' }, answer: 'maj' },
    { id: 'a2_vocab_juni', kind: 'vocab_spelling', concept: 'juni', lemma: 'juni', source: 'vocab', prompt: { zh: '六月' }, answer: 'juni' },
    { id: 'a2_vocab_juli', kind: 'vocab_spelling', concept: 'juli', lemma: 'juli', source: 'vocab', prompt: { zh: '七月' }, answer: 'juli' },
    { id: 'a2_vocab_augusti', kind: 'vocab_spelling', concept: 'augusti', lemma: 'augusti', source: 'vocab', prompt: { zh: '八月' }, answer: 'augusti' },
    { id: 'a2_vocab_september', kind: 'vocab_spelling', concept: 'september', lemma: 'september', source: 'vocab', prompt: { zh: '九月' }, answer: 'september' },
    { id: 'a2_vocab_oktober', kind: 'vocab_spelling', concept: 'oktober', lemma: 'oktober', source: 'vocab', prompt: { zh: '十月' }, answer: 'oktober' },
    { id: 'a2_vocab_november', kind: 'vocab_spelling', concept: 'november', lemma: 'november', source: 'vocab', prompt: { zh: '十一月' }, answer: 'november' },
    { id: 'a2_vocab_december', kind: 'vocab_spelling', concept: 'december', lemma: 'december', source: 'vocab', prompt: { zh: '十二月' }, answer: 'december' },

    // ===== 固定表达题 =====
    { id: 'a2_phrase_vad_ar_klockan', kind: 'phrase_fill', concept: 'vad_ar_klockan', lemma: 'vad är klockan', source: 'phrase', prompt: { zh: '几点了？' }, template: '{{Vad}} {{är}} {{klockan}}?' },
    { id: 'a2_phrase_klockan_ar_tre', kind: 'phrase_fill', concept: 'klockan_ar_tre', lemma: 'klockan är tre', source: 'phrase', prompt: { zh: '现在三点。' }, template: 'Klockan {{är}} {{tre}}.' },
    { id: 'a2_phrase_kvart_over_tre', kind: 'phrase_fill', concept: 'kvart_over_tre', lemma: 'kvart över tre', source: 'phrase', prompt: { zh: '三点一刻。' }, template: '{{Kvart}} {{över}} {{tre}}.' },
    { id: 'a2_phrase_halv_fyra', kind: 'phrase_fill', concept: 'halv_fyra', lemma: 'halv fyra', source: 'phrase', prompt: { zh: '三点半。' }, template: '{{Halv}} {{fyra}}.' },
    { id: 'a2_phrase_kvart_i_fyra', kind: 'phrase_fill', concept: 'kvart_i_fyra', lemma: 'kvart i fyra', source: 'phrase', prompt: { zh: '差一刻四点。' }, template: '{{Kvart}} {{i}} {{fyra}}.' },
    { id: 'a2_phrase_vi_ses_pa_tisdag', kind: 'phrase_fill', concept: 'vi_ses_pa_tisdag', lemma: 'vi ses på tisdag', source: 'phrase', prompt: { zh: '星期二见。' }, template: '{{Vi}} {{ses}} {{på}} {{tisdag}}.' },
    { id: 'a2_phrase_i_januari', kind: 'phrase_fill', concept: 'i_januari', lemma: 'i januari', source: 'phrase', prompt: { zh: '在一月。' }, template: '{{i}} {{januari}}' }
  ],

  // 进阶模式：本单元做“时间结构 + 场景对话”，不做名词/动词/形容词变形
  advancedPool: [
    // 时间结构专项
    {
      id: 'a2_time_kvart_over_tre',
      kind: 'morphology',
      source: 'time_pattern',
      lemma: 'kvart över tre',
      prompt: { zh: '三点一刻。' },
      template: '{{kvart}} {{över}} {{tre}}'
    },
    {
      id: 'a2_time_halv_fyra',
      kind: 'morphology',
      source: 'time_pattern',
      lemma: 'halv fyra',
      prompt: { zh: '三点半。' },
      template: '{{halv}} {{fyra}}'
    },
    {
      id: 'a2_time_kvart_i_fyra',
      kind: 'morphology',
      source: 'time_pattern',
      lemma: 'kvart i fyra',
      prompt: { zh: '差一刻四点。' },
      template: '{{kvart}} {{i}} {{fyra}}'
    },
    {
      id: 'a2_time_klockan_tio',
      kind: 'morphology',
      source: 'time_pattern',
      lemma: 'klockan tio',
      prompt: { zh: '十点。' },
      template: '{{klockan}} {{tio}}'
    },

    // 对话句题
    {
      id: 'a2_dialog_ursakta_vad_ar_klockan',
      kind: 'dialog_fill',
      concept: 'vad_ar_klockan',
      lemma: 'vad är klockan',
      source: 'dialog',
      prompt: { zh: '打扰一下！现在几点？' },
      template: 'Ursäkta! Vad {{är}} {{klockan}}?'
    },
    {
      id: 'a2_dialog_klockan_ar_kvart_i_nio',
      kind: 'dialog_fill',
      concept: 'kvart_i_nio',
      lemma: 'klockan är kvart i nio',
      source: 'dialog',
      prompt: { zh: '现在差一刻九点。' },
      template: 'Klockan är {{kvart}} {{i}} {{nio}}.'
    },
    {
      id: 'a2_dialog_nasta_buss_gar',
      kind: 'dialog_fill',
      concept: 'nasta_buss_gar',
      lemma: 'nästa buss går klockan nio',
      source: 'dialog',
      prompt: { zh: '谢谢！下一班公交九点发车，对吗？' },
      template: 'Tack! {{Nästa}} buss {{går}} klockan nio, eller?'
    },
    {
      id: 'a2_dialog_halv_tio',
      kind: 'dialog_fill',
      concept: 'halv_tio',
      lemma: 'halv tio',
      source: 'dialog',
      prompt: { zh: '对，九点，然后九点半。' },
      template: 'Ja, klockan nio och sedan {{halv}} {{tio}}.'
    },
    {
      id: 'a2_dialog_boka_tid',
      kind: 'dialog_fill',
      concept: 'boka_tid',
      lemma: 'boka en tid',
      source: 'dialog',
      prompt: { zh: '我想预约一个时间，谢谢。' },
      template: 'Hej! Jag vill {{boka}} en {{tid}}, tack.'
    },
    {
      id: 'a2_dialog_vilken_dag_passar',
      kind: 'dialog_fill',
      concept: 'vilken_dag_passar',
      lemma: 'vilken dag passar dig',
      source: 'dialog',
      prompt: { zh: '哪一天适合你？' },
      template: '{{Vilken}} {{dag}} {{passar}} dig?'
    },
    {
      id: 'a2_dialog_ar_tisdag_bra',
      kind: 'dialog_fill',
      concept: 'ar_tisdag_bra',
      lemma: 'är tisdag bra',
      source: 'dialog',
      prompt: { zh: '星期二可以吗？' },
      template: 'Är {{tisdag}} bra?'
    }
  ]
};
