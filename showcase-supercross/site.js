(function () {
  'use strict';
  const data = window.SX_DATA;
  const tabs = document.getElementById('tabs');
  const sheet = document.getElementById('sheet');
  document.getElementById('asof').textContent = 'AS OF ' + data.asOf;
  let current = data.series[0].id;
  const weights = {};
  data.series.forEach((series) => {
    weights[series.id] = series.weights.map((factor) => factor.weight);
  });

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function score(series, rider) {
    const w = weights[series.id];
    let acc = 0;
    let total = 0;
    w.forEach((weight, i) => {
      acc += weight * rider.scores[i];
      total += weight;
    });
    return total ? Math.round((acc / total) * 10) / 10 : 0;
  }

  function parts(iso) {
    const ms = new Date(iso).getTime() - Date.now();
    if (Number.isNaN(ms)) return null;
    if (ms <= 0) return { done: true };
    const total = Math.floor(ms / 1000);
    return {
      d: Math.floor(total / 86400),
      h: Math.floor((total % 86400) / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60
    };
  }

  function countdown(iso) {
    const p = parts(iso);
    if (!p) return 'Time not available.';
    if (p.done) return 'That marker has passed.';
    return p.d + 'd ' + p.h + 'h ' + String(p.m).padStart(2, '0') + 'm ' + String(p.s).padStart(2, '0') + 's';
  }

  function plate(number) {
    return '<span class="plate" aria-hidden="true">' + (number ? esc(number) : '–') + '</span>';
  }

  function clockHtml(iso) {
    const p = parts(iso);
    if (!p) return '<p class="clock">Time not available.</p>';
    if (p.done) return '<p class="clock" data-iso="' + esc(iso) + '">That marker has passed.</p>';
    const units = [
      ['d', p.d, 3, 'DAYS'],
      ['h', p.h, 2, 'HRS'],
      ['m', p.m, 2, 'MIN'],
      ['s', p.s, 2, 'SEC']
    ];
    return '<div class="clock" data-iso="' + esc(iso) + '">' + units.map((unit) => {
      const text = String(unit[1]).padStart(unit[2], '0');
      const digits = text.split('').map((digit) => '<b class="digit">' + digit + '</b>').join('');
      return '<div class="unit" data-unit="' + unit[0] + '" data-width="' + unit[2] + '"><div class="digits">' + digits + '</div><span>' + unit[3] + '</span></div>';
    }).join('') + '</div>';
  }

  function tickClock() {
    const node = sheet.querySelector('.clock');
    if (!node || !node.dataset.iso) return;
    const p = parts(node.dataset.iso);
    if (!p || p.done) {
      node.textContent = p && p.done ? 'That marker has passed.' : 'Time not available.';
      return;
    }
    const values = { d: p.d, h: p.h, m: p.m, s: p.s };
    node.querySelectorAll('[data-unit]').forEach((unit) => {
      const text = String(values[unit.dataset.unit]).padStart(Number(unit.dataset.width), '0');
      unit.querySelectorAll('.digit').forEach((digit, index) => {
        if (digit.textContent !== text[index]) {
          digit.textContent = text[index];
          digit.classList.remove('flip');
          void digit.offsetWidth;
          digit.classList.add('flip');
        }
      });
    });
  }

  function rowsHtml(rows) {
    return rows.map((row) => {
      const quiet = row.confirmed === false ? ' quiet' : '';
      return '<tr class="' + quiet + '"><td class="pos">' + row.pos + '</td><td>' + plate(row.number) + '</td><td>' + esc(row.name) + '</td><td>' + esc(row.bike) + '</td><td>' + esc(row.detail) + '</td></tr>';
    }).join('');
  }

  function podiumHtml(rows) {
    const order = [2, 1, 3];
    return '<div class="podium">' + order.map((pos) => {
      const row = rows.find((item) => item.pos === pos && item.confirmed !== false);
      if (!row) return '';
      return '<article class="step p' + pos + '"><b>' + pos + '</b>' + plate(row.number) + '<strong>' + esc(row.name) + '</strong><span>' + esc(row.bike) + '</span><em>' + esc(row.detail) + '</em></article>';
    }).join('') + '</div>';
  }

  function chartHtml(series) {
    if (series.standingsMode === 'titles') {
      return '<ul class="titles">' + series.standings.map((row) => '<li><span>' + esc(row.label) + '</span><strong>' + esc(row.name) + '</strong></li>').join('') + '</ul>';
    }
    const max = Math.max.apply(null, series.standings.map((row) => row.points));
    return '<ol class="chart">' + series.standings.map((row) => {
      const width = Math.max(8, Math.round((row.points / max) * 100));
      return '<li><span class="who">' + plate(row.number) + esc(row.name) + '</span><span class="bar" style="width:' + width + '%"></span><b>' + row.points + '</b></li>';
    }).join('') + '</ol>';
  }

  function paintTabs() {
    tabs.innerHTML = '';
    data.series.forEach((series) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = series.label;
      btn.setAttribute('aria-selected', String(series.id === current));
      btn.onclick = () => { current = series.id; paint(); };
      tabs.appendChild(btn);
    });
  }

  function paint() {
    paintTabs();
    const series = data.series.find((item) => item.id === current);
    document.body.dataset.series = series.id;
    const ranked = series.riders.map((rider) => ({ rider, score: score(series, rider) })).sort((a, b) => b.score - a.score);
    const extra = series.extra ? '<h3>' + esc(series.extraTitle) + '</h3><table><thead><tr><th>Pos</th><th>#</th><th>Rider</th><th>Bike</th><th>Moto</th></tr></thead><tbody>' + rowsHtml(series.extra) + '</tbody></table>' : '';
    sheet.innerHTML = `
      <section class="card next">
        <div>
          <p class="eyebrow">${esc(series.kicker)}</p>
          <h2>${esc(series.next.name)}</h2>
          <p class="when">${esc(series.next.when)}</p>
          <p>${esc(series.next.venue)}</p>
          <p class="note">${esc(series.next.clockNote)}</p>
          <p class="src"><a href="${esc(series.next.source)}">Next-race source</a></p>
        </div>
        <div class="countbox">
          <p class="eyebrow">SYDNEY COUNTDOWN</p>
          ${clockHtml(series.next.iso)}
          <p class="flag">${series.next.timeStatus === 'published' ? 'Published gate' : 'Clock unconfirmed'}</p>
        </div>
      </section>
      <section class="card results">
        <h3>PODIUM</h3>
        ${podiumHtml(series.results)}
        <h3>${esc(series.recentTitle)}</h3>
        <p>${esc(series.recentNote)}</p>
        <table>
          <thead><tr><th>Pos</th><th>#</th><th>Rider</th><th>Bike</th><th>Result</th></tr></thead>
          <tbody>${rowsHtml(series.results)}</tbody>
        </table>
        <p class="src"><a href="${esc(series.resultSource.url)}">${esc(series.resultSource.title)}</a></p>
        ${extra}
        <h3>${esc(series.standingsTitle)}</h3>
        <p>${esc(series.standingsNote)}</p>
        ${chartHtml(series)}
        <p class="src"><a href="${esc(series.standingsSource.url)}">${esc(series.standingsSource.title)}</a></p>
        <p>${esc(series.season)}</p>
      </section>
      <section class="card watch">
        <h3>WATCH FROM AUSTRALIA</h3>
        <div class="badges">${series.channels.map((channel) => '<span class="badge' + (channel.ok ? ' ok' : '') + '">' + esc(channel.name) + '</span>').join('')}</div>
        <p>${esc(series.watch)}</p>
      </section>
      <section class="card">
        <h3>WHO TO CHEER FOR · FAN PICK</h3>
        <p>${esc(series.cheer)}</p>
        <div class="picks">
          ${ranked.map(({ rider, score: idx }) => `<article class="rider${rider.cheer ? ' cheer' : ''}" data-rider="${esc(rider.name)}">${plate(rider.number)}<div><b>${esc(rider.name)}</b><span class="bike">${esc(rider.bike)}</span></div><span class="idx">${idx}</span><span class="stamp">OPINION</span>${rider.cheer ? '<span class="tag">CHEER</span>' : ''}<p>${esc(rider.why)}</p></article>`).join('')}
        </div>
      </section>
      <section class="card opinion">
        <h3>LIKELY STORY · OPINION</h3>
        <p>${esc(series.outlook)}</p>
      </section>
      <section class="card">
        <h3>WEIGHTING TABLE</h3>
        <p>Move a slider to change how much that factor counts. The notes under each rider stay as written. The index is their weighted average. It is an opinion, not a series ranking.</p>
        ${series.weights.map((factor, i) => `<label class="slider"><span>${esc(factor.factor)}<br><small>${esc(factor.note)}</small></span><strong data-w="${i}">${weights[series.id][i]}</strong><input type="range" min="0" max="50" value="${weights[series.id][i]}" data-i="${i}" aria-label="${esc(factor.factor)}"></label>`).join('')}
        <button class="reset" type="button">Reset weights</button>
      </section>
      <section class="card">
        <h3>SOURCES · AS OF ${esc(data.asOf)}</h3>
        <ul>${series.sources.map((source) => `<li><a href="${esc(source.url)}">${esc(source.title)}</a></li>`).join('')}</ul>
      </section>`;
    sheet.querySelectorAll('input[type="range"]').forEach((input) => {
      input.addEventListener('input', () => {
        const index = Number(input.dataset.i);
        weights[series.id][index] = Number(input.value);
        sheet.querySelector('[data-w="' + index + '"]').textContent = input.value;
        series.riders.forEach((rider) => {
          const card = sheet.querySelector('[data-rider="' + rider.name + '"] .idx');
          if (card) card.textContent = String(score(series, rider));
        });
      });
    });
    sheet.querySelector('.reset').onclick = () => {
      weights[series.id] = series.weights.map((factor) => factor.weight);
      paint();
    };
  }

  setInterval(tickClock, 1000);
  paint();
  window.Gateboard = { data, score, countdown, show(id) { current = id; paint(); } };
})();
