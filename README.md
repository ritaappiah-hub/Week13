# Adaptive CRM QA Workbench

An educational, browser-based prototype demonstrating an adaptive user interface for a CRM quality-assurance workflow.

## What it demonstrates
- Three runtime display modes: compact, visual, and detailed.
- A lightweight Bayesian preference learner that updates its estimates from explicit user feedback.
- Layout and content changes without a page reload.
- Local persistence using browser `localStorage`.
- A reset control that restores a neutral preference profile.
- Responsive layout for desktop and mobile screens.

## Important scope and limitations
- The prototype is created from scratch for an educational assignment.
- All CRM records and quality metrics are synthetic examples.
- It does not connect to Salesforce, Microsoft Dynamics 365, a production database, or an external AI API.
- The adaptive engine is a transparent, lightweight Bayesian preference model. It is not a generative AI model or a large-scale trained machine-learning service.
- Preference information stays in the current browser through `localStorage`.

## Run the application
1. Download and extract the ZIP archive.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox, or Safari).
3. Select **Prefer visual**, **Prefer detailed**, or **Prefer compact** several times.
4. Observe the mode title, confidence estimate, recommended action, and visible dashboard content.
5. Refresh the page to confirm that the preference profile is retained.
6. Select **Reset learning** to return to the neutral profile.

No package installation or build step is required.

## How the adaptation works
The model begins with a neutral count of one for each mode. When a user selects a preference, the corresponding count increases. The application calculates a simple posterior preference estimate:

`posterior(mode) = count(mode) / sum(all mode counts)`

The mode with the highest estimate becomes active. When the user provides a new preference that ties for the highest estimate, that most recent preference is selected.

## Suggested functional checks
| Test | Action | Expected result |
|---|---|---|
| Initial load | Open `index.html` with no saved profile | Compact mode appears with a neutral preference estimate |
| Visual adaptation | Select **Prefer visual** | Visual mode is selected and the trend chart is emphasized |
| Detailed adaptation | Select **Prefer detailed** | Detailed mode reveals additional table and defect information |
| Compact adaptation | Select **Prefer compact** | Compact mode hides secondary detail and shortens the visible test list |
| Persistence | Refresh after providing feedback | The learned profile and selected mode are retained |
| Reset | Select **Reset learning** | Counts return to the neutral prior and compact mode is displayed |
| Responsive layout | Resize the browser to a narrow screen | Navigation and content reorganize for mobile width |

## Files
- `index.html` — semantic page structure and synthetic CRM QA data.
- `styles.css` — responsive design and the three adaptive layouts.
- `app.js` — preference-learning logic, browser storage, and runtime adaptation.
- `TEST-PLAN.md` — manual functional test checklist.
- `SOURCE-CODE-CITATION.txt` — APA citation template for the repository.

## GitHub submission
Create a GitHub repository named `adaptive-crm-qa-workbench`, upload the contents of this folder, and give your instructor access. Then replace the repository URL placeholder in your report with the actual GitHub URL.

## AI-use disclosure
ChatGPT was used to assist with planning, code drafting, and report preparation. The adaptive preference model itself is implemented in the included JavaScript file. No external generative-AI API is called by the running application.
