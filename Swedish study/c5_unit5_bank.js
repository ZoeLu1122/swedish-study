window.UNIT_BANK_C5 = {
  unit: 'c5',
  unitTitle: '阅读与文本分析',
  basicPool: [
    // ===== 单词题 =====
    { id: 'c5_vocab_rubrik', kind: 'vocab_spelling', concept: 'rubrik', lemma: 'rubrik', source: 'vocab', prompt: { zh: '标题 / 题目（名词，单数）' }, answer: 'en rubrik' },
    { id: 'c5_vocab_stycke', kind: 'vocab_spelling', concept: 'stycke', lemma: 'stycke', source: 'vocab', prompt: { zh: '段落（名词，单数）' }, answer: 'ett stycke' },
    { id: 'c5_vocab_sammanfattning', kind: 'vocab_spelling', concept: 'sammanfattning', lemma: 'sammanfattning', source: 'vocab', prompt: { zh: '摘要 / 总结（名词，单数）' }, answer: 'en sammanfattning' },
    { id: 'c5_vocab_innehall', kind: 'vocab_spelling', concept: 'innehåll', lemma: 'innehåll', source: 'vocab', prompt: { zh: '内容（名词，单数）' }, answer: 'ett innehåll' },
    { id: 'c5_vocab_budskap', kind: 'vocab_spelling', concept: 'budskap', lemma: 'budskap', source: 'vocab', prompt: { zh: '主旨 / 信息（名词，单数）' }, answer: 'ett budskap' },
    { id: 'c5_vocab_pastaende', kind: 'vocab_spelling', concept: 'påstående', lemma: 'påstående', source: 'vocab', prompt: { zh: '论断 / 声明 / 陈述（名词，单数）' }, answer: 'ett påstående' },
    { id: 'c5_vocab_argument', kind: 'vocab_spelling', concept: 'argument', lemma: 'argument', source: 'vocab', prompt: { zh: '论据 / 论点（名词，单数）' }, answer: 'ett argument' },
    { id: 'c5_vocab_kalla', kind: 'vocab_spelling', concept: 'källa', lemma: 'källa', source: 'vocab', prompt: { zh: '来源 / 信息源（名词，单数）' }, answer: 'en källa' },
    { id: 'c5_vocab_nyckelord', kind: 'vocab_spelling', concept: 'nyckelord', lemma: 'nyckelord', source: 'vocab', prompt: { zh: '关键词（名词，单数）' }, answer: 'ett nyckelord' },
    // ===== 被动形式题 =====
    { id: 'c5_passive_lasa', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'läsa', prompt: { zh: '阅读' }, template: 'läser | {{läses}}' },
    { id: 'c5_passive_skriva', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'skriva', prompt: { zh: '书写' }, template: 'skriver | {{skrivs}}' },
    { id: 'c5_passive_anvanda', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'använda', prompt: { zh: '使用' }, template: 'använder | {{används}}' },
    { id: 'c5_passive_finansiera', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'finansiera', prompt: { zh: '资助' }, template: 'finansierar | {{finansieras}}' },
    { id: 'c5_passive_remittera', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'remittera', prompt: { zh: '转介' }, template: 'remitterar | {{remitteras}}' },
    { id: 'c5_passive_diskutera', kind: 'morphology', source: 'passive_forms', labelScheme: 'active_passive_now', slotLabels: ['主动现在时', '被动现在时'], lemma: 'diskutera', prompt: { zh: '讨论' }, template: 'diskuterar | {{diskuteras}}' },
    // ===== 固定表达题 =====
    { id: 'c5_phrase_artikeln_som_vi_laste_igar', kind: 'phrase_fill', concept: 'artikeln_som_vi_laste_igar', lemma: 'som', source: 'phrase', prompt: { zh: '我们昨天读的那篇文章非常有趣。' }, template: 'Artikeln {{som}} vi läste igår var mycket intressant.' },
    { id: 'c5_phrase_eleven_vars_uppsats_fick_bast_betyg', kind: 'phrase_fill', concept: 'eleven_vars_uppsats_fick_bast_betyg', lemma: 'vars', source: 'phrase', prompt: { zh: '那个作文得了最高分的学生获得了奖学金。' }, template: 'Eleven {{vars}} uppsats fick bäst betyg fick ett stipendium.' },
    { id: 'c5_phrase_hon_sammanfattade_hela_texten_vilket_imponerade', kind: 'phrase_fill', concept: 'hon_sammanfattade_hela_texten_vilket_imponerade', lemma: 'vilket', source: 'phrase', prompt: { zh: '她五分钟内总结了整篇文章，这令老师印象深刻。' }, template: 'Hon sammanfattade hela texten på fem minuter, {{vilket}} imponerade läraren.' },
    { id: 'c5_phrase_den_har_texten_lases_varje_dag', kind: 'phrase_fill', concept: 'den_har_texten_lases_varje_dag', lemma: 'läses', source: 'phrase', prompt: { zh: '这篇文章每天被数百万人阅读。' }, template: 'Den här texten {{läses}} av miljontals människor varje dag.' },
    { id: 'c5_phrase_boken_skrivs_av_en_kand_forfattare', kind: 'phrase_fill', concept: 'boken_skrivs_av_en_kand_forfattare', lemma: 'skrivs', source: 'phrase', prompt: { zh: '书是由一位著名作家写的。' }, template: 'Boken {{skrivs}} av en känd författare.' },
    { id: 'c5_phrase_patienter_remitteras_till_specialister', kind: 'phrase_fill', concept: 'patienter_remitteras_till_specialister', lemma: 'remitteras', source: 'phrase', prompt: { zh: '病情严重的患者被转介给专科医生。' }, template: 'Patienter vars tillstånd är allvarliga {{remitteras}} till specialister.' },
    { id: 'c5_phrase_analysera_texten_och_sammanfatta_argumenten', kind: 'phrase_fill', concept: 'analysera_texten_och_sammanfatta_argumenten', lemma: 'Analysera sammanfatta', source: 'phrase', prompt: { zh: '请分析这篇文章并总结主要论点。' }, template: '{{Analysera}} texten och {{sammanfatta}} de viktigaste argumenten.' },
    { id: 'c5_phrase_texten_saknar_en_tydlig_rubrik', kind: 'phrase_fill', concept: 'texten_saknar_en_tydlig_rubrik', lemma: 'rubrik', source: 'phrase', prompt: { zh: '这篇文章缺少清晰的标题。' }, template: 'Texten saknar en tydlig {{rubrik}}.' },
    { id: 'c5_phrase_budskapet_ar_svart_att_forsta', kind: 'phrase_fill', concept: 'budskapet_ar_svart_att_forsta', lemma: 'Budskapet', source: 'phrase', prompt: { zh: '主旨很难理解。' }, template: '{{Budskapet}} är svårt att förstå.' },
    { id: 'c5_phrase_texten_har_flera_nyckelord', kind: 'phrase_fill', concept: 'texten_har_flera_nyckelord', lemma: 'nyckelord', source: 'phrase', prompt: { zh: '这篇文章有很多关键词。' }, template: 'Texten har flera {{nyckelord}}.' },
    { id: 'c5_phrase_jamfor_de_har_tva_styckena', kind: 'phrase_fill', concept: 'jamfor_de_har_tva_styckena', lemma: 'Jämför', source: 'phrase', prompt: { zh: '请比较这两个段落。' }, template: '{{Jämför}} de här två styckena.' },
    // ===== 对话句题 =====
    { id: 'c5_dialog_artikeln_som_handlar_om_sjukvardssystemet', kind: 'dialog_fill', concept: 'artikeln_som_handlar_om_sjukvardssystemet', lemma: 'som', source: 'dialog', prompt: { zh: '我们今天要讨论那篇讲瑞典医疗系统的文章。' }, template: 'Vi ska diskutera artikeln {{som}} handlar om det svenska sjukvårdssystemet.' },
    { id: 'c5_dialog_kan_du_sammanfatta_det_forsta_stycket', kind: 'dialog_fill', concept: 'kan_du_sammanfatta_det_forsta_stycket', lemma: 'sammanfatta', source: 'dialog', prompt: { zh: '你能用自己的话总结第一段吗？' }, template: 'Kan du {{sammanfatta}} det första stycket med egna ord?' },
    { id: 'c5_dialog_det_finns_ett_pastaende', kind: 'dialog_fill', concept: 'det_finns_ett_pastaende', lemma: 'påstående', source: 'dialog', prompt: { zh: '文章里有一个我不太明白的论点。' }, template: 'Det finns ett {{påstående}} i texten som jag inte riktigt förstår.' },
    { id: 'c5_dialog_ar_kallan_tillforlitlig', kind: 'dialog_fill', concept: 'ar_kallan_tillforlitlig', lemma: 'källan', source: 'dialog', prompt: { zh: '文章引用的来源可靠吗？' }, template: 'Är {{källan}} som artikeln bygger på tillförlitlig?' },
    { id: 'c5_dialog_hon_sammanfattade_hela_texten_vilket_imponerade_mig', kind: 'dialog_fill', concept: 'hon_sammanfattade_hela_texten_vilket_imponerade_mig', lemma: 'vilket', source: 'dialog', prompt: { zh: '她五分钟内总结了整篇文章，这让我很佩服。' }, template: 'Hon sammanfattade hela texten på fem minuter, {{vilket}} imponerade mig.' },
    { id: 'c5_dialog_artikeln_som_handlar_om_klimatforandringar', kind: 'dialog_fill', concept: 'artikeln_som_handlar_om_klimatforandringar', lemma: 'som', source: 'dialog', prompt: { zh: '你读了那篇关于气候变化的新闻吗？' }, template: 'Har du läst artikeln {{som}} handlar om klimatförändringar?' },
    { id: 'c5_dialog_rubriken_ar_bra_men_innehallet_ar_komplicerat', kind: 'dialog_fill', concept: 'rubriken_ar_bra_men_innehallet_ar_komplicerat', lemma: 'rubriken', source: 'dialog', prompt: { zh: '我觉得标题很好，但内容有点复杂。' }, template: 'Jag tycker att {{rubriken}} är bra, men innehållet är lite komplicerat.' },
    { id: 'c5_dialog_forfattaren_vars_stil_ar_speciell', kind: 'dialog_fill', concept: 'forfattaren_vars_stil_ar_speciell', lemma: 'vars', source: 'dialog', prompt: { zh: '作者的风格很特别。' }, template: 'Författaren {{vars}} stil är väldigt speciell.' },
    { id: 'c5_dialog_jag_haller_inte_med_om_ett_argument', kind: 'dialog_fill', concept: 'jag_haller_inte_med_om_ett_argument', lemma: 'argument', source: 'dialog', prompt: { zh: '我不完全同意文中的一个论点。' }, template: 'Jag håller inte helt med om ett {{argument}} i texten.' },
    { id: 'c5_dialog_det_fick_mig_att_tanka_mer_vilket_var_intressant', kind: 'dialog_fill', concept: 'det_fick_mig_att_tanka_mer_vilket_var_intressant', lemma: 'vilket', source: 'dialog', prompt: { zh: '这件事让我开始思考更多，真的很有意思。' }, template: 'Det fick mig att tänka mer, {{vilket}} var intressant.' }
  ],
  advancedPool: [
    // ===== noun_forms =====
    { id: 'c5_noun_rubrik_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'rubrik', prompt: { zh: '标题 / 题目' }, template: '{{en}} | {{rubrik}} | {{rubriken}} | {{rubriker}} | {{rubrikerna}}' },
    { id: 'c5_noun_stycke_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'stycke', prompt: { zh: '段落' }, template: '{{ett}} | {{stycke}} | {{stycket}} | {{stycken}} | {{styckena}}' },
    { id: 'c5_noun_sammanfattning_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'sammanfattning', prompt: { zh: '摘要 / 总结' }, template: '{{en}} | {{sammanfattning}} | {{sammanfattningen}} | {{sammanfattningar}} | {{sammanfattningarna}}' },
    { id: 'c5_noun_innehall_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'innehåll', prompt: { zh: '内容' }, template: '{{ett}} | {{innehåll}} | {{innehållet}} | {{innehåll}} | {{innehållen}}' },
    { id: 'c5_noun_budskap_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'budskap', prompt: { zh: '主旨 / 信息' }, template: '{{ett}} | {{budskap}} | {{budskapet}} | {{budskap}} | {{budskapen}}' },
    { id: 'c5_noun_pastaende_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'påstående', prompt: { zh: '论断 / 声明 / 陈述' }, template: '{{ett}} | {{påstående}} | {{påståendet}} | {{påståenden}} | {{påståendena}}' },
    { id: 'c5_noun_argument_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'argument', prompt: { zh: '论据 / 论点' }, template: '{{ett}} | {{argument}} | {{argumentet}} | {{argument}} | {{argumenten}}' },
    { id: 'c5_noun_kalla_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'källa', prompt: { zh: '来源 / 信息源' }, template: '{{en}} | {{källa}} | {{källan}} | {{källor}} | {{källorna}}' },
    { id: 'c5_noun_nyckelord_group', kind: 'morphology', source: 'noun_forms', labelScheme: 'noun_forms', lemma: 'nyckelord', prompt: { zh: '关键词' }, template: '{{ett}} | {{nyckelord}} | {{nyckelordet}} | {{nyckelord}} | {{nyckelorden}}' },
    // ===== verb_forms =====
    { id: 'c5_verb_sammanfatta_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'sammanfatta', prompt: { zh: '总结 / 概括' }, template: '{{sammanfatta}} | {{sammanfattar}} | {{sammanfattade}} | {{sammanfattat}}' },
    { id: 'c5_verb_analysera_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'analysera', prompt: { zh: '分析' }, template: '{{analysera}} | {{analyserar}} | {{analyserade}} | {{analyserat}}' },
    { id: 'c5_verb_jamfora_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'jämföra', prompt: { zh: '比较' }, template: '{{jämföra}} | {{jämför}} | {{jämförde}} | {{jämfört}}' },
    { id: 'c5_verb_tolka_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'tolka', prompt: { zh: '解读 / 诠释' }, template: '{{tolka}} | {{tolkar}} | {{tolkade}} | {{tolkat}}' },
    { id: 'c5_verb_beskriva_group', kind: 'morphology', source: 'verb_forms', labelScheme: 'verb_forms', slotLabels: ['原形', '现在时', '过去时', '完成时'], lemma: 'beskriva', prompt: { zh: '描述 / 描写' }, template: '{{beskriva}} | {{beskriver}} | {{beskrev}} | {{beskrivit}}' }
  ]
};
