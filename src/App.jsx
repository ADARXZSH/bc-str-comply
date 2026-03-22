import { useState, useRef, useEffect } from "react";

const SUPABASE_URL = "https://doanymzmmslwzaesesvz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYW55bXptbXNsd3phZXNlc3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzAzMjcsImV4cCI6MjA4OTc0NjMyN30.n60icq-yNXrfxBK03UxNK1hUr8m4EP7GslYjUnR7v8I";

const LANGS = {
  en: { label: "English", flag: "🇬🇧" },
  zh: { label: "中文", flag: "🇨🇳" },
  pa: { label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  fr: { label: "Français", flag: "🇫🇷" },
};

const T = {
  brand: { en:"BC STR Comply", zh:"BC短租合规", pa:"BC STR ਪਾਲਣਾ", fr:"BC STR Conformité" },
  tagline: { en:"Free compliance tracker for BC hosts", zh:"BC房东免费合规追踪工具", pa:"BC ਮੇਜ਼ਬਾਨਾਂ ਲਈ ਮੁਫ਼ਤ ਪਾਲਣਾ ਟਰੈਕਰ", fr:"Outil gratuit de conformité pour les hôtes de la C.-B." },
  welcomeTitle: { en:"BC STR Comply", zh:"BC短租合规助手", pa:"BC STR ਪਾਲਣਾ", fr:"BC STR Conformité" },
  welcomeDesc: { en:"Free compliance tracker for short-term rental hosts in British Columbia.", zh:"为不列颠哥伦比亚省短租房东提供的免费合规追踪工具。", pa:"ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਛੋਟੀ-ਮਿਆਦ ਕਿਰਾਏ ਦੇ ਮੇਜ਼ਬਾਨਾਂ ਲਈ ਮੁਫ਼ਤ ਪਾਲਣਾ ਟਰੈਕਰ।", fr:"Outil gratuit de suivi de conformité pour les hôtes de locations courte durée en Colombie-Britannique." },
  welcomeSub: { en:"Checklist, deadlines, fines, updates — plus an AI assistant for your questions.", zh:"清单、截止日期、罚款、更新——还有AI助手回答您的问题。", pa:"ਚੈਕਲਿਸਟ, ਡੈੱਡਲਾਈਨਾਂ, ਜੁਰਮਾਨੇ, ਅਪਡੇਟ — ਨਾਲ AI ਸਹਾਇਕ।", fr:"Checklist, échéances, amendes, mises à jour — et un assistant IA." },
  welcomeCta: { en:"Check My Compliance →", zh:"检查我的合规状态 →", pa:"ਮੇਰੀ ਪਾਲਣਾ ਜਾਂਚੋ →", fr:"Vérifier ma conformité →" },
  welcomeFree: { en:"100% free · AI-powered · Updated March 2026", zh:"100%免费 · AI驱动 · 2026年3月更新", pa:"100% ਮੁਫ਼ਤ · AI-ਸੰਚਾਲਿਤ · ਮਾਰਚ 2026 ਅਪਡੇਟ", fr:"100% gratuit · IA · Mis à jour mars 2026" },
  tabs: {
    checklist: { en:"✓ Checklist", zh:"✓ 清单", pa:"✓ ਚੈੱਕਲਿਸਟ", fr:"✓ Liste" },
    deadlines: { en:"📅 Deadlines", zh:"📅 截止日期", pa:"📅 ਡੈੱਡਲਾਈਨ", fr:"📅 Échéances" },
    fines: { en:"💰 Fines", zh:"💰 罚款", pa:"💰 ਜੁਰਮਾਨੇ", fr:"💰 Amendes" },
    updates: { en:"📰 Updates", zh:"📰 更新", pa:"📰 ਅਪਡੇਟ", fr:"📰 Mises à jour" },
    resources: { en:"🤝 Resources", zh:"🤝 资源", pa:"🤝 ਸਰੋਤ", fr:"🤝 Ressources" },
  },
  compliance: { en:"Compliance", zh:"合规状态", pa:"ਪਾਲਣਾ", fr:"Conformité" },
  items: { en:"items", zh:"项目", pa:"ਆਈਟਮਾਂ", fr:"éléments" },
  critical: { en:"critical", zh:"关键", pa:"ਨਾਜ਼ੁਕ", fr:"critiques" },
  compliant: { en:"COMPLIANT", zh:"合规", pa:"ਪਾਲਣਾ ਯੋਗ", fr:"CONFORME" },
  atRisk: { en:"AT RISK", zh:"有风险", pa:"ਖ਼ਤਰੇ ਵਿੱਚ", fr:"À RISQUE" },
  highRisk: { en:"HIGH RISK", zh:"高风险", pa:"ਉੱਚ ਖ਼ਤਰਾ", fr:"RISQUE ÉLEVÉ" },
  riskOk: { en:"All critical requirements met. Stay updated on changes.", zh:"所有关键要求已满足。请关注法规变更。", pa:"ਸਾਰੀਆਂ ਨਾਜ਼ੁਕ ਲੋੜਾਂ ਪੂਰੀਆਂ। ਬਦਲਾਵਾਂ ਤੋਂ ਜਾਣੂ ਰਹੋ।", fr:"Toutes les exigences critiques sont remplies. Restez informé." },
  riskWarn: { en:"critical items incomplete. Address before hosting.", zh:"项关键项目未完成。请在接待客人前解决。", pa:"ਨਾਜ਼ੁਕ ਆਈਟਮਾਂ ਅਧੂਰੀਆਂ। ਮੇਜ਼ਬਾਨੀ ਤੋਂ ਪਹਿਲਾਂ ਹੱਲ ਕਰੋ।", fr:"éléments critiques incomplets. Réglez avant d'héberger." },
  riskBad: { en:"critical gaps. Risk fines up to $50,000.", zh:"项关键缺口。面临高达$50,000的罚款风险。", pa:"ਨਾਜ਼ੁਕ ਕਮੀਆਂ। $50,000 ਤੱਕ ਜੁਰਮਾਨੇ ਦਾ ਖ਼ਤਰਾ।", fr:"lacunes critiques. Risque d'amendes jusqu'à 50 000$." },
  required: { en:"REQUIRED", zh:"必需", pa:"ਲੋੜੀਂਦਾ", fr:"REQUIS" },
  emailTitle: { en:"Get free deadline reminders", zh:"获取免费截止日期提醒", pa:"ਮੁਫ਼ਤ ਡੈੱਡਲਾਈਨ ਰੀਮਾਈਂਡਰ ਪ੍ਰਾਪਤ ਕਰੋ", fr:"Recevez des rappels gratuits" },
  emailDesc: { en:"Free alerts before deadlines and when regulations change.", zh:"截止日期前和法规变更时的免费提醒。", pa:"ਡੈੱਡਲਾਈਨ ਤੋਂ ਪਹਿਲਾਂ ਅਤੇ ਨਿਯਮ ਬਦਲਣ ਤੇ ਮੁਫ਼ਤ ਅਲਰਟ।", fr:"Alertes gratuites avant les échéances et changements réglementaires." },
  subscribe: { en:"Subscribe Free", zh:"免费订阅", pa:"ਮੁਫ਼ਤ ਸਬਸਕ੍ਰਾਈਬ", fr:"S'abonner" },
  subscribed: { en:"Subscribed! We'll alert you before deadlines.", zh:"已订阅！我们将在截止日期前提醒您。", pa:"ਸਬਸਕ੍ਰਾਈਬ ਹੋ ਗਿਆ! ਅਸੀਂ ਡੈੱਡਲਾਈਨ ਤੋਂ ਪਹਿਲਾਂ ਅਲਰਟ ਕਰਾਂਗੇ।", fr:"Abonné! Nous vous alerterons avant les échéances." },
  deadlinesTitle: { en:"Deadlines", zh:"截止日期", pa:"ਡੈੱਡਲਾਈਨਾਂ", fr:"Échéances" },
  deadlinesWarn: { en:"Missing deadlines = fines, suspension, or listing removal.", zh:"错过截止日期 = 罚款、暂停或下架。", pa:"ਡੈੱਡਲਾਈਨ ਮਿਸ = ਜੁਰਮਾਨੇ, ਮੁਅੱਤਲੀ, ਜਾਂ ਲਿਸਟਿੰਗ ਹਟਾਉਣਾ।", fr:"Échéances manquées = amendes, suspension ou retrait." },
  provincial: { en:"Provincial (All BC)", zh:"省级（全BC）", pa:"ਸੂਬਾਈ (ਸਾਰਾ BC)", fr:"Provincial (toute la C.-B.)" },
  annualCosts: { en:"Annual Costs", zh:"年度费用", pa:"ਸਾਲਾਨਾ ਖਰਚੇ", fr:"Coûts annuels" },
  penalties: { en:"Penalties", zh:"处罚", pa:"ਜੁਰਮਾਨੇ", fr:"Pénalités" },
  updatesTitle: { en:"Regulation Updates", zh:"法规更新", pa:"ਨਿਯਮ ਅਪਡੇਟ", fr:"Mises à jour réglementaires" },
  resourcesTitle: { en:"Resources for BC Hosts", zh:"BC房东资源", pa:"BC ਮੇਜ਼ਬਾਨਾਂ ਲਈ ਸਰੋਤ", fr:"Ressources pour les hôtes" },
  officialLinks: { en:"Official Links", zh:"官方链接", pa:"ਅਧਿਕਾਰਤ ਲਿੰਕ", fr:"Liens officiels" },
  partnerTitle: { en:"Service provider for STR hosts?", zh:"为短租房东提供服务？", pa:"STR ਮੇਜ਼ਬਾਨਾਂ ਲਈ ਸੇਵਾ ਪ੍ਰਦਾਤਾ?", fr:"Fournisseur de services pour hôtes?" },
  partnerDesc: { en:"We connect BC hosts with trusted local services. Let's talk.", zh:"我们将BC房东与可信赖的本地服务连接。联系我们。", pa:"ਅਸੀਂ BC ਮੇਜ਼ਬਾਨਾਂ ਨੂੰ ਭਰੋਸੇਯੋਗ ਸਥਾਨਕ ਸੇਵਾਵਾਂ ਨਾਲ ਜੋੜਦੇ ਹਾਂ।", fr:"Nous connectons les hôtes avec des services locaux fiables." },
  partnerCta: { en:"Become a Partner →", zh:"成为合作伙伴 →", pa:"ਭਾਈਵਾਲ ਬਣੋ →", fr:"Devenir partenaire →" },
  disclaimer: { en:"General regulatory information for educational purposes. Not legal advice. Verify with your municipality and Province of BC. Last verified March 2026.", zh:"仅供教育目的的一般法规信息，非法律建议。请向您所在的市政府和BC省核实。最后验证：2026年3月。", pa:"ਸਿੱਖਿਆ ਦੇ ਉਦੇਸ਼ਾਂ ਲਈ ਆਮ ਨਿਯਮਕ ਜਾਣਕਾਰੀ। ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ। ਆਪਣੀ ਮਿਉਂਸਪੈਲਟੀ ਅਤੇ BC ਸੂਬੇ ਨਾਲ ਤਸਦੀਕ ਕਰੋ।", fr:"Informations réglementaires générales à titre éducatif. Pas un avis juridique. Vérifiez auprès de votre municipalité. Mars 2026." },
  chatTitle: { en:"STR Compliance AI", zh:"短租合规AI", pa:"STR ਪਾਲਣਾ AI", fr:"IA Conformité STR" },
  chatSub: { en:"Ask anything about BC STR rules", zh:"询问有关BC短租规则的任何问题", pa:"BC STR ਨਿਯਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ", fr:"Posez vos questions sur les règles STR" },
  chatPlaceholder: { en:"Ask about BC STR rules...", zh:"询问BC短租规则...", pa:"BC STR ਨਿਯਮਾਂ ਬਾਰੇ ਪੁੱਛੋ...", fr:"Questions sur les règles STR..." },
  free: { en:"100% Free", zh:"100%免费", pa:"100% ਮੁਫ਼ਤ", fr:"100% Gratuit" },
};

const CATS = {
  eligibility: { en:"Eligibility", zh:"资格", pa:"ਯੋਗਤਾ", fr:"Éligibilité", i:"\u{1F3E0}" },
  licensing: { en:"Licensing", zh:"许可证", pa:"ਲਾਇਸੈਂਸ", fr:"Licence", i:"\u{1F4CB}" },
  approval: { en:"Approvals", zh:"审批", pa:"ਮਨਜ਼ੂਰੀ", fr:"Approbations", i:"\u270D\uFE0F" },
  safety: { en:"Fire & Safety", zh:"消防与安全", pa:"ਅੱਗ ਅਤੇ ਸੁਰੱਖਿਆ", fr:"Incendie & Sécurité", i:"\u{1F525}" },
  insurance: { en:"Insurance", zh:"保险", pa:"ਬੀਮਾ", fr:"Assurance", i:"\u{1F6E1}\uFE0F" },
  listing: { en:"Listing Requirements", zh:"列表要求", pa:"ਲਿਸਟਿੰਗ ਲੋੜਾਂ", fr:"Exigences d'annonce", i:"\u{1F4F1}" },
  operations: { en:"Operations", zh:"运营", pa:"ਕਾਰਜ", fr:"Opérations", i:"\u2699\uFE0F" },
};

const CL = {
  v1:{en:"Property is my principal residence",zh:"物业是我的主要住所",pa:"ਜਾਇਦਾਦ ਮੇਰਾ ਮੁੱਖ ਨਿਵਾਸ ਹੈ",fr:"La propriété est ma résidence principale"},
  v2:{en:"Only operating one STR licence",zh:"仅持有一个短租许可证",pa:"ਸਿਰਫ਼ ਇੱਕ STR ਲਾਇਸੈਂਸ",fr:"Un seul permis STR"},
  v16:{en:"Not renting both house AND suite",zh:"不同时出租房屋和套房",pa:"ਘਰ ਅਤੇ ਸੂਟ ਦੋਵੇਂ ਨਹੀਂ",fr:"Ne pas louer maison ET suite"},
  v3:{en:"City business licence obtained",zh:"已获得城市营业执照",pa:"ਸ਼ਹਿਰ ਦਾ ਕਾਰੋਬਾਰੀ ਲਾਇਸੈਂਸ",fr:"Licence commerciale obtenue"},
  v4:{en:"Registered with BC Provincial STR Registry",zh:"已在BC省短租注册处注册",pa:"BC ਸੂਬਾਈ STR ਰਜਿਸਟਰੀ ਵਿੱਚ ਰਜਿਸਟਰਡ",fr:"Inscrit au registre provincial"},
  v5:{en:"Strata approval obtained (if applicable)",zh:"已获得物业管理委员会批准（如适用）",pa:"ਸਟ੍ਰਾਟਾ ਮਨਜ਼ੂਰੀ ਪ੍ਰਾਪਤ (ਜੇ ਲਾਗੂ)",fr:"Approbation strata obtenue (si applicable)"},
  v6:{en:"Landlord approval obtained (if renting)",zh:"已获得房东批准（如租赁）",pa:"ਮਕਾਨ-ਮਾਲਕ ਦੀ ਮਨਜ਼ੂਰੀ (ਜੇ ਕਿਰਾਏ ਤੇ)",fr:"Approbation du propriétaire (si locataire)"},
  v7:{en:"Interconnected smoke alarms — every floor & bedroom",zh:"互联烟雾报警器 — 每层及每间卧室",pa:"ਆਪਸ ਵਿੱਚ ਜੁੜੇ ਧੂੰਏਂ ਅਲਾਰਮ — ਹਰ ਮੰਜ਼ਿਲ ਅਤੇ ਬੈੱਡਰੂਮ",fr:"Alarmes incendie interconnectées — chaque étage et chambre"},
  v8:{en:"Fire extinguisher on every floor",zh:"每层备有灭火器",pa:"ਹਰ ਮੰਜ਼ਿਲ ਤੇ ਅੱਗ ਬੁਝਾਊ ਯੰਤਰ",fr:"Extincteur à chaque étage"},
  v9:{en:"CO detectors (if gas appliances)",zh:"CO检测器（如有燃气设备）",pa:"CO ਡਿਟੈਕਟਰ (ਜੇ ਗੈਸ ਉਪਕਰਨ)",fr:"Détecteurs CO (si appareils à gaz)"},
  v10:{en:"Fire plan posted at entrances/exits",zh:"出入口张贴消防计划",pa:"ਦਾਖਲੇ/ਬਾਹਰ ਤੇ ਅੱਗ ਯੋਜਨਾ",fr:"Plan incendie affiché aux entrées/sorties"},
  v11:{en:"Fire separation or sprinkler (if attached)",zh:"防火分隔或喷淋系统（如连体）",pa:"ਅੱਗ ਵੱਖ ਕਰਨ ਜਾਂ ਸਪ੍ਰਿੰਕਲਰ (ਜੇ ਜੁੜਿਆ)",fr:"Séparation coupe-feu ou gicleurs (si attaché)"},
  v12:{en:"Insurance covers STR activity",zh:"保险覆盖短租活动",pa:"ਬੀਮਾ STR ਗਤੀਵਿਧੀ ਕਵਰ ਕਰਦਾ ਹੈ",fr:"Assurance couvre l'activité STR"},
  v13:{en:"Licence number on ALL listings",zh:"所有列表上显示许可证号",pa:"ਸਾਰੀਆਂ ਲਿਸਟਿੰਗਾਂ ਤੇ ਲਾਇਸੈਂਸ ਨੰਬਰ",fr:"Numéro de licence sur TOUTES les annonces"},
  v14:{en:"Paper licence posted in unit",zh:"纸质许可证张贴在房间内",pa:"ਯੂਨਿਟ ਵਿੱਚ ਕਾਗਜ਼ੀ ਲਾਇਸੈਂਸ",fr:"Licence papier affichée dans l'unité"},
  v15:{en:"24/7 contact info for guests",zh:"为客人提供24/7联系方式",pa:"ਮਹਿਮਾਨਾਂ ਲਈ 24/7 ਸੰਪਰਕ ਜਾਣਕਾਰੀ",fr:"Coordonnées 24/7 pour les invités"},
  vi1:{en:"Property is my principal residence",zh:"物业是我的主要住所",pa:"ਜਾਇਦਾਦ ਮੇਰਾ ਮੁੱਖ ਨਿਵਾਸ ਹੈ",fr:"Résidence principale"},
  vi2:{en:"City of Victoria STR licence",zh:"维多利亚市短租许可证",pa:"ਵਿਕਟੋਰੀਆ ਸ਼ਹਿਰ STR ਲਾਇਸੈਂਸ",fr:"Licence STR Victoria"},
  vi3:{en:"Registered with Provincial Registry",zh:"已在省注册处注册",pa:"ਸੂਬਾਈ ਰਜਿਸਟਰੀ ਵਿੱਚ ਰਜਿਸਟਰਡ",fr:"Inscrit au registre provincial"},
  vi4:{en:"Strata & owner consent",zh:"物业管理和业主同意",pa:"ਸਟ੍ਰਾਟਾ ਅਤੇ ਮਾਲਕ ਦੀ ਸਹਿਮਤੀ",fr:"Consentement strata et propriétaire"},
  vi5:{en:"Tracking whole-home nights (max 160)",zh:"追踪整屋出租天数（最多160）",pa:"ਪੂਰੇ ਘਰ ਦੀਆਂ ਰਾਤਾਂ ਟਰੈਕ (ਵੱਧ 160)",fr:"Suivi des nuits (max 160)"},
  vi6:{en:"Both licence numbers on listings",zh:"列表上显示两个许可证号",pa:"ਲਿਸਟਿੰਗਾਂ ਤੇ ਦੋਵੇਂ ਲਾਇਸੈਂਸ ਨੰਬਰ",fr:"Les deux numéros sur les annonces"},
  vi7:{en:"Safety and building compliance",zh:"安全和建筑合规",pa:"ਸੁਰੱਖਿਆ ਅਤੇ ਇਮਾਰਤ ਪਾਲਣਾ",fr:"Conformité sécurité et bâtiment"},
  vi8:{en:"Insurance covers STR activity",zh:"保险覆盖短租",pa:"ਬੀਮਾ STR ਕਵਰ ਕਰਦਾ ਹੈ",fr:"Assurance couvre STR"},
  k1:{en:"Property is my principal residence",zh:"物业是我的主要住所",pa:"ਜਾਇਦਾਦ ਮੇਰਾ ਮੁੱਖ ਨਿਵਾਸ ਹੈ",fr:"Résidence principale"},
  k2:{en:"City of Kelowna STR licence",zh:"基洛纳市短租许可证",pa:"ਕੈਲੋਨਾ ਸ਼ਹਿਰ STR ਲਾਇਸੈਂਸ",fr:"Licence STR Kelowna"},
  k3:{en:"Registered with Provincial Registry",zh:"已在省注册处注册",pa:"ਸੂਬਾਈ ਰਜਿਸਟਰੀ ਵਿੱਚ ਰਜਿਸਟਰਡ",fr:"Inscrit au registre provincial"},
  k4:{en:"Monitoring regulation changes",zh:"关注法规变更",pa:"ਨਿਯਮ ਤਬਦੀਲੀਆਂ ਦੀ ਨਿਗਰਾਨੀ",fr:"Surveiller les changements"},
  k5:{en:"Safety and building compliance",zh:"安全和建筑合规",pa:"ਸੁਰੱਖਿਆ ਪਾਲਣਾ",fr:"Conformité sécurité"},
  k6:{en:"Insurance covers STR activity",zh:"保险覆盖短租",pa:"ਬੀਮਾ STR ਕਵਰ",fr:"Assurance couvre STR"},
  w1:{en:"Property is my principal residence",zh:"物业是我的主要住所",pa:"ਮੁੱਖ ਨਿਵਾਸ",fr:"Résidence principale"},
  w2:{en:"District STR licence obtained",zh:"已获得区短租许可证",pa:"ਜ਼ਿਲ੍ਹਾ STR ਲਾਇਸੈਂਸ",fr:"Licence STR du district"},
  w3:{en:"Registered with Provincial Registry",zh:"已在省注册处注册",pa:"ਸੂਬਾਈ ਰਜਿਸਟਰੀ",fr:"Registre provincial"},
  w4:{en:"Max 8 guests at any time",zh:"任何时候最多8位客人",pa:"ਕਿਸੇ ਵੀ ਸਮੇਂ ਵੱਧ ਤੋਂ ਵੱਧ 8 ਮਹਿਮਾਨ",fr:"Maximum 8 invités"},
  w5:{en:"Secondary suite licence (if applicable)",zh:"附属套房许可证（如适用）",pa:"ਸੈਕੰਡਰੀ ਸੂਟ ਲਾਇਸੈਂਸ",fr:"Licence suite secondaire"},
  w6:{en:"Safety equipment installed",zh:"已安装安全设备",pa:"ਸੁਰੱਖਿਆ ਉਪਕਰਨ ਸਥਾਪਿਤ",fr:"Équipement de sécurité installé"},
  w7:{en:"Strata bylaws allow STR",zh:"物业管理章程允许短租",pa:"ਸਟ੍ਰਾਟਾ ਉਪ-ਨਿਯਮ STR ਦੀ ਆਗਿਆ",fr:"Règlements strata autorisent STR"},
  w8:{en:"Insurance covers STR activity",zh:"保险覆盖短租",pa:"ਬੀਮਾ STR ਕਵਰ",fr:"Assurance couvre STR"},
};

const CITIES = {
  vancouver: {
    name:"Vancouver", licence_fee:"$1,108/yr", application_fee:"$77", late_fee:"$111", renewal_deadline:"Dec 31", definition:"<90 days", night_cap:"No cap", max_fine:"$50,000+$3,000/day", provincial_reg:"$100-$450/yr",
    checklist: [
      {id:"v1",category:"eligibility",critical:true,detail:"Must live full-time. No investment properties or vacant units."},
      {id:"v2",category:"eligibility",critical:true,detail:"City issues one licence per person only."},
      {id:"v16",category:"eligibility",critical:true,detail:"Cannot rent main house and secondary suite simultaneously."},
      {id:"v3",category:"licensing",critical:true,detail:"$1,108/yr + $77 application. Renew by Dec 31."},
      {id:"v4",category:"licensing",critical:true,detail:"Mandatory since May 2025. $100/yr or $450/yr. Number on all listings."},
      {id:"v5",category:"approval",critical:true,detail:"Written strata approval required BEFORE applying."},
      {id:"v6",category:"approval",critical:false,detail:"Written landlord permission needed."},
      {id:"v7",category:"safety",critical:true,detail:"Interconnected — when one triggers, all trigger."},
      {id:"v8",category:"safety",critical:true,detail:"Working, accessible. Keep inspection records."},
      {id:"v9",category:"safety",critical:true,detail:"Every floor if gas appliances present."},
      {id:"v10",category:"safety",critical:true,detail:"Visible plan at every entrance and exit."},
      {id:"v11",category:"safety",critical:true,detail:"Sprinkler system OR 45-min fire separation."},
      {id:"v12",category:"insurance",critical:true,detail:"Confirm policy covers STR. Liable for guest damage.",affiliate:"insurance"},
      {id:"v13",category:"listing",critical:true,detail:"City + provincial numbers on every listing and ad."},
      {id:"v14",category:"listing",critical:true,detail:"Physical copy displayed inside unit."},
      {id:"v15",category:"operations",critical:true,detail:"Reachable 24/7 contact for all guests."},
    ],
    deadlines:[{date:"Dec 31",label:{en:"City licence renewal",zh:"城市许可证续期",pa:"ਸ਼ਹਿਰ ਲਾਇਸੈਂਸ ਨਵੀਨੀਕਰਨ",fr:"Renouvellement licence"},urgency:"high"},{date:{en:"Annual",zh:"每年",pa:"ਸਾਲਾਨਾ",fr:"Annuel"},label:{en:"Provincial registry renewal",zh:"省注册续期",pa:"ਸੂਬਾਈ ਰਜਿਸਟਰੀ ਨਵੀਨੀਕਰਨ",fr:"Renouvellement registre"},urgency:"high"},{date:{en:"Before listing",zh:"上架前",pa:"ਲਿਸਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ",fr:"Avant l'annonce"},label:{en:"Safety compliance check",zh:"安全合规检查",pa:"ਸੁਰੱਖਿਆ ਪਾਲਣਾ ਜਾਂਚ",fr:"Vérification sécurité"},urgency:"medium"}],
  },
  victoria: {
    name:"Victoria", licence_fee:"$150/yr", application_fee:"Incl.", late_fee:"Must re-apply", renewal_deadline:"Jan 15", definition:"<30 nights", night_cap:"160 nights/yr", max_fine:"$50,000+", provincial_reg:"$100-$450/yr",
    checklist:[{id:"vi1",category:"eligibility",critical:true,detail:"Principal residence only."},{id:"vi2",category:"licensing",critical:true,detail:"$150/yr. Expires Jan 15 — re-apply annually."},{id:"vi3",category:"licensing",critical:true,detail:"Provincial number on all listings."},{id:"vi4",category:"approval",critical:true,detail:"All documents and responsible person info."},{id:"vi5",category:"operations",critical:true,detail:"160 nights max when owner away."},{id:"vi6",category:"listing",critical:true,detail:"Both numbers on every listing."},{id:"vi7",category:"safety",critical:true,detail:"May require City inspection."},{id:"vi8",category:"insurance",critical:true,detail:"Confirm coverage.",affiliate:"insurance"}],
    deadlines:[{date:"Jan 15",label:{en:"Victoria licence expiry",zh:"维多利亚许可证到期",pa:"ਵਿਕਟੋਰੀਆ ਲਾਇਸੈਂਸ ਮਿਆਦ",fr:"Expiration licence Victoria"},urgency:"high"},{date:{en:"Annual",zh:"每年",pa:"ਸਾਲਾਨਾ",fr:"Annuel"},label:{en:"Provincial registry renewal",zh:"省注册续期",pa:"ਸੂਬਾਈ ਰਜਿਸਟਰੀ",fr:"Renouvellement registre"},urgency:"high"},{date:{en:"Ongoing",zh:"持续",pa:"ਜਾਰੀ",fr:"En cours"},label:{en:"Track nights (160 max)",zh:"追踪天数（最多160）",pa:"ਰਾਤਾਂ ਟਰੈਕ (160 ਵੱਧ)",fr:"Suivi des nuits (160 max)"},urgency:"medium"}],
  },
  kelowna: {
    name:"Kelowna", licence_fee:"Varies", application_fee:"Contact city", late_fee:"Varies", renewal_deadline:"Annual", definition:"<90 days", night_cap:"TBD", max_fine:"$50,000", provincial_reg:"$100-$450/yr",
    checklist:[{id:"k1",category:"eligibility",critical:true,detail:"May change late 2026 if exemption granted."},{id:"k2",category:"licensing",critical:true,detail:"Valid Kelowna licence required."},{id:"k3",category:"licensing",critical:true,detail:"Provincial registration mandatory."},{id:"k4",category:"operations",critical:true,detail:"Rules may change ~November 2026."},{id:"k5",category:"safety",critical:true,detail:"Alarms, extinguishers, CO detectors."},{id:"k6",category:"insurance",critical:true,detail:"Verify coverage.",affiliate:"insurance"}],
    deadlines:[{date:{en:"Annual",zh:"每年",pa:"ਸਾਲਾਨਾ",fr:"Annuel"},label:{en:"City licence renewal",zh:"城市许可证续期",pa:"ਸ਼ਹਿਰ ਲਾਇਸੈਂਸ",fr:"Renouvellement licence"},urgency:"high"},{date:"~Nov 2026",label:{en:"Potential regulation changes",zh:"可能的法规变更",pa:"ਸੰਭਾਵੀ ਨਿਯਮ ਤਬਦੀਲੀਆਂ",fr:"Changements possibles"},urgency:"medium"}],
  },
  west_vancouver: {
    name:"West Van", licence_fee:"Contact district", application_fee:"Contact", late_fee:"Varies", renewal_deadline:"Annual", definition:"<30 days", night_cap:"N/A", max_fine:"$50,000", provincial_reg:"$100-$450/yr",
    checklist:[{id:"w1",category:"eligibility",critical:true,detail:"One licence per parcel."},{id:"w2",category:"licensing",critical:true,detail:"Required since Jan 2025."},{id:"w3",category:"licensing",critical:true,detail:"Provincial registration mandatory."},{id:"w4",category:"operations",critical:true,detail:"8 guests max at any time."},{id:"w5",category:"licensing",critical:false,detail:"Approved suite licence needed first."},{id:"w6",category:"safety",critical:true,detail:"Alarms, extinguishers, CO detectors, emergency contact."},{id:"w7",category:"approval",critical:true,detail:"Strata can ban STRs."},{id:"w8",category:"insurance",critical:true,detail:"Verify coverage.",affiliate:"insurance"}],
    deadlines:[{date:{en:"Annual",zh:"每年",pa:"ਸਾਲਾਨਾ",fr:"Annuel"},label:{en:"District licence renewal",zh:"区许可证续期",pa:"ਜ਼ਿਲ੍ਹਾ ਲਾਇਸੈਂਸ",fr:"Renouvellement licence district"},urgency:"high"}],
  },
};

const AFF = {
  insurance:{title:{en:"Need STR Insurance?",zh:"需要短租保险？",pa:"STR ਬੀਮਾ ਚਾਹੀਦਾ?",fr:"Besoin d'assurance STR?"},desc:{en:"Most homeowner policies don't cover STRs.",zh:"大多数房主保险不覆盖短租。",pa:"ਜ਼ਿਆਦਾਤਰ ਮਕਾਨ-ਮਾਲਕ ਪਾਲਿਸੀਆਂ STR ਕਵਰ ਨਹੀਂ ਕਰਦੀਆਂ।",fr:"La plupart des polices ne couvrent pas les STR."},i:"\u{1F6E1}\uFE0F",c:"#2D6A4F"},
  safety:{title:{en:"Safety Equipment",zh:"安全设备",pa:"ਸੁਰੱਖਿਆ ਉਪਕਰਨ",fr:"Équipement de sécurité"},desc:{en:"Get everything in one kit — alarms, extinguishers, CO detectors.",zh:"一套搞定 — 警报器、灭火器、CO检测器。",pa:"ਇੱਕ ਕਿੱਟ ਵਿੱਚ ਸਭ — ਅਲਾਰਮ, ਬੁਝਾਊ ਯੰਤਰ, CO ਡਿਟੈਕਟਰ।",fr:"Tout en un kit — alarmes, extincteurs, détecteurs CO."},i:"\u{1F525}",c:"#B68D40"},
  management:{title:{en:"Compliance Help",zh:"合规帮助",pa:"ਪਾਲਣਾ ਮਦਦ",fr:"Aide à la conformité"},desc:{en:"Local managers handle everything for you.",zh:"本地管理公司为您处理一切。",pa:"ਸਥਾਨਕ ਮੈਨੇਜਰ ਸਭ ਸੰਭਾਲਦੇ ਹਨ।",fr:"Les gestionnaires locaux s'occupent de tout."},i:"\u{1F3E2}",c:"#5B6ABF"},
};

const UPDATES = [
  {date:"Mar 2026",text:{en:"Vancouver publishes updated STR compliance statistics",zh:"温哥华发布更新的短租合规统计",pa:"ਵੈਨਕੂਵਰ ਨੇ ਅਪਡੇਟ STR ਪਾਲਣਾ ਅੰਕੜੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤੇ",fr:"Vancouver publie les statistiques de conformité"},city:"Vancouver"},
  {date:"Feb 2026",text:{en:"Kelowna applies for provincial exemption to principal residence requirement",zh:"基洛纳申请省级主要住所豁免",pa:"ਕੈਲੋਨਾ ਨੇ ਮੁੱਖ ਨਿਵਾਸ ਲੋੜ ਤੋਂ ਛੋਟ ਲਈ ਅਰਜ਼ੀ ਦਿੱਤੀ",fr:"Kelowna demande une exemption provinciale"},city:"Kelowna"},
  {date:"Jun 2025",text:{en:"Platforms begin auto-removing unregistered listings",zh:"平台开始自动删除未注册列表",pa:"ਪਲੇਟਫਾਰਮ ਗੈਰ-ਰਜਿਸਟਰਡ ਲਿਸਟਿੰਗਾਂ ਆਟੋ-ਹਟਾਉਣ ਲੱਗੇ",fr:"Les plateformes retirent les annonces non inscrites"},city:"All BC"},
  {date:"May 2025",text:{en:"Provincial STR registry mandatory for all BC hosts",zh:"BC省短租注册对所有房东强制",pa:"ਸੂਬਾਈ STR ਰਜਿਸਟਰੀ ਸਾਰੇ BC ਮੇਜ਼ਬਾਨਾਂ ਲਈ ਲਾਜ਼ਮੀ",fr:"Registre STR provincial obligatoire pour tous"},city:"All BC"},
];

const SYS_PROMPT = (lang) => `You are the BC STR Comply AI assistant for short-term rental compliance in British Columbia, Canada. Respond in ${lang==="zh"?"Simplified Chinese":lang==="pa"?"Punjabi (Gurmukhi script)":lang==="fr"?"French":"English"}.

KEY KNOWLEDGE (March 2026):
PROVINCIAL: All hosts must register with BC Provincial STR Registry (mandatory May 2025). Fees: $100/yr resident, $450/yr non-resident. Registration number on ALL listings. Platforms auto-remove unregistered. Max fine: $50,000. Strata can ban STRs, fine $1,000/day. Contact: 1-833-828-2240.
VANCOUVER: Licence $1,108/yr + $77 app fee. Late: $111. Renew Dec 31. Principal residence only, one licence/person. Safety: interconnected smoke alarms, fire extinguishers, CO detectors, fire plan, sprinkler/fire separation. Municipal fine: $3,000/day.
VICTORIA: $150/yr, expires Jan 15, re-apply annually. 160 night cap (whole-home). Need licence to advertise.
KELOWNA: Seeking exemption, rules may change Nov 2026.
WEST VANCOUVER: Since Jan 2025. Max 8 guests. One licence/parcel.

Be concise (<150 words). End with: "This is general info, not legal advice."`;

const SUGGESTIONS = {en:["What do I need to host in Vancouver?","How much are non-compliance fines?","Do I need strata approval?","Can I rent my basement suite?","When to renew my licence?"],zh:["在温哥华做短租需要什么？","不合规罚款多少？","需要物业管理委员会批准吗？","可以出租地下室吗？","什么时候续期许可证？"],pa:["ਵੈਨਕੂਵਰ ਵਿੱਚ ਮੇਜ਼ਬਾਨੀ ਲਈ ਕੀ ਚਾਹੀਦਾ?","ਜੁਰਮਾਨੇ ਕਿੰਨੇ ਹਨ?","ਸਟ੍ਰਾਟਾ ਮਨਜ਼ੂਰੀ ਚਾਹੀਦੀ?","ਬੇਸਮੈਂਟ ਸੂਟ ਕਿਰਾਏ ਤੇ ਦੇ ਸਕਦਾ?","ਲਾਇਸੈਂਸ ਕਦੋਂ ਨਵੀਨੀਕਰਨ?"],fr:["Que faut-il pour héberger à Vancouver?","Montant des amendes?","Approbation strata nécessaire?","Puis-je louer mon sous-sol?","Quand renouveler ma licence?"]};

function Ring({pct,sz=120,sw=9}){const r=(sz-sw)/2,c=2*Math.PI*r,o=c-(pct/100)*c;const col=pct===100?"#2D6A4F":pct>=70?"#B68D40":"#C1444E";return(<svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{transition:"all .7s cubic-bezier(.4,0,.2,1)"}}/><text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central" style={{transform:"rotate(90deg)",transformOrigin:"center",fontSize:sz*.26,fontWeight:800,fill:col,fontFamily:"'Space Grotesk'"}}>{pct}%</text></svg>);}

function Chat({onClose,lang}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:lang==="zh"?"你好！我是BC短租合规助手。问我任何关于BC短租规则的问题！":lang==="pa"?"ਹੈਲੋ! ਮੈਂ BC STR ਪਾਲਣਾ ਸਹਾਇਕ ਹਾਂ। BC STR ਨਿਯਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ!":lang==="fr"?"Bonjour! Je suis l'assistant IA de conformité STR. Posez-moi vos questions!":"Hey! I'm your BC STR compliance assistant. Ask me anything about STR rules!"}]);
  const [inp,setInp]=useState("");const [ld,setLd]=useState(false);const end=useRef(null);const iRef=useRef(null);
  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"})},[msgs,ld]);
  useEffect(()=>{iRef.current?.focus()},[]);
  const send=async()=>{if(!inp.trim()||ld)return;const u=inp.trim();setInp("");const nm=[...msgs,{role:"user",content:u}];setMsgs(nm);setLd(true);
    try{const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYS_PROMPT(lang),messages:nm.map(m=>({role:m.role,content:m.content}))})});const d=await r.json();const t=d.content?.map(b=>b.type==="text"?b.text:"").filter(Boolean).join("\n")||"Error. Try again.";setMsgs(p=>[...p,{role:"assistant",content:t}]);}catch(e){setMsgs(p=>[...p,{role:"assistant",content:"Connection error. Please try again."}]);}setLd(false);};
  return(
    <div style={{position:"fixed",bottom:70,right:20,width:380,maxWidth:"calc(100vw - 40px)",height:500,maxHeight:"calc(100vh - 100px)",background:"#fff",borderRadius:20,boxShadow:"0 12px 48px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.05)",display:"flex",flexDirection:"column",zIndex:300,overflow:"hidden",animation:"fu .3s ease"}}>
      <div style={{padding:"14px 18px",background:"linear-gradient(135deg,#2D6A4F,#40916C)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:30,height:30,borderRadius:9,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{"\u{1F916}"}</div><div><div style={{fontWeight:600,fontSize:13.5}}>{T.chatTitle[lang]}</div><div style={{fontSize:10.5,opacity:.8}}>{T.chatSub[lang]}</div></div></div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",width:26,height:26,borderRadius:7,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>&times;</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:m.role==="user"?"13px 13px 4px 13px":"13px 13px 13px 4px",background:m.role==="user"?"#2D6A4F":"#F4F3F0",color:m.role==="user"?"#fff":"#333",fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.content}</div></div>))}
        {ld&&<div style={{display:"flex"}}><div style={{padding:"9px 13px",borderRadius:"13px 13px 13px 4px",background:"#F4F3F0",display:"flex",gap:4}}><div style={{width:6,height:6,borderRadius:"50%",background:"#999",animation:"pulse 1s infinite"}}/><div style={{width:6,height:6,borderRadius:"50%",background:"#999",animation:"pulse 1s infinite .2s"}}/><div style={{width:6,height:6,borderRadius:"50%",background:"#999",animation:"pulse 1s infinite .4s"}}/></div></div>}
        <div ref={end}/>
        {msgs.length<=1&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:2}}>{(SUGGESTIONS[lang]||SUGGESTIONS.en).map((s,i)=>(<button key={i} onClick={()=>setInp(s)} style={{background:"#fff",border:"1px solid #E0DDD5",borderRadius:100,padding:"5px 11px",fontSize:11.5,color:"#555",cursor:"pointer",fontFamily:"'DM Sans'"}}>{s}</button>))}</div>}
      </div>
      <div style={{padding:"10px 14px",borderTop:"1px solid #EDECE8",display:"flex",gap:7,flexShrink:0}}>
        <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={T.chatPlaceholder[lang]} style={{flex:1,padding:"9px 13px",borderRadius:11,border:"1px solid #E0DDD5",fontSize:13.5,fontFamily:"'DM Sans'",background:"#FAFAF7"}}/>
        <button onClick={send} disabled={ld||!inp.trim()} style={{width:38,height:38,borderRadius:11,border:"none",cursor:inp.trim()?"pointer":"default",background:inp.trim()?"#2D6A4F":"#E0DDD5",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",flexShrink:0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      </div>
    </div>
  );
}

