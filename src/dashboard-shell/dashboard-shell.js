const stateClassMap = {
  live: "state-live",
  warning: "state-warning",
  critical: "state-critical",
  stale: "state-stale",
  locked: "state-locked",
};

const stateLogCopy = {
  live: "Shared situational panel set to LIVE.",
  warning: "Shared situational panel moved to WARNING review state.",
  critical: "Shared situational panel marked CRITICAL.",
  stale: "Shared situational panel marked STANDBY / STALE.",
  locked: "Shared situational panel locked for override review.",
};

const modeConfigs = {
  target: {
    modeReadout: "TARGET ACQUISITION",
    slotAName: "FO / PRIMARY ACTIVE",
    slotBName: "FDC / SECONDARY ACTIVE",
    sharedLoad: "STABLE",
    slotAState: ["PRIMARY ACTIVE", "state-live"],
    slotARole: "USER SELECTED DEFAULT",
    slotATitle: "Forward Observer workspace",
    slotACopy: "Observation, target acquisition, correction flow, and target confirmation remain primary in the default overview.",
    slotAReason: "PRIMARY ACTIVE / TARGET WORKFLOW",
    slotARulers: ["OBSERVE", "TARGET", "HANDOFF"],
    slotBState: ["SECONDARY ACTIVE", "state-stale"],
    slotBRole: "DECISION CORE / VISIBLE",
    slotBTitle: "FDC workspace",
    slotBCopy: "Decision core receives confirmed target context without leaving the shared overview.",
    stageState: ["STAGED", "state-warning"],
    stageTitle: "Surveillance staged",
    stageCopy: "Spatial validation workspace remains ready to promote when target truth becomes the bottleneck.",
    placements: { fo: "PRIMARY ACTIVE", fdc: "SECONDARY ACTIVE", surv: "STAGED", how: "ON CALL", ammo: "ON CALL" },
    situational: "OBSERVER / TARGET / IMPACT CONTEXT",
    status: ["ACTIVE FLAGS", "03", "CRITICAL", "01"],
    workflow: [
      ["FDC intake ready", "Decision core receives confirmed target context without leaving the shared overview."],
      ["Shared workflow continuity", "Target and fire workflow remain visible in the same shell without page break."],
      ["Staged domain waiting", "Surveillance remains next in line if spatial validation becomes the bottleneck."],
    ],
    telemetryState: ["SUPPORT", "state-stale"],
    telemetryCopy: "Readouts stay shared and change emphasis by mode rather than moving into one domain only.",
    metrics: [["RANGE", "-- m"], ["DIR", "-- mil"], ["TOF", "-- s"]],
    eventHeaders: ["TARGET WORKFLOW / DESC", "OVERRIDE GATE / PASSIVE"],
    classes: { a: "is-promoted", b: "", status: "", workflow: "" },
  },
  spatial: {
    modeReadout: "SPATIAL VALIDATION",
    slotAName: "SURVEILLANCE / PRIMARY ACTIVE",
    slotBName: "FO / SECONDARY ACTIVE",
    sharedLoad: "VALIDATION HEAVY",
    slotAState: ["PROMOTED", "state-warning"],
    slotARole: "PROMOTED BY VALIDATION",
    slotATitle: "Surveillance workspace",
    slotACopy: "Spatial truth, traverse, intersection, calibration, and closure checks become primary until coordinate confidence is restored.",
    slotAReason: "PROMOTED BY SPATIAL VALIDATION",
    slotARulers: ["GRID", "GEOMETRY", "VALIDATE"],
    slotBState: ["SECONDARY ACTIVE", "state-stale"],
    slotBRole: "FO / TARGET CONTEXT",
    slotBTitle: "Forward Observer workspace",
    slotBCopy: "FO remains visible while spatial validation resolves target truth and coordinate integrity.",
    stageState: ["STAGED", "state-stale"],
    stageTitle: "FDC staged",
    stageCopy: "Decision core waits behind validation until spatial confidence is high enough to continue.",
    placements: { fo: "SECONDARY ACTIVE", fdc: "STAGED", surv: "PRIMARY ACTIVE", how: "ON CALL", ammo: "ON CALL" },
    situational: "GRID / INTERSECTION / CLOSURE CONTEXT",
    status: ["VALIDATION WARN", "02", "CLOSURE", "REVIEW"],
    workflow: [
      ["Spatial truth first", "Survey and positioning workspace owns the bottleneck until target coordinates are trustworthy."],
      ["FO remains paired", "Observation context stays visible while grid and geometry are corrected."],
      ["FDC waits on validation", "Decision core stays staged until spatial confidence is restored."],
    ],
    telemetryState: ["EMPHASIZED", "state-warning"],
    telemetryCopy: "Shared readouts now prioritize azimuth, distance, elevation, and intersection-related values.",
    metrics: [["AZ", "-- mil"], ["DIST", "-- m"], ["ELEV", "-- m"]],
    eventHeaders: ["SPATIAL VALIDATION / DESC", "RECOMMENDED / REVIEW"],
    classes: { a: "is-advisory", b: "", status: "", workflow: "is-advisory" },
  },
  readiness: {
    modeReadout: "GUN READINESS",
    slotAName: "FDC / PRIMARY ACTIVE",
    slotBName: "HOWITZER / SECONDARY ACTIVE",
    sharedLoad: "SECTION READY CHECK",
    slotAState: ["PRIMARY ACTIVE", "state-live"],
    slotARole: "DECISION CORE / PRIMARY",
    slotATitle: "FDC workspace",
    slotACopy: "Fire solution stays primary while section readiness and per-gun geometry become the blocking concern.",
    slotAReason: "PRIMARY ACTIVE / FIRE SOLUTION",
    slotARulers: ["DECIDE", "CHECK", "EXECUTE"],
    slotBState: ["PROMOTED", "state-warning"],
    slotBRole: "PROMOTED BY READINESS",
    slotBTitle: "Howitzer workspace",
    slotBCopy: "Gun layout, M.17, offsets, and section readiness are elevated because execution readiness is now the bottleneck.",
    stageState: ["STAGED", "state-stale"],
    stageTitle: "FO staged",
    stageCopy: "Target acquisition stays available but no longer owns the active bottleneck in this mode.",
    placements: { fo: "STAGED", fdc: "PRIMARY ACTIVE", surv: "ON CALL", how: "SECONDARY ACTIVE", ammo: "ON CALL" },
    situational: "GUN POSITIONS / REFERENCE GUN / TARGET RELATION",
    status: ["SECTION FLAGS", "04", "READINESS", "CHECK"],
    workflow: [
      ["Decision remains central", "FDC stays visible while execution readiness is resolved inside the section domain."],
      ["Howitzer elevated", "Per-gun geometry and readiness are now the secondary active workspace."],
      ["FO staged", "Observation context remains available without taking full workspace priority."],
    ],
    telemetryState: ["EMPHASIZED", "state-warning"],
    telemetryCopy: "Shared readouts shift toward per-gun offsets, reference geometry, and readiness values.",
    metrics: [["GUN REF", "G1"], ["OFFSET", "-- m"], ["READY", "CHECK"]],
    eventHeaders: ["GUN READINESS / DESC", "SECTION GATE / REVIEW"],
    classes: { a: "", b: "is-advisory", status: "", workflow: "is-advisory" },
  },
  ammo: {
    modeReadout: "AMMO SAFETY",
    slotAName: "FDC / PRIMARY ACTIVE",
    slotBName: "กระสุน / SECONDARY ACTIVE",
    sharedLoad: "SAFETY LOCK",
    slotAState: ["BLOCKED", "state-critical"],
    slotARole: "DECISION CORE / BLOCKED",
    slotATitle: "FDC workspace",
    slotACopy: "Decision core remains visible, but fire workflow is blocked until ammo and fuze safety conditions are cleared.",
    slotAReason: "AUTO-ELEVATED BY SAFETY LOCK",
    slotARulers: ["LOCK", "CHECK", "RELEASE"],
    slotBState: ["PROMOTED", "state-critical"],
    slotBRole: "PROMOTED BY AMMO SAFETY",
    slotBTitle: "กระสุน workspace",
    slotBCopy: "Ammo, fuze, compatibility, and misfire status are elevated because fire enablement is blocked at the safety layer.",
    stageState: ["ON CALL", "state-stale"],
    stageTitle: "Howitzer on call",
    stageCopy: "Section readiness remains visible through shared status, but ammo safety owns the current bottleneck.",
    placements: { fo: "ON CALL", fdc: "PRIMARY BLOCKED", surv: "ON CALL", how: "ON CALL", ammo: "SECONDARY ACTIVE" },
    situational: "TARGET / MISSION CONTEXT FOR AMMO DECISION",
    status: ["FIRE LOCKED", "01", "SAFETY", "CRITICAL"],
    workflow: [
      ["Safety lock active", "Fire workflow cannot continue until ammo and fuze conditions are made valid."],
      ["กระสุน elevated", "Compatibility, fuze time, and safety state are now the secondary active workspace."],
      ["FDC remains visible", "Decision core stays present so the user sees why fire execution is blocked."],
    ],
    telemetryState: ["BLOCKING", "state-critical"],
    telemetryCopy: "Shared readouts now prioritize fuze, safety, compatibility, and lock-related technical values.",
    metrics: [["FUZE", "--"], ["SAFE", "LOCK"], ["MISFIRE", "CHECK"]],
    eventHeaders: ["AMMO SAFETY / DESC", "AUTO-ELEVATED / BLOCKING"],
    classes: { a: "is-blocking", b: "is-blocking", status: "is-blocking", workflow: "is-blocking" },
  },
};

