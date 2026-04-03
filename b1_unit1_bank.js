window.UNIT_BANK_B1 = {
  unit: 'b1',
  unitTitle: '工作、语言与社会',
  // 基础模式：全量入库；后续由练习页按规则随机抽题
  basicPool: [
    // ===== 单词题 =====
    { id: 'b1_vocab_foralder', kind: 'vocab_spelling', concept: 'foralder', lemma: 'förälder', source: 'vocab', prompt: { zh: '家长 / 父母（名词，单数）' }, answer: 'en förälder' },
    { id: 'b1_vocab_nyckel', kind: 'vocab_spelling', concept: 'nyckel', lemma: 'nyckel', source: 'vocab', prompt: { zh: '钥匙（名词，单数）' }, answer: 'en nyckel' },
    { id: 'b1_vocab_telefon', kind: 'vocab_spelling', concept: 'telefon', lemma: 'telefon', source: 'vocab', prompt: { zh: '电话（名词，单数）' }, answer: 'en telefon' },
    { id: 'b1_vocab_stad', kind: 'vocab_spelling', concept: 'stad', lemma: 'stad', source: 'vocab', prompt: { zh: '城市（名词，单数）' }, answer: 'en stad' },
    { id: 'b1_vocab_buss', kind: 'vocab_spelling', concept: 'buss', lemma: 'buss', source: 'vocab', prompt: { zh: '公交车（名词，单数）' }, answer: 'en buss' },
    { id: 'b1_vocab_kontor', kind: 'vocab_spelling', concept: 'kontor', lemma: 'kontor', source: 'vocab', prompt: { zh: '办公室（名词，单数）' }, answer: 'ett kontor' },
    { id: 'b1_vocab_jobb', kind: 'vocab_spelling', concept: 'jobb', lemma: 'jobb', source: 'vocab', prompt: { zh: '工作（名词，单数）' }, answer: 'ett jobb' },
    { id: 'b1_vocab_land', kind: 'vocab_spelling', concept: 'land', lemma: 'land', source: 'vocab', prompt: { zh: '国家（名词，单数）' }, answer: 'ett land' },
    { id: 'b1_vocab_sprak', kind: 'vocab_spelling', concept: 'sprak', lemma: 'språk', source: 'vocab', prompt: { zh: '语言（名词，单数）' }, answer: 'ett språk' },
    { id: 'b1_vocab_vecka', kind: 'vocab_spelling', concept: 'vecka', lemma: 'vecka', source: 'vocab', prompt: { zh: '周（名词，单数）' }, answer: 'en vecka' },
    { id: 'b1_vocab_tid', kind: 'vocab_spelling', concept: 'tid', lemma: 'tid', source: 'vocab', prompt: { zh: '时间（名词，单数）' }, answer: 'en tid' },
    // ===== 固定表达题 =====
    { id: 'b1_phrase_en_nyckel', kind: 'phrase_fill', concept: 'en_nyckel', lemma: 'en nyckel', source: 'phrase', prompt: { zh: '钥匙是 en 还是 ett？' }, template: '{{en}} nyckel' },
    { id: 'b1_phrase_en_telefon', kind: 'phrase_fill', concept: 'en_telefon', lemma: 'en telefon', source: 'phrase', prompt: { zh: '电话是 en 还是 ett？' }, template: '{{en}} telefon' },
    { id: 'b1_phrase_en_buss', kind: 'phrase_fill', concept: 'en_buss', lemma: 'en buss', source: 'phrase', prompt: { zh: '公交车是 en 还是 ett？' }, template: '{{en}} buss' },
    { id: 'b1_phrase_ett_kontor', kind: 'phrase_fill', concept: 'ett_kontor', lemma: 'ett kontor', source: 'phrase', prompt: { zh: '办公室是 en 还是 ett？' }, template: '{{ett}} kontor' },
    { id: 'b1_phrase_ett_jobb', kind: 'phrase_fill', concept: 'ett_jobb', lemma: 'ett jobb', source: 'phrase', prompt: { zh: '工作是 en 还是 ett？' }, template: '{{ett}} jobb' },
    { id: 'b1_phrase_ett_sprak', kind: 'phrase_fill', concept: 'ett_sprak', lemma: 'ett språk', source: 'phrase', prompt: { zh: '语言是 en 还是 ett？' }, template: '{{ett}} språk' },
    { id: 'b1_phrase_en_vecka', kind: 'phrase_fill', concept: 'en_vecka', lemma: 'en vecka', source: 'phrase', prompt: { zh: '周是 en 还是 ett？' }, template: '{{en}} vecka' },
    { id: 'b1_phrase_han_arbetar_pa_ett_kontor', kind: 'phrase_fill', concept: 'han_arbetar_pa_ett_kontor', lemma: 'han arbetar på ett kontor', source: 'phrase', prompt: { zh: '他在办公室工作。' }, template: 'Han arbetar på ett {{kontor}}.' },
    { id: 'b1_phrase_jobbet_ar_bra', kind: 'phrase_fill', concept: 'jobbet_ar_bra', lemma: 'jobbet är bra', source: 'phrase', prompt: { zh: '这份工作很好。' }, template: '{{Jobbet}} är bra.' },
    { id: 'b1_phrase_vilket_sprak_talar_du', kind: 'phrase_fill', concept: 'vilket_sprak_talar_du', lemma: 'vilket språk talar du', source: 'phrase', prompt: { zh: '你会说哪种语言？' }, template: 'Vilket {{språk}} talar du?' },
    { id: 'b1_phrase_har_du_en_nyckel', kind: 'phrase_fill', concept: 'har_du_en_nyckel', lemma: 'har du en nyckel', source: 'phrase', prompt: { zh: '你有钥匙（单数不定式）吗？' }, template: 'Har du en {{nyckel}}?' },
    { id: 'b1_phrase_ja_jag_har_nyckeln', kind: 'phrase_fill', concept: 'ja_jag_har_nyckeln', lemma: 'ja jag har nyckeln', source: 'phrase', prompt: { zh: '是的，我有那把钥匙（单数定式）。' }, template: 'Ja, jag har {{nyckeln}}.' },
    // ===== 对话句题 =====
    { id: 'b1_dialog_vad_jobbar_din_familj_med', kind: 'dialog_fill', concept: 'vad_jobbar_din_familj_med', lemma: 'vad jobbar din familj med', source: 'dialog', prompt: { zh: '你的家人是做什么工作的？' }, template: 'Vad {{jobbar}} din familj {{med}}?' },
    { id: 'b1_dialog_jobbet_ar_bra_men_staden_ar_stor', kind: 'dialog_fill', concept: 'jobbet_ar_bra_men_staden_ar_stor', lemma: 'jobbet är bra men staden är stor och bussen tar lång tid', source: 'dialog', prompt: { zh: '这份工作很好，但是城市很大，公交车花很长时间。' }, template: '{{Jobbet}} är bra men {{staden}} är stor och {{bussen}} tar lång {{tid}}.' },
    { id: 'b1_dialog_hon_talar_ett_sprak_hemma', kind: 'dialog_fill', concept: 'hon_talar_ett_sprak_hemma', lemma: 'hon talar ett språk hemma och ett annat på jobbet', source: 'dialog', prompt: { zh: '她在家说一种语言，在工作中说另一种语言。' }, template: 'Hon talar ett {{språk}} hemma och ett annat på {{jobbet}}.' },
    { id: 'b1_dialog_telefonen_ligger_pa_bordet', kind: 'dialog_fill', concept: 'telefonen_ligger_pa_bordet', lemma: 'telefonen ligger på bordet', source: 'dialog', prompt: { zh: '那部电话在桌子上。' }, template: '{{Telefonen}} ligger på bordet.' }
  ],
  // 进阶模式：固定专项题，不随机
  advancedPool: [
    // ===== 名词变形 =====
    {
      id: 'b1_noun_foralder',
      kind: 'morphology',
      lemma: 'förälder',
      labelScheme: 'noun_forms',
      prompt: { zh: '家长 / 父母' },
      template: '{{en förälder}} {{föräldern}} {{föräldrar}} {{föräldrarna}}'
    },
    {
      id: 'b1_noun_nyckel',
      kind: 'morphology',
      lemma: 'nyckel',
      labelScheme: 'noun_forms',
      prompt: { zh: '钥匙' },
      template: '{{en nyckel}} {{nyckeln}} {{nycklar}} {{nycklarna}}'
    },
    {
      id: 'b1_noun_telefon',
      kind: 'morphology',
      lemma: 'telefon',
      labelScheme: 'noun_forms',
      prompt: { zh: '电话' },
      template: '{{en telefon}} {{telefonen}} {{telefoner}} {{telefonerna}}'
    },
    {
      id: 'b1_noun_stad',
      kind: 'morphology',
      lemma: 'stad',
      labelScheme: 'noun_forms',
      prompt: { zh: '城市' },
      template: '{{en stad}} {{staden}} {{städer}} {{städerna}}'
    },
    {
      id: 'b1_noun_buss',
      kind: 'morphology',
      lemma: 'buss',
      labelScheme: 'noun_forms',
      prompt: { zh: '公交车' },
      template: '{{en buss}} {{bussen}} {{bussar}} {{bussarna}}'
    },
    {
      id: 'b1_noun_vecka',
      kind: 'morphology',
      lemma: 'vecka',
      labelScheme: 'noun_forms',
      prompt: { zh: '周' },
      template: '{{en vecka}} {{veckan}} {{veckor}} {{veckorna}}'
    },
    {
      id: 'b1_noun_tid',
      kind: 'morphology',
      lemma: 'tid',
      labelScheme: 'noun_forms',
      prompt: { zh: '时间' },
      template: '{{en tid}} {{tiden}} {{tider}} {{tiderna}}'
    },
    {
      id: 'b1_noun_kontor',
      kind: 'morphology',
      lemma: 'kontor',
      labelScheme: 'noun_forms',
      prompt: { zh: '办公室' },
      template: '{{ett kontor}} {{kontoret}} {{kontor}} {{kontoren}}'
    },
    {
      id: 'b1_noun_jobb',
      kind: 'morphology',
      lemma: 'jobb',
      labelScheme: 'noun_forms',
      prompt: { zh: '工作' },
      template: '{{ett jobb}} {{jobbet}} {{jobb}} {{jobben}}'
    },
    {
      id: 'b1_noun_sprak',
      kind: 'morphology',
      lemma: 'språk',
      labelScheme: 'noun_forms',
      prompt: { zh: '语言' },
      template: '{{ett språk}} {{språket}} {{språk}} {{språken}}'
    },
    {
      id: 'b1_noun_land',
      kind: 'morphology',
      lemma: 'land',
      labelScheme: 'noun_forms',
      prompt: { zh: '国家' },
      template: '{{ett land}} {{landet}} {{länder}} {{länderna}}'
    },
    // ===== 结构专项 =====
    { id: 'b1_struct_en_buss_bussen', kind: 'morphology', source: 'pattern', lemma: 'en buss bussen', prompt: { zh: '公交车（单数不定式 → 单数定式）' }, template: '{{en}} buss → buss{{en}}' },
    { id: 'b1_struct_ett_jobb_jobbet', kind: 'morphology', source: 'pattern', lemma: 'ett jobb jobbet', prompt: { zh: '工作（单数不定式 → 单数定式）' }, template: '{{ett jobb}} → {{jobbet}}' },
    { id: 'b1_struct_en_telefon_telefonen', kind: 'morphology', source: 'pattern', lemma: 'en telefon telefonen', prompt: { zh: '电话（单数不定式 → 单数定式）' }, template: '{{en}} telefon → telefon{{en}}' },
    { id: 'b1_struct_ett_kontor_kontoret', kind: 'morphology', source: 'pattern', lemma: 'ett kontor kontoret', prompt: { zh: '办公室（单数不定式 → 单数定式）' }, template: '{{ett kontor}} → {{kontoret}}' }
  ]
};
