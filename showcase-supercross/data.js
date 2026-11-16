/* Sourced race notes for the showcase tracker. Opinion scores are computed in the page. */
window.SX_DATA = {
  asOf: "16 November 2026",
  site: "Gateboard",
  series: [
    {
      id: "supercross",
      label: "Supercross",
      title: "Monster Energy AMA Supercross",
      kicker: "Stadiums, USA",
      recentTitle: "Last main: Salt Lake City, 9 May 2026",
      recentNote: "450SX main at Rice-Eccles Stadium. Ken Roczen's 5th still took the title, three points ahead of Hunter Lawrence.",
      results: [
        { pos: "1", name: "Chase Sexton", detail: "Kawasaki · 21:10.489" },
        { pos: "2", name: "Justin Cooper", detail: "Yamaha · +2.096" },
        { pos: "3", name: "Jorge Prado", detail: "KTM · +3.309" },
        { pos: "4", name: "Cooper Webb", detail: "Yamaha · +3.920" },
        { pos: "5", name: "Ken Roczen", detail: "Suzuki · +10.162 · champion on the night" },
        { pos: "7", name: "Hunter Lawrence", detail: "Honda · +15.816 · holeshot, then a fall" }
      ],
      season: "2026 450SX final points: Ken Roczen 349, Hunter Lawrence 346. Official champions list names Roczen.",
      next: {
        name: "Anaheim 1",
        when: "Saturday 9 January 2027",
        venue: "Angel Stadium, Anaheim, California",
        iso: "2027-01-10T11:00:00+11:00",
        clockNote: "Countdown is to the published main-event time: 4:00pm Pacific on Saturday, which is 11:00am Sunday in Sydney (AEDT). Opening ceremonies are listed at 3:30pm Pacific."
      },
      watch: "An Australian TV or streaming partner for the 2027 AMA Supercross season was not on the schedule pages checked. Tickets and the US run-of-show are on the official Anaheim 1 page.",
      cheerTitle: "Who to cheer for",
      cheer: "Hunter Lawrence. He is the Australian who took the 2026 title fight to the last lap of the last night. This is a fan pick, not a forecast.",
      outlookTitle: "Likely story (opinion)",
      outlook: "The form table likes Ken Roczen because he just won the championship and still scored when it was messy. Chase Sexton won the finale, so he is the loudest 'watch him at the opener' name. None of that is a result. The 2027 Anaheim 1 track map was not published in the sources checked.",
      weights: [
        { factor: "2026 championship", weight: 35, note: "Title and the gap to second." },
        { factor: "Salt Lake finale", weight: 25, note: "Who actually won the last main." },
        { factor: "Season points rank", weight: 25, note: "Where they sat after 17 rounds." },
        { factor: "2027 track map", weight: 15, note: "Not published yet, so every rider scores a neutral 5." }
      ],
      riders: [
        { name: "Ken Roczen", cheer: false, scores: [10, 6, 10, 5], why: "Champion by 3. Fifth when fifth was enough." },
        { name: "Hunter Lawrence", cheer: true, scores: [9, 4, 9, 5], why: "Second by 3. Seventh after leading the holeshot battle." },
        { name: "Chase Sexton", cheer: false, scores: [6, 10, 6, 5], why: "Won Salt Lake. Sixth in the final points on the standings page checked." },
        { name: "Cooper Webb", cheer: false, scores: [7, 7, 8, 5], why: "Third on 315 points. Fourth in the finale." }
      ],
      sources: [
        { title: "Racer X: Salt Lake City 450 main results", url: "https://racerxonline.com/sx/2026/salt-lake-city/450sx/main-event" },
        { title: "SuperMotocross.com: Salt Lake 450 main", url: "https://www.supermotocross.com/results/2026/salt-lake-city/450-main-event/" },
        { title: "Racer X: Roczen wins the 2026 450SX title", url: "https://racerxonline.com/2026/05/09/ken-roczen-wins-2026-450sx-supercross-championship" },
        { title: "Supercross Live: champions list", url: "https://www.supercrosslive.com/champions/" },
        { title: "Supercross Live: Anaheim 2027", url: "https://www.supercrosslive.com/anaheim-2027/" },
        { title: "Supercross.com: 2027 schedule", url: "https://www.supercross.com/pages/schedule" }
      ]
    },
    {
      id: "motocross",
      label: "Motocross",
      title: "AMA Pro Motocross",
      kicker: "Outdoors, USA",
      recentTitle: "Last national: Ironman, 29 August 2026",
      recentNote: "450 overall at Ironman Raceway, Crawfordsville, Indiana. Hunter Lawrence's 8-4 was enough for the title by two points.",
      results: [
        { pos: "1", name: "Jorge Prado", detail: "KTM · motos 1-1 · first US win" },
        { pos: "2", name: "R.J. Hampshire", detail: "Husqvarna · 2-6" },
        { pos: "3", name: "Cooper Webb", detail: "Yamaha · 3-8" },
        { pos: "4", name: "Hunter Lawrence", detail: "Honda · 8-4 · 450 champion, 474 points" },
        { pos: "5", name: "Eli Tomac", detail: "KTM · 7-5" },
        { pos: "6", name: "Jett Lawrence", detail: "Honda · 11-3 · 472 points" }
      ],
      season: "250 champion: Cole Davies, Monster Energy Yamaha Star Racing, 407 points. He had the title before moto 2. Julien Beaumer won the 250 overall, motos 2-1.",
      next: {
        name: "Fox Raceway National",
        when: "Saturday 29 May 2027",
        venue: "Fox Raceway at Pala, California",
        iso: "2027-05-29T12:00:00-07:00",
        clockNote: "A start time was not in the schedule pages checked. The countdown uses noon in California on that Saturday, which is 5:00am Sunday 30 May in Sydney (AEST). That is a marker, not a published gate time."
      },
      watch: "An Australian broadcaster for the 2027 Pro Motocross season was not named in the sources checked. The calendar itself is the 1 October 2026 SMX League release.",
      cheerTitle: "Who to cheer for",
      cheer: "The Lawrence brothers, from Landsborough. Hunter has the 450 plate. Jett was two points short. Cole Davies is the 250 name if you want the rider who already closed a title early. Fan picks, not forecasts.",
      outlookTitle: "Likely story (opinion)",
      outlook: "Outdoors, the table leans Hunter because he won the championship on a messy last day, with Jett still the person who can take a moto apart. Prado's 1-1 at Ironman is the 'he has figured the US out' argument. The 2027 dirt is the same famous parks; it is still a new season.",
      weights: [
        { factor: "2026 title", weight: 40, note: "Who took the Edison Dye Cup, and how close it was." },
        { factor: "Ironman overall", weight: 30, note: "The last national, not the championship." },
        { factor: "Known injuries", weight: 15, note: "Nothing current was verified, so this stays neutral." },
        { factor: "Track type", weight: 15, note: "Outdoor nationals, not a stadium. Neutral until a specific 2027 map exists." }
      ],
      riders: [
        { name: "Hunter Lawrence", cheer: true, scores: [10, 6, 5, 5], why: "Champion by 2 after an 8-4." },
        { name: "Jett Lawrence", cheer: true, scores: [8, 5, 5, 5], why: "472 points. Sixth overall when it mattered most." },
        { name: "Jorge Prado", cheer: false, scores: [6, 10, 5, 5], why: "1-1 at Ironman, first win in the US." },
        { name: "Cooper Webb", cheer: false, scores: [5, 7, 5, 5], why: "Third overall on the last day. Not the champion." }
      ],
      also: "In Australia, the outdoor series is being rebranded AUSMX for 2027. A provisional eight-round calendar starts 6–7 March 2027 in Victoria. Venues were not locked in the announcement used here. 2026 ProMX MX1 champion: Jed Beaton, Yamaha, 373 points, from the official results table.",
      sources: [
        { title: "Pro Motocross: Ironman results, 29 Aug 2026", url: "https://promotocross.com/2026/08/29/smx-round-28-results-ironman-national-finals-august-29-2026" },
        { title: "Supercross.com: Lawrence and Davies crowned at Ironman", url: "https://www.supercross.com/blogs/news/hunter-lawrence-and-cole-davies-crowned-2026-pro-motocross-champions-at-ironman" },
        { title: "Pro Motocross: 2027 schedule release, 1 Oct 2026", url: "https://promotocross.com/2026/10/01/2027-monster-energy-smx-world-championship-schedule-revealed" },
        { title: "ProMX results: 2026 MX1 standings", url: "https://auspromx.com.au/results/" },
        { title: "Fullnoise: provisional 2027 AUSMX calendar", url: "https://www.fullnoise.com.au/fullnoise-news/provisional-calendar-announced-for-2027-ausmx-championship/" }
      ]
    },
    {
      id: "enduro",
      label: "Enduro",
      title: "FIM EnduroGP",
      kicker: "Trails, not stadiums",
      recentTitle: "Last round: GP of Wales, Rhayader, 7–9 August 2026",
      recentNote: "Final day of the Paulo Duarte championship. Season titles below are from the season summary. The day result is from the FIM report.",
      results: [
        { pos: "1", name: "Josep García", detail: "KTM · won the final day · EnduroGP and Enduro1 champion" },
        { pos: "2", name: "Andrea Verona", detail: "KTM · second on the day · Enduro2 champion" },
        { pos: "3", name: "Zach Pichon", detail: "TM · third on the day, six seconds behind Verona" },
        { pos: "4", name: "Nathan Watson", detail: "Beta · fourth on the final day" },
        { pos: "E3", name: "Steve Holcombe", detail: "Sherco · Enduro3 champion" },
        { pos: "W", name: "Rachel Gutish", detail: "Rieju · won the final women's day and the world title" }
      ],
      season: "Wikipedia's season page, citing the FIM calendar and results, lists García unbeaten in Enduro1 (280 class points) and first in the overall on 266. Verona defended Enduro2. Holcombe took Enduro3.",
      next: {
        name: "GP of Spain",
        when: "2–4 April 2027 (provisional)",
        venue: "Valverde del Camino, Spain",
        iso: "2027-04-02T08:00:00+02:00",
        clockNote: "The provisional calendar does not list a start time. The countdown uses 8:00am in Spain on 2 April 2027, the first morning of the round. That is 4:00pm the same day in Sydney (AEST, if Spain is on CEST). Session times can still change."
      },
      watch: "An Australian broadcast for EnduroGP was not named in the FIM or EnduroGP pages checked.",
      cheerTitle: "Who to cheer for",
      cheer: "Josep García, if you want the rider who just went unbeaten in his class. No Australian rider was in the final-day top five in the FIM report used here, so this cheer pick is not a hometown one. Fan pick, not a forecast.",
      outlookTitle: "Likely story (opinion)",
      outlook: "García's 2026 was a procession in Enduro1. Verona had to survive a last-test fight with Pichon. Holcombe's title came on the way back from the injury year the season page describes. A provisional 2027 map is not a form guide.",
      weights: [
        { factor: "2026 class title", weight: 40, note: "Who actually won the number plate." },
        { factor: "Wales final day", weight: 30, note: "The last special tests." },
        { factor: "Injuries", weight: 15, note: "Holcombe's 2025 troubles are last year's news. Nothing newer was verified, so the score stays moderate rather than a guess." },
        { factor: "2027 course", weight: 15, note: "Valverde is new on the provisional list. Neutral for everyone." }
      ],
      riders: [
        { name: "Josep García", cheer: true, scores: [10, 10, 5, 5], why: "Overall and Enduro1. Won the last day." },
        { name: "Andrea Verona", cheer: false, scores: [8, 8, 5, 5], why: "Enduro2 again. Second on the last day." },
        { name: "Steve Holcombe", cheer: false, scores: [8, 5, 6, 5], why: "Enduro3 champion. The season page says he was coming back from 2025 injuries." },
        { name: "Rachel Gutish", cheer: false, scores: [9, 9, 5, 5], why: "Women's champion and final-day winner, by 53 seconds." }
      ],
      sources: [
        { title: "FIM: champions crowned at the GP of Wales", url: "https://www.fim-moto.com/en/news/news-detail/article/world-champions-crowned-as-2026-fim-endurogp-comes-to-a-close-at-forsitservices-gp-of-wales" },
        { title: "Wikipedia: 2026 FIM Enduro World Championship (class tables)", url: "https://en.wikipedia.org/wiki/2026_FIM_Enduro_World_Championship" },
        { title: "EnduroGP: provisional 2027 calendar (8 Aug 2026)", url: "https://www.endurogp.com/2026/08/08/fim-endurogp-announces-provisional-calendar-for-2027/" }
      ]
    },
    {
      id: "ausx",
      label: "AUSX",
      title: "Boost Mobile AUSX Supercross",
      kicker: "Stadiums, Australia",
      recentTitle: "Last night in: Perth, 14 November 2026",
      recentNote: "HBF Park. SX1 and SX2 mains, from the official AUSX report and the same podium in a second write-up.",
      results: [
        { pos: "SX1", name: "Christian Craig", detail: "Honda · won after an early fight with Jo Shimoda" },
        { pos: "2", name: "Cedric Soubeyras", detail: "Kawasaki" },
        { pos: "3", name: "Austin Politelli", detail: "Honda" },
        { pos: "SX2", name: "Max Anstie", detail: "Yamaha · last-lap pass, 0.155s" },
        { pos: "2", name: "Cameron McAdoo", detail: "Honda" },
        { pos: "3", name: "Michael Hicks", detail: "Stark" }
      ],
      season: "After Perth, AUSX said Craig led SX1 on 207 points, Luke Clout second on 163, Soubeyras third on 159. SX2: McAdoo 174, Cole Davies 150, Brodie Connolly 145, Anstie 144. One round left. Jack Deveson had already clinched SMX Next.",
      next: {
        name: "Newcastle finale",
        when: "Saturday 28 November 2026",
        venue: "McDonald Jones Stadium, Newcastle, NSW",
        iso: "2026-11-28T18:30:00+11:00",
        clockNote: "The official event page did not list a gate time. MX Large reported that AUSX coverage starts at 6:30pm local. The countdown uses 6:30pm Sydney time on 28 November, and it is marked as a coverage time, not a confirmed start."
      },
      watch: "AUSX said every 2026 round is live and free on 7plus Sport, live on Kayo Sports, with a one-hour highlights show on 7mate the weekend after. International viewers were pointed at the AUSX 360 app.",
      cheerTitle: "Who to cheer for",
      cheer: "Luke Clout. He is the Australian sitting second in SX1, 44 points back, with two finals still to run in Newcastle. Cole Davies is the SX2 name a lot of local fans already know, 24 points behind McAdoo. Fan picks, not forecasts. Craig is the one the points say has the shorter path.",
      outlookTitle: "Likely story (opinion)",
      outlook: "AUSX itself said Craig needs seven points from the two Newcastle finals to wrap up the AUSX SX1 title, and that both titles are still open. That is the maths they published, not a tip. Clout has to have a huge night. SX2 is tighter: McAdoo leads, but Anstie just won on the last lap.",
      weights: [
        { factor: "Points in hand", weight: 40, note: "The gap AUSX published after Perth." },
        { factor: "Perth main", weight: 30, note: "Who won the most recent night." },
        { factor: "Finals left", weight: 15, note: "Two mains in Newcastle. A bad night can still move SX2. SX1 needs a very big swing." },
        { factor: "Injuries", weight: 15, note: "No fresh injury report was verified for these four, so the score stays neutral." }
      ],
      riders: [
        { name: "Christian Craig", cheer: false, scores: [10, 10, 7, 5], why: "Won Perth. Leads by 44. AUSX said seven points can close SX1." },
        { name: "Luke Clout", cheer: true, scores: [6, 4, 8, 5], why: "Second on 163. Needs a huge Newcastle." },
        { name: "Cameron McAdoo", cheer: false, scores: [9, 7, 8, 5], why: "SX2 leader on 174. Second in Perth by 0.155s." },
        { name: "Max Anstie", cheer: false, scores: [6, 10, 8, 5], why: "Won SX2 on the last lap. Fourth on 144." }
      ],
      sources: [
        { title: "AUSX: Perth report, Craig and Anstie", url: "https://ausxsupercross.com.au/news/perth-delivers-ausx-supercross-spectacular-as-christian-craig-and-max-anstie-reign-supreme-in-the-west/" },
        { title: "AUSX: Newcastle event page", url: "https://ausxsupercross.com.au/events/newcastle/" },
        { title: "AUSX: 2026 broadcast release (1 Oct 2026)", url: "https://ausxsupercross.com.au/news/ausx-confirms-live-and-free-national-broadcast-package/" },
        { title: "MX Large: coverage start time as reported", url: "https://www.mxlarge.com/news/australian-sx-live-coverage" },
        { title: "Supercross.com write-up of the Perth mains and points", url: "https://www.supercross.com/blogs/news/ausx-perth-2026-results" }
      ]
    }
  ]
};
