import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Line, LineChart, ReferenceArea, ReferenceDot, LabelList } from 'recharts';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

const donutData = [
  { name: 'Conforme', value: 6, color: '#00DCFA', label: 'Sites conformes', logements: 42 },
  { name: 'Alerte', value: 3, color: '#FF6600', label: 'Sites en alerte', logements: 18 },
  { name: 'Critique', value: 1, color: '#FF204E', label: 'Sites critiques', logements: 7 },
];

// Données réalistes pour le tableau
const sitesData = [
  { nom: 'immeuble_ancien_rouen', temp: 16.2, categorie: 'critique', seuil: '18–24 °C', logements: 7, date: '14/06/2025' },
  { nom: 'residence_luxe_tours', temp: 17.5, categorie: 'alerte', seuil: '18–24 °C', logements: 6, date: '14/06/2025' },
  { nom: 'maison_famille_jardin', temp: 20.3, categorie: 'conforme', seuil: '18–24 °C', logements: 8, date: '14/06/2025' },
  { nom: 'immeuble_appart_famille', temp: 19.8, categorie: 'conforme', seuil: '18–24 °C', logements: 12, date: '14/06/2025' },
  { nom: 'immeuble_ancien_le_mans', temp: 24.7, categorie: 'conforme', seuil: '18–24 °C', logements: 10, date: '14/06/2025' },
  { nom: 'immeuble_repres_rennes', temp: 22.4, categorie: 'conforme', seuil: '18–24 °C', logements: 12, date: '14/06/2025' },
  { nom: 'villa_eco_nantes', temp: 18.1, categorie: 'alerte', seuil: '18–24 °C', logements: 7, date: '14/06/2025' },
  { nom: 'maison_ilot_angers', temp: 18.7, categorie: 'alerte', seuil: '18–24 °C', logements: 5, date: '14/06/2025' },
  { nom: 'residence_jeunes_lemans', temp: 21.2, categorie: 'conforme', seuil: '18–24 °C', logements: 10, date: '14/06/2025' },
  { nom: 'maison_eco_rouen', temp: 19.2, categorie: 'conforme', seuil: '18–24 °C', logements: 10, date: '14/06/2025' },
].map(site => ({ ...site, chartData: generateSiteChartData(site.categorie, site.nom) }));

// Couleurs statuts identiques au donut
const STATUS_COLORS = {
  conforme: { label: 'Conforme', color: '#00DCFA', bg: '#E6F7FB', icon: '❤' },
  alerte: { label: 'Alerte', color: '#FF6600', bg: '#FFF3E6', icon: '⚠️' },
  critique: { label: 'Critique', color: '#FF204E', bg: '#FFE6EC', icon: '⛔' },
};

// Nouveau composant Select moderne
function ModernSelect({ value, onChange, children, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      width: 240,
      ...style,
    }}>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '12px 44px 12px 18px',
          borderRadius: 16,
          border: '1.5px solid #e6e6e6',
          background: '#F7F9FB',
          fontSize: 17,
          color: '#222',
          fontWeight: 500,
          boxShadow: '0 2px 8px #f0f4f8',
          appearance: 'none',
          outline: 'none',
          transition: 'border 0.18s, box-shadow 0.18s',
        }}
        onFocus={e => e.target.style.border = '1.5px solid #3DB6E3'}
        onBlur={e => e.target.style.border = '1.5px solid #e6e6e6'}
      >
        {children}
      </select>
      {/* Flèche custom */}
      <span style={{
        position: 'absolute',
        right: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="#3DB6E3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    </div>
  );
}

