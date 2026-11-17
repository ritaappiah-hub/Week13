# Functional Test Plan

## Purpose
Check that the adaptive CRM QA dashboard responds to preference feedback, persists the profile, and remains usable at different viewport sizes.

## Manual checks
1. **Initial state:** Clear the browser's local storage for this page and reload. Confirm that the interface starts in compact mode and the learned preference estimate is neutral.
2. **Visual preference:** Select "Prefer visual". Confirm that visual mode becomes active, the trend chart is visible and emphasized, and the confidence estimate changes.
3. **Detailed preference:** Select "Prefer detailed". Confirm that the table's detail column and defect descriptions are visible.
4. **Compact preference:** Select "Prefer compact". Confirm that secondary details are hidden and only the first three test rows remain visible.
5. **Persistence:** Refresh the browser after learning a preference. Confirm that the mode and preference estimate are restored.
6. **Reset:** Select "Reset learning". Confirm that the model returns to its neutral prior and compact mode.
7. **Action feedback:** Select the suggested action button in each mode. Confirm that the status text changes to match the current mode.
8. **Responsive behavior:** Resize to a narrow mobile viewport. Confirm that the sidebar navigation becomes horizontal and the content stacks vertically.

## Scope limitation
These are manual functional checks for the educational prototype. They do not constitute a formal usability study, security assessment, accessibility audit, or validation against a live CRM environment.
