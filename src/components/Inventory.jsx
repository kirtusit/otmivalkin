import React from 'react';
import '../App.css';
import '../components/inventory.css';

// Базовые продукты
export const defaultProducts = {
  'Головные уборы': [
    { name: 'Головной убор 1', char: ['char1', 'char3'] },
    { name: 'Головной убор 2', char: ['char2', 'char5'] }
  ],
  'Обувь': [
    { name: 'Обувь 1', char: ['char4'] },
    { name: 'Обувь 2', char: ['char1', 'char6'] }
  ],
  'Штаны': [
    { name: 'Штаны 1', char: ['char2', 'char7'] },
    { name: 'Штаны 2', char: ['char3', 'char9'] }
  ],
  'Куртки': [
    { name: 'Куртка 1', char: ['char8'] },
    { name: 'Куртка 2', char: ['char10'] }
  ],
  'Комбинезоны': [
    { name: 'Комбинезон 1', char: ['char1', 'char10'] },
    { name: 'Комбинезон 2', char: ['char2', 'char3'] }
  ],
  'Перчатки': [
    { name: 'Перчатки 1', char: ['char5'] },
    { name: 'Перчатки 2', char: ['char6', 'char7'] }
  ],
  'Губки': [
    { name: 'Губка 1', char: ['char1'] },
    { name: 'Губка 2', char: ['char2'] }
  ],
  'Тряпки/полотенца': [
    { name: 'Тряпка 1', char: ['char4', 'char8'] },
    { name: 'Полотенце 1', char: ['char3'] }
  ],
  'Ведра': [
    { name: 'Ведро 1', char: ['char9'] },
    { name: 'Ведро 2', char: ['char10'] }
  ],
  'Сгоны': [
    { name: 'Сгон 1', char: ['char2'] },
    { name: 'Сгон 2', char: ['char5'] }
  ],
  'Пульверизаторы': [
    { name: 'Пульверизатор 1', char: ['char6'] },
    { name: 'Пульверизатор 2', char: ['char7'] }
  ],
  'Кисточки': [
    { name: 'Кисточка 1', char: ['char8'] },
    { name: 'Кисточка 2', char: ['char9'] }
  ],
  'Аппараты высокого давления': [
    { name: 'АПВД 1', char: ['char1'] },
    { name: 'АПВД 2', char: ['char2', 'char10'] }
  ],
  'Освещение': [
    { name: 'Освещение 1', char: ['char3'] },
    { name: 'Освещение 2', char: ['char4'] }
  ],
  'Вентиляция': [
    { name: 'Вентиляция 1', char: ['char5'] },
    { name: 'Вентиляция 2', char: ['char6'] }
  ]
};

const primary = [
  { key: 'clothing', label: 'Одежда для работы, спец роба' },
  { key: 'tools', label: 'Инструменты' },
  { key: 'equipment', label: 'Оборудование' },
  { key: 'chemistry', label: 'Химия и средства' },
  { key: 'software', label: 'Программное обеспечение' }
];

const subItems = {
  clothing: ['Головные уборы', 'Обувь', 'Штаны', 'Куртки', 'Комбинезоны', 'Перчатки'],
  tools: ['Губки', 'Тряпки/полотенца', 'Ведра', 'Сгоны', 'Пульверизаторы', 'Кисточки'],
  equipment: ['Аппараты высокого давления', 'Освещение', 'Вентиляция'],
  chemistry: ['Чистящие средства', 'Защитные покрытия', 'Средства для придачи блеска'],
  software: ['Инвентаризация', 'Учет и управление', 'Системы наблюдения']
};

function Inventory({ selected, setSelected, subSelected, setSubSelected, filters, setFilters }) {
  // Объединяем все продукты
  const products = { ...defaultProducts,
    'Чистящие средства': [
      { name: 'Средство 1', char: ['char1', 'char2'] },
      { name: 'Средство 2', char: ['char3'] }
    ],
    'Защитные покрытия': [
      { name: 'Покрытие 1', char: ['char2', 'char4'] },
      { name: 'Покрытие 2', char: ['char5'] }
    ],
    'Средства для придачи блеска': [
      { name: 'Блеск 1', char: ['char6'] },
      { name: 'Блеск 2', char: ['char7', 'char8'] }
    ],
    'Инвентаризация': [
      { name: 'ПО Инвент 1', char: ['char1', 'char2'] },
      { name: 'ПО Инвент 2', char: ['char3'] }
    ],
    'Учет и управление': [
      { name: 'ПО Учёт 1', char: ['char2', 'char4'] },
      { name: 'ПО Учёт 2', char: ['char5'] }
    ],
    'Системы наблюдения': [
      { name: 'ПО Наблюд 1', char: ['char6'] },
      { name: 'ПО Наблюд 2', char: ['char7', 'char8'] }
    ]
  };

  // Вычисляем доступные характеристики для выбранной подкатегории
  const availableChars = subSelected
    ? Array.from(new Set((products[subSelected] || []).flatMap(p => p.char))).sort()
    : [];

  // Фильтрация продуктов
  const filtered = subSelected
    ? (products[subSelected] || []).filter(p =>
        availableChars.some(ch => filters[ch] && p.char.includes(ch)) ||
        !Object.values(filters).some(Boolean)
      )
    : [];

  return (
    <section className="inventory">
      <h2 className="section-title">Инвентарь и оборудование</h2>
      <div className="cards-container">
        {primary.map(item => (
          <div key={item.key} className="card">
            <div
              className={selected === item.key ? 'circle selected' : 'circle'}
              onClick={() => { setSelected(selected === item.key ? null : item.key); setSubSelected(null); setFilters({}); }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="inventory-layout">
          <div className="subcolumn">
            {subItems[selected].map(label => (
              <div
                key={label}
                className={subSelected === label ? 'subcircle selected' : 'subcircle'}
                onClick={() => { setSubSelected(subSelected === label ? null : label); setFilters({}); }}
              >
                {label}
              </div>
            ))}
          </div>

          {subSelected && (
            <div className="filter-column">
              <h4>Фильтры:</h4>
              <div className="filter-pills">
                {availableChars.map(ch => (
                  <div
                    key={ch}
                    className={filters[ch] ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => setFilters(f => ({ ...f, [ch]: !f[ch] }))}
                  >
                    {ch.replace('char', 'Характеристика товара ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {subSelected && (
            <div className="product-column">
              {(filtered.length > 0 ? filtered : products[subSelected] || []).map((prod, idx) => (
                <div key={idx} className="product-card">
                  <div className="product-image" />
                  <div className="product-info">
                    <h3>{prod.name}</h3>
                    <p>Характеристики: {prod.char.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Inventory;