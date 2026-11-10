/* Study Desk Arcade switches.
   GameMonetize games are listed and embedded when gmEnabled is exactly true.
   They are ad-supported, made and owned by their developers. Study Desk does
   not host their files. Pages, descriptions and embed addresses stay in
   arcade/gamemonetize.js so the switch is reversible.
   GameDistribution games stay hidden and are never embedded until BOTH values below
   are set by the account owner after GameDistribution approves the publisher account.
   See docs/arcade-gamedistribution.md before changing the GameDistribution values. */
window.ARCADE_CONFIG = {
  gmEnabled: true,
  gdEnabled: false,
  gdPublisherId: ''
};
