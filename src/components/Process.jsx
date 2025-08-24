// Process.jsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import './Process.css';

/*************************** SVG ICONS ***************************/
const Icon = ({ name }) => {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'icon' };
  switch (name) {
    case 'chev':
      return (<svg {...common}><polyline points="6 9 12 15 18 9"/></svg>);
    case 'location':
      return (<svg {...common}><path d="M12 22s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="11" r="2.5"/></svg>);
    case 'sunOff':
      return (<svg {...common}><path d="m2 2 20 20"/><path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M5 19l1.5-1.5"/><circle cx="12" cy="12" r="4"/></svg>);
    case 'glove':
      return (<svg {...common}><path d="M8 3v7M11 3v7M14 4v6M17 6v5"/><path d="M5 12v4a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5v-3"/></svg>);
    case 'thermo':
      return (<svg {...common}><path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z"/><path d="M10 9h4"/></svg>);
    case 'pressure':
      return (<svg {...common}><path d="M3 20h10"/><path d="M5 16l4-8 5 4 3-6"/><path d="M17 10h4v6h-4z"/></svg>);
    case 'spray':
      return (<svg {...common}><path d="M8 7h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><path d="M11 2h3a2 2 0 0 1 2 2v1H11z"/><path d="M16 4h3M16 6h2"/></svg>);
    case 'clock':
      return (<svg {...common}><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></svg>);
    case 'water':
      return (<svg {...common}><path d="M12 3s5 6 5 9a5 5 0 0 1-10 0c0-3 5-9 5-9Z"/></svg>);
    case 'foam':
      return (<svg {...common}><circle cx="7" cy="12" r="3"/><circle cx="13" cy="10" r="3.5"/><circle cx="17.5" cy="13.5" r="2.5"/></svg>);
    case 'brush':
      return (<svg {...common}><path d="M3 15h10l6-6-4-4-6 6v10"/><path d="M3 19s2 2 6 2 6-2 6-2"/></svg>);
    case 'droplet':
      return (<svg {...common}><path d="M12 2s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z"/></svg>);
    case 'wind':
      return (
        <svg {...common}>
          <path d="M3 8h8a3 3 0 1 0-3-3"/>
          <path d="M3 12h13a3 3 0 1 1-3 3"/>
          <path d="M3 16h6"/>
        </svg>
      );
    case 'towel':
      return (<svg {...common}><path d="M6 3h10a3 3 0 0 1 0 6H8a2 2 0 0 0 0 4h7"/><path d="M6 3v18"/></svg>);
    case 'file':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6"/>
          <path d="M8 13h8M8 17h5"/>
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M12 3v10"/>
          <path d="M8 11l4 4 4-4"/>
          <path d="M4 21h16"/>
        </svg>
      );
    default:
      return (<svg {...common}><rect x="4" y="4" width="16" height="16" rx="3"/></svg>);
  }
};

/*************************** TASK DATA ***************************/
const prepTasks = [
  { key: 'place', icon: 'location', label: 'Безопасное и разрешенное место', desc: 'Выберите место, где разрешена мойка и безопасно для окружающих: ровная площадка, без луж и скользких участков.' },
  { key: 'shade', icon: 'sunOff', label: 'Поместить авто в тень. Избежать солнечный лучей', desc: 'Работа в тени предотвращает быстрое высыхание воды и химии — меньше разводов и риск пятен на ЛКП. Идеальная температура кузова — «на ощупь прохладно»: слишком горячая или холодная поверхность ухудшает качество мойки.' },
  { key: 'ppe', icon: 'glove', label: 'Перчатки и прочие средства защиты', desc: 'Перчатки и защита глаз снизят контакт с реагентами. Держите рядом воду для промывки, если попало на кожу.' },
  { key: 'water', icon: 'water', label: 'Наличие доступа к воде', desc: 'Выберите способ подачи воды: «Моем ведрами» (самовсасывающая/аккумуляторная мини-мойка) или «Есть сантехническое подключение» (стационарный кран/шланг). Подберём подходящий набор.' }
];

const rinseTasks = [
  { key: 'prewash', icon: 'pressure', label: 'Смыв основной грязи (Если очень грязная машина)', desc: 'Начните с нижней части кузова и арок, чтобы убрать крупную грязь и песок перед химией.' },
  { key: 'chem', icon: 'spray', label: 'Обработка предварительной химии', desc: 'Нанесите состав снизу вверх: хватит времени подействовать, а стоки не оставят подтёков.' },
  { key: 'wait', icon: 'clock', label: 'Ожидание (5 минут)', desc: 'Дайте химии поработать, но не допускайте высыхания. Если жарко — слегка увлажняйте поверхность.' },
  { key: 'rinse', icon: 'water', label: 'Смыв реагента с грязью', desc: 'Смывайте под углом сверху вниз, не задерживаясь на эмблемах и резиновых уплотнителях.' }
];

const exteriorTasks = [
  { key: 'foam_spray', icon: 'spray', label: 'Распыление пены / эмульсии', desc: 'Равномерно покройте кузов активной пеной или эмульсией с дистанции 20–30 см. Двигайтесь снизу вверх, избегайте перегретых участков и не допускайте подсыхания состава.' },
  { key: 'soil_remove', icon: 'brush', label: 'Отчистка загрязнения', desc: 'Мягкой рукавицей или щёткой пройдитесь по секциям сверху вниз. Чаще ополаскивайте инструмент, уделяйте внимание нишам, эмблемам и нижней части дверей.' },
  { key: 'rinse_final', icon: 'water', label: 'Смыв загрязнения и пены / эмульсии', desc: 'Смывайте под углом сверху вниз, ведя струю ровно, не задерживаясь на уплотнителях и чувствительных элементах. Не дайте составу высохнуть.' }
];

// Твёрдые и глубокие загрязнения
const toughSoilTasks = [
  { key: 'tar', icon: 'spray', label: 'Устранение битума', desc: 'Точечно нанесите битумный очиститель на загрязнение, подождите 2–3 минуты и мягко снимите микрофиброй. Работайте малыми участками, не допускайте высыхания.' },
  { key: 'wax', icon: 'spray', label: 'Устранение воска', desc: 'Используйте обезжириватель/удалитель воска, распределите на панели и аккуратно протрите чистой микрофиброй. Избегайте попадания на неокрашенный пластик.' },
  { key: 'bugs', icon: 'spray', label: 'Устранение насекомых', desc: 'Смочите поверхность, нанесите средство для удаления насекомых, подождите 1–2 минуты и смойте, при необходимости помогая микрофиброй.' },
  { key: 'salts', icon: 'droplet', label: 'Устранение солей и реагентов', desc: 'Нанесите нейтрализатор/очиститель солевых отложений. Дайте подействовать и обильно смойте водой. Не допускайте высыхания состава.' },
  { key: 'waterspots', icon: 'droplet', label: 'Устранение водных камней', desc: 'Слабокислый очиститель минералов наносите локально, работая небольшими участками. После обработки тщательно смойте и при необходимости нейтрализуйте pH.' },
  { key: 'chrome', icon: 'brush', label: 'Углубленная чистка хромированных деталей', desc: 'Нанесите мягкий полиш для металлов на аппликатор, проработайте хром до блеска и удалите остатки чистой микрофиброй. При желании нанесите защиту.' },
];

// Нанесение воска / гидрофобных покрытий
const coatingTasks = [
  { key: 'liquid_wax', icon: 'spray', label: 'Нанесение жидкого воска', desc: 'После чистого смыва нанесите жидкий воск на влажный кузов распылителем. Равномерно распределите, затем смойте водой под давлением для активации.' },
];

// Сушка экстерьера
const dryingTasks = [
  { key: 'air_dry', icon: 'wind', label: 'Сушка воздухом', desc: 'Используйте воздуходувку/компрессор. Держите сопло на расстоянии 10–20 см, выгоняйте воду из эмблем, зеркал и молдингов, проходите сверху вниз.' },
  { key: 'towel_dry', icon: 'towel', label: 'Сушка полотенцем', desc: 'Сухое чистое полотенце из микрофибры (GSM 500+). Промакивающими движениями без нажима; чаще меняйте стороны, не тяните по потенциально грязным участкам.' },
  { key: 'glass_wipe', icon: 'droplet', label: 'Вытирание стекол', desc: 'Стекольный очиститель и микрофибра для стекла: движения прямые, затем крест‑накрест; пройдите кромки и углы, чтобы убрать остатки влаги.' },
];

// Твердые воски / антидождь
const solidRainTasks = [
  { key: 'hard_wax', icon: 'towel',   label: 'Нанесение твердого воска',         desc: 'Работайте по сухому кузову. Наберите немного воска на аппликатор, наносите тонким слоем по секциям. После выдержки располируйте чистой микрофиброй без нажима.' },
  { key: 'glass_coat', icon: 'droplet', label: 'Обработка стекол (Антидождь)',    desc: 'Обезжирьте стекло, нанесите состав перекрестными движениями, дайте вспениться/подсохнуть и отполируйте до прозрачности. Не касайтесь дворниками 10–15 мин.' },
];

const sections = [
  { key: 'prep', part: 1, title: 'Подготовка', tasks: prepTasks },
  { key: 'rinse', part: 2, title: 'Ополаскивание', tasks: rinseTasks },
  { key: 'exterior', part: 3, title: 'Мойка экстерьера', tasks: exteriorTasks },
  { key: 'tough', part: 4, title: 'Твердые и глубокие загрязнения', tasks: toughSoilTasks },
  { key: 'coating', part: 5, title: 'Нанесение жидкого воска (Пропустить если будем использовать твердые воски)', tasks: coatingTasks },
  { key: 'drying', part: 6, title: 'Сушка экстерьера', tasks: dryingTasks },
  { key: 'solidrain',part: 7, title: 'Твердые воски / антидождь', tasks: solidRainTasks },
];

// Демокарточки товаров (временно). Позже подцепим реальные из Inventory.
const demoProducts = [
  { name: 'Пенный распылитель 1 л', tag: 'Пена/шампунь' },
  { name: 'Микрофибра 40×40 см', tag: 'Текстиль' },
];

// Перчатки/СИЗ для подпункта ppe
const ppeProducts = [
  { name: 'Перчатки нитриловые L', tag: 'Защита рук' },
  { name: 'Перчатки нитриловые XL', tag: 'Защита рук' },
  { name: 'Комбинезон одноразовый L/XL', tag: 'Защитная одежда' },
  { name: 'Комбинезон многоразовый XXL', tag: 'Защитная одежда' },
  { name: 'Кепка с козырьком (тёмная)', tag: 'Голова' },
  { name: 'Кепка светлая с сеткой', tag: 'Голова' },
  { name: 'Футболка быстрой сушки M', tag: 'Одежда' },
  { name: 'Футболка быстрой сушки XL', tag: 'Одежда' },
  { name: 'Ботинки водоотталкивающие', tag: 'Обувь' },
  { name: 'Сапоги резиновые высокие', tag: 'Обувь' },
];

// Наборы для «Наличие доступа к воде»
const bucketWashProducts = [
  { name: 'Ведро 20 л с сепаратором', tag: 'Ведро' },
  { name: 'Ведро 10 л', tag: 'Ведро' },
  { name: 'Мини-мойка самовсасывающая 120 бар', tag: 'АВД от ведра' },
  { name: 'Мини-мойка аккумуляторная (забор из ведра)', tag: 'АВД от ведра' },
];

const plumbedProducts = [
  { name: 'Мини-мойка 140 бар', tag: 'АВД' },
  { name: 'Мини-мойка 160 бар', tag: 'АВД' },
  { name: 'Садовый шланг 15 м', tag: 'Шланг' },
  { name: 'Садовый шланг 30 м', tag: 'Шланг' },
];

/*************************** COMPONENT ***************************/
export default function Process() {
  // Session memory keys
  const STORAGE = {
    checks: 'process_checks',
    openSections: 'process_open_sections',
    openTasks: 'process_open_tasks',
  };
  const loadJSON = (k, fallback) => {
    try { const s = sessionStorage.getItem(k); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
  };
  const makeDefaultChecks = () => Object.fromEntries(
    sections.map(s => [s.key, Object.fromEntries((s.tasks || []).map(t => [t.key, false]))])
  );
  // Multi-open accordion (top→down). By default all closed.
  const [openKeys, setOpenKeys] = useState(() => new Set(loadJSON(STORAGE.openSections, [])));

  // Checklists state
  const [checks, setChecks] = useState(() => {
    const base = makeDefaultChecks();
    const saved = loadJSON(STORAGE.checks, null);
    if (!saved) return base;
    // Жёсткая синхронизация с актуальным списком задач (отбрасываем устаревшие ключи)
    const merged = {};
    for (const s of sections) {
      const sKey = s.key;
      const baseSection = base[sKey] || {};
      const savedSection = saved[sKey] || {};
      // берём только ключи, которые существуют в текущем base
      merged[sKey] = Object.fromEntries(
        Object.keys(baseSection).map(k => [k, !!savedSection[k]])
      );
    }
    // Миграция: если раньше был ключ prep.temp — перенесём отметку в prep.water
    if (saved?.prep && typeof saved.prep.temp !== 'undefined') {
      merged.prep = merged.prep || {};
      merged.prep.water = !!saved.prep.temp;
    }
    return merged;
  });

  // Открытие/закрытие подпунктов (вложенный аккордеон)
  const [openTasks, setOpenTasks] = useState(() => {
    const saved = loadJSON(STORAGE.openTasks, {});
    return Object.fromEntries(sections.map(s => [s.key, Array.isArray(saved?.[s.key]) ? saved[s.key] : []]));
  });

  // Метод подачи воды: 'bucket' | 'plumbed'
  const [waterMethod, setWaterMethod] = useState(() => loadJSON('process_water_method', 'bucket'));
  useEffect(() => { try { sessionStorage.setItem('process_water_method', JSON.stringify(waterMethod)); } catch {} }, [waterMethod]);

  const sectionProgress = (key) => {
    const section = sections.find(s => s.key === key);
    const validKeys = (section?.tasks || []).map(t => t.key);
    const obj = checks[key] || {};
    const values = validKeys.map(k => !!obj[k]);
    const total = validKeys.length;
    const done = values.filter(Boolean).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  const overall = (() => {
    const totals = sections.map(s => sectionProgress(s.key));
    const done = totals.reduce((a, b) => a + b.done, 0);
    const total = totals.reduce((a, b) => a + b.total, 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  })();

  const toggleTask = (sectionKey, taskKey) => {
    setChecks(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [taskKey]: !prev[sectionKey][taskKey] }
    }));
  };

  // Вложенный аккордеон: открыть/закрыть детали подпункта
  const toggleTaskPanel = (sectionKey, taskKey) => {
    setOpenTasks(prev => {
      const arr = prev[sectionKey] || [];
      const isOpen = arr.includes(taskKey);
      const next = isOpen ? arr.filter(k => k !== taskKey) : [...arr, taskKey];
      return { ...prev, [sectionKey]: next };
    });
  };

  const toggleOpen = (key) => {
    setOpenKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const openAll = () => setOpenKeys(new Set(sections.map(s => s.key)));
  const closeAll = () => {
    setOpenKeys(new Set());
    // Свернуть все подпункты во всех разделах
    setOpenTasks(Object.fromEntries(sections.map(s => [s.key, []])));
  };

  const clearSelection = () => {
    const empty = makeDefaultChecks();
    setChecks(empty);
    try { sessionStorage.setItem(STORAGE.checks, JSON.stringify(empty)); } catch {}
  };

  // persist memory
  useEffect(() => { try { sessionStorage.setItem(STORAGE.checks, JSON.stringify(checks)); } catch {} }, [checks]);
  useEffect(() => { try { sessionStorage.setItem(STORAGE.openSections, JSON.stringify([...openKeys])); } catch {} }, [openKeys]);
  useEffect(() => { try { sessionStorage.setItem(STORAGE.openTasks, JSON.stringify(openTasks)); } catch {} }, [openTasks]);

  return (
    <section className="process"><div className="process-wrap">
      <h2 className="section-title">Как помыть авто</h2>

      {/* Intro block before the accordion */}
      <div className="intro-card">
        <div className="intro-left"><Icon name="foam" /></div>
        <div className="intro-body">
          <h3 className="intro-title">Как пользоваться меню</h3>
          <ol className="intro-steps">
            <li>Нажимайте на заголовки, чтобы раскрывать этапы — можно открыть сразу несколько.</li>
            <li>Отмечайте пункты <b>только галочкой в квадратике</b>. Клик по тексту пункт не меняет.</li>
            <li>Кнопками справа выше можно развернуть или свернуть все разделы и подпункты.</li>
          </ol>
        </div>
      </div>

      {/* Overall progress + controls */}
      <div className="overall-progress">
        <div className="progress-label">Готово: {overall.done}/{overall.total}</div>
        <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overall.pct}>
          <div className="progress-fill" style={{ width: `${overall.pct}%` }} />
        </div>
        <div className="acc-controls">
          <button className="acc-btn" onClick={openAll}>Развернуть всё</button>
          <button className="acc-btn" onClick={closeAll}>Свернуть всё</button>
          <button className="acc-btn acc-btn--danger" onClick={clearSelection}>Стереть выбор</button>
        </div>
      </div>

      <div className="accordion theme-autowash">
        {sections.map((s) => {
          const open = openKeys.has(s.key);
          const p = sectionProgress(s.key);
          return (
            <div className={`acc-item ${open ? 'open' : ''}`} key={s.key}>
              <button className={`acc-header ${open ? 'open' : ''}`} onClick={() => toggleOpen(s.key)} aria-expanded={open} aria-controls={`panel-${s.key}`} id={`tab-${s.key}`}>
                <div className="acc-left">
                  <span className="acc-title">{(s.part ? `Часть ${s.part} — ` : '') + s.title}</span>
                  <span className={`acc-badge ${p.pct === 100 ? 'done' : ''}`}>{p.pct}%</span>
                </div>
                <span className={`acc-chevron ${open ? 'rot' : ''}`} aria-hidden>
                  <Icon name="chev" />
                </span>
              </button>

              {/* Sliding panel top→down */}
              <div className={`acc-panel ${open ? 'open' : ''}`} id={`panel-${s.key}`} role="region" aria-labelledby={`tab-${s.key}`}>
                <div className="acc-panel-inner">
                  <ul className="tasks">
                    {s.tasks.map(t => {
                      const done = !!checks[s.key]?.[t.key];
                      const taskOpen = (openTasks[s.key] || []).includes(t.key);
                      return (
                        <li key={t.key} className={`task ${done ? 'done' : ''}`} onClick={() => toggleTaskPanel(s.key, t.key)}>
                          <Icon name={t.icon} />

                          {/* Чекбокс — только по нему меняем состояние */}
                          <button
                            type="button"
                            className={`check ${done ? 'checked' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleTask(s.key, t.key); }}
                            aria-pressed={done}
                            aria-label={`Отметить пункт: ${t.label}`}
                          >
                            <span className="check-mark" />
                          </button>

                          {/* Заголовок пункта */}
                          <span className="task-label">{t.label}</span>

                          <span className={`task-hint ${taskOpen ? 'open' : ''}`} aria-hidden>
                            <span className="task-hint-text">{taskOpen ? 'Скрыть' : 'Подробнее'}</span>
                            <span className="task-hint-chev"><Icon name="chev" /></span>
                          </span>

                          {/* Кнопка сворачивания деталей подпункта */}
                          {(() => { return (
                            <div className={`task-panel ${taskOpen ? 'open' : ''}`} id={`subpanel-${s.key}-${t.key}`} onClick={(e) => e.stopPropagation()}>
                              <div className="task-panel-inner">
                                <div className="task-details">
                                  <div className="task-grid">
                                    {(s.key === 'prep' && t.key === 'place') ? (
                                      <>
                                        <div className="tg-col tg-rules">
                                          <div className="tg-title">Правила автомойки авто</div>
                                          <a className="pdf-card" href="/pravila_moyki_avto_rf.pdf" download target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>
                                            <span className="pdf-icon"><Icon name="file" /></span>
                                            <div className="pdf-info">
                                              <div className="pdf-name">pravila_moyki_avto_rf.pdf</div>
                                              <div className="pdf-meta">PDF • РФ</div>
                                            </div>
                                            <span className="pdf-download" aria-label="Скачать"><Icon name="download" /></span>
                                          </a>
                                          <div className="pdf-note">Памятка с местами, где можно и нельзя мыть авто по правилам РФ.</div>
                                        </div>

                                        <div className="tg-col tg-comment">
                                          <div className="tg-title">Комментарий</div>
                                          <div className="tg-value">{t.desc}</div>
                                        </div>
                                      </>
                                    ) : (s.key === 'prep' && t.key === 'shade') ? (
                                      <>
                                        <div className="tg-col tg-products">
                                          <div className="tg-title">Товар</div>
                                          <div className="tg-products-wrap">
                                            <div className="product-card" key={`${t.key}-tent-xl`}>
                                              <div className="pimg" aria-hidden />
                                              <div className="pinfo">
                                                <div className="pname">Тент универсальный XL 4×6 м</div>
                                                <div className="ptag">Навес / укрытие</div>
                                              </div>
                                            </div>
                                            <div className="product-card" key={`${t.key}-tent-m`}>
                                              <div className="pimg" aria-hidden />
                                              <div className="pinfo">
                                                <div className="pname">Тент универсальный M 3×3 м</div>
                                                <div className="ptag">Компактный навес</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="tg-col tg-comment">
                                          <div className="tg-title">Комментарий</div>
                                          <div className="tg-value">{t.desc}</div>
                                        </div>
                                      </>
                                    ) : (s.key === 'prep' && t.key === 'water') ? (
                                      <>
                                        <div className="tg-col tg-products">
                                          <div className="tg-title">Способ подачи воды</div>
                                          <div className="method-switch">
                                            <button className={`method-btn ${waterMethod==='bucket' ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); setWaterMethod('bucket'); }}>Моем ведрами</button>
                                            <button className={`method-btn ${waterMethod==='plumbed' ? 'on' : ''}`} onClick={(e) => { e.stopPropagation(); setWaterMethod('plumbed'); }}>Есть сантехническое подключение</button>
                                          </div>
                                          <div className="tg-products-wrap">
                                            {(waterMethod === 'bucket' ? bucketWashProducts : plumbedProducts).map((p, i) => (
                                              <div className="product-card" key={`${t.key}-wm-${i}`}>
                                                <div className="pimg" aria-hidden />
                                                <div className="pinfo">
                                                  <div className="pname">{p.name}</div>
                                                  <div className="ptag">{p.tag}</div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="tg-col tg-comment">
                                          <div className="tg-title">Комментарий</div>
                                          <div className="tg-value">{t.desc}</div>
                                        </div>
                                      </>
                                    ) : (s.key === 'prep' && t.key === 'ppe') ? (
                                      <>
                                        <div className="tg-col tg-products">
                                          <div className="tg-title">Товар</div>
                                          <div className="tg-products-wrap">
                                            {ppeProducts.map((p, i) => (
                                              <div className="product-card" key={`${t.key}-ppe-${i}`}>
                                                <div className="pimg" aria-hidden />
                                                <div className="pinfo">
                                                  <div className="pname">{p.name}</div>
                                                  <div className="ptag">{p.tag}</div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="tg-col tg-comment">
                                          <div className="tg-title">Комментарий</div>
                                          <div className="tg-value">{t.desc}</div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="tg-col tg-products">
                                          <div className="tg-title">Товар</div>
                                          <div className="tg-products-wrap">
                                            {demoProducts.map((p, i) => (
                                              <div className="product-card" key={`${t.key}-p${i}`}>
                                                <div className="pimg" aria-hidden />
                                                <div className="pinfo">
                                                  <div className="pname">{p.name}</div>
                                                  <div className="ptag">{p.tag}</div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="tg-col tg-comment">
                                          <div className="tg-title">Комментарий</div>
                                          <div className="tg-value">{t.desc}</div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ); })()}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div></section>
  );
}
