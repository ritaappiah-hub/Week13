/* Adaptive CRM QA Workbench
 * A small, transparent Bayesian preference learner.
 * All preference data remains in the user's browser.
 */
"use strict";

const STORAGE_KEY = "adaptive-crm-qa-profile-v1";
const MODES = ["compact", "visual", "detailed"];
const DEFAULT_COUNTS = { compact: 1, visual: 1, detailed: 1 };

const MODE_COPY = {
  compact: {
    heading: "Compact overview",
    summary: "A concise view that keeps the most important quality signals in focus.",
    recommendationTitle: "Review release readiness",
    recommendationText: "Start with the key quality indicators, then inspect the three high-priority defects before the next release.",
    action: "Open suggested review"
  },
  visual: {
    heading: "Visual analysis",
    summary: "Charts and trends are emphasized to help you spot changes in test performance quickly.",
    recommendationTitle: "Inspect the execution trend",
    recommendationText: "Compare recent pass rates and look for changes that may indicate a regression or unstable workflow.",
    action: "Review test trend"
  },
  detailed: {
    heading: "Detailed investigation",
    summary: "Expanded test context and defect information are available for deeper technical investigation.",
    recommendationTitle: "Investigate the failed workflow",
    recommendationText: "Review the Dynamics 365 opportunity stage assertion and compare the expected result with the recorded test outcome.",
    action: "Open defect details"
  }
};

function cloneDefaults() {
  return { ...DEFAULT_COUNTS };
}

function loadCounts() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!saved || !saved.counts) return cloneDefaults();
    const counts = {};
    for (const mode of MODES) {
      const value = Number(saved.counts[mode]);
      counts[mode] = Number.isFinite(value) && value >= 1 ? value : 1;
    }
    return counts;
  } catch (error) {
    return cloneDefaults();
  }
}

function saveCounts(counts) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      counts,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    // The interface remains usable if browser storage is unavailable.
  }
}

function posteriorFor(mode, counts) {
  const total = MODES.reduce((sum, key) => sum + counts[key], 0);
  return total > 0 ? counts[mode] / total : 1 / MODES.length;
}

function chooseMode(counts, tieBreakMode) {
  const highest = Math.max(...MODES.map(mode => counts[mode]));
  const candidates = MODES.filter(mode => counts[mode] === highest);
  return candidates.includes(tieBreakMode) ? tieBreakMode : candidates[0];
}

let preferenceCounts = loadCounts();
let activeMode = chooseMode(preferenceCounts, "compact");

const modeHeading = document.getElementById("modeHeading");
const modeSummary = document.getElementById("modeSummary");
const confidenceText = document.getElementById("confidenceText");
const confidenceBar = document.getElementById("confidenceBar");
const learningStatus = document.getElementById("learningStatus");
const recommendationTitle = document.getElementById("recommendationTitle");
const recommendationText = document.getElementById("recommendationText");
const actionButton = document.getElementById("actionButton");
const actionFeedback = document.getElementById("actionFeedback");

function renderAdaptiveInterface(statusMessage) {
  const copy = MODE_COPY[activeMode];
  document.body.dataset.mode = activeMode;
  modeHeading.textContent = copy.heading;
  modeSummary.textContent = copy.summary;
  recommendationTitle.textContent = copy.recommendationTitle;
  recommendationText.textContent = copy.recommendationText;
  actionButton.textContent = copy.action;

  const confidence = Math.round(posteriorFor(activeMode, preferenceCounts) * 100);
  confidenceText.textContent = `${confidence}%`;
  confidenceBar.style.width = `${confidence}%`;
  learningStatus.textContent = statusMessage ||
    "Preference estimates are calculated locally from your feedback.";

  document.querySelectorAll("[data-preference]").forEach(button => {
    const selected = button.dataset.preference === activeMode;
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.classList.toggle("selected", selected);
  });
}

function learnFromFeedback(mode) {
  if (!MODES.includes(mode)) return;
  preferenceCounts[mode] += 1;
  activeMode = chooseMode(preferenceCounts, mode);
  saveCounts(preferenceCounts);
  const confidence = Math.round(posteriorFor(activeMode, preferenceCounts) * 100);
  renderAdaptiveInterface(
    `Your ${mode} preference was recorded. The workspace is now in ${activeMode} mode (${confidence}% preference estimate).`
  );
}

document.querySelectorAll("[data-preference]").forEach(button => {
  button.addEventListener("click", () => learnFromFeedback(button.dataset.preference));
});

document.getElementById("resetProfile").addEventListener("click", () => {
  preferenceCounts = cloneDefaults();
  activeMode = "compact";
  saveCounts(preferenceCounts);
  renderAdaptiveInterface("Preference history reset. The interface has returned to its neutral compact view.");
});

actionButton.addEventListener("click", () => {
  const actionMessages = {
    compact: "Demo action: release-readiness summary selected. Review the high-priority defect count before release.",
    visual: "Demo action: trend review selected. Compare the five sample execution results for possible regressions.",
    detailed: "Demo action: detailed defect review selected. Inspect the sample failed workflow and its assertion context."
  };
  actionFeedback.textContent = actionMessages[activeMode];
});

renderAdaptiveInterface();
