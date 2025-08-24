import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Locations.css';

// Города Краснодарского края
const cities = {
  'Краснодар': [45.04, 38.98],
  'Сочи': [43.588, 39.724],
  'Новороссийск': [44.723, 37.768],
  'Геленджик': [44.563, 38.084],
  'Туапсе': [44.108, 39.077],
  'Анапа': [44.894, 37.316],
  'Армавир': [44.994, 41.129],
  'Ейск': [46.711, 38.276]
};

// Типы автомоек
const washTypes = ['Мойки самообслуживания', 'Ручная мойка', 'Детейлинг центры'];

// Характеристики (только три)
const characteristics = [
  'Место ожидания',
  'Есть ресторан / столовая',
  'Ресепшн'
];

// Нормализация старых тегов к новым характеристикам
const deriveTags = (wash) => {
  const src = new Set(wash.chars || []);
  const tags = new Set();
  if (src.has('Место ожидания на улице') || src.has('Место ожидания в помещении')) tags.add('Место ожидания');
  if (src.has('Столовая') || src.has('Ресторан')) tags.add('Есть ресторан / столовая');
  if (src.has('Ресепшн')) tags.add('Ресепшн');
  // если уже используются новые теги напрямую
  ['Место ожидания','Есть ресторан / столовая','Ресепшн'].forEach(t => { if (src.has(t)) tags.add(t); });
  return Array.from(tags);
};