function TemperatureIndicator({ selected, setSelected, navigate }) {
  let filteredData = donutData;
  let total = donutData.reduce((acc, d) => acc + d.value, 0);
  let percent = 70;
  let centerLabel = 'des sites conformes';
  let legend = donutData;
  let centerValue = 6;

  if (selected === 'conforme') {
    filteredData = [donutData[0]];
    percent = Math.round((donutData[0].value / total) * 100);
    centerLabel = 'des sites conformes';
    legend = [donutData[0]];
    centerValue = donutData[0].value;
  } else if (selected === 'alerte') {
    filteredData = [donutData[1]];
    percent = Math.round((donutData[1].value / total) * 100);
    centerLabel = 'des sites en alerte';
    legend = [donutData[1]];
    centerValue = donutData[1].value;
  } else if (selected === 'critique') {
    filteredData = [donutData[2]];
    percent = Math.round((donutData[2].value / total) * 100);
    centerLabel = 'des sites critiques';
    legend = [donutData[2]];
    centerValue = donutData[2].value;
  } else {
    percent = Math.round((donutData[0].value / total) * 100);
    centerLabel = 'des sites conformes';
    legend = donutData;
    centerValue = donutData[0].value;
  }

  // Légende dynamique
  const legendBlock = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 10,
      background: 'rgba(245,247,250,0.7)',
      borderRadius: 10,
      padding: '10px 10px 10px 16px',
      border: 'none',
      minWidth: 120,
      marginLeft: 24,
    }}>
      {legend.map((entry, idx) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ width: 13, height: 13, borderRadius: '50%', background: entry.color, display: 'inline-block', marginRight: 8, border: '1.5px solid #E6F7FB' }}></span>
          <span style={{ color: '#888', fontSize: 14, fontWeight: 400, whiteSpace: 'nowrap', letterSpacing: 0.1 }}>{entry.label} ({entry.value})</span>
        </div>
      ))}
    </div>
  );

  // Label du donut (affiche le nombre de sites uniquement si tous les sites)
  function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {
    if (selected !== 'all') return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const label = donutData[index].value + (donutData[index].value > 1 ? ' sites' : ' site');
    return (
      <text x={x} y={y} fill="#111" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={18} fontWeight={700}>
        {label}
      </text>
    );
  }

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div style={{
          background: '#fff',
          border: `2px solid ${entry.color}`,
          borderRadius: 8,
          padding: '10px 18px',
          color: '#222',
          fontWeight: 500,
          fontSize: 16,
          boxShadow: '0 2px 8px #e0e0e0',
        }}>
          <span style={{ color: entry.color, fontWeight: 700, fontSize: 18, marginRight: 8 }}>●</span>
          {entry.logements} logement{entry.logements > 1 ? 's' : ''} concernés<br/>
          <span style={{ color: '#888', fontSize: 14 }}>{entry.label}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px #e0e0e0',
      border: '1.5px solid #e6e6e6',
      padding: '0.4rem 1.1rem 0.4rem 1.1rem',
      width: 900,
      minWidth: 480,
      height: 620,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      justifyContent: 'space-between',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6, color: '#595959' }}>Températures moyennes de mes sites</div>
        <div style={{ marginBottom: 10, marginTop: 4 }}>
          <ModernSelect
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="all">Tous les sites</option>
            <option value="conforme">Sites conformes</option>
            <option value="alerte">Sites en alerte</option>
            <option value="critique">Sites critiques</option>
          </ModernSelect>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: -18 }}>
            {/* Donut au centre */}
            <div style={{ width: 440, height: 440, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', marginTop: -18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={CustomTooltip} cursor={false} />
                  <Pie
                    key={selected}
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    innerRadius={110}
                    outerRadius={155}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={700}
                    animateNewData={true}
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Texte central statique */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: 44, fontWeight: 700, color: '#222' }}>{percent}&nbsp;%</div>
                <div style={{ fontSize: 22, color: '#222', fontWeight: 500, marginTop: 2 }}>{centerLabel}</div>
              </div>
            </div>
            {/* Légende dynamique à droite */}
            {legendBlock}
          </div>
          {/* Message d'alerte sous le donut, encore rapproché */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginTop: 0,
            background: '#FFF7E6',
            borderRadius: 12,
            padding: '5px 14px',
            fontSize: 17,
            color: '#B26B00',
            fontWeight: 500,
            boxShadow: '0 1px 4px #f3e2c0',
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <span style={{ fontSize: 22, color: '#F7A600', marginRight: 4 }}>⚠️</span>
            3 sites en alerte depuis plus de 3 jours
          </div>
        </div>
      </div>
      {/* Barre du bas avec sélection, alerte et boutons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 0.3rem',
        marginTop: 0,
        minHeight: 48,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <div style={{ color: '#222', fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
          Sélection test (10)
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: '#fff', border: '1.5px solid #e6e6e6', borderRadius: 8, padding: '8px 12px', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, maxWidth: 48 }}>⋯</button>
          <button style={{ background: '#fff', color: '#222', border: '1.5px solid #222', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={() => navigate('/explorer', { state: { selected } })}>
            Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

// Fonction pour choisir une icône selon le type de site
function getSiteIcon(nom) {
  if (nom.includes('immeuble')) return '🏢';
  if (nom.includes('maison')) return '🏠';
  if (nom.includes('villa')) return '🏡';
  if (nom.includes('residence')) return '🏬';
  return '🏠';
}

function TableSites({ selection }) {
  const [animate, setAnimate] = useState(false);
  const [sort, setSort] = useState({ col: null, asc: true });
  const navigate = useNavigate();
  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 400);
    return () => clearTimeout(timeout);
  }, [selection]);
  const filtered = selection === 'all' ? sitesData : sitesData.filter(s => s.categorie === selection);

  // Tri dynamique
  const sorted = [...filtered].sort((a, b) => {
    if (!sort.col) return 0;
    let v1 = a[sort.col], v2 = b[sort.col];
    if (sort.col === 'temp') return sort.asc ? v1 - v2 : v2 - v1;
    if (sort.col === 'logements') return sort.asc ? v1 - v2 : v2 - v1;
    if (sort.col === 'date') {
      // format JJ/MM/AAAA
      const d1 = v1.split('/').reverse().join('-');
      const d2 = v2.split('/').reverse().join('-');
      return sort.asc ? d1.localeCompare(d2) : d2.localeCompare(d1);
    }
    if (sort.col === 'seuil') {
      // Trie sur la valeur min du seuil
      const n1 = parseFloat(v1);
      const n2 = parseFloat(v2);
      return sort.asc ? n1 - n2 : n2 - n1;
    }
    return 0;
  });

  // Flèche de tri
  function SortArrow({ active, asc }) {
    return active ? (
      <span style={{ marginLeft: 6, color: '#3DB6E3', fontSize: 15, display: 'inline-block', verticalAlign: 'middle' }}>
        <svg width="13" height="13" viewBox="0 0 20 20" style={{ transform: asc ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><path d="M6 8L10 12L14 8" stroke="#3DB6E3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
    ) : null;
  }

  return (
    <div style={{ width: '100%', maxWidth: 1400, paddingLeft: '2.5rem', marginTop: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 24px #e0e0e0', minWidth: 900 }}>
        <thead>
          <tr style={{ background: '#F0F4F8', color: '#222', fontWeight: 800, fontSize: 17, letterSpacing: 0.1 }}>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>🏷️</span>Nom du site
            </th>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none', cursor: 'pointer' }} onClick={() => setSort(s => ({ col: 'temp', asc: s.col === 'temp' ? !s.asc : true }))}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>🌡️</span>Temp. moyenne
              <SortArrow active={sort.col === 'temp'} asc={sort.asc} />
            </th>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>🟢</span>Statut
            </th>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none', cursor: 'pointer' }} onClick={() => setSort(s => ({ col: 'seuil', asc: s.col === 'seuil' ? !s.asc : true }))}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>📏</span>Seuils du site
              <SortArrow active={sort.col === 'seuil'} asc={sort.asc} />
            </th>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none', cursor: 'pointer' }} onClick={() => setSort(s => ({ col: 'logements', asc: s.col === 'logements' ? !s.asc : true }))}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>🏠</span>Nb logements
              <SortArrow active={sort.col === 'logements'} asc={sort.asc} />
            </th>
            <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none', cursor: 'pointer' }} onClick={() => setSort(s => ({ col: 'date', asc: s.col === 'date' ? !s.asc : true }))}>
              <span style={{ fontSize: 19, marginRight: 8, verticalAlign: 'middle' }}>🕒</span>Dernière mesure
              <SortArrow active={sort.col === 'date'} asc={sort.asc} />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((site, idx) => (
            <tr key={site.nom}
              style={{
                borderBottom: '1.5px solid #F3F4F6',
                background: idx % 2 === 0 ? '#fff' : '#F7F9FB',
                transition: 'background 0.18s, opacity 0.5s, transform 0.5s',
                cursor: 'pointer',
                opacity: animate ? 0 : 1,
                transform: animate ? 'translateY(20px)' : 'translateY(0)',
              }}
              onClick={() => navigate(`/site/${site.nom}`)}
              onMouseOver={e => e.currentTarget.style.background = '#E6F7FB'}
              onMouseOut={e => e.currentTarget.style.background = idx % 2 === 0 ? '#fff' : '#F7F9FB'}
            >
              <td style={{ padding: '16px 28px', fontWeight: 700, fontSize: 19, color: '#222', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>{getSiteIcon(site.nom)}</span>
                {site.nom.replace(/_/g, ' ')}
              </td>
              <td style={{ padding: '16px 28px', fontWeight: 700, fontSize: 17 }}>{site.temp.toFixed(1)} °C</td>
              <td style={{ padding: '16px 28px' }}>
                <span style={{ background: STATUS_COLORS[site.categorie].bg, color: STATUS_COLORS[site.categorie].color, fontWeight: 700, borderRadius: 10, padding: '7px 22px', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 17, boxShadow: '0 1px 4px #e0e0e0' }}>
                  <span style={{ fontSize: 22 }}>{STATUS_COLORS[site.categorie].icon}</span> {STATUS_COLORS[site.categorie].label}
                </span>
              </td>
              <td style={{ padding: '16px 28px', fontSize: 16 }}>{site.seuil}</td>
              <td style={{ padding: '16px 28px', fontWeight: 600, fontSize: 16 }}>{site.logements}</td>
              <td style={{ padding: '16px 28px', fontSize: 16 }}>{site.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Composant Explorer (squelette, à compléter)
function ExplorerPage({ selected, setSelected }) {
  const navigate = useNavigate();
  // On utilise toujours la valeur du state local pour la sélection
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FB', fontFamily: 'Inter, Arial, sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2.5rem 1rem 2.5rem', background: '#fff', borderBottom: '1.5px solid #e6e6e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#3DB6E3',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e0e0',
              transition: 'background 0.18s, box-shadow 0.18s',
              outline: 'none',
              padding: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#2699c7'; e.currentTarget.style.boxShadow = '0 4px 16px #b3e3fa'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#3DB6E3'; e.currentTarget.style.boxShadow = '0 2px 8px #e0e0e0'; }}
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 16L7 10L13 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span style={{ fontWeight: 700, fontSize: 24, color: '#222' }}>{
            selected === 'all' ? 'Tous les sites' :
            selected === 'conforme' ? 'Sites conformes' :
            selected === 'alerte' ? 'Sites en alerte' :
            selected === 'critique' ? 'Sites critiques' : ''
          }</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F4FA', color: '#3DB6E3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>RM</div>
      </header>
      <main style={{ maxWidth: '100vw', margin: 0, padding: '2.5rem 0' }}>
        <div style={{ paddingLeft: '2.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#595959', marginBottom: 18 }}>Température moyenne par sites</div>
          <div style={{ marginBottom: 24 }}>
            <ModernSelect value={selected} onChange={e => setSelected(e.target.value)}>
              <option value="all">Tous les sites</option>
              <option value="conforme">Sites conformes</option>
              <option value="alerte">Sites en alerte</option>
              <option value="critique">Sites critiques</option>
            </ModernSelect>
          </div>
          <TableSites selection={selected} />
        </div>
      </main>
    </div>
  );
}

// Génère des données réalistes pour 30 jours en fonction du statut du site
function generateSiteChartData(statut, siteNom) {
  const days = 30;
  const today = new Date();
  const data = [];
  const total = 50;
  // Cas particuliers selon la consigne utilisateur
  if (siteNom === 'immeuble_ancien_rouen') {
    // Après le 08 juin, temp >= 24°C
    let seuilTrouve = false;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy;
      if (!seuilTrouve && date === '08 juin') seuilTrouve = true;
      if (seuilTrouve) {
        tempMoy = 24 + Math.random() * 4; // 24-28°C
      } else {
        tempMoy = 20 + (Math.random() * 10); // 20-30°C
      }
      data.push({
        date,
        critique: tempMoy < 16 || tempMoy > 26 ? 10 : 0,
        anormal: tempMoy >= 16 && tempMoy < 18 || tempMoy > 24 && tempMoy <= 26 ? 10 : 0,
        conforme: tempMoy >= 18 && tempMoy <= 24 ? 30 : 0,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  if (siteNom === 'residence_luxe_tours') {
    // Après le 06 juin, temp <= 16°C
    let seuilTrouve = false;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy;
      if (!seuilTrouve && date === '06 juin') seuilTrouve = true;
      if (seuilTrouve) {
        tempMoy = 14 + Math.random() * 2; // 14-16°C
      } else {
        tempMoy = 18 + (Math.random() * 10); // 18-28°C
      }
      data.push({
        date,
        critique: tempMoy < 16 || tempMoy > 26 ? 10 : 0,
        anormal: tempMoy >= 16 && tempMoy < 18 || tempMoy > 24 && tempMoy <= 26 ? 10 : 0,
        conforme: tempMoy >= 18 && tempMoy <= 24 ? 30 : 0,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  if (siteNom === 'villa_eco_nantes') {
    // Après le 06 juin, temp <= 16°C
    let seuilTrouve = false;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy;
      if (!seuilTrouve && date === '06 juin') seuilTrouve = true;
      if (seuilTrouve) {
        tempMoy = 14 + Math.random() * 2; // 14-16°C
      } else {
        tempMoy = 18 + (Math.random() * 10); // 18-28°C
      }
      data.push({
        date,
        critique: tempMoy < 16 || tempMoy > 26 ? 10 : 0,
        anormal: tempMoy >= 16 && tempMoy < 18 || tempMoy > 24 && tempMoy <= 26 ? 10 : 0,
        conforme: tempMoy >= 18 && tempMoy <= 24 ? 30 : 0,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  if (siteNom === 'maison_ilot_angers') {
    // Après le 06 juin, temp >= 24°C
    let seuilTrouve = false;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy;
      if (!seuilTrouve && date === '06 juin') seuilTrouve = true;
      if (seuilTrouve) {
        tempMoy = 24 + Math.random() * 4; // 24-28°C
      } else {
        tempMoy = 18 + (Math.random() * 6); // 18-24°C
      }
      data.push({
        date,
        critique: tempMoy < 16 || tempMoy > 26 ? 10 : 0,
        anormal: tempMoy >= 16 && tempMoy < 18 || tempMoy > 24 && tempMoy <= 26 ? 10 : 0,
        conforme: tempMoy >= 18 && tempMoy <= 24 ? 30 : 0,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  if (statut === 'conforme') {
    // Toujours conforme
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      data.push({
        date,
        critique: 0,
        anormal: 0,
        conforme: total,
        tempMoy: 20 + (Math.random() * 4 - 2), // 18-22°C
      });
    }
    return data;
  }
  if (statut === 'critique') {
    // Génère une alerte fermée (jours 5 à 10), un point conforme (jours 11 à 12), puis une alerte ouverte (jours 20 à 29 sans retour en conforme)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy, critique = 0, anormal = 0, conforme = 0;
      if (i >= 20) {
        // Alerte ouverte (fin de période) : forcer hors conforme
        critique = Math.floor(Math.random() * 10 + 8); // 8-17
        anormal = Math.floor(Math.random() * 6 + 2); // 2-7
        conforme = total - critique - anormal;
        // Toujours hors conforme : <18 ou >24
        tempMoy = (Math.random() < 0.5) ? (15 + Math.random() * 2) : (25 + Math.random() * 2); // 15-17 ou 25-27°C
      } else if (i >= 5 && i <= 10) {
        // Alerte fermée
        critique = Math.floor(Math.random() * 8 + 4); // 4-11
        anormal = Math.floor(Math.random() * 6 + 2); // 2-7
        conforme = total - critique - anormal;
        tempMoy = 15 + (Math.random() * 2); // 15-17°C
      } else if (i >= 11 && i <= 12) {
        // Point conforme entre deux alertes
        critique = 0;
        anormal = 0;
        conforme = total;
        tempMoy = 18 + (Math.random() * 6); // 18-24°C inclus
      } else {
        // Conforme ou léger alerte
        critique = 0;
        anormal = Math.floor(Math.random() * 4 + 2); // 2-5
        conforme = total - anormal;
        tempMoy = 20 + (Math.random() * 4 - 2); // 18-22°C
      }
      data.push({
        date,
        critique,
        anormal,
        conforme,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  if (statut === 'alerte') {
    // Génère une alerte ouverte (jours 25 à 29 sans retour en conforme), un point conforme (jours 14 à 15), et parfois une alerte fermée (jours 10 à 13)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      let tempMoy, critique = 0, anormal = 0, conforme = 0;
      if (i >= 25) {
        // Alerte ouverte (fin de période) : forcer hors conforme
        critique = 0;
        anormal = Math.floor(Math.random() * 10 + 8); // 8-17
        conforme = total - anormal;
        // Toujours hors conforme : <18 ou >24
        tempMoy = (Math.random() < 0.5) ? (16 + Math.random() * 1.5) : (24.5 + Math.random() * 1.5); // 16-17.5 ou 24.5-26°C
      } else if (i >= 10 && i <= 13 && Math.random() < 0.7) {
        // Alerte fermée (aléatoire)
        critique = 0;
        anormal = Math.floor(Math.random() * 8 + 4); // 4-11
        conforme = total - anormal;
        tempMoy = (Math.random() < 0.5) ? (16.5 + Math.random() * 1.5) : (24.5 + Math.random() * 1.5);
      } else if (i >= 14 && i <= 15) {
        // Point conforme entre deux alertes
        critique = 0;
        anormal = 0;
        conforme = total;
        tempMoy = 18 + (Math.random() * 6); // 18-24°C inclus
      } else {
        // Conforme
        critique = 0;
        anormal = 0;
        conforme = total;
        tempMoy = 20 + (Math.random() * 4 - 2); // 18-22°C
      }
      data.push({
        date,
        critique,
        anormal,
        conforme,
        tempMoy: Math.round(tempMoy * 10) / 10,
      });
    }
    return data;
  }
  // fallback : conforme
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    data.push({
      date,
      critique: 0,
      anormal: 0,
      conforme: total,
      tempMoy: 20 + (Math.random() * 4 - 2),
    });
  }
  return data;
}

// Fonction pour générer des noms de logements réalistes
const generateLogementName = (index, etage) => {
  const types = ['Studio', 'T1', 'T2', 'T3', 'T4', 'T5'];
  const orientations = ['Nord', 'Sud', 'Est', 'Ouest', 'Nord-Est', 'Nord-Ouest', 'Sud-Est', 'Sud-Ouest'];
  const type = types[Math.floor(Math.random() * types.length)];
  const orientation = orientations[Math.floor(Math.random() * orientations.length)];
  return `${type} ${orientation} - ${etage}e étage n°${index}`;
};

// Données des logements pour la heatmap
const generateLogementsData = (siteId, nbLogements) => {
  const days = 30;
  const today = new Date();
  const logements = [];
  const site = sitesData.find(s => s.nom === siteId);
  
  // Calcul du nombre de logements affectés selon le statut du site
  let nbLogementsAffectes = 0;
  if (site.categorie === 'critique') {
    // 70% des logements sont affectés en critique
    nbLogementsAffectes = Math.ceil(nbLogements * 0.7);
  } else if (site.categorie === 'alerte') {
    // 40% des logements sont affectés en alerte
    nbLogementsAffectes = Math.ceil(nbLogements * 0.4);
  }
  
  // Répartition des logements par étage
  const maxEtages = 8;
  const logementsParEtage = Math.ceil(nbLogements / maxEtages);
  
  let logementIndex = 1;
  for (let etage = 1; etage <= maxEtages && logementIndex <= nbLogements; etage++) {
    for (let i = 1; i <= logementsParEtage && logementIndex <= nbLogements; i++) {
      const logement = {
        id: `${siteId}_log${logementIndex}`,
        nom: generateLogementName(i, etage),
        temperatures: []
      };
      
      // Détermine si ce logement est affecté par le problème
      const isAffected = logementIndex <= nbLogementsAffectes;
      
      for (let j = days - 1; j >= 0; j--) {
        const d = new Date(today);
        d.setDate(today.getDate() - j);
        const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        
        let temp;
        if (site.categorie === 'critique' && isAffected) {
          // Logements critiques : température < 16°C ou > 26°C
          if (site.nom === 'immeuble_ancien_rouen') {
            // Cas spécial : après le 08 juin, temp >= 24°C
            const isAfter8June = new Date('2025-06-08') <= d;
            temp = isAfter8June ? 26 + Math.random() * 2 : 20 + Math.random() * 4;
          } else {
            temp = Math.random() < 0.7 ? 15 + Math.random() : 26 + Math.random() * 2;
          }
        } else if (site.categorie === 'alerte' && isAffected) {
          // Logements en alerte : température entre 16-18°C ou 24-26°C
          if (site.nom === 'residence_luxe_tours' || site.nom === 'villa_eco_nantes') {
            // Cas spécial : après le 06 juin, temp <= 16°C
            const isAfter6June = new Date('2025-06-06') <= d;
            temp = isAfter6June ? 16 + Math.random() * 1.5 : 20 + Math.random() * 4;
          } else if (site.nom === 'maison_ilot_angers') {
            // Cas spécial : après le 06 juin, temp >= 24°C
            const isAfter6June = new Date('2025-06-06') <= d;
            temp = isAfter6June ? 24 + Math.random() * 1.5 : 20 + Math.random() * 4;
          } else {
            temp = Math.random() < 0.6 ? 
              (Math.random() < 0.5 ? 16 + Math.random() * 2 : 24 + Math.random() * 2) : 
              20 + Math.random() * 4;
          }
        } else {
          // Logements conformes : température entre 18-24°C
          temp = 18 + Math.random() * 6;
        }
        
        logement.temperatures.push({
          date,
          temp: Math.round(temp * 10) / 10
        });
      }
      
      logements.push(logement);
      logementIndex++;
    }
  }
  return logements;
};

function LogementsHeatmap() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const site = sitesData.find(s => s.nom === siteId);
  const [logements] = useState(() => generateLogementsData(siteId, site?.logements || 0));
  
  // Obtenir les dates uniques pour les colonnes
  const dates = logements[0]?.temperatures.map(t => t.date) || [];
  
  // Fonction pour déterminer la couleur de la cellule
  const getCellColor = (temp) => {
    if (temp < 16 || temp > 26) return { bg: '#FF204E44', border: '#FFD6E0' }; // Critique
    if (temp < 18 || temp > 24) return { bg: '#FF660044', border: '#FFD6B3' }; // Alerte
    return { bg: '#00DCFA44', border: '#B6F0FF' }; // Conforme
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FB', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2.5rem 1rem 2.5rem', background: '#fff', borderBottom: '1.5px solid #e6e6e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#3DB6E3',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e0e0',
              transition: 'background 0.18s, box-shadow 0.18s',
              outline: 'none',
              padding: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#2699c7'; e.currentTarget.style.boxShadow = '0 4px 16px #b3e3fa'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#3DB6E3'; e.currentTarget.style.boxShadow = '0 2px 8px #e0e0e0'; }}
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 16L7 10L13 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <div style={{ fontWeight: 800, fontSize: 24, color: '#222', marginBottom: 4 }}>Températures par logement</div>
            <div style={{ color: '#666', fontSize: 16 }}>{site?.nom.replace(/_/g, ' ')} - {site?.logements} logements</div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main style={{ padding: '2rem 2.5rem' }}>
        {/* Légende */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#00DCFA44', border: '1.5px solid #B6F0FF', display: 'inline-block' }}></span>
            <span style={{ color: '#00DCFA', fontWeight: 700, fontSize: 15 }}>Conforme (18–24°C)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF660044', border: '1.5px solid #FFD6B3', display: 'inline-block' }}></span>
            <span style={{ color: '#FF6600', fontWeight: 700, fontSize: 15 }}>Alerte (16–18°C, 24–26°C)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF204E44', border: '1.5px solid #FFD6E0', display: 'inline-block' }}></span>
            <span style={{ color: '#FF204E', fontWeight: 700, fontSize: 15 }}>Critique ({'<'}16°C, {'>'}26°C)</span>
          </div>
        </div>
        
        {/* Heatmap */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px #e0e0e0', overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 2, minWidth: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 16px', textAlign: 'left', fontWeight: 700, fontSize: 15, color: '#666', minWidth: 140 }}>Logement</th>
                {dates.map(date => (
                  <th key={date} style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600, fontSize: 14, color: '#888', minWidth: 40 }}>
                    {date}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logements.map(logement => (
                <tr key={logement.id}>
                  <td style={{ padding: '8px 16px', fontWeight: 600, fontSize: 15, color: '#222' }}>{logement.nom}</td>
                  {logement.temperatures.map((t, idx) => {
                    const colors = getCellColor(t.temp);
                    return (
                      <td key={idx} style={{ position: 'relative' }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          background: colors.bg,
                          border: `1.5px solid ${colors.border}`,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#222',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        title={`${t.date}: ${t.temp}°C`}
                        >
                          {t.temp}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// Page d'accueil complète avec header, onglets, fond, etc.
function DashboardPage({ selected, setSelected, navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FB', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem 0.7rem 2rem', background: '#fff', borderBottom: '1.5px solid #e6e6e6' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 24, color: '#222', letterSpacing: '-1px' }}>IntentMAX</span>
          <span style={{ background: '#3DB6E3', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 6, padding: '2px 10px', marginLeft: 10 }}>Beta</span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F4FA', color: '#3DB6E3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>RM</div>
      </header>
      {/* Onglets stylés comme la spec */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 2rem', background: '#fff', borderBottom: '1.5px solid #e6e6e6', gap: 16, marginTop: 8 }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: '#CDF6FE',
          border: 'none',
          borderTop: '2px solid #00DCFA',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 700,
          fontSize: 18,
          color: '#222',
          marginRight: 8,
          gap: 16,
          boxShadow: '0 2px 8px #e0e0e0',
          cursor: 'pointer',
          height: 44,
        }}>
          Tableau de bord
        </button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 700,
          fontSize: 18,
          color: '#222',
          gap: 16,
          height: 44,
          cursor: 'pointer',
        }}>
          Catalogue d'indicateurs
        </button>
      </div>
      {/* Zone centrale pour accueillir les indicateurs */}
      <main style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', minHeight: 'calc(100vh - 100px)', padding: '1.2rem 0' }}>
        <div style={{ width: '100vw', minHeight: 400, display: 'flex', gap: 32, paddingLeft: '2.5rem' }}>
          <div style={{ width: 900, height: 700 }}>
            <TemperatureIndicator selected={selected} setSelected={setSelected} navigate={navigate} />
          </div>
          <div style={{ width: '50vw', height: '100%' }}></div>
        </div>
      </main>
    </div>
  );
}

function SiteDetailPage() {
  const { siteId } = useParams();
  const site = sitesData.find(s => s.nom === siteId);
  const navigate = useNavigate();
  const chartData = site?.chartData || [];
  const tempMoyGlobale = chartData.length ? (chartData.reduce((acc, d) => acc + d.tempMoy, 0) / chartData.length).toFixed(1) : '--';

  // État pour basculer entre vue journalière et mensuelle
  const [viewMode, setViewMode] = React.useState('daily'); // 'daily' ou 'monthly'
  const [selectedMonth, setSelectedMonth] = React.useState(null);

  // Génération des données mensuelles complètes pour l'année
  const generateMonthlyData = () => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    // Données mensuelles réalistes pour une année complète
    const yearlyData = [
      { month: 'Jan', tempMoy: 8.2, alerts: { warning: 12, critical: 8 } },
      { month: 'Fév', tempMoy: 9.1, alerts: { warning: 10, critical: 6 } },
      { month: 'Mar', tempMoy: 12.4, alerts: { warning: 8, critical: 3 } },
      { month: 'Avr', tempMoy: 15.7, alerts: { warning: 5, critical: 1 } },
      { month: 'Mai', tempMoy: 18.9, alerts: { warning: 0, critical: 0 } },
      { month: 'Juin', tempMoy: 22.1, alerts: { warning: 0, critical: 0 } },
      { month: 'Juil', tempMoy: 24.8, alerts: { warning: 6, critical: 2 } },
      { month: 'Août', tempMoy: 24.2, alerts: { warning: 4, critical: 1 } },
      { month: 'Sep', tempMoy: 20.5, alerts: { warning: 0, critical: 0 } },
      { month: 'Oct', tempMoy: 16.3, alerts: { warning: 7, critical: 2 } },
      { month: 'Nov', tempMoy: 11.8, alerts: { warning: 0, critical: 0 } },
      { month: 'Déc', tempMoy: 7.9, alerts: { warning: 15, critical: 10 } }
    ];
    
    return yearlyData.map((data, index) => ({
      month: data.month,
      year: currentYear,
      monthIndex: index,
      tempMoy: data.tempMoy.toFixed(1),
      alerts: data.alerts,
      totalAlerts: data.alerts.warning + data.alerts.critical,
      hasAlerts: (data.alerts.warning + data.alerts.critical) > 0
    }));
  };

  const monthlyData = generateMonthlyData();

  // Calcul des statistiques des logements
  const calculerStatistiquesLogements = () => {
    const logements = generateLogementsData(siteId, site?.logements || 0);
    const derniereDate = logements[0]?.temperatures[logements[0].temperatures.length - 1];
    let logementsHorsNorme = 0;
    let logementsCritiques = 0;
    let logementsAlerte = 0;
    logements.forEach(logement => {
      const derniereTemp = logement.temperatures[logement.temperatures.length - 1].temp;
      if (derniereTemp < 16 || derniereTemp > 26) {
        logementsCritiques++;
        logementsHorsNorme++;
      } else if (derniereTemp < 18 || derniereTemp > 24) {
        logementsAlerte++;
        logementsHorsNorme++;
      }
    });
    const pourcentageHorsNorme = Math.round((logementsHorsNorme / logements.length) * 100);
    return {
      total: site?.logements || 0,
      horsNorme: logementsHorsNorme,
      critiques: logementsCritiques,
      alerte: logementsAlerte,
      pourcentage: pourcentageHorsNorme
    };
  };
  const stats = calculerStatistiquesLogements();

  // Détection des alertes (franchissement seuils)
  let filteredAlerts = [];
  if (site?.categorie !== 'conforme') {
    const alerts = [];
    let inAlert = false;
    let alertStart = null;
    chartData.forEach((d, i) => {
      const t = d.tempMoy;
      const isConforme = t >= 18 && t <= 24;
      if (!isConforme) {
        if (!inAlert) {
          inAlert = true;
          alertStart = i;
        }
      } else {
        if (inAlert) {
          inAlert = false;
          alerts.push({ start: alertStart, end: i });
          alertStart = null;
        }
      }
    });
    if (inAlert && alertStart !== null) alerts.push({ start: alertStart, end: null });
    filteredAlerts = alerts;
  } else {
    filteredAlerts = [];
  }

  // Ajout : état pour panneau déroulant et alerte sélectionnée
  const [openPanel, setOpenPanel] = React.useState(false);
  const [selectedAlert, setSelectedAlert] = React.useState(null);

  // Gestion du clic sur une pastille d'alerte du graphique
  function handleAlertDotClick(alertData) {
    setSelectedAlert(alertData);
    setSelectedMonth(null); // Réinitialiser la sélection de mois
    setOpenPanel(true);
  }

  // Gestion du clic sur une barre mensuelle
  function handleMonthlyBarClick(monthData) {
    setSelectedMonth(monthData);
    setOpenPanel(true);
  }

  // Générer des alertes simulées pour les mois sélectionnés
  const generateMonthlyAlerts = (monthData) => {
    if (!monthData) return [];
    
    const alerts = [];
    const daysInMonth = new Date(monthData.year, monthData.monthIndex + 1, 0).getDate();
    
    // Générer des alertes basées sur les données du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(monthData.year, monthData.monthIndex, day);
      const tempMoy = parseFloat(monthData.tempMoy);
      
      // Ajouter de la variabilité quotidienne
      const dailyVariation = (Math.random() - 0.5) * 8; // ±4°C
      const dailyTemp = tempMoy + dailyVariation;
      
      if (dailyTemp < 16 || dailyTemp > 26) {
        alerts.push({
          id: `alert-${monthData.monthIndex}-${day}`,
          date: date.toISOString().split('T')[0],
          tempMoy: dailyTemp.toFixed(1),
          type: 'critical',
          message: dailyTemp < 16 ? 'Température trop basse' : 'Température trop élevée'
        });
      } else if (dailyTemp < 18 || dailyTemp > 24) {
        alerts.push({
          id: `alert-${monthData.monthIndex}-${day}`,
          date: date.toISOString().split('T')[0],
          tempMoy: dailyTemp.toFixed(1),
          type: 'warning',
          message: dailyTemp < 18 ? 'Température basse' : 'Température élevée'
        });
      }
    }
    
    return alerts.slice(0, monthData.totalAlerts); // Limiter au nombre d'alertes du mois
  };

  // Générer toutes les alertes de l'année entière
  const generateAllYearlyAlerts = () => {
    const allAlerts = [];
    
    // Ajouter les alertes journalières existantes
    filteredAlerts.forEach((alert, index) => {
      const tStart = chartData[alert.start]?.tempMoy;
      const tEnd = alert.end !== null ? chartData[alert.end]?.tempMoy : undefined;
      const dateStart = chartData[alert.start]?.date;
      const dateEnd = alert.end !== null ? chartData[alert.end]?.date : null;
      
      let nature = '';
      if (tStart !== undefined) nature = tStart < 18 ? 'Seuil bas' : tStart > 24 ? 'Seuil haut' : '';
      let statut = 'Commencée';
      let date = dateStart;
      if (alert.end !== null) {
        statut = 'Terminée';
        date = dateStart + ' → ' + dateEnd;
      } else if (alert.end === null) {
        statut = 'En cours';
      }
      
      allAlerts.push({
        id: `daily-${index}`,
        nature,
        date,
        statut,
        tempMoy: tStart,
        type: 'daily'
      });
    });
    
    // Ajouter les alertes mensuelles pour tous les mois
    monthlyData.forEach((monthData) => {
      if (monthData.totalAlerts > 0) {
        const monthAlerts = generateMonthlyAlerts(monthData);
        monthAlerts.forEach((alert, index) => {
          const nature = alert.type === 'critical' ? (parseFloat(alert.tempMoy) < 18 ? 'Seuil bas' : 'Seuil haut') : 'Alerte';
          allAlerts.push({
            id: `monthly-${monthData.monthIndex}-${index}`,
            nature,
            date: alert.date + ' (' + alert.tempMoy + '°C)',
            statut: 'Terminée',
            tempMoy: alert.tempMoy,
            type: 'monthly',
            month: monthData.month,
            year: monthData.year
          });
        });
      }
    });
    
    // Trier par date (les plus récentes en premier)
    return allAlerts.sort((a, b) => {
      const dateA = new Date(a.date.split(' ')[0]);
      const dateB = new Date(b.date.split(' ')[0]);
      return dateB - dateA;
    });
  };

  // Filtrer les alertes par mois sélectionné ou alerte spécifique
  const getFilteredAlertsForMonth = () => {
    if (!selectedMonth && !selectedAlert) return generateAllYearlyAlerts();
    
    if (selectedAlert) {
      // Filtrer pour l'alerte spécifique sélectionnée
      return generateAllYearlyAlerts().filter(alert => {
        // Pour les alertes journalières, comparer les dates de début
        if (selectedAlert.start !== undefined) {
          const alertStartDate = chartData[selectedAlert.start]?.date;
          return alert.date.includes(alertStartDate);
        }
        return false;
      });
    }
    
    if (selectedMonth) {
      const monthStart = new Date(selectedMonth.year, selectedMonth.monthIndex, 1);
      const monthEnd = new Date(selectedMonth.year, selectedMonth.monthIndex + 1, 0);
      
      return generateAllYearlyAlerts().filter(alert => {
        const alertDate = new Date(alert.date.split(' ')[0]);
        return alertDate >= monthStart && alertDate <= monthEnd;
      });
    }
    
    return generateAllYearlyAlerts();
  };

  const currentAlerts = getFilteredAlertsForMonth();

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FB', fontFamily: 'Inter, Arial, sans-serif', position: 'relative' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem 2.5rem 1rem 2.5rem', background: '#fff', borderBottom: '1.5px solid #e6e6e6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#3DB6E3',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e0e0e0',
              transition: 'background 0.18s, box-shadow 0.18s',
              outline: 'none',
              padding: 0,
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#2699c7'; e.currentTarget.style.boxShadow = '0 4px 16px #b3e3fa'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#3DB6E3'; e.currentTarget.style.boxShadow = '0 2px 8px #e0e0e0'; }}
            aria-label="Retour"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13 16L7 10L13 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F4FA', color: '#3DB6E3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>RM</div>
      </header>
      <main style={{ maxWidth: 1500, margin: '0 auto', padding: '2.5rem 0 2.5rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36 }}>
          <div style={{ flex: 'none', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 38, color: '#3DB6E3' }}>📈</span>
              <span style={{ fontWeight: 800, fontSize: 36, color: '#222' }}>Température moyenne</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 26, color: '#444', marginBottom: 2 }}>{site?.nom.replace(/_/g, ' ') || ''} - Immeuble haussmannien avec balcon filant</div>
            <div style={{ color: '#888', fontSize: 21, marginBottom: 18 }}>6 Place de l'Hôtel de Ville, 75004 Paris</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <span style={{ fontSize: 32, color: '#3DB6E3', fontWeight: 700 }}>🌡️</span>
              <span style={{ fontSize: 48, color: '#3DB6E3', fontWeight: 800 }}>{tempMoyGlobale} °C</span>
              <span style={{ color: '#888', fontSize: 22, fontWeight: 500, marginLeft: 8 }}>moyenne sur 30 jours</span>
            </div>
            
            {/* Toggle entre vue journalière et mensuelle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 8 }}>
              <div style={{ 
                display: 'flex', 
                background: '#F0F4F8', 
                borderRadius: 12, 
                padding: 4,
                border: '1px solid #e6e6e6'
              }}>
                <button
                  onClick={() => setViewMode('daily')}
                  style={{
                    background: viewMode === 'daily' ? '#3DB6E3' : 'transparent',
                    color: viewMode === 'daily' ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Vue journalière
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  style={{
                    background: viewMode === 'monthly' ? '#3DB6E3' : 'transparent',
                    color: viewMode === 'monthly' ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Vue mensuelle
                </button>
              </div>
              {selectedMonth && (
                <div style={{ 
                  background: '#E6F7FB', 
                  color: '#3DB6E3', 
                  padding: '6px 12px', 
                  borderRadius: 8, 
                  fontSize: 14, 
                  fontWeight: 600 
                }}>
                  {selectedMonth.month} {selectedMonth.year} sélectionné
                </div>
              )}
            </div>
            <div style={{ width: 1160, height: 520, background: '#fff', borderRadius: 18, border: '1.5px solid #e6e6e6', marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #e0e0e0', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'daily' ? (
                  <LineChart data={chartData} margin={{ top: 18, right: 18, left: 0, bottom: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <ReferenceArea y1={0} y2={16} fill="#FF204E44" ifOverflow="extendDomain" />
                    <ReferenceArea y1={16} y2={18} fill="#FF660044" ifOverflow="extendDomain" />
                    <ReferenceArea y1={18} y2={24} fill="#00DCFA44" ifOverflow="extendDomain" />
                    <ReferenceArea y1={24} y2={26} fill="#FF660044" ifOverflow="extendDomain" />
                    <ReferenceArea y1={26} y2={40} fill="#FF204E44" ifOverflow="extendDomain" />
                    <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#888' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 40]} tick={{ fontSize: 13, fill: '#888' }} axisLine={false} tickLine={false} unit="°C" />
                    <Tooltip formatter={(value, name) => [`${value} °C`, 'Temp. moyenne']} />
                    <Line type="monotone" dataKey="tempMoy" stroke="#3DB6E3" strokeWidth={6} dot={false} name="Temp. moyenne" style={{ filter: 'drop-shadow(0px 2px 4px #3DB6E355)' }} />
                    {filteredAlerts.map((a, i) => {
                      const tStart = chartData[a.start]?.tempMoy;
                      const tEnd = a.end !== null ? chartData[a.end]?.tempMoy : undefined;
                      const isStartHorsConforme = tStart !== undefined && (tStart < 18 || tStart > 24);
                      const isEndConforme = tEnd !== undefined && tEnd >= 18 && tEnd <= 24;
                      const dots = [];
                      if (isStartHorsConforme) {
                        dots.push(
                          <ReferenceDot key={`start-${i}`} x={chartData[a.start].date} y={tStart} r={9} fill="#FF204E" stroke="#fff" strokeWidth={3} cursor="pointer" onClick={() => handleAlertDotClick(a)} />
                        );
                      }
                      if (a.end !== null && a.end !== chartData.length - 1 && isEndConforme) {
                        dots.push(
                          <ReferenceDot key={`end-${i}`} x={chartData[a.end].date} y={tEnd} r={9} fill="#00DCFA" stroke="#fff" strokeWidth={3} cursor="pointer" onClick={() => handleAlertDotClick(a)} />
                        );
                      }
                      return dots;
                    })}
                  </LineChart>
                ) : (
                  <BarChart data={monthlyData} margin={{ top: 18, right: 18, left: 0, bottom: 18 }} barCategoryGap="10%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#888' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 40]} tick={{ fontSize: 13, fill: '#888' }} axisLine={false} tickLine={false} unit="°C" />
                    <Tooltip 
                      formatter={(value, name) => [`${value} °C`, 'Temp. moyenne']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          const monthData = payload[0].payload;
                          return `${monthData.month} ${monthData.year}`;
                        }
                        return label;
                      }}
                    />
                    <Bar 
                      dataKey="tempMoy" 
                      fill="#3DB6E3" 
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                      onClick={(data) => handleMonthlyBarClick(data)}
                    >
                      {monthlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill="#3DB6E3"
                          style={{ 
                            filter: 'drop-shadow(0px 2px 4px rgba(61, 182, 227, 0.3))'
                          }}
                        />
                      ))}
                      <LabelList dataKey="totalAlerts" content={renderAlertBadge} />
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 18, marginLeft: 8, alignItems: 'center', maxWidth: 1160 }}>
              {viewMode === 'daily' ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: '#00DCFA44', opacity: 0.44, display: 'inline-block', border: '1.5px solid #B6F0FF' }}></span>
                    <span style={{ color: '#00DCFA', fontWeight: 700, fontSize: 16 }}>Zone conforme (18–24°C)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF660044', opacity: 0.44, display: 'inline-block', border: '1.5px solid #FFD6B3' }}></span>
                    <span style={{ color: '#FF6600', fontWeight: 700, fontSize: 16 }}>Zone alerte (16–18°C, 24–26°C)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: '#FF204E44', opacity: 0.44, display: 'inline-block', border: '1.5px solid #FFD6E0' }}></span>
                    <span style={{ color: '#FF204E', fontWeight: 700, fontSize: 16 }}>Zone critique ({'<'}16°C, {'>'}26°C)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 24 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#FF204E', border: '3px solid #fff', display: 'inline-block', verticalAlign: 'middle' }}></span>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>Début d'alerte</span>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#00DCFA', border: '3px solid #fff', display: 'inline-block', marginLeft: 18, verticalAlign: 'middle' }}></span>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>Fin d'alerte</span>
                  </div>
                  </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 0 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF204E', border: '2px solid #fff', display: 'inline-block' }}></span>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>Alertes critiques</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6600', border: '2px solid #fff', display: 'inline-block', marginLeft: 18 }}></span>
                    <span style={{ color: '#222', fontWeight: 600, fontSize: 15 }}>Alertes warning</span>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setOpenPanel(!openPanel)}
              style={{
                position: 'fixed',
                right: 32, // même marge que le panneau latéral
                bottom: openPanel ? '340px' : '25px', // <- descend le bouton quand fermé
                background: '#3DB6E3',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: '24px 24px 32px 32px',
                boxShadow: '0 2px 12px #e0e0e0',
                padding: '16px 44px 16px 34px',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(.77,0,.18,1)',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                opacity: openPanel ? 0.7 : 1,
              }}
              onMouseOver={e => {
                const arrow = e.currentTarget.querySelector('.arrow-drill');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
              }}
              onMouseOut={e => {
                const arrow = e.currentTarget.querySelector('.arrow-drill');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
              }}
            >
              Journal des alertes
              <span
                className="arrow-drill"
                style={{
                  display: 'inline-block',
                  marginLeft: 16,
                  fontSize: 22,
                  transition: 'transform 0.25s cubic-bezier(.77,0,.18,1)',
                  transform: openPanel ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▼
              </span>
            </button>
          </div>
          {/* Panneau latéral à droite : carte d'alerte */}
          <div style={{ width: 400, minWidth: 400, maxWidth: 400, marginLeft: 32 }}>
            <div style={{ width: '100%', background: site?.categorie === 'critique' ? '#FFE6E6' : site?.categorie === 'alerte' ? '#FFF3E6' : '#E6F7FB', borderRadius: 16, padding: '1.2rem 1.5rem 1.1rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: site?.categorie === 'critique' ? '0 1px 4px #f3e2c0' : '0 1px 4px #ffe6b3', border: site?.categorie === 'critique' ? '1.2px solid #FFD6E0' : site?.categorie === 'alerte' ? '1.2px solid #FFD6B3' : '1.2px solid #B6F0FF', minHeight: 0, justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ 
                background: site?.categorie === 'critique' ? '#FF204E' : site?.categorie === 'alerte' ? '#FF6600' : '#E6F7FB',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                marginTop: 2
              }}>
                <span style={{ 
                  color: site?.categorie === 'conforme' ? '#00DCFA' : '#fff',
                  fontSize: site?.categorie === 'conforme' ? 15 : 17,
                  fontWeight: 700
                }}>
                  {site?.categorie === 'conforme' ? '❤' : '!'}
                </span>
              </div>
              <div style={{ 
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 6,
                color: site?.categorie === 'critique' ? '#FF204E' : site?.categorie === 'alerte' ? '#FF6600' : '#00DCFA',
                textAlign: 'center'
              }}>
                {site?.categorie === 'critique' ? 'Alerte critique' : site?.categorie === 'alerte' ? 'Alerte warning' : 'Conforme'}
              </div>
              {stats.horsNorme > 0 ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 2, textAlign: 'center' }}>
                    {stats.critiques > 0 && `${stats.critiques} logement${stats.critiques > 1 ? 's' : ''} critique${stats.critiques > 1 ? 's' : ''}`}
                    {stats.critiques > 0 && stats.alerte > 0 && ' et '}
                    {stats.alerte > 0 && `${stats.alerte} logement${stats.alerte > 1 ? 's' : ''} en alerte`}
                  </div>
                  <div style={{ fontSize: 15, color: '#444', marginBottom: 10, textAlign: 'center' }}>
                    {stats.pourcentage} % des logements hors seuils
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 15, color: '#444', marginBottom: 10, textAlign: 'center' }}>
                  Tous les logements sont conformes
                </div>
              )}
              <button 
                onClick={() => navigate(`/site/${siteId}/logements`)}
                style={{ border: '1.2px solid #bbb', borderRadius: 8, background: '#fff', color: '#222', fontWeight: 700, fontSize: 15, padding: '8px 18px', cursor: 'pointer', marginTop: 2, minWidth: 220 }}
              >
                Voir les logements concernés
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* Panneau bas déroulant : journal des alertes uniquement */}
      <div style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100vw',
        maxWidth: '100vw',
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.15)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 1002,
        transform: openPanel ? 'translateY(0)' : 'translateY(90%)',
        transition: 'transform 0.35s cubic-bezier(.77,0,.18,1), max-height 0.35s cubic-bezier(.77,0,.18,1), min-height 0.35s cubic-bezier(.77,0,.18,1), padding 0.2s',
        minHeight: openPanel ? 320 : 112, // <- doublé
        maxHeight: openPanel ? '80vh' : 128,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: openPanel ? '2.5rem 0 2rem 0' : '0.7rem 0 0.7rem 0',
        pointerEvents: 'auto',
      }}>
        {/* Bandeau supérieur toujours visible */}
        <div style={{ width: '100%', maxWidth: 1160, margin: '0 auto', background: '#F7F9FB', borderRadius: 18, boxShadow: '0 2px 12px #e0e0e0', padding: openPanel ? '32px 24px' : '0 24px', overflow: 'auto', minHeight: openPanel ? 0 : 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: openPanel ? 'auto' : 32 }}>
          <div style={{ fontWeight: 800, fontSize: openPanel ? 24 : 18, color: '#222', textAlign: 'left', paddingLeft: 0, letterSpacing: 0.2 }}>
            Journal des alertes
            {selectedMonth && openPanel && (
              <span style={{ color: '#3DB6E3', fontSize: 20, marginLeft: 12 }}>
                - {selectedMonth.month} {selectedMonth.year}
              </span>
            )}
            {selectedAlert && openPanel && (
              <span style={{ color: '#FF204E', fontSize: 20, marginLeft: 12 }}>
                - Alerte spécifique
              </span>
            )}
          </div>
          {/* Bouton d'ouverture si replié */}
          {!openPanel && (
            <button
              onClick={() => setOpenPanel(true)}
              style={{
                background: '#3DB6E3',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 18px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #e0e0e0',
                marginLeft: 18
              }}
            >
              Ouvrir
            </button>
          )}
          {/* Croix de fermeture si ouvert */}
          {openPanel && (
            <button onClick={() => setOpenPanel(false)} style={{
              background: 'transparent',
              border: 'none',
              fontSize: 32,
              color: '#888',
              cursor: 'pointer',
              zIndex: 1003,
            }} aria-label="Fermer le panneau">×</button>
          )}
        </div>
        {/* Contenu détaillé du panneau, affiché seulement si ouvert */}
        {openPanel && (
          <div style={{ width: '100%', maxWidth: 1160, margin: '0 auto', background: '#F7F9FB', borderRadius: 18, boxShadow: '0 2px 12px #e0e0e0', padding: '32px 24px', overflow: 'auto' }}>
            {(selectedMonth || selectedAlert) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22 }}>
                <button
                  onClick={() => {
                    setSelectedMonth(null);
                    setSelectedAlert(null);
                  }}
                  style={{
                    background: '#fff',
                    border: '1px solid #3DB6E3',
                    color: '#3DB6E3',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F0F8FF'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  Voir toutes les alertes
                </button>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px #e0e0e0' }}>
              <thead>
                <tr style={{ background: '#F0F4F8', color: '#222', fontWeight: 800, fontSize: 17, letterSpacing: 0.1 }}>
                  <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>Nature</th>
                  <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '20px 28px 18px 28px', border: 'none' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {currentAlerts.length === 0 ? (
                  <tr><td colSpan={4} style={{ color: '#aaa', textAlign: 'center', padding: 24, fontSize: 18 }}>
                    {selectedMonth ? `Aucune alerte pour ${selectedMonth.month} ${selectedMonth.year}` : 
                     selectedAlert ? 'Aucune alerte trouvée pour cette sélection' : 'Aucune alerte'}
                  </td></tr>
                ) : (
                  currentAlerts.map((a, i) => {
                    const color = a.nature === 'Seuil haut' ? '#FF204E' : a.nature === 'Seuil bas' ? '#FF204E' : '#FF6600';
                    const statutColor = a.statut === 'En cours' ? '#FF6600' : a.statut === 'Terminée' ? '#00DCFA' : '#888';
                    
                    return (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.18s', cursor: 'pointer' }}
                        onMouseOver={e => e.currentTarget.style.background = '#F7F9FB'}
                        onMouseOut={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '14px 28px', fontWeight: 700, color: '#888', border: 'none' }}>#{i + 1}</td>
                        <td style={{ padding: '14px 28px', color: color, fontWeight: 700, border: 'none' }}>{a.nature}</td>
                        <td style={{ padding: '14px 28px', color: '#444', border: 'none' }}>{a.date}</td>
                        <td style={{ padding: '14px 28px', color: statutColor, fontWeight: 700, border: 'none' }}>{a.statut}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Fonction de rendu du badge d'alerte centré sur la barre
const renderAlertBadge = (props) => {
  const { x, y, width, value } = props;
  if (!value || value === 0) return null;
  const badgeWidth = 40;
  return (
    <foreignObject
      x={x + width / 2 - badgeWidth / 2}
      y={y - 28}
      width={badgeWidth}
      height={28}
      style={{ overflow: 'visible', pointerEvents: 'none' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: '#FF204E',
          color: '#fff',
          fontWeight: 700,
          fontSize: 14,
          borderRadius: 10,
          padding: '1px 8px 1px 8px',
          boxShadow: '0 1px 4px #ffd6e0',
          position: 'relative',
          minWidth: 28,
          textAlign: 'center',
          zIndex: 2
        }}>
          {value} alerte{value > 1 ? 's' : ''}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: -6,
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #FF204E',
            zIndex: 1
          }} />
        </div>
      </div>
    </foreignObject>
  );
};

function App() {
  const [selected, setSelected] = React.useState('all');
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={<DashboardPage selected={selected} setSelected={setSelected} navigate={navigate} />} />
      <Route path="/explorer" element={<ExplorerPage selected={selected} setSelected={setSelected} />} />
      <Route path="/site/:siteId" element={<SiteDetailPage />} />
      <Route path="/site/:siteId/logements" element={<LogementsHeatmap />} />
    </Routes>
  );
}

// Wrapping with Router
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