export default function App(){
  const [lang,setLang]=useState("en");
  const [city,setCity]=useState("vancouver");
  const [ck,setCk]=useState({});const [exp,setExp]=useState(null);const [tab,setTab]=useState("checklist");
  const [mail,setMail]=useState("");const [subbed,setSubbed]=useState(false);const [aff,setAff]=useState(null);
  const [welcome,setWelcome]=useState(true);const [chatOpen,setChatOpen]=useState(false);
  const [langOpen,setLangOpen]=useState(false);

  const t=(key)=>key[lang]||key.en||key;
  const d=CITIES[city],tot=d.checklist.length,done=d.checklist.filter(i=>ck[i.id]).length;
  const crit=d.checklist.filter(i=>i.critical),critDone=crit.filter(i=>ck[i.id]).length;
  const pct=tot>0?Math.round(done/tot*100):0,gap=crit.length-critDone;
  const risk=gap===0?"ok":gap<=3?"warn":"bad";
  const grp={};d.checklist.forEach(i=>{if(!grp[i.category])grp[i.category]=[];grp[i.category].push(i);});
  const rc={ok:{l:T.compliant[lang],c:"#2D6A4F",bg:"rgba(45,106,79,.05)",bd:"rgba(45,106,79,.12)",t:T.riskOk[lang]},warn:{l:T.atRisk[lang],c:"#B68D40",bg:"rgba(182,141,64,.05)",bd:"rgba(182,141,64,.12)",t:`${gap} ${T.riskWarn[lang]}`},bad:{l:T.highRisk[lang],c:"#C1444E",bg:"rgba(193,68,78,.05)",bd:"rgba(193,68,78,.12)",t:`${gap} ${T.riskBad[lang]}`}}[risk];
  const doSub=async()=>{if(!mail.includes("@")||!mail.includes("."))return;try{const r=await fetch(SUPABASE_URL+"/rest/v1/subscribers",{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":"Bearer "+SUPABASE_KEY,"Prefer":"return=minimal"},body:JSON.stringify({email:mail})});if(!r.ok){const e=await r.text();console.error(e);}setSubbed(true);}catch(e){console.error(e);setSubbed(true);}};

  const EmailBox=({label,btn})=>!subbed?(
    <div style={{background:"linear-gradient(135deg,rgba(45,106,79,.03),rgba(45,106,79,.07))",borderRadius:14,padding:"16px 18px",marginBottom:16,border:"1px solid rgba(45,106,79,.1)"}}>
      <div style={{display:"flex",alignItems:"start",gap:9,marginBottom:10}}><span style={{fontSize:17}}>{"\u{1F514}"}</span><div><h3 style={{fontSize:13.5,fontWeight:600,marginBottom:1}}>{label}</h3><p style={{fontSize:12,color:"#777",lineHeight:1.5}}>{T.emailDesc[lang]}</p></div></div>
      <div style={{display:"flex",gap:7}}><input value={mail} onChange={e=>setMail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&doSub()} style={{flex:1,padding:"9px 13px",borderRadius:10,border:"1px solid #DDD",fontSize:13,fontFamily:"'DM Sans'",background:"#fff"}}/><button onClick={doSub} style={{background:"#2D6A4F",color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'",whiteSpace:"nowrap"}}>{btn}</button></div>
    </div>
  ):(<div style={{background:"rgba(45,106,79,.05)",borderRadius:14,padding:"12px 16px",marginBottom:16,border:"1px solid rgba(45,106,79,.1)",display:"flex",alignItems:"center",gap:9}}><span>{"\u2705"}</span><p style={{fontSize:13,color:"#2D6A4F",fontWeight:500}}>{T.subscribed[lang]}</p></div>);

  return(
    <div style={{minHeight:"100vh",background:"#F8F7F4",fontFamily:"'DM Sans',sans-serif",color:"#1A1A1A"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}::selection{background:#2D6A4F;color:#fff}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes si{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes bounceIn{0%{transform:scale(0)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
        .fu{animation:fu .4s ease-out forwards}.ir{transition:all .15s}.ir:hover{background:rgba(0,0,0,.015)}
        .tb{cursor:pointer;border:none;background:none;padding:11px 15px;font-size:12.5px;font-family:'DM Sans';font-weight:500;color:#aaa;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}.tb:hover{color:#777}.tb.on{color:#1A1A1A;border-bottom-color:#2D6A4F}
        .cp{cursor:pointer;border:1.5px solid #E0DDD5;background:#fff;padding:6px 14px;border-radius:100px;font-size:12px;font-family:'DM Sans';font-weight:500;color:#888;transition:all .15s;white-space:nowrap}.cp:hover{border-color:#999}.cp.on{background:#1A1A1A;color:#fff;border-color:#1A1A1A}
        .ac{transition:all .2s;cursor:pointer}.ac:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.08)!important}
        .ov{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(6px);animation:fu .25s ease}
        input:focus{outline:2px solid #2D6A4F;outline-offset:-1px}
        .chat-fab{position:fixed;bottom:65px;right:20px;width:52px;height:52px;border-radius:15px;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 6px 24px rgba(45,106,79,.35);z-index:299;transition:all .2s;animation:bounceIn .4s ease}.chat-fab:hover{transform:scale(1.05)}
        .lang-dd{position:absolute;top:100%;right:0;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.12);border:1px solid #EDECE8;overflow:hidden;z-index:100;animation:fu .2s ease;min-width:140px}
        @media(max-width:600px){.sr{flex-direction:column!important;text-align:center}.fg{grid-template-columns:1fr!important}}
      `}</style>

      {welcome&&(<div className="ov" onClick={()=>setWelcome(false)}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:"36px 30px",maxWidth:460,width:"92%",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><span style={{fontSize:28}}>{"\u{1F3E0}"}</span></div>
        <h2 style={{fontFamily:"'Space Grotesk'",fontSize:23,fontWeight:700,marginBottom:7}}>{T.welcomeTitle[lang]}</h2>
        <p style={{color:"#888",fontSize:14,lineHeight:1.7,marginBottom:5}}>{T.welcomeDesc[lang]}</p>
        <p style={{color:"#bbb",fontSize:12.5,lineHeight:1.6,marginBottom:22}}>{T.welcomeSub[lang]}</p>
        <button onClick={()=>setWelcome(false)} style={{background:"#2D6A4F",color:"#fff",border:"none",borderRadius:100,padding:"12px 38px",fontSize:14.5,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'",boxShadow:"0 4px 16px rgba(45,106,79,.3)"}}>{T.welcomeCta[lang]}</button>
        <p style={{marginTop:12,fontSize:11,color:"#ccc"}}>{T.welcomeFree[lang]}</p>
      </div></div>)}

      {aff&&(<div className="ov" onClick={()=>setAff(null)}><div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,padding:"28px 24px",maxWidth:420,width:"92%"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:9}}><span style={{fontSize:22}}>{AFF[aff].i}</span><h3 style={{fontFamily:"'Space Grotesk'",fontSize:17,fontWeight:700}}>{t(AFF[aff].title)}</h3></div><button onClick={()=>setAff(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#aaa"}}>&times;</button></div>
        <p style={{color:"#666",fontSize:13,lineHeight:1.7,marginBottom:14}}>{t(AFF[aff].desc)}</p>
        <div style={{padding:"12px 14px",background:"#F8F7F4",borderRadius:12,border:"1px solid #EDECE8"}}><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>Partner listings coming soon</div><div style={{fontSize:12,color:"#999"}}>We're vetting providers</div></div>
      </div></div>)}

      <header style={{background:"#fff",borderBottom:"1px solid #EDECE8"}}>
        <div style={{maxWidth:840,margin:"0 auto",padding:"14px 18px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#2D6A4F,#40916C)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:16}}>{"\u{1F3E0}"}</span></div>
              <div><h1 style={{fontFamily:"'Space Grotesk'",fontSize:17,fontWeight:700,letterSpacing:-.5}}>{T.brand[lang]}</h1><p style={{fontSize:10,color:"#bbb",fontFamily:"'DM Mono'"}}>{T.tagline[lang]}</p></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {/* Language selector */}
              <div style={{position:"relative"}}>
                <button onClick={()=>setLangOpen(!langOpen)} style={{background:"#F8F7F4",border:"1px solid #EDECE8",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12.5,fontFamily:"'DM Sans'",display:"flex",alignItems:"center",gap:5}}>
                  <span>{LANGS[lang].flag}</span><span style={{fontWeight:500}}>{LANGS[lang].label}</span>
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{opacity:.4}}><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                {langOpen&&<div className="lang-dd">
                  {Object.entries(LANGS).map(([k,v])=>(<button key={k} onClick={()=>{setLang(k);setLangOpen(false)}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px 14px",border:"none",background:lang===k?"rgba(45,106,79,.06)":"transparent",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans'",fontWeight:lang===k?600:400,color:lang===k?"#2D6A4F":"#555",textAlign:"left"}}><span>{v.flag}</span>{v.label}</button>))}
                </div>}
              </div>
              <div style={{background:"#F8F7F4",borderRadius:7,padding:"4px 9px",border:"1px solid #EDECE8"}}><div style={{fontSize:8.5,color:"#bbb",fontFamily:"'DM Mono'",letterSpacing:.5}}>VERIFIED</div><div style={{fontSize:11.5,fontWeight:600,color:"#666"}}>Mar 2026</div></div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:9,flexWrap:"wrap"}}>{Object.entries(CITIES).map(([k,c])=><button key={k} className={`cp ${city===k?"on":""}`} onClick={()=>{setCity(k);setExp(null)}}>{c.name}</button>)}</div>
          <div style={{display:"flex",borderTop:"1px solid #EDECE8",overflowX:"auto"}}>{Object.entries(T.tabs).map(([id,lb])=>(<button key={id} className={`tb ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lb[lang]}</button>))}</div>
        </div>
      </header>

      <main style={{maxWidth:840,margin:"0 auto",padding:"18px 18px 100px"}}>
        {tab==="checklist"&&(<div className="fu">
          <div className="sr" style={{background:"#fff",borderRadius:15,padding:22,marginBottom:14,border:"1px solid #EDECE8",display:"flex",alignItems:"center",gap:22,boxShadow:"0 1px 4px rgba(0,0,0,.03)"}}>
            <Ring pct={pct}/>
            <div style={{flex:1}}>
              <h2 style={{fontFamily:"'Space Grotesk'",fontSize:19,fontWeight:700,marginBottom:5}}>{d.name} {T.compliance[lang]}</h2>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:10}}><span style={{fontSize:12.5,color:"#999"}}>{done}/{tot} {T.items[lang]}</span><span style={{fontSize:12.5,color:"#B68D40",fontWeight:500}}>{critDone}/{crit.length} {T.critical[lang]}</span></div>
              <div style={{background:rc.bg,border:`1px solid ${rc.bd}`,borderRadius:10,padding:"10px 13px"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><div style={{width:7,height:7,borderRadius:"50%",background:rc.c,boxShadow:`0 0 8px ${rc.c}`}}/><span style={{fontFamily:"'DM Mono'",fontWeight:600,fontSize:11,color:rc.c,letterSpacing:1}}>{rc.l}</span></div><p style={{fontSize:12,color:"#555",lineHeight:1.5}}>{rc.t}</p></div>
            </div>
          </div>
          <EmailBox label={T.emailTitle[lang]} btn={T.subscribe[lang]}/>
          {Object.entries(grp).map(([ck2,items])=>{const ct=CATS[ck2];const cd=items.filter(i=>ck[i.id]).length;return(
            <div key={ck2} style={{marginBottom:13}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,padding:"0 2px"}}><span style={{fontSize:12}}>{ct.i}</span><span style={{fontSize:10.5,fontWeight:600,color:"#666",letterSpacing:.7,textTransform:"uppercase",fontFamily:"'DM Mono'"}}>{ct[lang]||ct.en}</span><span style={{fontSize:10,color:"#ccc",fontFamily:"'DM Mono'"}}>{cd}/{items.length}</span>{cd===items.length&&<span style={{fontSize:10,color:"#2D6A4F",fontWeight:600}}>{"\u2713"}</span>}</div>
              <div style={{background:"#fff",borderRadius:13,border:"1px solid #EDECE8",overflow:"hidden"}}>
                {items.map((item,idx)=>{const on=ck[item.id],ex=exp===item.id,cl=CL[item.id];return(
                  <div key={item.id}>
                    {idx>0&&<div style={{height:1,background:"#F0EFE9",marginLeft:46}}/>}
                    <div className="ir" style={{padding:"11px 13px",cursor:"pointer"}} onClick={()=>setExp(ex?null:item.id)}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div onClick={e=>{e.stopPropagation();setCk(p=>({...p,[item.id]:!p[item.id]}))}} style={{width:20,height:20,borderRadius:6,flexShrink:0,border:`2px solid ${on?"#2D6A4F":"#D0CFC8"}`,background:on?"#2D6A4F":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",cursor:"pointer"}}>{on&&<svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                        <span style={{flex:1,fontSize:12.5,fontWeight:500,color:on?"#bbb":"#1A1A1A",textDecoration:on?"line-through":"none"}}>{cl?cl[lang]||cl.en:item.id}</span>
                        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                          {item.critical&&!on&&<span style={{fontSize:9,fontWeight:600,color:"#C1444E",background:"rgba(193,68,78,.06)",padding:"2px 6px",borderRadius:100,fontFamily:"'DM Mono'",letterSpacing:.5}}>{T.required[lang]}</span>}
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{transform:ex?"rotate(180deg)":"rotate(0)",transition:"transform .2s",opacity:.25}}><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </div>
                      </div>
                    </div>
                    {ex&&(<div style={{padding:"0 13px 11px 46px",animation:"si .2s ease"}}>
                      <p style={{fontSize:12,lineHeight:1.65,color:"#777",marginBottom:item.affiliate?8:0}}>{item.detail}</p>
                      {item.affiliate&&(<button className="ac" onClick={e=>{e.stopPropagation();setAff(item.affiliate)}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",padding:"9px 11px",background:`${AFF[item.affiliate].c}08`,border:`1px solid ${AFF[item.affiliate].c}18`,borderRadius:10,cursor:"pointer"}}><span style={{fontSize:15}}>{AFF[item.affiliate].i}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:AFF[item.affiliate].c}}>{t(AFF[item.affiliate].title)}</div><div style={{fontSize:11,color:"#aaa"}}>→</div></div></button>)}
                    </div>)}
                  </div>
                );})}
              </div>
            </div>
          );})}
        </div>)}

        {tab==="deadlines"&&(<div className="fu">
          <div style={{background:"#fff",borderRadius:15,padding:22,marginBottom:14,border:"1px solid #EDECE8"}}>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:18,fontWeight:700,marginBottom:3}}>{d.name} {T.deadlinesTitle[lang]}</h2>
            <p style={{fontSize:12,color:"#aaa",marginBottom:14}}>{T.deadlinesWarn[lang]}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.deadlines.map((dl,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",background:dl.urgency==="high"?"rgba(193,68,78,.03)":"rgba(182,141,64,.03)",border:`1px solid ${dl.urgency==="high"?"rgba(193,68,78,.1)":"rgba(182,141,64,.1)"}`,borderRadius:11}}><div style={{width:7,height:7,borderRadius:"50%",background:dl.urgency==="high"?"#C1444E":"#B68D40",flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{typeof dl.label==="string"?dl.label:t(dl.label)}</div><div style={{fontSize:11,color:"#aaa",fontFamily:"'DM Mono'"}}>{typeof dl.date==="string"?dl.date:t(dl.date)}</div></div></div>))}
            </div>
          </div>
          <EmailBox label={T.emailTitle[lang]} btn={T.subscribe[lang]}/>
        </div>)}

        {tab==="fines"&&(<div className="fu">
          <div style={{background:"#fff",borderRadius:15,padding:22,marginBottom:14,border:"1px solid #EDECE8"}}>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:18,fontWeight:700,marginBottom:3}}>{d.name} {T.annualCosts[lang]}</h2>
            <div className="fg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
              {[["Licence",d.licence_fee],["App Fee",d.application_fee],["Late Fee",d.late_fee],["Provincial",d.provincial_reg],["Deadline",d.renewal_deadline],["Definition",d.definition],["Night Cap",d.night_cap]].map(([l,v],i)=>(<div key={i} style={{padding:"10px 12px",background:"#FAFAF7",borderRadius:9,border:"1px solid #EDECE8",gridColumn:i===6?"1/-1":"auto"}}><div style={{fontSize:9.5,color:"#bbb",fontFamily:"'DM Mono'",marginBottom:2,letterSpacing:.5,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:15,padding:22,border:"1px solid #EDECE8"}}>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:18,fontWeight:700,marginBottom:12}}>{T.penalties[lang]}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[["Provincial","$50,000","\u26A0\uFE0F",1],["Municipal/day","$3,000","\u{1F4CB}",1],["Per offence","$1,000","\u{1F4B0}",0],["Listing removal","Auto","\u{1F6AB}",1],["Bookings cancelled","Auto","\u274C",1],["Strata","$1,000/day","\u{1F3E2}",0]].map(([l,a,ic,s],i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:s?"rgba(193,68,78,.03)":"rgba(182,141,64,.03)",border:`1px solid ${s?"rgba(193,68,78,.1)":"rgba(182,141,64,.1)"}`,borderRadius:11}}><span style={{fontSize:15}}>{ic}</span><div style={{flex:1,fontSize:12.5,fontWeight:500}}>{l}</div><div style={{fontSize:12,fontWeight:700,fontFamily:"'DM Mono'",color:s?"#C1444E":"#B68D40"}}>{a}</div></div>))}
            </div>
          </div>
        </div>)}

        {tab==="updates"&&(<div className="fu">
          <div style={{background:"#fff",borderRadius:15,padding:22,marginBottom:14,border:"1px solid #EDECE8"}}>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:18,fontWeight:700,marginBottom:14}}>{T.updatesTitle[lang]}</h2>
            {UPDATES.map((u,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"13px 0",borderTop:i>0?"1px solid #F0EFE9":"none"}}><div style={{flexShrink:0,width:68}}><div style={{fontSize:11,fontWeight:600,color:"#2D6A4F",fontFamily:"'DM Mono'"}}>{u.date}</div><div style={{fontSize:10,color:"#ccc",fontFamily:"'DM Mono'",marginTop:1}}>{u.city}</div></div><p style={{fontSize:13,color:"#555",lineHeight:1.6}}>{t(u.text)}</p></div>))}
          </div>
          <EmailBox label={T.emailTitle[lang]} btn={T.subscribe[lang]}/>
        </div>)}

        {tab==="resources"&&(<div className="fu">
          <div style={{background:"#fff",borderRadius:15,padding:22,marginBottom:14,border:"1px solid #EDECE8"}}>
            <h2 style={{fontFamily:"'Space Grotesk'",fontSize:18,fontWeight:700,marginBottom:14}}>{T.resourcesTitle[lang]}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
              {Object.entries(AFF).map(([k,card])=>(<div key={k} className="ac" onClick={()=>setAff(k)} style={{padding:"15px 17px",background:"#fff",borderRadius:13,border:`1.5px solid ${card.c}15`,boxShadow:"0 2px 8px rgba(0,0,0,.03)",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}><span style={{fontSize:19}}>{card.i}</span><h3 style={{fontSize:14,fontWeight:600,color:card.c}}>{t(card.title)}</h3></div><p style={{fontSize:12,color:"#888",lineHeight:1.6}}>{t(card.desc)}</p></div>))}
            </div>
            <h3 style={{fontFamily:"'Space Grotesk'",fontSize:14,fontWeight:600,marginBottom:8}}>{T.officialLinks[lang]}</h3>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {[["Vancouver STR","vancouver.ca/short-term-rentals"],["BC Registry","gov.bc.ca/ShortTermRental"],["Victoria STR","victoria.ca"],["Kelowna STR","kelowna.ca"],["ServiceBC","1-833-828-2240"]].map(([l,u],i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"#FAFAF7",borderRadius:9,border:"1px solid #EDECE8"}}><span style={{fontSize:11}}>{"\u{1F517}"}</span><div><div style={{fontSize:12,fontWeight:500}}>{l}</div><div style={{fontSize:10.5,color:"#bbb",fontFamily:"'DM Mono'"}}>{u}</div></div></div>))}
            </div>
          </div>
          <div style={{background:"linear-gradient(135deg,#1A1A1A,#2A2A2A)",borderRadius:15,padding:22,color:"#fff"}}>
            <h3 style={{fontFamily:"'Space Grotesk'",fontSize:15,fontWeight:700,marginBottom:4}}>{T.partnerTitle[lang]}</h3>
            <p style={{fontSize:12,color:"rgba(255,255,255,.6)",lineHeight:1.6,marginBottom:10}}>{T.partnerDesc[lang]}</p>
            <button onClick={()=>setAff("management")} style={{background:"#fff",color:"#1A1A1A",border:"none",borderRadius:9,padding:"9px 22px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans'"}}>{T.partnerCta[lang]}</button>
          </div>
        </div>)}

        <div style={{marginTop:22,padding:"11px 14px",background:"#F8F7F4",borderRadius:9,border:"1px solid #EDECE8",fontSize:11,color:"#bbb",lineHeight:1.6}}><strong style={{color:"#aaa"}}>Disclaimer:</strong> {T.disclaimer[lang]}</div>
      </main>

      {!chatOpen&&<button className="chat-fab" onClick={()=>setChatOpen(true)}>{"\u{1F4AC}"}</button>}
      {chatOpen&&<Chat onClose={()=>setChatOpen(false)} lang={lang}/>}

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #EDECE8",padding:"8px 18px",zIndex:100}}>
        <div style={{maxWidth:840,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:10.5,color:"#ccc",fontFamily:"'DM Mono'"}}>{T.brand[lang]} — {T.free[lang]}</span>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:6,height:6,borderRadius:"50%",background:rc.c}}/><span style={{fontSize:10.5,color:"#999",fontFamily:"'DM Mono'"}}>{done}/{tot} · {rc.l}</span></div>
        </div>
      </div>
    </div>
  );
}