# Motivational Speaker React Test Site

A 5-page React + Vite website for local analytics and inquiry testing.

## Pages

- `/` Home
- `/about` About
- `/programs` Programs
- `/events` Events
- `/contact` Contact form

## Setup

```powershell
npm install
npm run build
npm run preview
```

Open:

```txt
http://localhost:62927
```

## Environment

Create `.env` from `.env.example` and update your tracking ID:

```env
VITE_NSI_ANALYTICS_ID=NSI_LNAF4X28TN
VITE_NSI_TRACKER_URL=http://localhost:4173/nsi-analytics.js
VITE_NSI_INQUIRY_API_URL=http://localhost:4000/api/inquiries/submit
```

The contact form:

- has `data-nsi-form="true"`
- sends JSON to `/api/inquiries/submit`
- fires `window.nsi.track('form_submit', ...)` without PII
