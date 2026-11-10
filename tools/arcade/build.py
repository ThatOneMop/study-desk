"""Generate Study Desk Arcade data, game pages and the Arcade part of credits.html.
Run from the repo root: python3 tools/arcade/build.py .
Data: gamemonetize.json (public GameMonetize feed records) and gdmeta.json (GameDistribution game pages)."""
import json, sys, html, re
from pathlib import Path
ROOT = Path(sys.argv[1])
A = Path(__file__).resolve().parent
gm = json.load(open(A/'gamemonetize.json'))
gd = json.load(open(A/'gdmeta.json'))

GM = [
 ("buggy-blast","Buggy Blast","Racing","🏎","#b5672e","Mapi Games","Off-road buggy racing across 12 circuits with nitro, drifts, jumps and unlockable buggies.","A/D or ←/→ steer · Space nitro · S brake/drift · R reset · Touch buttons on phones","Single player"),
 ("tidal-kart","Tidal Kart","Racing","🏁","#2e8fb5","mythicalmotions","Cartoon 3D kart racer with six drivers, twelve tracks, drift boosts and power-up items.","Arrows/WASD drive · Shift/Space drift · E use item · Esc pause · Touch buttons on phones","Single player"),
 ("rim-rebels-3v3","Rim Rebels 3v3","Sports","🏀","#c0582f","Broxy Games Ltd.","Full-court 3v3 street basketball with jump shots, pass fakes, alley-oops and blocks.","WASD/arrows move · J/Space shoot · K pass · Shift turbo · E switch · Esc pause","Single player against the computer"),
 ("cage-ballers-football","Cage Ballers Football","Sports","⚽","#3d8a46","Broxy Games Ltd.","Fast small-sided 3D cage football against the computer, with sprints, tackles and replays.","WASD/arrows move · Shift sprint · Space shoot/tackle · E pass · Q switch · C camera","Single player against the computer"),
 ("hive-rush-bee-swarm","Hive Rush: Bee Swarm","Arcade","🐝","#c99a1e","Mad Viking Studio","Lead a bee swarm around a 3D meadow: gather pollen, make honey, grow new colonies and chase off wasps.","WASD/arrows or hold the mouse to fly · Touch: drag","Single player"),
 ("nutty-rush-kart","Nutty Rush Kart","Racing","🐿","#b5672e","Broxy Games Ltd.","Colourful critter kart racing: build your kart, drift for boosts and fire nuts across 40 tracks.","W/↑ accelerate · A/D steer · S brake · Space/Shift drift · E/Q fire nut · R reset","Single player"),
 ("tiny-track-rally","Tiny Track Rally","Racing","🚙","#2e8fb5","BenBlazeCraft","Toy-car 3D racing with drifts, nitro and weather across two cups of tracks.","W/↑ gas · S/↓ brake · A/D steer · Shift/Space nitro · C camera · R reset","Single player"),
 ("hilltop-hustle","Hilltop Hustle","Racing","⛰","#5f8a2e","Popyca Games","Bouncy hill-climb driving: balance your jeep, grab fuel, flip for coins and upgrade your rides.","→/D gas · ←/A brake · tilt in the air · Touch pedals","Single player"),
 ("chubby-duck-offroad","Chubby Duck Offroad","Racing","🦆","#a7782e","MrHorfen","Ride a dirt bike down fresh mountain trails, land on the slopes and spin in the air for stars.","W throttle · S brake · A/D lean and spin · Space hop · R retry","Single player"),
 ("sky-ace-stunt-plane-islands","Sky Ace: Stunt Plane Islands","Flying","✈","#2e7fb5","Popyca Games","Fly a stunt plane over islands and canyons: rings, balloons, loops, races and 28 missions.","W/S pitch · A/D roll · R/F speed · Space boost · Q/E rudder · Mouse drag steer","Single player"),
 ("nutty-rush","Nutty Rush","Platformer","🌰","#7a5bb0","Broxy Games Ltd.","Cosy 3D platformer: a little squirrel runs, double-jumps and throws nuts across five worlds.","Arrows/WASD move · Space jump (twice for double) · F throw nut · Shift sprint","Single player"),
 ("gorbo-the-orc-crown-quest","Gorbo the Orc: Crown Quest","Platformer","👑","#5b7a3d","Sleepy Yak","Funny cartoon platform adventure: run, jump and combo your way through 48 levels to win back the crown.","Arrows/A D run · Space/W jump · X/J swing · C/L throw axe · E potion","Single player"),
 ("frosty-ball","Frosty Ball","Platformer","⛄","#4f8fb5","Shadow Games","Roll a snowball through icy physics levels with portals, anti-gravity pads and spikes.","A/D or ←/→ move · Space/W/↑ jump · P pause · Touch buttons","Single player"),
 ("panda-run","Panda Run","Runner","🐼","#3d8a46","GG Developers","3D runner: jump, slide and dodge through four biomes and 200 levels.","WASD / arrows move, jump and slide · Swipe on phones","Single player"),
 ("wobble-it","Wobble It","Puzzle","🏐","#4f6fa8","Bluefrost","Roll a beach ball round floating block worlds where walls turn into floors; collect every key.","W/↑ roll · A/D turn · Space hop · E jump forward · R restart","Single player"),
 ("mecha-screw-3d","Mecha Screw 3D","Puzzle","🔩","#4f6fa8","Mapi Games","Unscrew colourful machines and sort screws into matching boxes across 15 puzzles.","Click or tap exposed screws","Single player"),
 ("rope-chef","Rope Chef","Puzzle","🥟","#c0702f","Marcus Yeo","Cut the ropes so ingredients drop into the pot in recipe order. Cute physics puzzles.","Click or drag across a rope to cut it · Tap bubbles to pop them","Single player"),
 ("orbit-pals","Orbit Pals","Puzzle","🪐","#6a4fa8","SPNK Studio","Space sorting puzzle: hop the alien pals between planets until each kind is together.","Click a planet, then click another to send the pals","Single player"),
 ("meow-sudoku","Meow Sudoku","Puzzle","🐱","#b54f6b","Inlogic Software s.r.o.","Colourful logic puzzle: place cats so each row, column and colour has exactly one.","Click/tap to place a cat · Double-tap to mark","Single player"),
 ("solitaire-the-collection","Solitaire The Collection","Classic","🃏","#3d7a4b","DarkPlay","33 solitaire games in one, including Klondike, Spider, FreeCell and Pyramid.","Click or drag cards","Single player"),
 ("netherton-volleyball","Netherton Volleyball","Sports","🏐","#8a6b3d","Wardvale Games","Pixel-art 6v6 volleyball: time your taps to serve, dig, set and spike for the cup.","Click/tap when the ring is green · Space tap · Q W E / A S D set players","Single player"),
 ("soccer-rebound","Soccer Rebound","Sports","⚽","#3d8a46","Intelligentia Studios","Football on a pinball table: work the flippers while your toy team passes and shoots.","←/A left flipper · →/D right flipper · ↑/W/Space bend shot","Single player"),
 ("curve-free-kick","Curve Free Kick","Sports","🥅","#2f7a3d","fix games","3D free kicks: choose your run-up, bend the ball round the wall and beat the keeper.","Move the mouse to line up · Click or Space to shoot","Single player"),
]
# slug, genre, icon, short description
GD = [
 ("moto-x3m-bike-race-game","Racing","🏍","Stunt bike racing over loops, ramps and traps; land flips to shave seconds."),
 ("fireboy-and-watergirl-1-forest-temple","Platformer","🔥","Two-player co-op puzzle platformer: guide fire and water through the Forest Temple."),
 ("basketball-stars","Sports","🏀","One- or two-player arcade basketball with dunks, blocks and supershots."),
 ("football-legends-2026","Sports","⚽","Cartoon head-style football for one or two players, with tournaments and power shots."),
 ("vex-7","Platformer","🏃","Precision stickman obstacle runs with spikes, saws and tricky jumps."),
 ("bob-the-robber-2","Puzzle","🕵","Sneak past guards and cameras in a light-hearted stealth puzzle adventure."),
 ("car-eats-car-5","Racing","🚗","Cartoon 3D driving and car battles from the Car Eats Car series."),
 ("golf-orbit","Sports","⛳","One-tap space golf: launch the ball as far as you can and upgrade your swing."),
 ("tiny-fishing","Idle","🎣","Cast deep, reel up a big haul and upgrade your line in this idle fishing game."),
 ("basket-random","Sports","🏀","Silly two-player physics basketball where every round changes the rules."),
 ("moto-x3m-pool-party","Racing","🏍","Summer-themed Moto X3M stunt tracks with water slides and pool jumps."),
 ("moto-x3m-spooky-land","Racing","🎃","Halloween-themed Moto X3M stunt tracks full of cartoon frights."),
 ("vex-x3m","Racing","🏍","Vex-style obstacle courses on a stunt bike."),
 ("vex-6","Platformer","🏃","More Vex obstacle runs with new traps and challenge modes."),
 ("fireboy-and-watergirl-2-light-temple","Platformer","💡","Co-op puzzle platforming with light beams and mirrors."),
 ("fireboy-and-watergirl-3-ice-temple","Platformer","❄","Co-op puzzle platforming on slippery ice and melting floors."),
 ("fireboy-and-watergirl-4-crystal-temple","Platformer","💎","Co-op puzzle platforming with portals and crystals."),
 ("fireboy-and-watergirl-5-elements","Platformer","🌿","Co-op puzzle platforming across temples of every element."),
 ("bob-the-robber-5-temple-adventure","Puzzle","🕵","Bob explores an ancient temple full of traps and puzzles."),
 ("tennis-masters-2026","Sports","🎾","Arcade tennis tournaments with smashes, lobs and power shots."),
 ("penalty-shooters-2","Sports","⚽","Football penalty shootouts: aim, curve and save your way to the cup."),
 ("soccer-random","Sports","⚽","Two-player physics football that changes with every goal."),
 ("volley-random","Sports","🏐","Two-player physics volleyball on random courts."),
 ("boxing-random","Sports","🥊","Floppy two-player physics boxing with random arenas."),
 ("monsters-wheels-2","Racing","🚙","Cartoon monster-truck physics racing over hills and wrecks."),
 ("trial-xtreme","Racing","🏍","Trials bike riding: balance over ramps, crates and gaps."),
 ("coaster-racer-2","Racing","🏎","Fast arcade racing with upgrades and track tricks."),
 ("traffic-jam-3d","Racing","🚦","Weave through 3D highway traffic and complete driving missions."),
 ("battle-racing-stars","Racing","🏁","Kart-style racing with boosts and power-ups."),
 ("marble-crazy-league","Racing","🔵","3D marble racing down twisting tracks."),
 ("carnage-battle-arena","Action","💥","Cartoon car-combat arena: ram, boost and stay on the platform."),
 ("gold-miner","Arcade","⛏","Swing the claw, grab gold and gems, and hit each level's target."),
 ("stack-ball","Arcade","🟠","Smash down through spinning helix platforms without hitting black tiles."),
 ("magic-finger","Arcade","✨","Tap-to-shoot magic action levels from TapNation."),
 ("knock-em-all","Puzzle","🎯","Throw balls to knock every target off the platform."),
 ("block-crasher","Arcade","🧱","Bounce a ball to crash through blocks in quick arcade levels."),
 ("pool-duel","Sports","🎱","Play pool against the computer or a friend."),
 ("archer-go","Arcade","🏹","Archery challenges: judge wind and distance to hit the targets."),
 ("galaxy-tank-battle","Action","🛰","Turn-based cartoon tank artillery on alien planets."),
 ("rooftop-snipers","Action","🎩","Goofy two-player duel: knock your rival off the roof (cartoon, no gore)."),
 ("idle-ants","Idle","🐜","Build an ant colony that devours giant snacks and objects."),
 ("auto-factory-tycoon","Idle","🏭","Build and upgrade a car factory in this tycoon game."),
 ("idle-mining-empire","Idle","⛏","Grow a mining empire with managers, shafts and upgrades."),
 ("bubble-shooter-pro","Classic","🫧","Classic bubble shooter: match three colours to clear the board."),
 ("classic-solitaire","Classic","🃏","Classic Klondike solitaire."),
]
COLORS = {"Flying":"#2e7fb5","Runner":"#3d8a46","Racing":"#b5672e","Platformer":"#7a5bb0","Sports":"#3d8a46","Puzzle":"#4f6fa8","Idle":"#a78a2e","Arcade":"#b54f6b","Action":"#8a4b3d","Classic":"#4b7a7a"}