// Данные автомоек по городам края (по 2–3 в каждую категорию)
const washData = {
  'Краснодар': {
    'Мойки самообслуживания': [
      { name: 'Мой Сам!', address: 'Минская ул., 120к8', coords: [45.0305, 38.9405], chars: ['Место ожидания'] },
      { name: 'Чалик', address: 'Сормовская ул., 4а', coords: [45.0575, 39.0], chars: [] },
      { name: 'Fresh', address: 'ул. Шаляпина, 35/3', coords: [45.094, 39.018], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка на Ставропольской', address: 'ул. Ставропольская, 180', coords: [45.018, 39.015], chars: ['Место ожидания'] },
      { name: 'Автомойка «Юг»', address: 'ул. Селезнёва, 200', coords: [45.053, 39.03], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detailing BBS', address: 'ул. Красноярская, 127', coords: [45.047, 39.023], chars: ['Место ожидания','Ресепшн'] },
      { name: 'MGS‑Tuning Studio', address: 'Дальняя ул., 39к1', coords: [45.043, 39.015], chars: ['Есть ресторан / столовая'] }
    ]
  },
  'Сочи': {
    'Мойки самообслуживания': [
      { name: 'SelfWash Сочи', address: 'ул. Пластунская, 50', coords: [43.594, 39.739], chars: [] },
      { name: 'Самомой Сочи', address: 'Донская ул., 47', coords: [43.606, 39.742], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Капля', address: 'ул. Яна Фабрициуса, 18', coords: [43.588, 39.724], chars: ['Место ожидания'] },
      { name: 'СамМой Car', address: 'ул. Костромская, 145', coords: [43.6, 39.744], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail Sochi', address: 'ул. Виноградная, 2', coords: [43.594, 39.732], chars: ['Место ожидания','Ресепшн'] },
      { name: 'Shine Sochi', address: 'ул. Пирогова, 32', coords: [43.575, 39.724], chars: ['Место ожидания'] }
    ]
  },
  'Новороссийск': {
    'Мойки самообслуживания': [
      { name: 'Самомой Новороссийск', address: 'ул. Видова, 186', coords: [44.711, 37.776], chars: [] },
      { name: 'МойСам', address: 'Сухумское шоссе, 25', coords: [44.704, 37.781], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка Новороссийск', address: 'ул. Куникова, 28в', coords: [44.707, 37.776], chars: ['Место ожидания'] },
      { name: 'Чистогород', address: 'ул. Советов, 35', coords: [44.723, 37.768], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail Novoross', address: 'ул. Анапское ш., 10', coords: [44.708, 37.764], chars: ['Место ожидания'] },
      { name: 'Gloss Garage', address: 'пр‑кт Ленина, 90', coords: [44.725, 37.769], chars: ['Ресепшн'] }
    ]
  },
  'Геленджик': {
    'Мойки самообслуживания': [
      { name: 'Самомой Геленджик', address: 'ул. Луначарского, 40', coords: [44.565, 38.075], chars: [] },
      { name: 'SelfWash ГДЖ', address: 'ул. Революционная, 20', coords: [44.559, 38.084], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Архипо‑Осиповка Автомойка', address: 'с. Архипо‑Осиповка', coords: [44.37, 38.53], chars: ['Место ожидания'] },
      { name: 'Автомойка Центр', address: 'ул. Кирова, 50', coords: [44.563, 38.084], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail GДЖ', address: 'ул. Мира, 12', coords: [44.56, 38.083], chars: ['Ресепшн'] },
      { name: 'Gloss Bay', address: 'ул. Туристическая, 8', coords: [44.551, 38.089], chars: ['Место ожидания'] }
    ]
  },
  'Туапсе': {
    'Мойки самообслуживания': [
      { name: 'SelfWash Туапсе', address: 'ул. Октябрьской Революции, 120', coords: [44.108, 39.077], chars: [] },
      { name: 'Самомой Туапсе', address: 'Сочинское ш., 14', coords: [44.154, 39.081], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка (Сочинское шоссе)', address: 'Сочинское ш., 9‑й км, 16', coords: [44.151, 39.075], chars: ['Место ожидания'] },
      { name: 'Автомойка Центр Туапсе', address: 'ул. Калараша, 70', coords: [44.103, 39.075], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail T', address: 'ул. Победы, 5', coords: [44.111, 39.08], chars: ['Место ожидания'] },
      { name: 'Shine T', address: 'ул. Ленинградская, 3', coords: [44.106, 39.078], chars: ['Ресепшн'] }
    ]
  },
  'Анапа': {
    'Мойки самообслуживания': [
      { name: 'Самомой Анапа', address: 'ул. Крымская, 150', coords: [44.892, 37.317], chars: [] },
      { name: 'SelfWash Анапа', address: 'ул. Астраханская, 30', coords: [44.896, 37.306], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка Анапа', address: 'ул. Владимирская, 55', coords: [44.895, 37.316], chars: ['Место ожидания'] },
      { name: 'Автомойка Южная', address: 'ул. Южная, 23', coords: [44.901, 37.317], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail Ana', address: 'ул. Горького, 10', coords: [44.894, 37.311], chars: ['Ресепшн'] },
      { name: 'Shine Ana', address: 'ул. Ленина, 5', coords: [44.894, 37.318], chars: ['Место ожидания'] }
    ]
  },
  'Армавир': {
    'Мойки самообслуживания': [
      { name: 'Самомой Армавир', address: 'ул. Московская, 80', coords: [45.0, 41.13], chars: [] },
      { name: 'SelfWash Армавир', address: 'ул. Карла Маркса, 10', coords: [44.998, 41.121], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка Армавир', address: 'ул. Ефремова, 22', coords: [44.996, 41.13], chars: ['Место ожидания'] },
      { name: 'Автомойка Центр', address: 'ул. Комсомольская, 15', coords: [44.993, 41.129], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail Arm', address: 'ул. Луначарского, 5', coords: [44.994, 41.132], chars: ['Место ожидания'] },
      { name: 'Shine Arm', address: 'ул. Тургенева, 9', coords: [44.991, 41.127], chars: ['Ресепшн'] }
    ]
  },
  'Ейск': {
    'Мойки самообслуживания': [
      { name: 'Самомой Ейск', address: 'ул. Коммунистическая, 45', coords: [46.711, 38.276], chars: [] },
      { name: 'SelfWash Ейск', address: 'ул. Свердлова, 12', coords: [46.69, 38.277], chars: [] }
    ],
    'Ручная мойка': [
      { name: 'Автомойка Ейск', address: 'ул. Шмидта, 30', coords: [46.704, 38.28], chars: ['Место ожидания'] },
      { name: 'Автомойка Центр Ейск', address: 'ул. Победы, 60', coords: [46.715, 38.274], chars: ['Есть ресторан / столовая'] }
    ],
    'Детейлинг центры': [
      { name: 'Detail Yeisk', address: 'ул. Мира, 7', coords: [46.708, 38.279], chars: ['Ресепшн'] },
      { name: 'Shine Yeisk', address: 'ул. Пушкина, 3', coords: [46.712, 38.276], chars: ['Место ожидания'] }
    ]
  }
};

export default function Locations() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [city, setCity] = useState('Краснодар');
  const [type, setType] = useState(washTypes[0]);
  const [selectedWash, setSelectedWash] = useState(null);
  const [charFilters, setCharFilters] = useState({});

  // Подключаем Яндекс.Карты
  useEffect(() => {
    if (window.ymaps) return setScriptLoaded(true);
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=<YOUR_API_KEY>';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  const initMap = useCallback(() => {
    if (!scriptLoaded || mapInstance.current) return;
    mapInstance.current = new window.ymaps.Map(mapRef.current, {
      center: cities[city],
      zoom: 10,
      controls: ['zoomControl']
    });
    updatePlacemarks();
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded) return;
    window.ymaps.ready(initMap);
  }, [scriptLoaded, initMap]);

  // Перерисовка при смене фильтров
  useEffect(() => {
    if (!mapInstance.current) return;
    setSelectedWash(null);
    updatePlacemarks();
  }, [city, type, charFilters]);

  const updatePlacemarks = useCallback(() => {
    const list = washData[city]?.[type] || [];
    const activeChars = Object.keys(charFilters).filter((c) => charFilters[c]);
    const filtered = (type === 'Мойки самообслуживания')
      ? list
      : list.filter((wash) => (
          activeChars.length > 0
            ? activeChars.every((c) => deriveTags(wash).includes(c))
            : true
        ));

    const ym = window.ymaps;
    const map = mapInstance.current;
    if (!ym || !map) return;

    map.geoObjects.removeAll();

    const points = [];

    const addPlacemark = (wash, coords) => {
      const placemark = new ym.Placemark(coords, {
        balloonContent: `<b>${wash.name}</b><br>${wash.address}`
      });
      placemark.events.add('click', () => setSelectedWash(wash.name));
      map.geoObjects.add(placemark);
      points.push(coords);
    };

    filtered.forEach((wash) => {
      if (wash.coords && Array.isArray(wash.coords)) {
        addPlacemark(wash, wash.coords);
      }
    });

    // Авто‑масштабирование по точкам
    setTimeout(() => {
      if (points.length === 1) {
        map.setCenter(points[0], 12, { duration: 200 });
      } else if (points.length > 1) {
        const bounds = ym.util.bounds.fromPoints(points);
        map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40, duration: 200 });
      } else {
        map.setCenter(cities[city], 11, { duration: 200 });
      }
    }, 0);
  }, [city, type, charFilters]);

  const listToShow = (type === 'Мойки самообслуживания')
    ? (washData[city]?.[type] || [])
    : (washData[city]?.[type]?.filter((wash) => {
        const activeChars = Object.keys(charFilters).filter((c) => charFilters[c]);
        return activeChars.length > 0
          ? activeChars.every((c) => deriveTags(wash).includes(c))
          : true;
      }) || []);

  return (
    <section className="locations">
      <h2 className="section-title">Где помыть авто</h2>

      {/* Кнопки городов */}
      <div className="city-button-group">
        {Object.keys(cities).map((c) => (
          <button
            key={c}
            className={c === city ? 'city-button active' : 'city-button'}
            onClick={() => setCity(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Типы автомоек */}
      <div className="wash-type-selector">
        {washTypes.map((w) => (
          <button
            key={w}
            className={w === type ? 'filter-button active' : 'filter-button'}
            onClick={() => setType(w)}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Фильтры по характеристикам (кроме самообслуживания) */}
      {type !== 'Мойки самообслуживания' && (
        <div className="char-filter-group">
          {characteristics.map((c) => (
            <button
              key={c}
              className={charFilters[c] ? 'char-filter active' : 'char-filter'}
              onClick={() => setCharFilters((f) => ({ ...f, [c]: !f[c] }))}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div ref={mapRef} className="map-container" />

      <div className="wash-cards-container">
        {listToShow.map((wash, idx) => (
          <div
            key={idx}
            className={`wash-card ${selectedWash === wash.name ? 'selected' : ''}`}
            onClick={() => setSelectedWash(wash.name)}
          >
            <h3 className="wash-name">{wash.name}</h3>
            <p className="wash-address">{city}, {wash.address}</p>

            {/* Удобства (скрыто для самообслуживания) */}
            {type !== 'Мойки самообслуживания' && deriveTags(wash).length > 0 && (
              <div className="wash-features">
                <span className="features-label">Удобства:</span>
                <div className="wash-chars">
                  {deriveTags(wash).map((c, i) => (
                    <span key={i} className="wash-char-pill">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedWash === wash.name && (
              <button
                className="route-button"
                onClick={() => {
                  const dest = wash.coords
                    ? `${wash.coords[0]},${wash.coords[1]}`
                    : encodeURIComponent(`${city}, ${wash.address}`);
                  window.open(
                    `https://yandex.ru/maps/?rtext=~${dest}&rtt=auto`,
                    '_blank'
                  );
                }}
              >
                Построить маршрут
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
