# VeerSetu Khandesh 🇮🇳

**"Setu" (सेतु) means bridge.** This project is a bridge between the families of
soldiers who were **martyred while serving in the Indian Armed Forces**, from the
**Khandesh region** of Maharashtra — **Dhule, Jalgaon, Nandurbar and Nashik** — and
citizens who want to support them, financially or otherwise.

The design is deliberately built to read as a **military platform at a glance**:
an olive-drab / khaki-canvas / brass-insignia palette, condensed "parade
signage" headline type (Oswald) paired with Inter for body text, a rank-stripe
chevron band under the header, and soldier profiles shown as **dog-tag shaped
cards**.

## What it does

- Maintains a **verified, district-and-village-wise record** of martyred soldiers
  from Khandesh: name, age, village, force, battalion, unit, rank, designation,
  service number, posting, martyrdom date & place, and their story.
- Two account types:
  - **Family login** — a soldier's relative registers an account and submits the
    soldier's details for review.
  - **Admin login** — reviews every submission (approve / reject with a reason),
    and can also add records directly (auto-published).
  - **No submission goes public until an admin approves it.**
- **Public, no-login browsing**: an interactive Leaflet map of the four Khandesh
  districts — click a district, then a village, to see soldiers recorded there.
- Every published profile shows the family's **UPI QR code** for direct financial
  support, plus a phone number and email for any other kind of help (jobs,
  education sponsorship, legal aid, etc.). The platform is a **directory, not a
  payment processor** — it never touches the money.
- Home and About pages explain the motive and the services on offer.

## Architecture

This is now a **decoupled** application:

- **Backend** (`/`): Spring Boot 3, exposed purely as a **JSON REST API** under
  `/api/**`. No server-rendered pages.
- **Frontend** (`/frontend`): a **React** single-page app (Vite), talking to the
  backend over `fetch` with the session cookie, styled with a hand-built CSS
  design system (no UI framework) for a distinct, non-generic look.

```
veersetu-khandesh/
├── src/main/java/com/veersetu/khandesh/
│   ├── config/       SecurityConfig (JSON auth + CORS), WebConfig, DataSeeder
│   ├── entity/        User, Soldier, Role, ApprovalStatus, District
│   ├── repository/    UserRepository, SoldierRepository
│   ├── service/        UserService, SoldierService, FileStorageService, QrCodeService
│   ├── controller/     PublicApiController, AuthApiController,
│   │                    FamilyApiController, AdminApiController
│   └── dto/             RegisterDto, SoldierFormDto, SoldierResponse, UserResponse
├── src/main/resources/application.properties
├── database/schema.sql   Reference schema (Hibernate creates this automatically too)
└── frontend/
    ├── src/
    │   ├── api/client.js        fetch wrapper (login/logout/CRUD helpers)
    │   ├── context/AuthContext.jsx
    │   ├── components/          Header, Footer, SoldierCard, DistrictMap
    │   ├── pages/                Home, About, MapExplore, SoldierDetail, Login,
    │   │                          RegisterFamily, RegisterSoldierForm,
    │   │                          FamilyDashboard, AdminDashboard, AdminReview
    │   └── styles/theme.css      the military design system (CSS variables)
    └── package.json
```