_js = (ROOT/"catalog.js").read_text(); catalog = json.loads(_js.split("=", 1)[1].strip().rstrip(";"))
catalog = [g for g in catalog if g.get('group') != 'Arcade' and g.get('source') not in ('GameMonetize', 'GameDistribution')]
live = []
for id_, title, genre, icon, color, dev, desc, controls, mp in GM:
    g = gm[title]
    live.append({"id": id_, "title": title, "description": desc, "icon": icon, "genre": genre, "color": color,
        "url": f"arcade/{id_}/index.html", "group": "Arcade", "controls": controls, "type": "arcade", "internet": True,
        "multiplayer": mp, "credits": "credits.html#arcade-gamemonetize", "thumbnail": g['thumb'], "thumbnailAlt": title + " cover art",
        "developer": dev, "source": "GameMonetize", "sourcePage": g.get('page') or f"https://gamemonetize.com/{id_}-game", "embed": g['url'],
        "aliases": ["arcade", "gamemonetize", dev.lower()]})
(ROOT/'catalog.json').write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
(ROOT/'catalog.js').write_text("window.GAME_CATALOG = " + json.dumps(catalog, ensure_ascii=False, separators=(',', ':')) + ";\n")

gdlist = []
for slug, genre, icon, desc in GD:
    m = gd[slug]
    gdlist.append({"id": "gd-" + slug, "title": m['title'], "description": desc, "icon": icon, "genre": genre, "color": COLORS[genre],
        "url": f"arcade/gd-{slug}/index.html", "group": "Arcade", "controls": (m.get('instruction') or 'See the in-game instructions')[:160],
        "type": "arcade", "internet": True, "multiplayer": "See game", "credits": "credits.html#arcade-gamedistribution",
        "thumbnail": f"https://img.gamedistribution.com/{m['md5']}-512x384.jpg", "thumbnailAlt": m['title'] + " cover art",
        "developer": m['company'], "source": "GameDistribution", "sourcePage": f"https://gamedistribution.com/games/{slug}/",
        "gdGameId": m['md5'], "aliases": ["arcade", "gamedistribution", m['company'].lower()]})