function updateClock() {
  const node = document.getElementById("clock-readout");
  if (!node) return;

  const now = new Date();
  node.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
}

function appendLog(message) {
  const eventLog = document.getElementById("event-log");
  if (!eventLog) return;

  const row = document.createElement("div");
  row.className = "event-row";

  const stamp = document.createElement("span");
  stamp.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });

  const copy = document.createElement("p");
  copy.textContent = message;

  const tag = document.createElement("em");
  tag.textContent = "MODE";

  row.append(stamp, copy, tag);
  eventLog.prepend(row);
}

function setChip(node, text, stateClass) {
  if (!node) return;
  Object.values(stateClassMap).forEach((className) => node.classList.remove(className));
  if (stateClass) node.classList.add(stateClass);
  node.textContent = text;
}

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

function setMode(modeKey) {
  const config = modeConfigs[modeKey];
  if (!config) return;

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === modeKey);
  });

  setText("mode-readout", config.modeReadout);
  setText("slot-a-name", config.slotAName);
  setText("slot-b-name", config.slotBName);
  setText("shared-load", config.sharedLoad);
  setChip(document.getElementById("slot-a-state"), config.slotAState[0], config.slotAState[1]);
  setText("slot-a-role", config.slotARole);
  setText("slot-a-title", config.slotATitle);
  setText("slot-a-copy", config.slotACopy);
  setText("slot-a-reason", config.slotAReason);
  setText("slot-a-ruler-1", config.slotARulers[0]);
  setText("slot-a-ruler-2", config.slotARulers[1]);
  setText("slot-a-ruler-3", config.slotARulers[2]);

  setChip(document.getElementById("slot-b-state"), config.slotBState[0], config.slotBState[1]);
  setText("slot-b-role", config.slotBRole);
  setText("slot-b-title", config.slotBTitle);
  setText("slot-b-copy", config.slotBCopy);

  setChip(document.getElementById("stage-state"), config.stageState[0], config.stageState[1]);
  setText("stage-title", config.stageTitle);
  setText("stage-copy", config.stageCopy);

  setText("placement-fo", config.placements.fo);
  setText("placement-fdc", config.placements.fdc);
  setText("placement-surv", config.placements.surv);
  setText("placement-how", config.placements.how);
  setText("placement-ammo", config.placements.ammo);

  setText("situational-emphasis", config.situational);
  setText("status-band-label-1", config.status[0]);
  setText("status-band-value-1", config.status[1]);
  setText("status-band-label-2", config.status[2]);
  setText("status-band-value-2", config.status[3]);

  setText("wf-title-1", config.workflow[0][0]);
  setText("wf-copy-1", config.workflow[0][1]);
  setText("wf-title-2", config.workflow[1][0]);
  setText("wf-copy-2", config.workflow[1][1]);
  setText("wf-title-3", config.workflow[2][0]);
  setText("wf-copy-3", config.workflow[2][1]);

  setChip(document.getElementById("telemetry-state"), config.telemetryState[0], config.telemetryState[1]);
  setText("telemetry-copy", config.telemetryCopy);
  setText("metric-label-1", config.metrics[0][0]);
  setText("metric-value-1", config.metrics[0][1]);
  setText("metric-label-2", config.metrics[1][0]);
  setText("metric-value-2", config.metrics[1][1]);
  setText("metric-label-3", config.metrics[2][0]);
  setText("metric-value-3", config.metrics[2][1]);

  setText("event-header-left", config.eventHeaders[0]);
  setText("event-header-right", config.eventHeaders[1]);

  const slotACard = document.getElementById("slot-a-card");
  const slotBCard = document.getElementById("slot-b-card");
  const workflowPanel = document.querySelector(".workflow-panel");
  const statusPanel = document.querySelector(".status-stack");

  [slotACard, slotBCard, workflowPanel, statusPanel].forEach((node) => {
    if (!node) return;
    node.classList.remove("is-promoted", "is-advisory", "is-blocking");
  });

  if (config.classes.a && slotACard) slotACard.classList.add(config.classes.a);
  if (config.classes.b && slotBCard) slotBCard.classList.add(config.classes.b);
  if (config.classes.workflow && workflowPanel) workflowPanel.classList.add(config.classes.workflow);
  if (config.classes.status && statusPanel) statusPanel.classList.add(config.classes.status);

  appendLog(`Mode changed to ${config.modeReadout}.`);
}

function setState(node, nextState) {
  if (!node || !stateClassMap[nextState]) return;

  Object.values(stateClassMap).forEach((className) => node.classList.remove(className));
  node.classList.add(stateClassMap[nextState]);
  node.textContent = nextState.toUpperCase();
  node.dataset.state = nextState;

  appendLog(stateLogCopy[nextState] || `State changed to ${nextState}.`);
}

function wireStateActions() {
  const buttons = document.querySelectorAll("[data-state-target]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-state-target");
      const nextState = button.getAttribute("data-next-state");
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target || !nextState) return;
      setState(target, nextState);
    });
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-mode");
      if (!mode) return;
      setMode(mode);
    });
  });
}

function boot() {
  updateClock();
  wireStateActions();
  setMode("target");
  window.setInterval(updateClock, 1000);
}

boot();
