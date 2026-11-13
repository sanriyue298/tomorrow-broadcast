# v0.2 validation notes

## Automated checks

`node check-game.cjs`: 14 checks passed. Includes legal starter fleets, construction/refunds/movement/upgrades, supply connectivity, power/weight/shields, skill costs/cooldowns, both loss conditions, ammo explosions, encounter choices, reward progression, final boss requirement, gun range, target priority and malformed save rejection.

The same test runs 30 seeded full expeditions with an automated strategy using only legal purchases, repairs and skills. On the current balance, 13 completed the final battle and 17 lost in sector five. These are regression scenarios, not an estimate of human difficulty. No hidden resource grants or full-heal shortcuts are used.

A mid-combat serialization/restore pair produces identical simulation state after identical subsequent inputs.

## Browser observations

- 844 × 390 and 800 × 360 landscape: whole-page horizontal overflow corrected; module names and the three skill buttons fit the visible game layout.
- 393 × 852 portrait: orientation prompt and optional portrait mode; no document horizontal overflow.
- Tested selecting a starter, selecting/installing a module, dragging an installed reactor to another cell, dragging a weapon card into an empty cell, loading a saved mid-battle state, resolving a mid-route encounter, activating shield, locking a target, firing a salvo, pausing, selecting a field upgrade and entering sector two.
- No browser warnings or script errors observed during these flows.
- Corrected structural supports under modules, pointer capture for card drag, and off-screen firing during visual review.

## Limits

These were desktop-browser viewport checks, not physical Android device testing. Real-device frame rate, touch comfort, audio latency, full-screen/orientation permission behavior and battery cost remain to be verified. No offline cache or cross-device save synchronization is implemented. The deployment retains the existing private audience.