(ROOT/'arcade').mkdir(exist_ok=True)
(ROOT/'arcade'/'gamemonetize.js').write_text(
    "/* GameMonetize Arcade entries. NOT shown or embedded unless arcade-config.js sets gmEnabled to true.\n"
    "   Pages, descriptions and embed addresses stay here so the switch is reversible. */\n"
    "window.ARCADE_GM_CATALOG = " + json.dumps(live, ensure_ascii=False, indent=1) + ";\n")
(ROOT/'arcade'/'gamedistribution.js').write_text(
    "/* GameDistribution Arcade entries. NOT shown or embedded unless arcade-config.js enables them\n"
    "   with an approved publisher ID. See docs/arcade-gamedistribution.md. */\n"
    "window.ARCADE_GD_CATALOG = " + json.dumps(gdlist, ensure_ascii=False, indent=1) + ";\n")

PAGE = open(A/'page.html').read()
def page(g, kind):
    data = {k: g[k] for k in ('id','title','developer','source','sourcePage','thumbnail','description','controls')}
    if kind == 'gm': data['embed'] = g['embed']
    else: data['gdGameId'] = g['gdGameId']
    out = (PAGE.replace('{{TITLE}}', html.escape(g['title'])).replace('{{KIND}}', kind)
        .replace('{{DATA}}', json.dumps(data, ensure_ascii=False).replace('</', '<\\/')))
    d = ROOT/'arcade'/g['id']; d.mkdir(parents=True, exist_ok=True); (d/'index.html').write_text(out)
