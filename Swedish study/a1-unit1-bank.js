window.UNIT_BANK_A1 = {
  unit: 'a1',
  unitTitle: '基础问候与自我介绍',

  // 基础模式：全量入库；后续由练习页按规则随机抽 20 题
  basicPool: [
    // ===== 单词题 =====
    { id: 'a1_vocab_namn', kind: 'vocab_spelling', concept: 'namn', lemma: 'namn', source: 'vocab', prompt: { zh: '名字' }, answer: 'namn' },
    { id: 'a1_vocab_land', kind: 'vocab_spelling', concept: 'land', lemma: 'land', source: 'vocab', prompt: { zh: '国家' }, answer: 'land' },
    { id: 'a1_vocab_tack', kind: 'vocab_spelling', concept: 'tack', lemma: 'tack', source: 'vocab', prompt: { zh: '谢谢' }, answer: 'tack' },
    { id: 'a1_vocab_forlat', kind: 'vocab_spelling', concept: 'forlat', lemma: 'förlåt', source: 'vocab', prompt: { zh: '对不起' }, answer: 'förlåt' },
    { id: 'a1_vocab_ursakta', kind: 'vocab_spelling', concept: 'ursakta', lemma: 'ursäkta', source: 'vocab', prompt: { zh: '打扰一下 / 借过' }, answer: 'ursäkta' },
    { id: 'a1_vocab_ja', kind: 'vocab_spelling', concept: 'ja', lemma: 'ja', source: 'vocab', prompt: { zh: '是' }, answer: 'ja' },
    { id: 'a1_vocab_nej', kind: 'vocab_spelling', concept: 'nej', lemma: 'nej', source: 'vocab', prompt: { zh: '不' }, answer: 'nej' },
    { id: 'a1_vocab_bra', kind: 'vocab_spelling', concept: 'bra', lemma: 'bra', source: 'vocab', prompt: { zh: '好，很好' }, answer: 'bra' },
    { id: 'a1_vocab_halla', kind: 'vocab_spelling', concept: 'halla', lemma: 'hallå', source: 'vocab', prompt: { zh: '喂 / 你好' }, answer: 'hallå' },
    { id: 'a1_vocab_en_ett', kind: 'phrase_fill', concept: 'en_ett', lemma: 'en ett', source: 'vocab', prompt: { zh: '一（不定冠词：en / ett）' }, template: '{{en}} {{ett}}' },
    { id: 'a1_vocab_tva', kind: 'vocab_spelling', concept: 'tva', lemma: 'två', source: 'vocab', prompt: { zh: '二' }, answer: 'två' },
    { id: 'a1_vocab_tre', kind: 'vocab_spelling', concept: 'tre', lemma: 'tre', source: 'vocab', prompt: { zh: '三' }, answer: 'tre' },
    { id: 'a1_vocab_fyra', kind: 'vocab_spelling', concept: 'fyra', lemma: 'fyra', source: 'vocab', prompt: { zh: '四' }, answer: 'fyra' },
    { id: 'a1_vocab_fem', kind: 'vocab_spelling', concept: 'fem', lemma: 'fem', source: 'vocab', prompt: { zh: '五' }, answer: 'fem' },
    { id: 'a1_vocab_sex', kind: 'vocab_spelling', concept: 'sex', lemma: 'sex', source: 'vocab', prompt: { zh: '六' }, answer: 'sex' },
    { id: 'a1_vocab_sju', kind: 'vocab_spelling', concept: 'sju', lemma: 'sju', source: 'vocab', prompt: { zh: '七' }, answer: 'sju' },
    { id: 'a1_vocab_atta', kind: 'vocab_spelling', concept: 'atta', lemma: 'åtta', source: 'vocab', prompt: { zh: '八' }, answer: 'åtta' },
    { id: 'a1_vocab_nio', kind: 'vocab_spelling', concept: 'nio', lemma: 'nio', source: 'vocab', prompt: { zh: '九' }, answer: 'nio' },
    { id: 'a1_vocab_tio', kind: 'vocab_spelling', concept: 'tio', lemma: 'tio', source: 'vocab', prompt: { zh: '十' }, answer: 'tio' },

    // ===== 固定表达题 =====
    { id: 'a1_phrase_hej', kind: 'phrase_fill', concept: 'hej', lemma: 'hej', source: 'phrase', prompt: { zh: '你好' }, template: '{{Hej}}' },
    { id: 'a1_phrase_hej_da', kind: 'phrase_fill', concept: 'hej_da', lemma: 'hej då', source: 'phrase', prompt: { zh: '再见' }, template: '{{Hej}} {{då}}' },
    { id: 'a1_phrase_god_morgon', kind: 'phrase_fill', concept: 'god_morgon', lemma: 'god morgon', source: 'phrase', prompt: { zh: '早上好' }, template: 'God {{morgon}}' },
    { id: 'a1_phrase_god_dag', kind: 'phrase_fill', concept: 'god_dag', lemma: 'god dag', source: 'phrase', prompt: { zh: '日安' }, template: 'God {{dag}}' },
    { id: 'a1_phrase_god_kvall', kind: 'phrase_fill', concept: 'god_kvall', lemma: 'god kväll', source: 'phrase', prompt: { zh: '晚上好' }, template: 'God {{kväll}}' },
    { id: 'a1_phrase_god_natt', kind: 'phrase_fill', concept: 'god_natt', lemma: 'god natt', source: 'phrase', prompt: { zh: '晚安' }, template: 'God {{natt}}' },
    { id: 'a1_phrase_vi_ses', kind: 'phrase_fill', concept: 'vi_ses', lemma: 'vi ses', source: 'phrase', prompt: { zh: '再见 / 回头见' }, template: '{{Vi}} {{ses}}' },
    { id: 'a1_phrase_ha_det_bra', kind: 'phrase_fill', concept: 'ha_det_bra', lemma: 'ha det bra', source: 'phrase', prompt: { zh: '保重' }, template: '{{Ha}} {{det}} {{bra}}' },
    { id: 'a1_phrase_tack_sa_mycket', kind: 'phrase_fill', concept: 'tack_sa_mycket', lemma: 'tack så mycket', source: 'phrase', prompt: { zh: '非常感谢' }, template: '{{Tack}} {{så}} {{mycket}}' },
    { id: 'a1_phrase_var_ar_du_fran', kind: 'phrase_fill', concept: 'var_ar_du_fran', lemma: 'var är du från', source: 'phrase', prompt: { zh: '你来自哪里' }, template: '{{Var}} {{är}} {{du}} {{från}}' },

    // ===== 对话句题 =====
    { id: 'a1_dialog_heter_question', kind: 'dialog_fill', concept: 'vad_heter_du', lemma: 'vad heter du', source: 'dialog', prompt: { zh: '你好！我叫 Anna。你叫什么名字？' }, template: 'Hej! Jag heter Anna. {{Vad}} {{heter}} {{du}}?' },
    { id: 'a1_dialog_trevligt', kind: 'dialog_fill', concept: 'trevligt_att_traffas', lemma: 'trevligt att träffas', source: 'dialog', prompt: { zh: '你好！我叫 Wei。很高兴认识你！' }, template: 'Hej! Jag heter Wei. {{Trevligt}} {{att}} {{träffas}}!' },
    { id: 'a1_dialog_jag_ar_fran_kina', kind: 'dialog_fill', concept: 'jag_ar_fran_kina', lemma: 'jag är från kina', source: 'dialog', prompt: { zh: '我来自中国。你呢？' }, template: '{{Jag}} {{är}} {{från}} {{Kina}}. Och du?' },
    { id: 'a1_dialog_ar_student', kind: 'dialog_fill', concept: 'ar_student', lemma: 'är', source: 'dialog', prompt: { zh: '我明白了。我是学生。再见！' }, template: 'Jag förstår. Jag {{är}} student. Hej då!' },
    { id: 'a1_dialog_hur_mar_du', kind: 'dialog_fill', concept: 'hur_mar_du', lemma: 'hur mår du', source: 'dialog', prompt: { zh: '早上好！你好吗？' }, template: 'God morgon! {{Hur}} {{mår}} {{du}}?' },
    { id: 'a1_dialog_tva_kaffe', kind: 'dialog_fill', concept: 'tva', lemma: 'två', source: 'dialog', prompt: { zh: '也很好，谢谢！这是两杯咖啡，给你。' }, template: 'Också bra, tack! Det är {{två}} kaffe, varsågod.' },
    { id: 'a1_dialog_heter_anna_larsson', kind: 'dialog_fill', concept: 'heter_anna_larsson', lemma: 'heter', source: 'dialog', prompt: { zh: '我叫安娜·拉尔森。' }, template: 'Jag {{heter}} Anna Larsson.' }
  ],

  // 进阶模式：固定专项题，不随机
  advancedPool: [
    // 名词变形
    {
      id: 'a1_noun_namn',
      kind: 'morphology',
      lemma: 'namn',
      labelScheme: 'noun_forms',
      prompt: { zh: '名字' },
      template: '{{ett namn}} {{namnet}} {{namn}} {{namnen}}'
    },
    {
      id: 'a1_noun_land',
      kind: 'morphology',
      lemma: 'land',
      labelScheme: 'noun_forms',
      prompt: { zh: '国家' },
      template: '{{ett land}} {{landet}} {{länder}} {{länderna}}'
    },

    // 动词变形
    {
      id: 'a1_verb_heta',
      kind: 'morphology',
      lemma: 'heta',
      labelScheme: 'verb_forms',
      prompt: { zh: '叫做，名叫' },
      template: '{{heta}} {{heter}} {{hette}} {{hetat}}'
    },
    {
      id: 'a1_verb_vara',
      kind: 'morphology',
      lemma: 'vara',
      labelScheme: 'verb_forms',
      prompt: { zh: '是' },
      template: '{{vara}} {{är}} {{var}} {{varit}}'
    },

    // 形容词变形
    {
      id: 'a1_adj_bra',
      kind: 'morphology',
      lemma: 'bra',
      labelScheme: 'adjective_forms',
      prompt: { zh: '好' },
      template: '{{bra}} {{bättre}} {{bäst}}'
    }
  ]
};