## REST API summary

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/public/soldiers?district=&village=` | Public | List approved soldiers |
| GET | `/api/public/soldiers/{id}` | Public | Single soldier profile |
| GET | `/api/public/districts` | Public | District list + coordinates + counts |
| GET | `/api/public/stats` | Public | Home page totals |
| POST | `/api/auth/register` | Public | Create a family account (JSON) |
| POST | `/api/auth/login` | Public | Log in (form-urlencoded `email`/`password`) |
| POST | `/api/auth/logout` | Authenticated | Log out |
| GET | `/api/auth/me` | Authenticated | Current session user |
| PUT | `/api/auth/me` | Authenticated | Update your account (name, phone, relation, password) |
| POST | `/api/auth/forgot-password` | Public | Email a password reset link for an account (JSON `{email}`) |
| POST | `/api/auth/reset-password` | Public | Set a new password using a reset token (JSON `{token, newPassword}`) |
| GET | `/api/family/soldiers` | FAMILY | Your own submissions |
| GET | `/api/family/soldiers/{id}` | FAMILY | One of your own submissions, in full (for editing) |
| POST | `/api/family/soldiers` | FAMILY | Submit a soldier (multipart, goes to PENDING) |
| PUT | `/api/family/soldiers/{id}` | FAMILY | Edit your own submission (multipart, goes back to PENDING) |
| GET | `/api/admin/soldiers/pending` | ADMIN | Review queue |
| GET | `/api/admin/soldiers/{id}` | ADMIN | Any record, any status |
| POST | `/api/admin/soldiers/{id}/approve` | ADMIN | Publish a record |
| POST | `/api/admin/soldiers/{id}/reject` | ADMIN | Reject with a reason (JSON `{reason}`) |
| POST | `/api/admin/soldiers` | ADMIN | Add a record directly (multipart, auto-approved) |

## Running it locally

### 1. Backend

1. Create the database (or let the app do it — `createDatabaseIfNotExist=true`
   is already set):
   ```sql
   CREATE DATABASE veersetu_khandesh;
   ```
2. Edit `src/main/resources/application.properties` with your MySQL username/password.
3. Run:
   ```bash
   mvn spring-boot:run
   ```
   The API is now on **http://localhost:8080**.

On first startup, a default admin account is created automatically — check the
console log for the generated credentials (or set `veersetu.admin.email` /
`veersetu.admin.password` in `application.properties` beforehand). **Log in and
change this password before deploying publicly.**

**Forgot password:** no SMTP server is configured by default, so a "forgot
password" request just prints the reset link to the backend console instead
of emailing it — fine for local development. To send real email, set the
`SPRING_MAIL_HOST` / `SPRING_MAIL_PORT` / `SPRING_MAIL_USERNAME` /
`SPRING_MAIL_PASSWORD` environment variables (Spring Boot picks these up
automatically) and set `veersetu.frontend-url` (or the `FRONTEND_URL` env
var) to your deployed frontend's URL, so reset links point at the right place.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```
Visit **http://localhost:5173**. The Vite dev server proxies `/api` and
`/uploads` to `localhost:8080`, so the browser treats everything as same-origin
and the session cookie just works. For production, build with `npm run build`
and serve the `dist/` folder from any static host (or copy it into the Spring
Boot app's `src/main/resources/static` and drop the CORS config), pointing it
at your deployed API's URL.

### Production nginx config (SPA routing)

`deploy/nginx.conf` is the site config used on the deployed server — it
serves the built `frontend/dist` and proxies `/api` and `/uploads` to the
backend on `127.0.0.1:8080`. Its `location /` block uses
`try_files $uri $uri/ /index.html;` so that a hard refresh or a direct link
to a client-side route (e.g. `/map`, `/soldiers/12`) still loads the React
app instead of a raw 404 — without it, only the root URL works and every
other page breaks on refresh. `.github/workflows/deploy.yml` copies this
file to `/etc/nginx/sites-available/veersetu-khandesh` and reloads nginx on
every deploy, so edit it here, not on the server.

## Design system

The frontend intentionally avoids default-looking UI kits. The full token set —
colors, type, spacing, the dog-tag card shape, the chevron rank-stripe band —
lives in `frontend/src/styles/theme.css`. Palette: olive drab (`#4B5320`), khaki
canvas (`#EDE7D6`), brass insignia gold (`#AD8A34`), oxblood for sacrifice/martyrdom
(`#6E1F2A`). Headings use Oswald (condensed, parade-signage feel); body copy uses
Inter.

## Suggested next steps (not included, to keep this a clean starting point)

- Re-enable CSRF protection with a double-submit cookie pattern for the SPA,
  or move to stateless JWT auth if you deploy frontend and backend on
  different domains.
- Add server-side image validation (file type/size) and virus scanning for uploads.
- Add pagination to the admin queue and public map API once record counts grow.
- Add email notifications to families when their submission is approved/rejected.
- Move uploaded files to cloud storage (e.g. S3) instead of local disk for production.
- Add a proper i18n layer for Marathi/Hindi content.

## Project name

**VeerSetu Khandesh** — *veer* (वीर, "the brave") + *setu* (सेतु, "bridge") +
Khandesh, the region the project serves.
# pipeline test
