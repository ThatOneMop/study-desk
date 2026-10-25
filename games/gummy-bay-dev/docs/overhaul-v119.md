# Gummy Bay v119: movement clearance

Releasing crouch now respects the current roof clearance instead of raising the eye into it. Crouch movement speed and jump restrictions remain active when standing would hit the roof. Once clear, standing resumes automatically. Crouch transitions use exponential smoothing with a small settling tolerance so equal elapsed time gives the same posture at different frame rates.

Sprint FOV now requires actual movement after collision resolution; holding sprint into a wall no longer maintains the sprint zoom. FOV easing also uses exponential smoothing.

Validation: full suite recorded in evidence/v119-final-tests.json, including a new raised-floor/low-ceiling and frame-rate test. No rendered playfeel claim: the cloud browser previously failed to create a WebGL context. Local visual testing remains outstanding. This is one movement pass, not completion of the entire overhaul.
