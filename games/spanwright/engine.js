'use strict';
/*
 * Spanwright — county crossing physics.
 * Original code. Material strengths follow the public table
 * documented in docs/spanwright-research.md. Nothing else is taken from that note.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SpanEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const SAVE_KEY = 'study-desk-spanwright-v1';
  const G = 12;
  const FRAME = 1 / 60;
  const SUBS = 16;
  const H = FRAME / SUBS;

  const MATERIALS = {
    road:      { id: 'road', name: 'Road', cost: 200, max: 2, strength: 900, tension: true, compression: true, k: 22000, zeta: 0.68, key: '1' },
    wood:      { id: 'wood', name: 'Wood', cost: 180, max: 2, strength: 800, tension: true, compression: true, k: 18000, zeta: 0.66, key: '2' },
    steel:     { id: 'steel', name: 'Steel', cost: 450, max: 4, strength: 2000, tension: true, compression: true, k: 42000, zeta: 0.74, key: '3' },
    rope:      { id: 'rope', name: 'Rope', cost: 220, max: 40, strength: 1200, tension: true, compression: false, k: 16000, zeta: 0.36, key: '4' },
    cable:     { id: 'cable', name: 'Cable', cost: 400, max: 40, strength: 2200, tension: true, compression: false, k: 30000, zeta: 0.4, key: '5' },
    hydraulic: { id: 'hydraulic', name: 'Hydraulic', cost: 750, max: 4, strength: 2000, tension: true, compression: true, k: 28000, zeta: 0.75, key: '6' },
    spring:    { id: 'spring', name: 'Spring', cost: 380, max: 3, strength: 960, tension: true, compression: true, k: 480, zeta: 0.18, key: '7' }
  };

  const VEHICLES = {
    cycle:   { id: 'cycle', name: 'Reed Cycle', mass: 4.2, speed: 6.1, accel: 8, brake: 10, w: 1.05, h: 0.72, axle: 0.36, radius: 0.22 },
    cart:    { id: 'cart', name: 'Parcel Cart', mass: 9.2, speed: 4.8, accel: 6, brake: 9, w: 1.62, h: 0.78, axle: 0.58, radius: 0.26 },
    hack:    { id: 'hack', name: 'County Hack', mass: 11, speed: 6.2, accel: 7, brake: 10, w: 1.78, h: 0.74, axle: 0.64, radius: 0.26 },
    van:     { id: 'van', name: 'Field Van', mass: 16, speed: 4.3, accel: 4.4, brake: 8, w: 1.96, h: 0.9, axle: 0.72, radius: 0.28 },
    dray:    { id: 'dray', name: 'Workshop Dray', mass: 22, speed: 3.6, accel: 3.6, brake: 7, w: 2.1, h: 0.86, axle: 0.78, radius: 0.3 },
    wagon:   { id: 'wagon', name: 'Grain Wagon', mass: 31, speed: 3.15, accel: 2.8, brake: 6.5, w: 2.35, h: 1.02, axle: 0.86, radius: 0.32 },
    hopper:  { id: 'hopper', name: 'Hopper', mass: 36, speed: 2.7, accel: 2.4, brake: 6, w: 2.28, h: 1.12, axle: 0.84, radius: 0.32 },
    cistern: { id: 'cistern', name: 'Cistern', mass: 48, speed: 2.55, accel: 2.1, brake: 5.5, w: 2.62, h: 1.08, axle: 0.96, radius: 0.34 }
  };

  const WORLDS = [
    { id: 'willow', name: 'Willow Reach', kicker: 'Chapter 1', line: 'Quiet water, short planks, the first bolts.' },
    { id: 'copper', name: 'Copper Cut', kicker: 'Chapter 2', line: 'The quarry wants a longer, stiffer reach.' },
    { id: 'tide', name: 'Tide Gate', kicker: 'Chapter 3', line: 'Barges keep a timetable. The leaf has to as well.' },
    { id: 'hollow', name: 'Bramble Hollow', kicker: 'Chapter 4', line: 'Hang the road, or let a coil take the blow.' },
    { id: 'lantern', name: 'Lantern Mile', kicker: 'Chapter 5', line: 'Markers in the dark, and more than one vehicle.' },
    { id: 'second', name: 'Second Measuring', kicker: 'Chapter 6', line: 'Stricter contracts on familiar water.' }
  ];

  const ACHIEVEMENTS = [
    { id: 'first-crossing', name: 'First cart home', detail: 'Finish a contract.' },
    { id: 'ledger', name: 'Inside the book', detail: 'Finish at or under budget.' },
    { id: 'unbroken', name: 'Quiet members', detail: 'Finish under budget without a member reaching its limit.' },
    { id: 'thrifty', name: 'Half the ledger', detail: 'Finish on half the budget or less.' },
    { id: 'spring-step', name: 'Coil in the works', detail: 'Finish a crossing that uses a spring.' },
    { id: 'gate-bell', name: 'Barge bell', detail: 'Finish a crossing that shares the water with a barge.' },
    { id: 'marker-hand', name: 'Lantern hand', detail: 'Finish a crossing that asks for a marker.' },
    { id: 'night-pair', name: 'Two on the road', detail: 'Finish a crossing with more than one vehicle.' },
    { id: 'clean-exam', name: 'Clean contract', detail: 'Pass a contract that forbids a snap.' },
    { id: 'collapse-watch', name: 'Saw it go', detail: 'Watch a member snap.' },
    { id: 'replay-desk', name: 'Run it back', detail: 'Watch a replay from the start.' },
    { id: 'yard-bird', name: 'Yard bird', detail: 'Send something across the practice yard.' },
    { id: 'world-willow', name: 'Willow sealed', detail: 'Clear every contract in Willow Reach.' },
    { id: 'world-copper', name: 'Copper sealed', detail: 'Clear every contract in Copper Cut.' },
    { id: 'world-tide', name: 'Tide sealed', detail: 'Clear every contract in Tide Gate.' },
    { id: 'world-hollow', name: 'Hollow sealed', detail: 'Clear every contract in Bramble Hollow.' },
    { id: 'world-lantern', name: 'Lantern sealed', detail: 'Clear every contract in Lantern Mile.' },
    { id: 'world-second', name: 'Second sealed', detail: 'Clear every contract in Second Measuring.' },
    { id: 'county-seal', name: 'County seal', detail: 'Earn a star on every contract.' },
    { id: 'brass-book', name: 'Brass book', detail: 'Earn three stars on every contract.' }
  ];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hypot(x, y) { return Math.hypot(x, y); }

  function makeLevel(d) {
    const L = {
      grid: 1,
      waterY: 2.05,
      contract: { maxOver: 0.5, requireUnder: false, requireClean: false },
      checkpoints: [],
      boats: [],
      forbid: [],
      starters: [],
      materials: ['road', 'wood'],
      timeLimit: 48,
      tutorial: null,
      theme: d.world,
      vehicles: [{ id: 'v1', type: 'cart' }],
      phases: null,
      brief: '',
      budget: 3000,
      dress: (d.dress == null ? 1 : d.dress)
    };
    Object.assign(L, d);
    if (!L.anchors) {
      const left = d.left == null ? 7 : d.left;
      const right = d.right == null ? 6 : d.right;
      const gap = d.gap;
      const yL = d.yL == null ? 6 : d.yL;
      const yR = d.yR == null ? yL : d.yR;
      const xL = left;
      const xR = left + gap;
      const xEnd = xR + right;
      L.anchors = [{ x: xL, y: yL }, { x: xR, y: yR }];
      (d.piers || []).forEach(p => L.anchors.push({ x: p[0], y: p[1] }));
      (d.towers || []).forEach(p => L.anchors.push({ x: p[0], y: p[1] }));
      const shoreL = d.shoreL == null ? xL + 0.05 : d.shoreL;
      const shoreR = d.shoreR == null ? xR - 0.05 : d.shoreR;
      L.ground = [
        { x0: 0.15, y0: yL, x1: shoreL, y1: yL },
        { x0: shoreR, y0: yR, x1: xEnd + 0.2, y1: yR }
      ];
      L.bounds = { x0: -1.2, y0: -0.5, x1: xEnd + 1.2, y1: Math.max(yL, yR, 6) + 12 };
      L.xL = xL; L.xR = xR; L.xEnd = xEnd; L.yL = yL; L.yR = yR;
      L.vehicles = (d.vehicles || [{ id: 'v1', type: 'cart' }]).map((v, i) => Object.assign({
        id: 'v' + (i + 1),
        type: 'cart',
        x: 2.1 + i * 2.15,
        dir: 1,
        flagX: (v && v.dir === -1) ? 1.55 : xEnd - 2.05,
        flagY: ((v && v.dir === -1) ? yL : yR) + 0.5
      }, v));
    }
    if (!L.phases) {
      if (L.vehicles.length === 1) {
        L.phases = [{ id: 'A', t: 0.3, label: 'Crossing', spawn: [L.vehicles[0].id] }];
      } else {
        L.phases = L.vehicles.map((v, i) => ({
          id: String.fromCharCode(65 + i),
          t: 0.3 + i * 5.2,
          label: v.type,
          spawn: [v.id]
        }));
      }
    }
    L.contract = Object.assign({ maxOver: 0.5, requireUnder: false, requireClean: false }, d.contract || {});
    return L;
  }

  const LEVELS = [
    makeLevel({ id: 'willow-1', world: 'willow', name: 'First Plank', gap: 6, left: 7, budget: 1700, materials: ['road'], vehicles: [{ id: 'v1', type: 'cart' }], brief: 'Six metres of quiet water. The cart will not swim.', tutorial: true, dress: 1 }),
    makeLevel({ id: 'willow-2', world: 'willow', name: 'A Brace for the Middle', gap: 10, budget: 11400, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'cart' }], brief: 'Ten metres of bare road will buckle. Triangles and a steel bottom chord keep the deck up.', dress: 2 }),
    makeLevel({ id: 'willow-3', world: 'willow', name: 'Two Errands', gap: 8, budget: 8900, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'cart' }, { id: 'v2', type: 'van', x: 2.2 }], brief: 'The van follows the cart. Brace for the second vehicle, not the first.', dress: 3 }),
    makeLevel({ id: 'willow-4', world: 'willow', name: 'Rock in the Current', gap: 14, left: 6, budget: 15800, materials: ['road', 'wood', 'steel'], piers: [[12, 6]], vehicles: [{ id: 'v1', type: 'van' }], brief: 'The midstream rock will hold a bolt. Brace each side. A single plank across will fold.', dress: 4 }),
    makeLevel({ id: 'willow-5', world: 'willow', name: 'Penny Ledger', gap: 8, budget: 8200, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'cart' }], brief: 'The clerk left little room. A neat brace fits. A wasteful one does not.', dress: 5 }),
    makeLevel({ id: 'willow-6', world: 'willow', name: 'Down to the Orchard', gap: 10, budget: 11400, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'van' }], brief: 'The orchard road is a van, not a cart. Keep the deck from settling into the water.', dress: 6 }),

    makeLevel({ id: 'copper-1', world: 'copper', name: 'Longer Steel', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'dray' }], brief: 'The dray will fold a naked deck. Steel in the bottom chord, wood in the triangles.', dress: 7 }),
    makeLevel({ id: 'copper-2', world: 'copper', name: 'The Shelf', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'wagon' }], brief: 'A grain wagon. Brace the whole shelf. A flat line of road will buckle under it.', dress: 8 }),
    makeLevel({ id: 'copper-3', world: 'copper', name: 'Cart then Wagon', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'cart' }, { id: 'v2', type: 'wagon', x: 2.1 }], brief: 'The cart is a decoy. The wagon is the load the span has to survive.', dress: 9 }),
    makeLevel({ id: 'copper-4', world: 'copper', name: 'Pier and Plate', gap: 16, budget: 18400, piers: [[15, 6]], materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'wagon' }], brief: 'Use the pier and brace both openings. Sixteen metres in one droop will not do.', dress: 10 }),
    makeLevel({ id: 'copper-5', world: 'copper', name: 'Around the Boulder', gap: 12, yL: 9, yR: 9, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'dray' }], forbid: [{ x: 10, y: 4.2, w: 6, h: 3.2 }], brief: 'The boulder fills the low gap. Stay on the high banks and brace the deck. A bare plank settles into the rock.', dress: 11 }),
    makeLevel({ id: 'copper-6', world: 'copper', name: 'Thin Book', gap: 10, budget: 16000, materials: ['road', 'steel'], vehicles: [{ id: 'v1', type: 'dray' }], brief: 'No wood. Every brace is steel, and the ledger is tight for it.', dress: 12 }),

    makeLevel({ id: 'tide-1', world: 'tide', name: 'The Barge Bell', gap: 10, left: 4, right: 6, budget: 11200, materials: ['road', 'wood', 'hydraulic'], vehicles: [{ id: 'v1', type: 'cart' }], piers: [[8, 2], [12, 2]], shoreL: 8.2, shoreR: 11.8, allowSplit: true, brief: 'Stand a piston on each low bolt. Split the joint at the top of each piston. Arm the pistons and the hinges for Lift and Barge, then let them rest before the cart.', dress: 13, waterY: 1.35,
      boats: [{ id: 'b1', x: 8.75, w: 1.7, h: 5.05, vx: 1.15, endX: 9.7, phase: 'B' }],
      phases: [
        { id: 'A', t: 0.2, label: 'Lift', spawn: [] },
        { id: 'B', t: 2.3, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'C', t: 5.6, label: 'Lower', spawn: [] },
        { id: 'D', t: 7.6, label: 'Cart', spawn: ['v1'] }
      ]
    }),
    makeLevel({ id: 'tide-2', world: 'tide', name: 'Leaf and Hinge', gap: 8, left: 8, budget: 8900, materials: ['road', 'wood', 'steel', 'hydraulic'], vehicles: [{ id: 'v1', type: 'cart' }], towers: [[8, 10]], brief: 'The barge rides low. The deck still has to stay up. Brace it, or hinge a leaf if you prefer a moving span.', dress: 14, waterY: 1.8, allowSplit: true,
      boats: [{ id: 'b1', x: 9.2, w: 3.1, h: 1.45, vx: 2.05, endX: 12.4, phase: 'B' }],
      phases: [
        { id: 'A', t: 0.2, label: 'Open', spawn: [] },
        { id: 'B', t: 2.3, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'C', t: 6.6, label: 'Cart', spawn: ['v1'] }
      ]
    }),
    makeLevel({ id: 'tide-3', world: 'tide', name: 'Second Barge', gap: 12, left: 7, budget: 14000, materials: ['road', 'wood', 'steel', 'hydraulic'], vehicles: [{ id: 'v1', type: 'van' }], piers: [[10, 2], [16, 2]], brief: 'Two low barges, then the van. A naked deck buckles before the second bell.', dress: 15, waterY: 1.7,
      boats: [
        { id: 'b1', x: 9.2, w: 2.6, h: 1.45, vx: 2.3, endX: 11.3, phase: 'B' },
        { id: 'b2', x: 9.2, w: 2.6, h: 1.45, vx: 2.3, endX: 11.3, phase: 'C' }
      ],
      phases: [
        { id: 'A', t: 0.2, label: 'Lift', spawn: [] },
        { id: 'B', t: 2.0, label: 'First barge', spawn: [], boats: ['b1'] },
        { id: 'C', t: 5.3, label: 'Second barge', spawn: [], boats: ['b2'] },
        { id: 'D', t: 8.6, label: 'Van', spawn: ['v1'] }
      ]
    }),
    makeLevel({ id: 'tide-4', world: 'tide', name: 'Lantern Hold', gap: 10, budget: 11400, materials: ['road', 'wood', 'steel', 'hydraulic'], vehicles: [{ id: 'v1', type: 'cart' }], piers: [[10, 2], [14, 2]], brief: 'The cart waits at the lantern, then crosses. The span has to be braced before it rolls.', dress: 16, waterY: 1.7,
      checkpoints: [{ id: 'c1', x: 4.2, y: 6.7, r: 1.15, vehicle: 'v1', hold: true, release: 'C' }],
      boats: [{ id: 'b1', x: 9.15, w: 2.7, h: 1.45, vx: 2.15, endX: 11.15, phase: 'B' }],
      phases: [
        { id: 'A', t: 0.25, label: 'Cart to the lantern', spawn: ['v1'] },
        { id: 'B', t: 2.4, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'C', t: 6.5, label: 'Release', spawn: [] }
      ]
    }),
    makeLevel({ id: 'tide-5', world: 'tide', name: 'Up to the Wharf', gap: 8, budget: 8900, materials: ['road', 'wood', 'steel', 'hydraulic'], vehicles: [{ id: 'v1', type: 'van' }], towers: [[7, 9]], brief: 'The van is the load. A piston can help, but a quiet brace is enough if the deck does not sag.', dress: 17, allowSplit: true, waterY: 1.8 }),
    makeLevel({ id: 'tide-6', world: 'tide', name: 'Three Bells', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel', 'hydraulic'], vehicles: [{ id: 'v1', type: 'cart' }, { id: 'v2', type: 'van', x: 2.2 }], piers: [[11, 2], [16, 2]], brief: 'Cart, then van. Brace for the van. The low barge is not the thing that breaks a bad deck.', dress: 18, waterY: 1.7,
      boats: [{ id: 'b1', x: 10.1, w: 2.6, h: 1.45, vx: 2.2, endX: 12.2, phase: 'A' }],
      phases: [
        { id: 'A', t: 0.3, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'B', t: 4.4, label: 'Cart', spawn: ['v1'] },
        { id: 'C', t: 9.2, label: 'Van', spawn: ['v2'] }
      ]
    }),

    makeLevel({ id: 'hollow-1', world: 'hollow', name: 'Guy Lines', gap: 12, budget: 13100, materials: ['road', 'wood', 'rope'], towers: [[7, 10], [19, 10]], vehicles: [{ id: 'v1', type: 'cart' }], brief: 'Rope takes a pull and nothing else. Hang the deck from the two high bolts. A bare road buckles.', dress: 19 }),
    makeLevel({ id: 'hollow-2', world: 'hollow', name: 'Cable Over the Cut', gap: 16, budget: 16500, materials: ['road', 'wood', 'steel', 'cable'], towers: [[7, 11], [23, 11]], vehicles: [{ id: 'v1', type: 'van' }], brief: 'Sixteen metres. Cable can hang it, or steel can truss it. A flat plank will not.', dress: 20 }),
    makeLevel({ id: 'hollow-3', world: 'hollow', name: 'Soft Landing', gap: 10, budget: 21300, materials: ['road', 'wood', 'steel', 'spring'], piers: [[12, 3]], vehicles: [{ id: 'v1', type: 'hopper' }], brief: 'The hopper buckles a naked deck. A real truss holds. A coil can sit in it and move.', dress: 21, waterY: 1.6 }),
    makeLevel({ id: 'hollow-4', world: 'hollow', name: 'The Long Hang', gap: 18, budget: 23000, materials: ['road', 'rope', 'cable'], towers: [[7, 12], [25, 12]], vehicles: [{ id: 'v1', type: 'van' }], brief: 'No wood and no steel. Hang the deck. Ropes go slack if you ask them to push.', dress: 22 }),
    makeLevel({ id: 'hollow-5', world: 'hollow', name: 'Coil Under the Deck', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel', 'spring', 'rope'], piers: [[13, 3]], vehicles: [{ id: 'v1', type: 'wagon' }], brief: 'The wagon needs a braced deck. The coil is for the give, not for the whole job.', dress: 23, waterY: 1.6 }),
    makeLevel({ id: 'hollow-6', world: 'hollow', name: 'High Stay', gap: 14, budget: 23000, materials: ['road', 'steel', 'cable'], towers: [[7, 11]], vehicles: [{ id: 'v1', type: 'dray' }], brief: 'Stay cables from the one tower, or a steel truss. There is no wood to hide in.', dress: 24 }),

    makeLevel({ id: 'lantern-1', world: 'lantern', name: 'The Marker', gap: 10, budget: 11400, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'cart' }], checkpoints: [{ id: 'm1', x: 12, y: 7.3, r: 1.25, vehicle: 'v1' }], brief: 'The lantern has to be passed before the flag will count. Brace the deck on the way.', dress: 25 }),
    makeLevel({ id: 'lantern-2', world: 'lantern', name: 'There and Back', gap: 10, budget: 11400, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'hack', x: 3.6, flagX: 0.7, flagY: 6.5 }], checkpoints: [{ id: 'far', x: 20, y: 6.8, r: 1.35, vehicle: 'v1', reverse: true }], brief: 'Touch the far lantern. The hack turns around. The span is crossed twice.', dress: 26 }),
    makeLevel({ id: 'lantern-3', world: 'lantern', name: 'Wait on the Span', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'van' }, { id: 'v2', type: 'wagon', x: 2.1 }], checkpoints: [{ id: 'hold', x: 12, y: 6.8, r: 1.2, vehicle: 'v1', hold: true, release: 'B' }], brief: 'The van waits on the span until the wagon phase. Brace for the wagon.', dress: 27,
      phases: [
        { id: 'A', t: 0.3, label: 'Van', spawn: ['v1'] },
        { id: 'B', t: 6.5, label: 'Wagon', spawn: ['v2'] }
      ]
    }),
    makeLevel({ id: 'lantern-4', world: 'lantern', name: 'Night Pair', gap: 12, budget: 25500, materials: ['road', 'steel', 'cable'], towers: [[7, 11], [19, 11]], vehicles: [{ id: 'v1', type: 'cart' }, { id: 'v2', type: 'cistern', x: 2.0 }], brief: 'A cistern follows a cart. The deck needs a steel truss, not a clothesline of road.', dress: 28 }),
    makeLevel({ id: 'lantern-5', world: 'lantern', name: 'Two Lanterns', gap: 12, budget: 14000, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'hack' }], checkpoints: [
      { id: 'a', x: 10, y: 7.1, r: 1.2, vehicle: 'v1', order: 1 },
      { id: 'b', x: 16, y: 6.9, r: 1.2, vehicle: 'v1', order: 2 }
    ], brief: 'The lanterns are numbered. The second stays dark until the first is taken. Brace the road between them.', dress: 29 }),
    makeLevel({ id: 'lantern-6', world: 'lantern', name: 'Last Light', gap: 14, left: 6, budget: 27500, materials: ['road', 'wood', 'steel', 'cable', 'hydraulic'], vehicles: [{ id: 'v1', type: 'van' }, { id: 'v2', type: 'hopper', x: 2.1 }], piers: [[14, 6]], towers: [[6, 11]], checkpoints: [{ id: 'm', x: 14, y: 7.2, r: 1.35, vehicle: 'v1' }, { id: 'n', x: 14, y: 7.2, r: 1.35, vehicle: 'v2' }], brief: 'Both vehicles pass the midstream lantern. Truss each side. The hopper is the one that folds a plank.', dress: 30 }),

    makeLevel({ id: 'second-1', world: 'second', name: 'Clean Timber', gap: 10, budget: 10600, materials: ['road', 'wood', 'steel'], vehicles: [{ id: 'v1', type: 'van' }], contract: { maxOver: 0.5, requireClean: true }, brief: 'The van must cross, and not a single member may reach its limit.', dress: 31 }),
    makeLevel({ id: 'second-2', world: 'second', name: 'A Short Ledger', gap: 12, budget: 21000, materials: ['road', 'steel'], vehicles: [{ id: 'v1', type: 'dray' }], contract: { maxOver: 0, requireUnder: true }, brief: 'Over budget does not count, not even by a dollar. No wood either.', dress: 32 }),
    makeLevel({ id: 'second-3', world: 'second', name: 'Barge Oath', gap: 10, left: 4, right: 6, budget: 10000, materials: ['road', 'wood', 'hydraulic'], vehicles: [{ id: 'v1', type: 'cart' }], piers: [[8, 2], [12, 2]], shoreL: 8.2, shoreR: 11.8, allowSplit: true, contract: { maxOver: 0.5, requireClean: true }, brief: 'Same bells as the first gate, and nothing may reach its limit.', dress: 33, waterY: 1.35,
      boats: [{ id: 'b1', x: 8.75, w: 1.7, h: 5.05, vx: 1.15, endX: 9.7, phase: 'B' }],
      phases: [
        { id: 'A', t: 0.2, label: 'Lift', spawn: [] },
        { id: 'B', t: 2.3, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'C', t: 5.6, label: 'Lower', spawn: [] },
        { id: 'D', t: 7.6, label: 'Cart', spawn: ['v1'] }
      ]
    }),
    makeLevel({ id: 'second-4', world: 'second', name: 'Hollow Promise', gap: 14, budget: 30300, materials: ['road', 'steel', 'rope', 'spring'], towers: [[7, 11], [21, 11]], piers: [[14, 3]], vehicles: [{ id: 'v1', type: 'hopper' }], contract: { maxOver: 0, requireUnder: true }, brief: 'Under budget. The hopper needs a truss. Rope will not stand in for a post.', dress: 34, waterY: 1.6 }),
    makeLevel({ id: 'second-5', world: 'second', name: 'Unbroken Night', gap: 12, budget: 23600, materials: ['road', 'steel', 'cable'], towers: [[7, 11], [19, 11]], vehicles: [{ id: 'v1', type: 'cart' }, { id: 'v2', type: 'cistern', x: 2 }], contract: { maxOver: 0.5, requireUnder: true, requireClean: true }, brief: 'Under budget and nothing near its limit, with a cistern on the road.', dress: 35 }),
    makeLevel({ id: 'second-6', world: 'second', name: 'County Exam', gap: 14, left: 6, budget: 15800, materials: ['road', 'wood', 'steel', 'rope', 'cable', 'hydraulic', 'spring'], vehicles: [{ id: 'v1', type: 'van' }, { id: 'v2', type: 'wagon', x: 2.1 }], piers: [[12, 6]], towers: [[6, 11]], checkpoints: [{ id: 'm', x: 12, y: 7.15, r: 1.3, vehicle: 'v1' }], contract: { maxOver: 0, requireUnder: true }, brief: 'The last book. Under budget, both vehicles home, the mid lantern lit. Brace each opening.', dress: 36, waterY: 1.65,
      boats: [{ id: 'b1', x: 9.1, w: 2.5, h: 1.45, vx: 2.1, endX: 11.2, phase: 'A' }],
      phases: [
        { id: 'A', t: 0.3, label: 'Barge', spawn: [], boats: ['b1'] },
        { id: 'B', t: 4.6, label: 'Van', spawn: ['v1'] },
        { id: 'C', t: 10, label: 'Wagon', spawn: ['v2'] }
      ]
    })
  ];

  function yardLevel() {
    return makeLevel({
      id: 'yard', world: 'yard', sandbox: true, name: 'Practice Yard', gap: 18, left: 8, right: 8, yL: 6, budget: 80000,
      materials: Object.keys(MATERIALS),
      vehicles: [{ id: 'v1', type: 'cart' }],
      piers: [[14, 3], [20, 6]],
      towers: [[8, 11], [26, 11]],
      brief: 'Every material, a wide gap, and no clerk. Pins you add yourself stay in the save.',
      contract: { maxOver: 4, requireUnder: false, requireClean: false },
      allowSplit: true,
      theme: 'willow',
      dress: 99,
      waterY: 1.7,
      timeLimit: 90
    });
  }

  function defaultMeta() {
    return {
      version: 1,
      stars: {},
      best: {},
      achievements: {},
      drafts: {},
      sandbox: null,
      settings: { master: 0.8, music: 0.48, sfx: 0.85, quality: 'fine', stressInk: false, shake: true, grid: 1 },
      tutorial: true,
      stats: { crossings: 0, collapses: 0, replays: 0 }
    };
  }

  function normalize(meta) {
    const d = defaultMeta();
    if (!meta || typeof meta !== 'object') return d;
    d.stars = meta.stars || {};
    d.best = meta.best || {};
    d.achievements = meta.achievements || {};
    d.drafts = meta.drafts || {};
    d.sandbox = meta.sandbox || null;
    d.tutorial = meta.tutorial !== false;
    Object.assign(d.settings, meta.settings || {});
    Object.assign(d.stats, meta.stats || {});
    if (d.settings.quality !== 'plain') d.settings.quality = 'fine';
    d.settings.grid = d.settings.grid === 0.5 ? 0.5 : 1;
    d.settings.master = clamp(+d.settings.master || 0, 0, 1);
    d.settings.music = clamp(+d.settings.music || 0, 0, 1);
    d.settings.sfx = clamp(+d.settings.sfx || 0, 0, 1);
    return d;
  }

  function worldUnlocked(meta, worldId) {
    const i = WORLDS.findIndex(w => w.id === worldId);
    if (i <= 0) return true;
    const prev = WORLDS[i - 1].id;
    const ls = LEVELS.filter(l => l.world === prev);
    const n = ls.filter(l => (meta.stars[l.id] || 0) >= 1).length;
    return n >= Math.min(4, ls.length);
  }

  function levelUnlocked(meta, levelOrId) {
    const level = typeof levelOrId === 'string'
      ? (levelOrId === 'yard' ? yardLevel() : LEVELS.find(l => l.id === levelOrId))
      : levelOrId;
    if (!level) return false;
    if (level.sandbox) return (meta.stars['willow-1'] || 0) >= 1 || !!meta.achievements['first-crossing'];
    if (!worldUnlocked(meta, level.world)) return false;
    const ls = LEVELS.filter(l => l.world === level.world);
    const i = ls.findIndex(l => l.id === level.id);
    if (i <= 0) return true;
    return (meta.stars[ls[i - 1].id] || 0) >= 1;
  }

  function groundY(level, x) {
    let y = null;
    for (const g of level.ground || []) {
      const min = Math.min(g.x0, g.x1) - 0.02;
      const max = Math.max(g.x0, g.x1) + 0.02;
      if (x < min || x > max) continue;
      const t = (x - g.x0) / ((g.x1 - g.x0) || 1);
      const gy = g.y0 + (g.y1 - g.y0) * clamp(t, 0, 1);
      if (y == null || gy > y) y = gy;
    }
    return y;
  }

  function makeSession(level, meta) {
    const session = {
      level: JSON.parse(JSON.stringify(level)),
      grid: (meta && meta.settings && meta.settings.grid) || level.grid || 1,
      nodes: [],
      beams: [],
      splits: [],
      nextId: 1,
      spent: 0,
      undo: [],
      redo: [],
      sim: null,
      backup: null,
      selected: null
    };
    for (const a of session.level.anchors || []) {
      session.nodes.push({ id: session.nextId++, x: a.x, y: a.y, vx: 0, vy: 0, pin: true, anchor: true, mass: 0.7, splashed: false });
    }
    for (const s of session.level.starters || []) {
      const n = { id: session.nextId++, x: s.x, y: s.y, vx: 0, vy: 0, pin: false, anchor: false, mass: 0.7, splashed: false };
      const m = { id: session.nextId++, x: s.x, y: s.y, vx: 0, vy: 0, pin: false, anchor: false, mass: 0.7, splashed: false };
      session.nodes.push(n, m);
      session.splits.push({ a: n.id, b: m.id, open: Object.assign({}, s.open || {}), latched: false });
    }
    return session;
  }

  function startLevel(meta, id) {
    if (!levelUnlocked(meta, id)) return null;
    const level = id === 'yard' ? yardLevel() : LEVELS.find(l => l.id === id);
    if (!level) return null;
    const session = makeSession(level, meta);
    if (id === 'yard' && meta.sandbox) importDesign(session, meta.sandbox, true);
    else if (meta.drafts && meta.drafts[id]) importDesign(session, meta.drafts[id], true);
    recompute(session);
    return session;
  }

  function testSession(partial) {
    const level = makeLevel(Object.assign({
      id: 'fixture', world: 'willow', name: 'Fixture', sandbox: true, budget: 99999, gap: 8,
      materials: Object.keys(MATERIALS), vehicles: []
    }, partial || {}));
    if (partial && partial.anchors) {
      level.anchors = partial.anchors;
      level.ground = partial.ground || level.ground || [];
      level.vehicles = partial.vehicles || [];
      level.phases = partial.phases || [{ id: 'A', t: 0.05, label: 'A', spawn: level.vehicles.map(v => v.id) }];
    }
    if (partial && partial.vehicles) level.vehicles = partial.vehicles;
    return makeSession(level, { settings: { grid: partial && partial.grid || 1 } });
  }

  function nodeById(session, id) {
    for (const n of session.nodes) if (n.id === id) return n;
    return null;
  }
  function beamById(session, id) {
    for (const b of session.beams) if (b.id === id) return b;
    return null;
  }
  function splitFor(session, id) {
    for (const s of session.splits) if (s.a === id || s.b === id) return s;
    return null;
  }

  function recompute(session) {
    let spent = 0;
    for (const b of session.beams) spent += b.built * MATERIALS[b.mat].cost;
    session.spent = Math.round(spent * 100) / 100;
  }

  function snapshot(session) {
    return JSON.stringify({
      nodes: session.nodes,
      beams: session.beams,
      splits: session.splits,
      nextId: session.nextId,
      selected: session.selected
    });
  }
  function restore(session, raw) {
    const d = JSON.parse(raw);
    session.nodes = d.nodes;
    session.beams = d.beams;
    session.splits = d.splits;
    session.nextId = d.nextId;
    session.selected = d.selected;
    recompute(session);
  }
  function commit(session, pre) {
    session.undo.push(pre);
    if (session.undo.length > 60) session.undo.shift();
    session.redo = [];
  }
  function undo(session) {
    if (!session.undo.length || (session.sim && session.sim.mode === 'run')) return false;
    const cur = snapshot(session);
    restore(session, session.undo.pop());
    session.redo.push(cur);
    return true;
  }
  function redo(session) {
    if (!session.redo.length || (session.sim && session.sim.mode === 'run')) return false;
    const cur = snapshot(session);
    restore(session, session.redo.pop());
    session.undo.push(cur);
    return true;
  }

  function pointBlocked(session, x, y) {
    const b = session.level.bounds;
    if (x < b.x0 - 0.4 || x > b.x1 + 0.4 || y > b.y1 + 0.5) return 'That point is outside the works.';
    if (y < session.level.waterY - 0.15) return 'Below the waterline.';
    for (const r of session.level.forbid || []) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return 'The rock is in the way.';
    }
    const gy = groundY(session.level, x);
    if (gy != null && y < gy - 0.25) return 'The bank is solid there.';
    return null;
  }

  function grabPoint(session, x, y, side) {
    const near = [];
    for (const n of session.nodes) {
      const d = hypot(n.x - x, n.y - y);
      if (d < 0.52) near.push({ n, d });
    }
    near.sort((a, b) => a.d - b.d);
    if (near.length) {
      const splitNodes = near.filter(item => splitFor(session, item.n.id));
      if (splitNodes.length >= 2) {
        const s = splitFor(session, splitNodes[0].n.id);
        if (side === 'a' || side === 'b') {
          const id = side === 'a' ? s.a : s.b;
          return { ok: true, node: nodeById(session, id) };
        }
        if (near.length >= 2 && near[0].d < 0.2 && near[1].d < 0.2 && splitFor(session, near[0].n.id) === splitFor(session, near[1].n.id)) {
          return { ok: false, reason: 'Choose a hinge side.', needSide: true };
        }
      }
      return { ok: true, node: near[0].n };
    }
    const g = session.grid || 1;
    const sx = Math.round(x / g) * g;
    const sy = Math.round(y / g) * g;
    if (hypot(sx - x, sy - y) > Math.max(0.49, g * 0.76)) return { ok: false, reason: 'Snap to the grid.' };
    const blocked = pointBlocked(session, sx, sy);
    if (blocked) return { ok: false, reason: blocked };
    const node = { id: session.nextId++, x: sx, y: sy, vx: 0, vy: 0, pin: false, anchor: false, mass: 0.7, splashed: false };
    session.nodes.push(node);
    return { ok: true, node };
  }

  function placeBeam(session, mat, x0, y0, x1, y1, opt) {
    opt = opt || {};
    if (session.sim && session.sim.mode === 'run') return { ok: false, reason: 'The crossing is already in motion.' };
    const M = MATERIALS[mat];
    if (!M) return { ok: false, reason: 'Unknown material.' };
    if (session.level.materials.indexOf(mat) < 0) return { ok: false, reason: M.name + ' is not on this contract.' };
    const pre = snapshot(session);
    let A, B;
    if (opt.nodeA) A = { ok: true, node: nodeById(session, opt.nodeA) };
    else A = grabPoint(session, x0, y0, opt.sideA);
    if (!A.ok || !A.node) { restore(session, pre); return A.ok ? { ok: false, reason: 'Missing joint.' } : A; }
    if (opt.nodeB) B = { ok: true, node: nodeById(session, opt.nodeB) };
    else B = grabPoint(session, x1, y1, opt.sideB);
    if (!B.ok || !B.node) { restore(session, pre); return B.ok ? { ok: false, reason: 'Missing joint.' } : B; }
    if (A.node === B.node) { restore(session, pre); return { ok: false, reason: 'That span is too short.' }; }
    const len = hypot(B.node.x - A.node.x, B.node.y - A.node.y);
    if (len < 0.34) { restore(session, pre); return { ok: false, reason: 'That span is too short.' }; }
    if (len > M.max + 0.03) { restore(session, pre); return { ok: false, reason: M.name + ' reaches ' + M.max + ' m.' }; }
    if (session.beams.some(b => (b.a === A.node.id && b.b === B.node.id) || (b.a === B.node.id && b.b === A.node.id))) {
      restore(session, pre);
      return { ok: false, reason: 'That line is already there.' };
    }
    const beam = {
      id: session.nextId++, a: A.node.id, b: B.node.id, mat,
      built: len, rest: len, scale: mat === 'spring' ? 1 : 1, phaseOn: {},
      broken: false, strain: 0, force: 0, hot: 0, peak: 0
    };
    session.beams.push(beam);
    recompute(session);
    session.selected = beam.id;
    commit(session, pre);
    return { ok: true, id: beam.id, cost: len * M.cost, len, x0: A.node.x, y0: A.node.y, x1: B.node.x, y1: B.node.y };
  }

  function distToSeg(px, py, x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    const l2 = dx * dx + dy * dy || 1e-8;
    let t = ((px - x0) * dx + (py - y0) * dy) / l2;
    t = clamp(t, 0, 1);
    return { d: hypot(px - (x0 + dx * t), py - (y0 + dy * t)), t };
  }

  function pickBeam(session, x, y) {
    let best = null;
    for (const b of session.beams) {
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      if (!a || !c) continue;
      const hit = distToSeg(x, y, a.x, a.y, c.x, c.y);
      if (hit.d < 0.38 && (!best || hit.d < best.d)) best = { id: b.id, d: hit.d, t: hit.t };
    }
    return best;
  }

  function deleteBeam(session, id) {
    if (session.sim && session.sim.mode === 'run') return { ok: false, reason: 'Wait until the run stops.' };
    const pre = snapshot(session);
    const i = session.beams.findIndex(b => b.id === id);
    if (i < 0) return { ok: false, reason: 'Nothing there.' };
    session.beams.splice(i, 1);
    const used = new Set();
    for (const b of session.beams) { used.add(b.a); used.add(b.b); }
    for (const s of session.splits) { used.add(s.a); used.add(s.b); }
    session.nodes = session.nodes.filter(n => n.pin || n.anchor || used.has(n.id));
    if (session.selected === id) session.selected = null;
    recompute(session);
    commit(session, pre);
    return { ok: true };
  }

  function deleteAt(session, x, y) {
    const hit = pickBeam(session, x, y);
    if (!hit) {
      if (session.level.sandbox) {
        let best = null, bd = 0.4;
        for (const n of session.nodes) {
          if (!n.anchor || n.pin === false) continue;
          const d = hypot(n.x - x, n.y - y);
          if (d < bd) { best = n; bd = d; }
        }
        // only extra yard anchors, never if a beam uses them
      }
      return { ok: false, reason: 'Tap a member to lift it out.' };
    }
    return deleteBeam(session, hit.id);
  }

  function moveJoint(session, id, x, y) {
    if (session.sim && session.sim.mode === 'run') return { ok: false, reason: 'The crossing is already in motion.' };
    const n = nodeById(session, id);
    if (!n) return { ok: false, reason: 'No joint.' };
    if (n.pin) return { ok: false, reason: 'That bolt is seated in the bank.' };
    const g = session.grid || 1;
    const sx = Math.round(x / g) * g;
    const sy = Math.round(y / g) * g;
    const blocked = pointBlocked(session, sx, sy);
    if (blocked) return { ok: false, reason: blocked };
    const preX = n.x, preY = n.y;
    n.x = sx; n.y = sy;
    for (const b of session.beams) {
      if (b.a !== id && b.b !== id) continue;
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      const len = hypot(c.x - a.x, c.y - a.y);
      if (len > MATERIALS[b.mat].max + 0.03 || len < 0.34) {
        n.x = preX; n.y = preY;
        return { ok: false, reason: 'A member would pass its reach.' };
      }
    }
    for (const b of session.beams) {
      if (b.a !== id && b.b !== id) continue;
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      b.built = hypot(c.x - a.x, c.y - a.y);
      b.rest = b.mat === 'spring' ? b.built * b.scale : b.built;
    }
    const partner = splitFor(session, id);
    if (partner) {
      const other = nodeById(session, partner.a === id ? partner.b : partner.a);
      if (other && !other.pin) { other.x = sx; other.y = sy; }
    }
    recompute(session);
    return { ok: true };
  }

  function splitJoint(session, x, y) {
    if (!session.level.allowSplit && session.level.materials.indexOf('hydraulic') < 0 && !session.level.sandbox) {
      return { ok: false, reason: 'This contract has no hinges.' };
    }
    let best = null, bd = 0.5;
    for (const n of session.nodes) {
      const d = hypot(n.x - x, n.y - y);
      if (d < bd) { best = n; bd = d; }
    }
    if (!best) return { ok: false, reason: 'Tap a joint to split it.' };
    if (best.pin) return { ok: false, reason: 'Bank bolts do not split. Build a joint, then split that.' };
    if (splitFor(session, best.id)) return { ok: true, id: best.id, already: true };
    const pre = snapshot(session);
    const m = { id: session.nextId++, x: best.x, y: best.y, vx: 0, vy: 0, pin: false, anchor: false, mass: 0.7, splashed: false };
    session.nodes.push(m);
    session.splits.push({ a: best.id, b: m.id, open: {}, latched: false });
    for (const beam of session.beams) {
      if (beam.a !== best.id && beam.b !== best.id) continue;
      const otherId = beam.a === best.id ? beam.b : beam.a;
      const o = nodeById(session, otherId);
      const right = o.x > best.x + 0.04 || (Math.abs(o.x - best.x) <= 0.04 && o.y > best.y);
      if (right) {
        if (beam.a === best.id) beam.a = m.id;
        else beam.b = m.id;
      }
    }
    session.selected = m.id;
    commit(session, pre);
    return { ok: true, id: m.id, pair: best.id };
  }

  function toggleSplitPhase(session, nodeId, phaseId) {
    const s = splitFor(session, nodeId);
    if (!s) return { ok: false, reason: 'Not a hinge.' };
    const pre = snapshot(session);
    s.open[phaseId] = !s.open[phaseId];
    commit(session, pre);
    return { ok: true, open: !!s.open[phaseId] };
  }

  function setScale(session, beamId, scale) {
    const b = beamById(session, beamId);
    if (!b) return { ok: false };
    if (b.mat === 'hydraulic') scale = clamp(scale, 0.5, 1.5);
    else if (b.mat === 'spring') scale = clamp(scale, 0.65, 1.4);
    else return { ok: false, reason: 'That member does not travel.' };
    b.scale = Math.round(scale * 100) / 100;
    if (b.mat === 'spring') b.rest = b.built * b.scale;
    return { ok: true, scale: b.scale };
  }

  function togglePhase(session, beamId, phaseId) {
    const b = beamById(session, beamId);
    if (!b || b.mat !== 'hydraulic') return { ok: false, reason: 'Select a piston.' };
    const pre = snapshot(session);
    b.phaseOn[phaseId] = !b.phaseOn[phaseId];
    commit(session, pre);
    return { ok: true, on: !!b.phaseOn[phaseId] };
  }

  function markUndo(session) {
    if (session.sim && session.sim.mode === 'run') return;
    commit(session, snapshot(session));
  }

  function exportDesign(session) {
    return {
      nodes: session.nodes.map(n => ({ id: n.id, x: n.x, y: n.y, pin: !!n.pin, anchor: !!n.anchor })),
      beams: session.beams.map(b => ({ id: b.id, a: b.a, b: b.b, mat: b.mat, built: b.built, scale: b.scale, phaseOn: b.phaseOn })),
      splits: session.splits.map(s => ({ a: s.a, b: s.b, open: s.open })),
      nextId: session.nextId,
      vehicles: session.level.sandbox ? session.level.vehicles.map(v => ({ id: v.id, type: v.type, x: v.x, flagX: v.flagX, flagY: v.flagY, dir: v.dir })) : null,
      boat: session.level.sandbox ? (session.level.boats[0] || null) : null
    };
  }

  function importDesign(session, design, silent) {
    if (!design || !design.nodes || !design.beams) return { ok: false };
    const pre = silent ? null : snapshot(session);
    session.nodes = design.nodes.map(n => ({
      id: n.id, x: n.x, y: n.y, vx: 0, vy: 0, pin: !!n.pin, anchor: !!n.anchor, mass: 0.7, splashed: false
    }));
    session.beams = design.beams.filter(b => MATERIALS[b.mat] && session.level.materials.indexOf(b.mat) >= 0).map(b => ({
      id: b.id, a: b.a, b: b.b, mat: b.mat, built: b.built, rest: b.mat === 'spring' ? b.built * (b.scale || 1) : b.built,
      scale: b.scale || 1, phaseOn: Object.assign({}, b.phaseOn || {}), broken: false, strain: 0, force: 0, hot: 0, peak: 0
    }));
    session.splits = (design.splits || []).map(s => ({ a: s.a, b: s.b, open: Object.assign({}, s.open || {}), latched: false }));
    session.nextId = design.nextId || (Math.max(0, ...session.nodes.map(n => n.id), ...session.beams.map(b => b.id)) + 1);
    if (session.level.sandbox && design.vehicles) {
      session.level.vehicles = design.vehicles.map(v => Object.assign({ dir: 1 }, v));
      refreshYard(session);
    }
    recompute(session);
    if (pre) commit(session, pre);
    return { ok: true };
  }

  function refreshYard(session) {
    if (!session.level.sandbox) return;
    const ids = session.level.vehicles.map(v => v.id);
    session.level.phases = [
      { id: 'A', t: 0.35, label: 'First', spawn: ids[0] ? [ids[0]] : [] },
      { id: 'B', t: 5.2, label: 'Second', spawn: ids[1] ? [ids[1]] : [], boats: session.level.boats.length ? [session.level.boats[0].id] : [] },
      { id: 'C', t: 10, label: 'Third', spawn: ids[2] ? [ids[2]] : [] }
    ];
  }

  function setSandboxVehicle(session, index, type) {
    if (!session.level.sandbox || !VEHICLES[type]) return { ok: false };
    const v = session.level.vehicles[index];
    if (!v) return { ok: false };
    v.type = type;
    return { ok: true };
  }
  function addSandboxVehicle(session, type) {
    if (!session.level.sandbox) return { ok: false };
    if (session.level.vehicles.length >= 3) return { ok: false, reason: 'The yard holds three.' };
    const i = session.level.vehicles.length;
    session.level.vehicles.push({
      id: 'v' + (i + 1), type: type || 'cart', x: 2.1 + i * 2.2, dir: 1,
      flagX: session.level.xEnd - 2.05, flagY: session.level.yL + 0.5
    });
    refreshYard(session);
    return { ok: true };
  }
  function setSandboxBoat(session, on) {
    if (!session.level.sandbox) return { ok: false };
    if (on) {
      session.level.boats = [{ id: 'yard-barge', x: session.level.xL + 1.2, w: 3, h: 4.6, vx: 2.1, endX: session.level.xR - 3.2, phase: 'B' }];
    } else session.level.boats = [];
    refreshYard(session);
    return { ok: true };
  }
  function addAnchor(session, x, y) {
    if (!session.level.sandbox) return { ok: false, reason: 'Anchors on a contract are already seated.' };
    const g = session.grid || 1;
    const sx = Math.round(x / g) * g;
    const sy = Math.round(y / g) * g;
    if (sy < session.level.waterY - 0.2) return { ok: false, reason: 'Too low.' };
    const pre = snapshot(session);
    const node = { id: session.nextId++, x: sx, y: sy, vx: 0, vy: 0, pin: true, anchor: true, mass: 0.7, splashed: false };
    session.nodes.push(node);
    commit(session, pre);
    return { ok: true, id: node.id };
  }

  function dampFor(mat, mass) {
    const red = Math.max(0.2, mass * 0.5);
    return 2 * mat.zeta * Math.sqrt(mat.k * red);
  }

  function emit(sim, e) {
    sim.events.push(e);
    if (sim.events.length > 120) sim.events.shift();
  }

  function currentPhase(session) {
    let cur = null;
    for (const p of session.level.phases) if (session.sim.t + 1e-6 >= p.t) cur = p;
    return cur;
  }

  function makeVehicle(def) {
    const spec = VEHICLES[def.type] || VEHICLES.cart;
    return {
      id: def.id, type: spec.id, name: spec.name,
      x: def.x, y: def.flagY, angle: 0, vx: 0, vy: 0, omega: 0,
      ax: 0, ay: 0, aa: 0,
      dir: def.dir || 1,
      flagX: def.flagX, flagY: def.flagY,
      spawned: false, alive: false, done: false, failed: false,
      holding: false, holdRelease: null, speedMul: 1,
      got: {}, missed: false, tip: 0, grounded: 0, spin: 0, releaseAt: 0,
      why: null
    };
  }

  function spawnVehicle(session, id) {
    const v = session.sim.vehicles.find(item => item.id === id);
    if (!v || v.spawned) return;
    const spec = VEHICLES[v.type];
    const gy = groundY(session.level, v.x);
    v.spawned = true;
    v.alive = true;
    v.y = (gy == null ? session.level.yL : gy) + 0.62;
    v.vx = v.vy = v.omega = 0;
    v.angle = 0;
    v.releaseAt = session.sim.t + 0.22;
    emit(session.sim, { type: 'spawn', id: v.id, name: v.name });
  }

  function onPhase(session, phase) {
    for (const id of phase.spawn || []) spawnVehicle(session, id);
    for (const id of phase.boats || []) {
      const b = session.sim.boats.find(item => item.id === id);
      if (b) b.active = true;
    }
    for (const v of session.sim.vehicles) {
      if (v.holding && v.holdRelease === phase.id) v.holding = false;
    }
    emit(session.sim, { type: 'phase', id: phase.id, label: phase.label || phase.id });
  }

  function rebuildSegs(session) {
    const segs = [];
    for (const g of session.level.ground || []) segs.push({ x0: g.x0, y0: g.y0, x1: g.x1, y1: g.y1, beam: null });
    for (const b of session.beams) {
      if (b.broken || b.mat !== 'road') continue;
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      if (!a || !c) continue;
      segs.push({ x0: a.x, y0: a.y, x1: c.x, y1: c.y, beam: b });
    }
    session._segs = segs;
  }

  function raySeg(ox, oy, dx, dy, s) {
    const sx = s.x1 - s.x0, sy = s.y1 - s.y0;
    const den = dx * sy - dy * sx;
    if (Math.abs(den) < 1e-8) return null;
    const t = ((s.x0 - ox) * sy - (s.y0 - oy) * sx) / den;
    const u = ((s.x0 - ox) * dy - (s.y0 - oy) * dx) / den;
    if (t < 0 || u < 0 || u > 1) return null;
    const len = Math.hypot(sx, sy) || 1;
    let nx = -sy / len, ny = sx / len;
    if (nx * dx + ny * dy > 0) { nx = -nx; ny = -ny; }
    return { t, u, nx, ny, tx: sx / len, ty: sy / len, x: ox + dx * t, y: oy + dy * t };
  }

  function wheelHit(session, v, lx) {
    const co = Math.cos(v.angle), si = Math.sin(v.angle);
    const mountY = -0.04;
    const mx = v.x + co * lx - si * mountY;
    const my = v.y + si * lx + co * mountY;
    const dx = si, dy = -co;
    const reach = 0.78 + (v.grounded ? 0.2 : 0);
    let best = null;
    for (const seg of session._segs) {
      const hit = raySeg(mx, my, dx, dy, seg);
      if (!hit || hit.t > reach) continue;
      if (!best || hit.t < best.t) best = Object.assign(hit, { beam: seg.beam });
    }
    return best;
  }

  function applyVehicle(session, v) {
    const spec = VEHICLES[v.type];
    v.ax = 0;
    v.ay = -G;
    v.aa = 0;
    if (!v.alive || v.failed) return;
    const hits = [];
    for (const lx of [-spec.axle, spec.axle]) {
      const hit = wheelHit(session, v, lx);
      if (!hit) continue;
      const rest = 0.52;
      const comp = rest - hit.t;
      if (comp < -0.12) continue;
      let gvx = 0, gvy = 0;
      if (hit.beam) {
        const a = nodeById(session, hit.beam.a), c = nodeById(session, hit.beam.b);
        gvx = a.vx * (1 - hit.u) + c.vx * hit.u;
        gvy = a.vy * (1 - hit.u) + c.vy * hit.u;
      }
      const vn = (v.vx - gvx) * hit.nx + (v.vy - gvy) * hit.ny;
      const f = Math.max(0, spec.susK * Math.max(0, comp) - spec.susC * vn);
      v.ax += hit.nx * f / spec.mass;
      v.ay += hit.ny * f / spec.mass;
      const rx = hit.x - v.x, ry = hit.y - v.y;
      v.aa += (rx * hit.ny * f - ry * hit.nx * f) / spec.inertia;
      const driving = !v.holding && !v.done && session.sim.t >= v.releaseAt;
      let tx = hit.tx, ty = hit.ty;
      if (tx * v.dir < 0) { tx = -tx; ty = -ty; }
      if (driving && comp > 0.01) {
        const along = v.vx * tx + v.vy * ty;
        const want = spec.speed * (v.speedMul || 1);
        const delta = clamp(want - along, -spec.brake, spec.accel);
        v.ax += tx * delta;
        v.ay += ty * delta;
        v.spin += along * H;
      } else {
        v.ax += -v.vx * 2.4;
        v.ay += -v.vy * 0.15;
      }
      if (hit.beam && f > 0) {
        const a = nodeById(session, hit.beam.a), c = nodeById(session, hit.beam.b);
        const fx = -hit.nx * f, fy = -hit.ny * f;
        if (!a.pin) { a.fx += fx * (1 - hit.u); a.fy += fy * (1 - hit.u); }
        if (!c.pin) { c.fx += fx * hit.u; c.fy += fy * hit.u; }
      }
      hits.push(hit);
    }
    v.grounded = hits.length;
    if (hits.length) {
      let nx = 0, ny = 0;
      for (const h of hits) { nx += h.nx; ny += h.ny; }
      const ang = Math.atan2(-nx, ny);
      const err = Math.atan2(Math.sin(ang - v.angle), Math.cos(ang - v.angle));
      if (Math.abs(err) < 0.85) v.aa += err * 12 - v.omega * 5;
    }
    v.aa = clamp(v.aa, -40, 40);
  }

  function depenetrate(session, v) {
    const spec = VEHICLES[v.type];
    for (const lx of [-spec.axle, spec.axle]) {
      const hit = wheelHit(session, v, lx);
      if (!hit) continue;
      if (hit.t < 0.16) {
        const pen = 0.16 - hit.t;
        v.x += hit.nx * pen;
        v.y += hit.ny * pen;
        const vn = v.vx * hit.nx + v.vy * hit.ny;
        if (vn < 0) { v.vx -= vn * hit.nx; v.vy -= vn * hit.ny; }
      }
    }
  }

  function applyMember(session, a, c, rest, k, damp, strength, kind, ref) {
    let dx = c.x - a.x, dy = c.y - a.y;
    let len = hypot(dx, dy);
    if (len < 1e-4) {
      if (ref) { ref.strain = 0; ref.force = 0; }
      return;
    }
    const nx = dx / len, ny = dy / len;
    const stretch = len - rest;
    if (kind === 'rope' && stretch < 0) {
      if (ref) { ref.strain = 0; ref.force = 0; }
      return;
    }
    const rv = ((c.vx - a.vx) * nx + (c.vy - a.vy) * ny);
    let f = k * stretch + damp * rv;
    const abs = Math.abs(f);
    if (ref) {
      ref.force = abs;
      ref.strain = abs / strength;
      if (ref.strain > ref.peak) ref.peak = ref.strain;
      if (ref.strain > session.sim.peakStrain) session.sim.peakStrain = ref.strain;
      if (ref.strain > session.sim.liveStrain) session.sim.liveStrain = ref.strain;
    }
    if (ref && ref.strain > 1) {
      f = Math.sign(f) * strength;
      ref.hot = (ref.hot || 0) + 1;
    } else if (ref) ref.hot = 0;
    if (ref && session.sim.t > 0.12 && (ref.hot > 8 || ref.strain > 1.4)) {
      snap(session, ref);
      return;
    }
    const cap = (ref ? strength : 5000) * 1.05;
    f = clamp(f, -cap, cap);
    if (!a.pin) { a.fx += nx * f; a.fy += ny * f; }
    if (!c.pin) { c.fx -= nx * f; c.fy -= ny * f; }
  }

  function snap(session, b) {
    if (b.broken) return;
    b.broken = true;
    b.strain = Math.max(1, b.strain || 1);
    session.sim.breaks += 1;
    if (!session.sim.firstBreak) session.sim.firstBreak = b.id;
    const a = nodeById(session, b.a), c = nodeById(session, b.b);
    const kick = (Math.sin(b.id * 12.989) * 0.5);
    if (a && !a.pin) { a.vx += kick; a.vy += 0.35; }
    if (c && !c.pin) { c.vx -= kick; c.vy += 0.35; }
    emit(session.sim, { type: 'break', id: b.id, mat: b.mat, x: ((a ? a.x : 0) + (c ? c.x : 0)) / 2, y: ((a ? a.y : 0) + (c ? c.y : 0)) / 2 });
  }

  function splitOpen(session, split) {
    const phase = session.sim.phase;
    return !!(phase && split.open && split.open[phase]);
  }

function applyWeld(session, split) {
  if (splitOpen(session, split)) { split.latched = false; return; }
  const a = nodeById(session, split.a), c = nodeById(session, split.b);
  if (!a || !c) return;
  const d = hypot(c.x - a.x, c.y - a.y);
  if (d > 0.55) { split.latched = false; return; }
  split.latched = true;
  const mx = (a.x + c.x) / 2, my = (a.y + c.y) / 2;
  if (!a.pin) { a.x = a.pin ? a.x : mx; a.y = my; a.vx = 0; a.vy = 0; }
  if (!c.pin) { c.x = mx; c.y = my; c.vx = 0; c.vy = 0; }
  if (a.pin && !c.pin) { c.x = a.x; c.y = a.y; c.vx = 0; c.vy = 0; }
  if (c.pin && !a.pin) { a.x = c.x; a.y = c.y; a.vx = 0; a.vy = 0; }
}

  function collideNode(session, n) {
    if (n.pin) return;
    const gy = groundY(session.level, n.x);
    if (gy != null && n.y < gy) {
      n.y = gy;
      if (n.vy < 0) n.vy *= -0.04;
      n.vx *= 0.62;
      return;
    }
    const mud = session.level.waterY - 0.22;
    if (n.y < mud) {
      if (n.vy < -2.2 && !n.splashed) {
        n.splashed = true;
        emit(session.sim, { type: 'splash', x: n.x, y: session.level.waterY });
      }
      n.y = mud;
      if (n.vy < 0) n.vy *= -0.1;
      n.vx *= 0.55;
    }
  }

  function rectHitSeg(x0, y0, x1, y1, rx, ry, rw, rh) {
    function inside(x, y) { return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh; }
    if (inside(x0, y0) || inside(x1, y1)) return true;
    const edges = [
      [rx, ry, rx + rw, ry],
      [rx + rw, ry, rx + rw, ry + rh],
      [rx + rw, ry + rh, rx, ry + rh],
      [rx, ry + rh, rx, ry]
    ];
    for (const e of edges) {
      const den = (e[2] - e[0]) * (y1 - y0) - (e[3] - e[1]) * (x1 - x0);
      if (Math.abs(den) < 1e-8) continue;
      const t = ((x0 - e[0]) * (y1 - y0) - (y0 - e[1]) * (x1 - x0)) / den;
      const u = ((x0 - e[0]) * (e[3] - e[1]) - (y0 - e[1]) * (e[2] - e[0])) / den;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
    }
    return false;
  }

  function roadKink(session, n) {
  const conn = [];
  for (const b of session.beams) {
    if (b.broken || b.mat !== 'road') continue;
    if (b.a === n.id || b.b === n.id) conn.push(b);
  }
  if (conn.length < 2) return { kink: 0, beams: conn };
  const ends = conn.slice(0, 2).map(b => {
    const o = nodeById(session, b.a === n.id ? b.b : b.a);
    return [o.x - n.x, o.y - n.y];
  });
  const d1 = Math.hypot(ends[0][0], ends[0][1]) || 1;
  const d2 = Math.hypot(ends[1][0], ends[1][1]) || 1;
  const dot = (ends[0][0] * ends[1][0] + ends[0][1] * ends[1][1]) / (d1 * d2);
  const ang = Math.acos(clamp(dot, -1, 1)) * 180 / Math.PI;
  return { kink: 180 - ang, beams: conn };
}

function breakKinks(session) {
  if (session.sim.t < 0.18) return;
  for (const n of session.nodes) {
    if (n.pin) continue;
    const info = roadKink(session, n);
    if (info.kink > (n.restKink || 0) + 20) {
      let worst = info.beams[0];
      for (const b of info.beams) if ((b.strain || 0) > (worst.strain || 0)) worst = b;
      snap(session, worst);
    }
  }
}

function prepareHydraulics(session) {
  for (const b of session.beams) {
    if (b.mat !== 'hydraulic') continue;
    const a = nodeById(session, b.a), c = nodeById(session, b.b);
    const dx = c.x - a.x, dy = c.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    b.ux = dx / len;
    b.uy = dy / len;
  }
}

function enforceHydraulics(session) {
  for (const b of session.beams) {
    if (b.broken || b.mat !== 'hydraulic') continue;
    const a = nodeById(session, b.a), c = nodeById(session, b.b);
    if (!a || !c) continue;
    let free = null, tx = 0, ty = 0;
    if (a.pin && !c.pin) { free = c; tx = a.x + b.ux * b.rest; ty = a.y + b.uy * b.rest; }
    else if (c.pin && !a.pin) { free = a; tx = c.x - b.ux * b.rest; ty = c.y - b.uy * b.rest; }
    else {
      const dx = c.x - a.x, dy = c.y - a.y, len = Math.hypot(dx, dy) || 1e-4;
      const err = clamp(len - b.rest, -0.004, 0.004);
      const nx = dx / len, ny = dy / len;
      if (!a.pin) { a.x += nx * err * 0.5; a.y += ny * err * 0.5; }
      if (!c.pin) { c.x -= nx * err * 0.5; c.y -= ny * err * 0.5; }
      b.strain = clamp(Math.abs(len - b.rest) * 1.4, 0, 0.9);
      continue;
    }
    const dx = tx - free.x, dy = ty - free.y;
    const dist = Math.hypot(dx, dy);
    const step = Math.min(dist, 0.006);
    if (dist > 1e-5) { free.x += dx / dist * step; free.y += dy / dist * step; }
    free.vx *= 0.82; free.vy *= 0.82;
    b.strain = clamp(dist * 1.1, 0, 0.92);
    b.force = b.strain * MATERIALS.hydraulic.strength;
    if (b.strain > b.peak) b.peak = b.strain;
    if (b.strain > session.sim.peakStrain) session.sim.peakStrain = b.strain;
  }
}

function buckleSag(session) {
  // An unbraced deck settles into a sag. Past a small drop the planks buckle.
  // A truss, hanger, or pier keeps the road near the height it was drawn.
  if (session.sim.t < 0.45) return;
  const limit = session.level.sag == null ? 0.45 : session.level.sag;
  for (const n of session.nodes) {
    if (n.pin || n.restY == null) continue;
    const roads = [];
    for (const b of session.beams) {
      if (b.broken || b.mat !== 'road') continue;
      if (b.a === n.id || b.b === n.id) roads.push(b);
    }
    if (roads.length < 2) { n.sagHot = 0; continue; }
    if (n.y < n.restY - limit) {
      n.sagHot = (n.sagHot || 0) + 1;
      if (n.sagHot > 28) {
        let worst = roads[0];
        for (const b of roads) if ((b.strain || 0) > (worst.strain || 0)) worst = b;
        snap(session, worst);
      }
    } else n.sagHot = 0;
  }
}

function updateBoats(session) {
    for (const boat of session.sim.boats) {
      if (!boat.active || boat.done) continue;
      boat.x += boat.vx * H;
      const rx = boat.x, ry = session.level.waterY, rw = boat.w, rh = boat.h;
      for (const b of session.beams) {
        if (b.broken) continue;
        const a = nodeById(session, b.a), c = nodeById(session, b.b);
        if (rectHitSeg(a.x, a.y, c.x, c.y, rx, ry, rw, rh)) snap(session, b);
      }
      if (boat.x >= boat.endX) {
        boat.done = true;
        boat.active = false;
      }
    }
  }

  function failVehicle(session, v, why) {
    if (v.failed || v.done) return;
    v.failed = true;
    v.alive = false;
    v.why = why;
    emit(session.sim, { type: 'fail', id: v.id, why, name: v.name });
    finish(session, 'fail', why, v);
  }

  function checkVehicles(session) {
    const water = session.level.waterY;
    const bounds = session.level.bounds;
    for (const v of session.sim.vehicles) {
      if (!v.alive || v.done || v.failed) continue;
      for (const c of session.level.checkpoints) {
        if (c.vehicle && c.vehicle !== v.id) continue;
        if (v.got[c.id]) continue;
        if (hypot(v.x - c.x, v.y - c.y) > (c.r || 1.2)) continue;
        if (c.order) {
          const ordered = session.level.checkpoints.filter(k => k.vehicle === v.id && k.order).sort((a, b) => a.order - b.order);
          const next = ordered.find(k => !v.got[k.id]);
          if (next && next.id !== c.id) continue;
        }
        v.got[c.id] = true;
        emit(session.sim, { type: 'checkpoint', id: c.id, x: c.x, y: c.y });
        if (c.hold) { v.holding = true; v.holdRelease = c.release || null; }
        if (c.reverse) {
          v.dir *= -1;
          v.vx *= -0.15;
          v.vy *= 0.4;
        }
        if (c.speed) v.speedMul = c.speed;
      }
      if (v.y < water + 0.02) { failVehicle(session, v, v.missed ? 'miss' : 'swim'); return; }
      if (v.y < bounds.y0 - 3 || v.x < bounds.x0 - 4 || v.x > bounds.x1 + 4) {
        failVehicle(session, v, v.missed ? 'miss' : 'off');
        return;
      }
      if (Math.abs(v.angle) > 1.45) {
        v.tip += H;
        if (v.tip > 0.28) { failVehicle(session, v, 'tip'); return; }
      } else v.tip = Math.max(0, v.tip - H);
      const need = session.level.checkpoints.filter(c => !c.vehicle || c.vehicle === v.id);
      const have = need.every(c => v.got[c.id]);
      if (have && hypot(v.x - v.flagX, v.y - v.flagY) < 1.55) {
        v.done = true;
        v.holding = true;
        emit(session.sim, { type: 'flag', id: v.id, name: v.name });
      } else if (!have && hypot(v.x - v.flagX, v.y - v.flagY) < 1.55) {
        if (!v.missed) {
          v.missed = true;
          emit(session.sim, { type: 'miss', id: v.id, name: v.name });
        }
      }
    }
    const pending = session.level.phases.some(p => (p.spawn || []).some(id => {
      const v = session.sim.vehicles.find(item => item.id === id);
      return v && !v.spawned;
    }));
    if (session.sim.vehicles.length && session.sim.vehicles.every(v => v.done) && !pending) finish(session, 'success');
    if (session.sim.t > (session.level.timeLimit || 48)) finish(session, 'fail', 'time');
  }

  function grade(session) {
    const spent = session.spent;
    const budget = session.level.budget;
    const contract = session.level.contract || {};
    const cap = budget * (1 + (contract.maxOver == null ? 0.5 : contract.maxOver));
    const tooFar = spent > cap + 0.05;
    const over = spent > budget + 0.05;
    const broke = session.sim.breaks > 0;
    const peak = session.sim.peakStrain || 0;
    const crossed = session.sim.result === 'success';
    let stars = 0;
    let block = null;
    if (crossed && !tooFar) stars = 1;
    if (tooFar) block = 'ledger';
    if (stars >= 1 && !over) stars = 2;
    if (stars >= 2 && !broke && peak < 1) stars = 3;
    if (contract.requireUnder && over) { stars = 0; block = block || 'under'; }
    if (contract.requireClean && (broke || peak >= 1)) { stars = 0; block = block || 'clean'; }
    return { stars, spent, budget, over, tooFar, broke, peak, crossed, block };
  }

  function finish(session, kind, why, vehicle) {
    if (!session.sim || session.sim.mode !== 'run') return;
    session.sim.result = kind;
    session.sim.why = why || null;
    session.sim.who = vehicle ? vehicle.name : null;
    if (kind === 'success') {
      const g0 = grade(session);
      if (g0.block === 'ledger' || g0.block === 'under' || g0.block === 'clean') {
        session.sim.result = 'fail';
        session.sim.why = g0.block;
      }
    }
    session.sim.grade = grade(session);
    session.sim.mode = 'result';
    emit(session.sim, { type: 'result', result: session.sim.result, why: session.sim.why, grade: session.sim.grade });
  }

  function reasonText(sim) {
    const who = sim.who || 'The vehicle';
    switch (sim.why) {
      case 'swim': return who + ' took a swim.';
      case 'tip': return who + ' tipped over.';
      case 'off': return who + ' left the works.';
      case 'miss': return who + ' reached the flag with a marker still dark.';
      case 'time': return 'The light ran out before everyone was across.';
      case 'ledger': return 'The ledger stops at half again over the budget.';
      case 'under': return 'This contract has to come in under budget.';
      case 'clean': return 'This contract needs a span that never reaches its limit.';
      default: return sim.result === 'success' ? 'Everyone is across.' : 'The crossing failed.';
    }
  }

  function substep(session) {
    const sim = session.sim;
    if (sim.mode !== 'run') return;
    sim.t += H;
    sim.liveStrain = 0;
    const phase = currentPhase(session);
    if (phase && sim.phase !== phase.id) {
      sim.phase = phase.id;
      onPhase(session, phase);
    }
    for (const b of session.beams) {
      if (b.mat !== 'hydraulic' || b.broken) continue;
      const armed = !!(phase && b.phaseOn && b.phaseOn[phase.id]);
      b.targetScale = armed ? b.scale : 1;
      const goal = b.built * b.targetScale;
      const step = Math.max(0.4, Math.abs(b.built) * 0.7) * H;
      b.rest += clamp(goal - b.rest, -step, step);
    }
    for (const n of session.nodes) {
      n.fx = 0;
      n.fy = n.pin ? 0 : -n.mass * G;
    }
    rebuildSegs(session);
    for (const v of sim.vehicles) if (v.alive && !v.done && !v.failed) applyVehicle(session, v);
    for (const b of session.beams) {
      if (b.broken || b.mat === 'hydraulic') continue;
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      const mat = MATERIALS[b.mat];
      const damp = dampFor(mat, 0.7);
      applyMember(session, a, c, b.rest, mat.k, damp, mat.strength, mat.compression ? 'bar' : 'rope', b);
    }
    for (const s of session.splits) applyWeld(session, s);
    for (const n of session.nodes) {
      if (n.pin) { n.vx = 0; n.vy = 0; continue; }
      n.vx = (n.vx + (n.fx / n.mass) * H) * 0.9992;
      n.vy = (n.vy + (n.fy / n.mass) * H) * 0.9992;
      const sp = hypot(n.vx, n.vy);
      if (sp > 26) { n.vx *= 26 / sp; n.vy *= 26 / sp; }
      n.x += n.vx * H;
      n.y += n.vy * H;
      collideNode(session, n);
    }
    for (const v of sim.vehicles) {
      if (!v.alive || v.done || v.failed) continue;
      const spec = VEHICLES[v.type];
      v.vx += v.ax * H;
      v.vy += v.ay * H;
      v.omega = (v.omega + v.aa * H) * 0.998;
      const sp = hypot(v.vx, v.vy);
      if (sp > 18) { v.vx *= 18 / sp; v.vy *= 18 / sp; }
      v.x += v.vx * H;
      v.y += v.vy * H;
      v.angle += v.omega * H;
      depenetrate(session, v);
      if (v.grounded) v.spin += v.vx * H * 0.15;
    }
    enforceHydraulics(session);
    buckleSag(session);
    updateBoats(session);
    checkVehicles(session);
  }

  function sample(session) {
    const sim = session.sim;
    sim.samples.push({
      t: sim.t,
      xy: session.nodes.flatMap(n => [Math.round(n.x * 1000) / 1000, Math.round(n.y * 1000) / 1000]),
      broken: session.beams.map(b => b.broken ? 1 : 0),
      strain: session.beams.map(b => Math.round((b.strain || 0) * 100) / 100),
      rest: session.beams.map(b => Math.round(b.rest * 1000) / 1000),
      vehicles: sim.vehicles.map(v => [v.x, v.y, v.angle, v.alive ? 1 : 0, v.done ? 1 : 0, v.spin || 0]),
      boats: sim.boats.map(b => b.x)
    });
    if (sim.samples.length > 1800) sim.samples.splice(0, sim.samples.length - 1800);
  }

  function beginSim(session) {
    for (const b of session.beams) {
      const a = nodeById(session, b.a), c = nodeById(session, b.b);
      const len = hypot(c.x - a.x, c.y - a.y);
      if (len > MATERIALS[b.mat].max + 0.04) return { ok: false, reason: MATERIALS[b.mat].name + ' is past its reach.' };
    }
    session.backup = snapshot(session);
    for (const n of session.nodes) { n.vx = 0; n.vy = 0; n.splashed = false; }
    for (const b of session.beams) {
      b.broken = false; b.strain = 0; b.force = 0; b.hot = 0; b.peak = 0;
      if (b.mat === 'spring') b.rest = b.built * b.scale;
      else b.rest = b.built;
      b.targetScale = 1;
    }
    for (const s of session.splits) s.latched = false;
    for (const n of session.nodes) {
      n.restKink = roadKink(session, n).kink;
      n.restY = n.y;
      n.sagHot = 0;
    }
    prepareHydraulics(session);
    session.sim = {
      mode: 'run', t: 0, frame: 0, phase: null, speed: 1,
      breaks: 0, firstBreak: null, peakStrain: 0, liveStrain: 0,
      events: [], samples: [], result: null, why: null, grade: null, who: null,
      vehicles: session.level.vehicles.map(makeVehicle),
      boats: (session.level.boats || []).map(b => Object.assign({}, b, { active: false, done: false }))
    };
    for (const specId of Object.keys(VEHICLES)) {
      const spec = VEHICLES[specId];
      spec.susK = spec.mass * G / (2 * 0.18);
      spec.susC = 2 * Math.sqrt(spec.susK * spec.mass) * 0.45;
      spec.inertia = spec.mass * (spec.w * spec.w + spec.h * spec.h) / 8;
    }
    sample(session);
    return { ok: true };
  }

  function tick(session) {
    if (!session.sim || session.sim.mode !== 'run') return session.sim;
    for (let i = 0; i < SUBS; i++) {
      substep(session);
      if (session.sim.mode !== 'run') break;
    }
    session.sim.frame += 1;
    if (session.sim.frame % 2 === 0) sample(session);
    return session.sim;
  }

  function applySample(session, A, B, u) {
    const xy = A.xy;
    const xyB = B ? B.xy : A.xy;
    session.nodes.forEach((n, i) => {
      n.x = xy[i * 2] + (xyB[i * 2] - xy[i * 2]) * u;
      n.y = xy[i * 2 + 1] + (xyB[i * 2 + 1] - xy[i * 2 + 1]) * u;
    });
    session.beams.forEach((b, i) => {
      b.broken = !!(A.broken[i] || (B && B.broken[i] && u > 0.5));
      const s0 = A.strain[i] || 0, s1 = B ? B.strain[i] : s0;
      b.strain = s0 + (s1 - s0) * u;
      b.rest = A.rest[i];
    });
    session.sim.vehicles.forEach((v, i) => {
      const a = A.vehicles[i], b = B ? B.vehicles[i] : a;
      if (!a) return;
      v.x = a[0] + (b[0] - a[0]) * u;
      v.y = a[1] + (b[1] - a[1]) * u;
      v.angle = a[2] + (b[2] - a[2]) * u;
      v.alive = !!(a[3] || b[3]);
      v.done = !!a[4];
      v.spin = a[5] + ((b[5] || 0) - a[5]) * u;
    });
    session.sim.boats.forEach((boat, i) => {
      const a = A.boats[i], b = B ? B.boats[i] : a;
      boat.x = a + (b - a) * u;
    });
  }

  function applyReplay(session, time) {
    const samples = session.sim.samples;
    if (!samples.length) return;
    let i = 0;
    while (i < samples.length - 1 && samples[i + 1].t < time) i++;
    const A = samples[i], B = samples[Math.min(samples.length - 1, i + 1)];
    const span = (B.t - A.t) || 1;
    const u = B === A ? 0 : clamp((time - A.t) / span, 0, 1);
    applySample(session, A, B, u);
    session.sim.replayT = time;
  }

  function beginReplay(session) {
    if (!session.sim || !session.sim.samples || !session.sim.samples.length) return { ok: false, reason: 'Nothing to replay.' };
    session.sim.mode = 'replay';
    session.sim.replayT = 0;
    applyReplay(session, 0);
    return { ok: true };
  }
  function tickReplay(session, dt) {
    if (!session.sim || session.sim.mode !== 'replay') return;
    const last = session.sim.samples[session.sim.samples.length - 1];
    const speed = session.sim.speed || 1;
    applyReplay(session, Math.min(last.t, (session.sim.replayT || 0) + dt * speed));
  }
  function seekReplay(session, u) {
    if (!session.sim || !session.sim.samples.length) return;
    const last = session.sim.samples[session.sim.samples.length - 1];
    session.sim.mode = 'replay';
    applyReplay(session, clamp(u, 0, 1) * last.t);
  }

  function rebuild(session) {
    if (session.backup) restore(session, session.backup);
    session.sim = null;
    session.backup = null;
    return { ok: true };
  }

  function setSpeed(session, n) {
    if (session.sim) session.sim.speed = n;
  }

  function give(meta, id, unlocked) {
    if (!meta.achievements[id]) {
      meta.achievements[id] = 1;
      unlocked.push(id);
    }
  }

  function award(meta, session) {
    const unlocked = [];
    const sim = session.sim;
    if (!sim || !sim.grade) return unlocked;
    const g = sim.grade;
    const id = session.level.id;
    if (sim.breaks > 0) {
      meta.stats.collapses += 1;
      give(meta, 'collapse-watch', unlocked);
    }
    if (session.level.sandbox) {
      if (g.crossed && g.stars >= 1) give(meta, 'yard-bird', unlocked);
      return unlocked;
    }
    if (g.result !== 'success' && sim.result !== 'success' && !(g.crossed && g.stars >= 1)) {
      // stars can still be 0 on contract fail
    }
    if (sim.result === 'success' && g.stars >= 1) {
      meta.stats.crossings += 1;
      const prev = meta.stars[id] || 0;
      if (g.stars > prev) meta.stars[id] = g.stars;
      if (!meta.best[id] || g.spent < meta.best[id]) meta.best[id] = Math.round(g.spent);
      give(meta, 'first-crossing', unlocked);
      if (g.stars >= 2) give(meta, 'ledger', unlocked);
      if (g.stars >= 3) give(meta, 'unbroken', unlocked);
      if (g.spent <= session.level.budget * 0.5 + 0.01) give(meta, 'thrifty', unlocked);
      if (session.beams.some(b => b.mat === 'spring')) give(meta, 'spring-step', unlocked);
      if (session.level.boats && session.level.boats.length) give(meta, 'gate-bell', unlocked);
      if (session.level.checkpoints && session.level.checkpoints.length) give(meta, 'marker-hand', unlocked);
      if (session.level.vehicles && session.level.vehicles.length >= 2) give(meta, 'night-pair', unlocked);
      if (session.level.contract && session.level.contract.requireClean) give(meta, 'clean-exam', unlocked);
    }
    for (const w of WORLDS) {
      const ls = LEVELS.filter(l => l.world === w.id);
      if (ls.length && ls.every(l => (meta.stars[l.id] || 0) >= 1)) give(meta, 'world-' + w.id, unlocked);
    }
    if (LEVELS.every(l => (meta.stars[l.id] || 0) >= 1)) give(meta, 'county-seal', unlocked);
    if (LEVELS.every(l => (meta.stars[l.id] || 0) >= 3)) give(meta, 'brass-book', unlocked);
    return unlocked;
  }

  function noteReplay(meta) {
    meta.stats.replays = (meta.stats.replays || 0) + 1;
    const unlocked = [];
    give(meta, 'replay-desk', unlocked);
    return unlocked;
  }

  function encode(payload) {
    return JSON.stringify({ version: 1, id: 'spanwright', meta: payload.meta });
  }
  function decode(raw) {
    try {
      const data = JSON.parse(raw);
      if (!data || data.version !== 1 || data.id !== 'spanwright' || !data.meta) return { ok: false, reason: 'wrong game' };
      return { ok: true, meta: normalize(data.meta) };
    } catch (err) {
      return { ok: false, reason: 'bad save' };
    }
  }

  function stressBand(strain) {
    if (strain < 0.45) return 'low';
    if (strain < 0.78) return 'mid';
    return 'high';
  }

  return {
    SAVE_KEY, G, FRAME, MATERIALS, VEHICLES, WORLDS, ACHIEVEMENTS, LEVELS,
    defaultMeta, normalize, worldUnlocked, levelUnlocked, groundY,
    startLevel, testSession, placeBeam, deleteBeam, deleteAt, moveJoint, pickBeam,
    splitJoint, toggleSplitPhase, setScale, togglePhase, markUndo, undo, redo,
    exportDesign, importDesign, setSandboxVehicle, addSandboxVehicle, setSandboxBoat, addAnchor,
    beginSim, tick, beginReplay, tickReplay, seekReplay, rebuild, setSpeed,
    award, noteReplay, encode, decode, grade, reasonText, stressBand,
    yardLevel, nodeById, beamById, splitFor, recompute
  };
});
