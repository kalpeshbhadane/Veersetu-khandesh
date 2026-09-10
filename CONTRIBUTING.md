# Branching & deploy workflow

There's one production server (65.1.97.236) and no separate staging
environment, so the branch model exists to put a review gate in front of
production, not to give `development` a live environment of its own.

## The branches

- **`main`** — production. What's on `main` is what *should* be live. The
  only way anything reaches the server is: merge into `main`, then someone
  manually runs the **Deploy VeerSetu Khandesh** GitHub Action (Actions tab →
  select it → "Run workflow") **on `main`**. Never commit to `main` directly.
- **`development`** — integration branch. All new work lands here first.
  Multiple features can sit on `development` together and get sanity-checked
  (does it build, does it hang together with other in-flight work) before
  any of it goes near production.
- **`feature/<short-name>`** — one branch per change, branched off
  `development`, PR'd back into `development`. Delete it once merged.

## Day to day

```
development ← feature/add-x        (PR, review, merge)
development ← feature/fix-y        (PR, review, merge)
   │
   └── when development is in a good, deployable state:
       development → main          (PR, review, merge)
                                    → run the deploy workflow on main
```

1. `git checkout development && git pull`
2. `git checkout -b feature/whatever-you're-doing`
3. Commit, push, open a PR **into `development`**.
4. Once enough work has landed on `development` and you're ready to ship,
   open a PR **`development` → `main`**, review it, merge.
5. GitHub → Actions → "Deploy VeerSetu Khandesh" → Run workflow → branch
   `main`. (The workflow itself refuses to run on anything but `main`, as a
   safety net if it's ever triggered on the wrong branch by mistake.)

## Hotfixes

For something urgent that can't wait for `development` to be ready: branch
off `main` (e.g. `hotfix/whatever`), PR straight into `main`, deploy, then
also merge the same fix into `development` so it isn't lost on the next
promotion.

## If you later add a staging server

If a second environment shows up, point a second job/workflow at
`development` (deploying to that server, own DB, own uploads folder) so
`development` becomes an actual tested environment rather than just a
merge point — nothing here needs to change for `main`/production.

## Recommended GitHub settings

These aren't enforceable from the CLI — set them in the repo's
**Settings → Branches**:

- Protect `main`: require a pull request before merging, no direct pushes.
- Protect `development`: require a pull request before merging.
