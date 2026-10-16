# CampusVote — Campus Online Voting Prototype

A responsive student-election interface built with plain HTML, CSS, and JavaScript. This first milestone is a **front-end prototype only**.

## Features
- Student dashboard and election overview
- Candidate directory with position filter
- Ballot selection for four sample positions
- Review-before-confirmation dialog
- Demo confirmation screen
- Illustrative results dashboard
- Responsive layout and keyboard-accessible candidate selection

## Run locally
1. Download and extract the project.
2. Open `index.html` in a modern browser.
3. For a local development server, open the folder in VS Code and use the Live Server extension.

No build step or package installation is required.

## Project structure
```text
campusvote-prototype/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Important security note
This prototype does **not** authenticate students, persist ballots, or conduct a real election. The sample candidates, election status, and result percentages are fictional. Client-side JavaScript can be modified by users and must never be trusted to enforce voting rules.

Before connecting a real election:
- Use Supabase Auth and a verified student eligibility process.
- Enable Row Level Security on every exposed table.
- Never put a Supabase service-role key in browser code.
- Do not let a browser directly insert arbitrary ballot rows.
- Use a database transaction or carefully designed PostgreSQL function to validate eligibility and record a ballot atomically.
- Enforce one submission per eligible voter per election using database constraints and appropriate locking/transaction logic.
- Separate voter eligibility/participation records from ballot choices to reduce the ability to link a person to their selections.
- Restrict results access until publication is authorized.
- Keep audit logs for administrative actions, without recording ballot choices alongside identifying details.
- Test authorization, repeat submissions, concurrent requests, and attempts to access another student's records.
- Obtain university approval and independent security review before any live election.

## Suggested next milestones
1. Supabase project and schema
2. Authentication and verified student eligibility
3. Secure ballot submission
4. Admin dashboard and result publication
5. Automated tests, deployment, screenshots, and portfolio documentation