for g in live: page(g, 'gm')
for g in gdlist: page(g, 'gd')

# Arcade part of credits.html is regenerated. Later non-arcade sections (before </main>) stay.
def listed(games):
    return "".join(f'<li><a href="{g["sourcePage"]}">{html.escape(g["title"])}</a> by {html.escape(g["developer"])}</li>' for g in games)
cfg = (ROOT/'arcade-config.js').read_text()
gm_on = bool(re.search(r'gmEnabled:\s*true\b', cfg))
if gm_on:
    intro = ('<section id="arcade"><h2>Arcade (third-party games)</h2><p>Arcade games are not part of Study Desk. They are made and owned by '
        'their developers. The 23 GameMonetize games are on and ad-supported, made and owned by their developers. '
        'GameDistribution entries are prepared but switched off, so they are not shown or embedded. '
        'Study Desk does not host their files. All rights belong to their developers.</p></section>')
    gmsec = (f'<section id="arcade-gamemonetize"><h2>GameMonetize games</h2><p>These {len(live)} GameMonetize games are on and ad-supported, '
        'made and owned by their developers. Study Desk does not host their files. All rights belong to their developers.</p><ul>'
        + listed(live) + '</ul></section>')
else:
    intro = ('<section id="arcade"><h2>Arcade (third-party games)</h2><p>Arcade games are not part of Study Desk. They are made and owned by '
        'their developers. GameMonetize and GameDistribution entries are prepared but switched off, so they are not shown or embedded. '
        'Study Desk does not host their files. All rights belong to their developers.</p></section>')
    gmsec = (f'<section id="arcade-gamemonetize"><h2>GameMonetize games (switched off)</h2><p>These {len(live)} games are prepared '
        'but are not shown or embedded while gmEnabled is not true in arcade-config.js. Their pages do not load GameMonetize. '
        'All rights belong to their developers.</p><ul>' + listed(live) + '</ul></section>')
gdsec = (f'<section id="arcade-gamedistribution"><h2>GameDistribution games (switched off)</h2><p>These {len(gdlist)} games are prepared '
    'but are not shown or embedded until the site has an approved GameDistribution publisher account (see docs/arcade-gamedistribution.md). '
    'All rights belong to their developers.</p><ul>' + listed(gdlist) + '</ul></section>')
cr = (ROOT/'credits.html').read_text()
start = cr.find('<section id="arcade">')
end = cr.index('</main>')
if start < 0: start = end
else:
    for match in re.finditer(r'<section id="([^"]+)"', cr):
        if match.start() > start and not match.group(1).startswith('arcade'):
            end = match.start()
            break
(ROOT/'credits.html').write_text(cr[:start] + intro + gmsec + gdsec + cr[end:])
print(f"{len(catalog)} public catalog entries; {len(live)} GameMonetize {'on' if gm_on else 'gated'}; {len(gdlist)} GD gated")
