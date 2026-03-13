window.UNIT_BANK_A3 = {
  unit: 'a3',
  unitTitle: '家庭与住所',
  basicPool: [
    // ===== 单词题 =====
    { id: 'a3_vocab_mamma', kind: 'phrase_fill', concept: 'mamma', lemma: 'en mamma', source: 'vocab', prompt: { zh: '妈妈（名词，单数）' }, template: '{{en}} {{mamma}}' },
    { id: 'a3_vocab_pappa', kind: 'phrase_fill', concept: 'pappa', lemma: 'en pappa', source: 'vocab', prompt: { zh: '爸爸（名词，单数）' }, template: '{{en}} {{pappa}}' },
    { id: 'a3_vocab_bror', kind: 'phrase_fill', concept: 'bror', lemma: 'en bror', source: 'vocab', prompt: { zh: '兄弟（名词，单数）' }, template: '{{en}} {{bror}}' },
    { id: 'a3_vocab_familj', kind: 'phrase_fill', concept: 'familj', lemma: 'en familj', source: 'vocab', prompt: { zh: '家庭（名词，单数）' }, template: '{{en}} {{familj}}' },
    { id: 'a3_vocab_fru', kind: 'phrase_fill', concept: 'fru', lemma: 'en fru', source: 'vocab', prompt: { zh: '妻子（名词，单数）' }, template: '{{en}} {{fru}}' },
    { id: 'a3_vocab_son', kind: 'phrase_fill', concept: 'son', lemma: 'en son', source: 'vocab', prompt: { zh: '儿子（名词，单数）' }, template: '{{en}} {{son}}' },
    { id: 'a3_vocab_sovrum', kind: 'phrase_fill', concept: 'sovrum', lemma: 'ett sovrum', source: 'vocab', prompt: { zh: '卧室（名词，单数）' }, template: '{{ett}} {{sovrum}}' },
    { id: 'a3_vocab_vardagsrum', kind: 'phrase_fill', concept: 'vardagsrum', lemma: 'ett vardagsrum', source: 'vocab', prompt: { zh: '客厅（名词，单数）' }, template: '{{ett}} {{vardagsrum}}' },
    { id: 'a3_vocab_tradgard', kind: 'phrase_fill', concept: 'tradgard', lemma: 'en trädgård', source: 'vocab', prompt: { zh: '花园（名词，单数）' }, template: '{{en}} {{trädgård}}' },
    { id: 'a3_vocab_adress', kind: 'phrase_fill', concept: 'adress', lemma: 'en adress', source: 'vocab', prompt: { zh: '地址（名词，单数）' }, template: '{{en}} {{adress}}' },
    { id: 'a3_vocab_stada', kind: 'vocab_spelling', concept: 'stada', lemma: 'städa', source: 'vocab', prompt: { zh: '打扫（原形）' }, answer: 'städa' },
    { id: 'a3_vocab_handla', kind: 'vocab_spelling', concept: 'handla', lemma: 'handla', source: 'vocab', prompt: { zh: '购物（原形）' }, answer: 'handla' },
    { id: 'a3_vocab_laga_mat', kind: 'vocab_spelling', concept: 'laga_mat', lemma: 'laga mat', source: 'vocab', prompt: { zh: '做饭（原形）' }, answer: 'laga mat' },
    { id: 'a3_vocab_promenera', kind: 'vocab_spelling', concept: 'promenera', lemma: 'promenera', source: 'vocab', prompt: { zh: '散步（原形）' }, answer: 'promenera' },
    { id: 'a3_vocab_vila', kind: 'vocab_spelling', concept: 'vila', lemma: 'vila', source: 'vocab', prompt: { zh: '休息（原形）' }, answer: 'vila' },
    // ===== 固定表达题 =====
    { id: 'a3_phrase_jag_har_en_syster', kind: 'phrase_fill', concept: 'jag_har_en_syster', lemma: 'jag har en syster', source: 'phrase', prompt: { zh: '我有一个姐妹。' }, template: 'Jag har en {{syster}}.' },
    { id: 'a3_phrase_jag_har_tva_barn', kind: 'phrase_fill', concept: 'jag_har_tva_barn', lemma: 'jag har två barn', source: 'phrase', prompt: { zh: '我有两个孩子。' }, template: 'Jag har två {{barn}}.' },
    { id: 'a3_phrase_min_syster_heter_anna', kind: 'phrase_fill', concept: 'min_syster_heter_anna', lemma: 'min syster heter Anna', source: 'phrase', prompt: { zh: '我妹妹叫 Anna。' }, template: 'Min {{syster}} heter Anna.' },
    { id: 'a3_phrase_min_pappa_arbetar_som_larare', kind: 'phrase_fill', concept: 'min_pappa_arbetar_som_larare', lemma: 'min pappa arbetar som lärare', source: 'phrase', prompt: { zh: '我爸爸是老师。' }, template: 'Min {{pappa}} arbetar som {{lärare}}.' },
    { id: 'a3_phrase_hon_ar_tjugo_ar_gammal', kind: 'phrase_fill', concept: 'hon_ar_tjugo_ar_gammal', lemma: 'hon är tjugo år gammal', source: 'phrase', prompt: { zh: '她二十岁。' }, template: 'Hon är {{tjugo}} år {{gammal}}.' },
    { id: 'a3_phrase_de_ar_fem_och_atta_ar_gamla', kind: 'phrase_fill', concept: 'de_ar_fem_och_atta_ar_gamla', lemma: 'de är fem och åtta år gamla', source: 'phrase', prompt: { zh: '孩子们五岁和八岁。' }, template: 'De är {{fem}} och {{åtta}} år {{gamla}}.' },
    { id: 'a3_phrase_jag_bor_i_ett_hus', kind: 'phrase_fill', concept: 'jag_bor_i_ett_hus', lemma: 'jag bor i ett hus', source: 'phrase', prompt: { zh: '我住在一个房子里。' }, template: 'Jag {{bor}} i ett {{hus}}.' },
    { id: 'a3_phrase_det_finns_tre_rum', kind: 'phrase_fill', concept: 'det_finns_tre_rum', lemma: 'det finns tre rum', source: 'phrase', prompt: { zh: '有三个房间。' }, template: 'Det finns {{tre}} {{rum}}.' },
    { id: 'a3_phrase_lagenheten_ar_stor_och_mysig', kind: 'phrase_fill', concept: 'lagenheten_ar_stor_och_mysig', lemma: 'lägenheten är stor och mysig', source: 'phrase', prompt: { zh: '公寓很大也很舒适。' }, template: '{{Lägenheten}} {{är}} {{stor}} och {{mysig}}.' },
    { id: 'a3_phrase_jag_bor_i_stockholm', kind: 'phrase_fill', concept: 'jag_bor_i_stockholm', lemma: 'jag bor i Stockholm', source: 'phrase', prompt: { zh: '我住在斯德哥尔摩。' }, template: 'Jag bor {{i}} Stockholm.' },
    { id: 'a3_phrase_jag_bor_pa_storgatan', kind: 'phrase_fill', concept: 'jag_bor_pa_storgatan', lemma: 'jag bor på Storgatan', source: 'phrase', prompt: { zh: '我住在大街上。' }, template: 'Jag bor {{på}} Storgatan.' },
    { id: 'a3_phrase_jag_ar_hemma_idag', kind: 'phrase_fill', concept: 'jag_ar_hemma_idag', lemma: 'jag är hemma idag', source: 'phrase', prompt: { zh: '我今天在家。' }, template: 'Jag {{är}} {{hemma}} idag.' },
    { id: 'a3_phrase_jag_gar_hem_nu', kind: 'phrase_fill', concept: 'jag_gar_hem_nu', lemma: 'jag går hem nu', source: 'phrase', prompt: { zh: '我现在回家。' }, template: 'Jag {{går}} {{hem}} nu.' },
    // ===== 对话句题 =====
    { id: 'a3_dialog_beratta_om_din_familj', kind: 'dialog_fill', concept: 'beratta_om_din_familj', lemma: 'berätta om din familj', source: 'dialog', prompt: { zh: '说说你的家庭吧！' }, template: 'Berätta om {{din}} {{familj}}!' },
    { id: 'a3_dialog_jag_har_en_man_och_tva_barn', kind: 'dialog_fill', concept: 'jag_har_en_man_och_tva_barn', lemma: 'jag har en man och två barn', source: 'dialog', prompt: { zh: '我有一个丈夫和两个孩子。' }, template: 'Jag har {{en}} {{man}} och {{två}} {{barn}}.' },
    { id: 'a3_dialog_hur_gamla_ar_barnen', kind: 'dialog_fill', concept: 'hur_gamla_ar_barnen', lemma: 'hur gamla är barnen', source: 'dialog', prompt: { zh: '孩子们多大了？' }, template: 'Hur {{gamla}} är {{barnen}}?' },
    { id: 'a3_dialog_de_ar_fem_och_atta_ar_gamla', kind: 'dialog_fill', concept: 'de_ar_fem_och_atta_ar_gamla', lemma: 'de är fem och åtta år gamla', source: 'dialog', prompt: { zh: '他们五岁和八岁。' }, template: 'De är {{fem}} och {{åtta}} år {{gamla}}.' },
    { id: 'a3_dialog_vi_bor_i_en_lagenhet_i_malmo', kind: 'dialog_fill', concept: 'vi_bor_i_en_lagenhet_i_malmo', lemma: 'vi bor i en lägenhet i Malmö', source: 'dialog', prompt: { zh: '我们住在马尔默的一间公寓里。' }, template: 'Vi {{bor}} i {{en}} {{lägenhet}} i Malmö.' },
    { id: 'a3_dialog_det_finns_tre_rum_och_ett_kok', kind: 'dialog_fill', concept: 'det_finns_tre_rum_och_ett_kok', lemma: 'det finns tre rum och ett kök', source: 'dialog', prompt: { zh: '有三个房间和一个厨房。' }, template: 'Det finns {{tre}} {{rum}} och {{ett}} {{kök}}.' },
    { id: 'a3_dialog_jag_ar_din_nya_granne', kind: 'dialog_fill', concept: 'jag_ar_din_nya_granne', lemma: 'jag är din nya granne', source: 'dialog', prompt: { zh: '我是你的新邻居。' }, template: 'Jag är {{din}} {{nya}} {{granne}}.' },
    { id: 'a3_dialog_ar_det_en_stor_lagenhet', kind: 'dialog_fill', concept: 'ar_det_en_stor_lagenhet', lemma: 'är det en stor lägenhet', source: 'dialog', prompt: { zh: '这是一个大公寓吗？' }, template: 'Är det {{en}} {{stor}} {{lägenhet}}?' },
    { id: 'a3_dialog_det_finns_tre_rum_ett_kok_ett_badrum', kind: 'dialog_fill', concept: 'det_finns_tre_rum_ett_kok_ett_badrum', lemma: 'det finns tre rum, ett kök och ett badrum', source: 'dialog', prompt: { zh: '有三个房间、一个厨房和一个浴室。' }, template: 'Ja, det finns {{tre}} {{rum}}, {{ett}} {{kök}} och {{ett}} {{badrum}}.' },
    { id: 'a3_dialog_det_ar_mycket_mysigt', kind: 'dialog_fill', concept: 'det_ar_mycket_mysigt', lemma: 'det är mycket mysigt', source: 'dialog', prompt: { zh: '这里非常温馨！' }, template: 'Det är mycket {{mysigt}}!' },
    { id: 'a3_dialog_bor_du_ensam', kind: 'dialog_fill', concept: 'bor_du_ensam', lemma: 'bor du ensam', source: 'dialog', prompt: { zh: '你一个人住吗？' }, template: '{{Bor}} du {{ensam}}?' },
    { id: 'a3_dialog_jag_bor_med_min_man_och_var_dotter', kind: 'dialog_fill', concept: 'jag_bor_med_min_man_och_var_dotter', lemma: 'jag bor med min man och vår dotter', source: 'dialog', prompt: { zh: '不，我和我丈夫还有我们的女儿一起住。' }, template: 'Nej, jag {{bor}} med {{min}} {{man}} och {{vår}} {{dotter}}.' }
  ],
  advancedPool: [
    // ===== 所有格代词变形 =====
    { id: 'a3_possessive_min_group', kind: 'morphology', source: 'possessive', slotLabels: ['en词', 'ett词', '复数'], lemma: 'min', prompt: { zh: '我的' }, template: '{{min}} | {{mitt}} | {{mina}}' },
    { id: 'a3_possessive_din_group', kind: 'morphology', source: 'possessive', slotLabels: ['en词', 'ett词', '复数'], lemma: 'din', prompt: { zh: '你的' }, template: '{{din}} | {{ditt}} | {{dina}}' },
    { id: 'a3_possessive_var_group', kind: 'morphology', source: 'possessive', slotLabels: ['en词', 'ett词', '复数'], lemma: 'vår', prompt: { zh: '我们的' }, template: '{{vår}} | {{vårt}} | {{våra}}' },
    // ===== 形容词变形 =====
    { id: 'a3_adj_stor_group', kind: 'morphology', source: 'adjective', labelScheme: 'adjective_forms', slotLabels: ['en-词形式', 'ett-词形式', '复数 / 定指形式'], lemma: 'stor', prompt: { zh: '大的' }, template: '{{stor}} | {{stort}} | {{stora}}' },
    { id: 'a3_adj_mysig_group', kind: 'morphology', source: 'adjective', labelScheme: 'adjective_forms', slotLabels: ['en-词形式', 'ett-词形式', '复数 / 定指形式'], lemma: 'mysig', prompt: { zh: '温馨的' }, template: '{{mysig}} | {{mysigt}} | {{mysiga}}' },
    { id: 'a3_adj_gammal_group', kind: 'morphology', source: 'adjective', labelScheme: 'adjective_forms', slotLabels: ['en-词形式', 'ett-词形式', '复数 / 定指形式'], lemma: 'gammal', prompt: { zh: '年老的；旧的' }, template: '{{gammal}} | {{gammalt}} | {{gamla}}' },
    { id: 'a3_adj_ny_group', kind: 'morphology', source: 'adjective', labelScheme: 'adjective_forms', slotLabels: ['en-词形式', 'ett-词形式', '复数 / 定指形式'], lemma: 'ny', prompt: { zh: '新的' }, template: '{{ny}} | {{nytt}} | {{nya}}' },
    // ===== 名词变形 =====
    { id: 'a3_noun_familj_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'familj', prompt: { zh: '家庭' }, template: '{{en}} | {{familj}} | {{familjen}} | {{familjer}} | {{familjerna}}' },
    { id: 'a3_noun_lagenhet_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'lägenhet', prompt: { zh: '公寓' }, template: '{{en}} | {{lägenhet}} | {{lägenheten}} | {{lägenheter}} | {{lägenheterna}}' },
    { id: 'a3_noun_granne_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'granne', prompt: { zh: '邻居' }, template: '{{en}} | {{granne}} | {{grannen}} | {{grannar}} | {{grannarna}}' },
    { id: 'a3_noun_rum_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'rum', prompt: { zh: '房间' }, template: '{{ett}} | {{rum}} | {{rummet}} | {{rum}} | {{rummen}}' },
    // ===== 动词变形 =====
    { id: 'a3_verb_bo_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'bo', prompt: { zh: '居住' }, template: '{{bo}} | {{bor}} | {{bodde}} | {{bott}}' },
    // ===== 结构专项 =====
    { id: 'a3_struct_jag_har_en_man_och_tva_barn', kind: 'morphology', source: 'pattern', lemma: 'jag har en man och två barn', prompt: { zh: '我有一个丈夫和两个孩子。' }, template: '{{Jag}} {{har}} {{en}} {{man}} och {{två}} {{barn}}.' },
    { id: 'a3_struct_min_man_heter_david', kind: 'morphology', source: 'pattern', lemma: 'min man heter David och han är lärare', prompt: { zh: '我丈夫叫 David，他是老师。' }, template: '{{Min}} {{man}} {{heter}} David och han är {{lärare}}.' },
    { id: 'a3_struct_de_ar_fem_och_atta_ar_gamla', kind: 'morphology', source: 'pattern', lemma: 'de är fem och åtta år gamla', prompt: { zh: '他们五岁和八岁。' }, template: '{{De}} {{är}} {{fem}} och {{åtta}} år {{gamla}}.' },
    { id: 'a3_struct_vi_bor_i_en_lagenhet_i_malmo', kind: 'morphology', source: 'pattern', lemma: 'vi bor i en lägenhet i Malmö', prompt: { zh: '我们住在马尔默的一间公寓里。' }, template: 'Vi {{bor}} i en {{lägenhet}} i Malmö.' },
    { id: 'a3_struct_det_finns_tre_rum_och_ett_kok', kind: 'morphology', source: 'pattern', lemma: 'det finns tre rum och ett kök', prompt: { zh: '有三个房间和一个厨房。' }, template: 'Det {{finns}} tre {{rum}} och ett {{kök}}.' }
  ]
};
