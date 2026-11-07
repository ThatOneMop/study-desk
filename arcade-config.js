/* Study Desk Arcade switches.
   GameMonetize games are prepared in arcade/gamemonetize.js (pages, descriptions
   and embed addresses kept) but hidden: those hosts are not working.
   gmEnabled must be exactly true before a GameMonetize game is listed or loaded.
   GameDistribution games stay hidden and are never embedded until BOTH values below
   are set by the account owner after GameDistribution approves the publisher account.
   See docs/arcade-gamedistribution.md before changing the GameDistribution values. */
window.ARCADE_CONFIG = {
  gmEnabled: false,
  gdEnabled: false,
  gdPublisherId: ''
};
