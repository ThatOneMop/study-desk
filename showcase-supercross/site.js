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

  function countdown(iso) {
    const ms = new Date(iso).getTime() - Date.now();
    if (Number.isNaN(ms)) return 'Time not available.';
    if (ms <= 0) return 'That marker has passed.';
    const total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return days + 'd ' + hours + 'h ' + String(mins).padStart(2, '0') + 'm ' + String(secs).padStart(2, '0') + 's';
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
    const ranked = series.riders.map((rider) => ({ rider, score: score(series, rider) })).sort((a, b) => b.score - a.score);
    sheet.innerHTML = `
      <section class="card next">
        <div>
          <p class="eyebrow">${series.kicker}</p>
          <h2>${series.next.name}</h2>
          <p>${series.next.when}<br>${series.next.venue}</p>
          <p>${series.next.clockNote}</p>
        </div>
        <div>
          <p class="eyebrow">SYDNEY COUNTDOWN</p>
          <p class="clock" data-iso="${series.next.iso}">${countdown(series.next.iso)}</p>
        </div>
      </section>
      <section class="grid">
        <article class="card">
          <h3>RECENT RESULTS</h3>
          <p><strong>${series.recentTitle}</strong></p>
          <p>${series.recentNote}</p>
          <table>
            <thead><tr><th>Pos</th><th>Rider</th><th>What the source said</th></tr></thead>
            <tbody>
              ${series.results.map((row) => `<tr><td class="pos">${row.pos}</td><td>${row.name}</td><td>${row.detail}</td></tr>`).join('')}
            </tbody>
          </table>
          <p>${series.season}</p>
        </article>
        <article class="card">
          <h3>WATCH FROM AUSTRALIA</h3>
          <p>${series.watch}</p>
          <p>Times on this page are converted into Australia/Sydney. If a source did not publish a start time, the countdown says so.</p>
        </article>
      </section>
      <section class="card">
        <h3>WHO TO CHEER FOR · FAN PICK</h3>
        <p>${series.cheer}</p>
        <div class="picks">
          ${ranked.map(({ rider, score }) => `<article class="rider${rider.cheer ? ' cheer' : ''}" data-rider="${rider.name}"><b>${rider.name}</b><span class="idx">${score}</span><span>opinion index</span>${rider.cheer ? '<span class="tag">CHEER</span>' : ''}<p>${rider.why}</p></article>`).join('')}
        </div>
      </section>
      <section class="card opinion">
        <h3>LIKELY STORY · OPINION</h3>
        <p>${series.outlook}</p>
        ${series.also ? `<p>${series.also}</p>` : ''}
      </section>
      <section class="card">
        <h3>WEIGHTING TABLE</h3>
        <p>Move a slider to change how much that factor counts. The 0–10 notes under each rider stay the sourced ones. The index is their weighted average. It is an opinion, not a series ranking.</p>
        ${series.weights.map((factor, i) => `<label class="slider"><span>${factor.factor}<br><small>${factor.note}</small></span><strong data-w="${i}">${weights[series.id][i]}</strong><input type="range" min="0" max="50" value="${weights[series.id][i]}" data-i="${i}" aria-label="${factor.factor}"></label>`).join('')}
        <button class="reset" type="button">Reset weights</button>
      </section>
      <section class="card">
        <h3>SOURCES · AS OF ${data.asOf}</h3>
        <ul>${series.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a></li>`).join('')}</ul>
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
    const reset = sheet.querySelector('.reset');
    reset.onclick = () => {
      weights[series.id] = series.weights.map((factor) => factor.weight);
      paint();
    };
  }

  let lastMinute = '';
  setInterval(() => {
    const node = sheet.querySelector('.clock');
    if (!node) return;
    const text = countdown(node.dataset.iso);
    if (text !== node.textContent) {
      node.textContent = text;
      const minute = text.slice(0, -3);
      if (minute !== lastMinute) {
        node.classList.remove('tick');
        void node.offsetWidth;
        node.classList.add('tick');
        lastMinute = minute;
      }
    }
  }, 1000);

  paint();
  window.Gateboard = { data, score, countdown, show(id) { current = id; paint(); } };
})();
