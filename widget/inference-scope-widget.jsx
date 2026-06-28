const colors = {
  ok: '#5cff9a',
  warn: '#ffd15c',
  high: '#ff6f6f',
  unknown: '#89a7c4',
};

const valueOrDash = (value) => {
  if (value === undefined || value === null || value === '') return '—';
  return String(value);
};

const Metric = ({ label, value }) => (
  <div className="metric">
    <div className="metricLabel">{label}</div>
    <div className="metricValue">{valueOrDash(value)}</div>
  </div>
);

const KV = ({ label, value }) => (
  <div className="kv">
    <div className="k">{label}</div>
    <div className="v">{valueOrDash(value)}</div>
  </div>
);

const RuntimeCard = ({ rt }) => (
  <div className="runtimeCard">
    <div className="runtimeHead">
      <div className="runtimeTitle">
        {valueOrDash(rt.compactName || rt.modelName || 'Unknown runtime')}
      </div>
      <div className="runtimeTag">{valueOrDash(rt.runtime || 'unknown')}</div>
    </div>
    <div className="grid2">
      <KV label="PID" value={rt.pid} />
      <KV label="RSS" value={rt.rssGb ? `${rt.rssGb}G` : '0.0G'} />
      <KV label="CPU" value={rt.cpuPercent ? `${rt.cpuPercent}%` : '0%'} />
      <KV label="Ports" value={rt.listeningPorts || rt.port} />
      <KV label="Context" value={rt.context} />
      <KV label="GPU layers" value={rt.gpuLayers} />
      <KV label="Flash" value={rt.flashAttention} />
      <KV label="Host" value={rt.hostBind || '127.0.0.1'} />
    </div>
    {rt.ollamaLoadedModels ? <div className="path">Loaded: {rt.ollamaLoadedModels}</div> : null}
    {rt.modelPath && rt.modelPath !== 'unknown' ? <div className="path">{rt.modelPath}</div> : null}
  </div>
);

export const command = '~/.local/bin/llm-runtime-monitor-feed';

export const refreshFrequency = 5000;

export const className = `
  top: 24px;
  right: 24px;
  width: 420px;
  color: #e8f3ff;
  font-family: SF Mono, IBM Plex Mono, Menlo, monospace;
  user-select: none;
  pointer-events: none;
  z-index: 9999;

  .frame {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(120,196,255,0.24);
    background:
      linear-gradient(180deg, rgba(12,18,28,0.78), rgba(8,12,20,0.72)),
      radial-gradient(circle at top right, rgba(86,190,255,0.12), transparent 36%);
    box-shadow: 0 18px 48px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.04);
  }

  .gridGlow {
    position: absolute;
    inset: 0;
    opacity: 0.18;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100% 22px, 22px 100%;
  }

  .inner {
    position: relative;
    padding: 18px 18px 16px;
  }

  .eyebrow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(183,219,255,0.62);
    margin-bottom: 10px;
  }

  .titleRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .title {
    font-size: 18px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 8px;
    max-width: 300px;
  }

  .dotWrap {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(120,196,255,0.18);
    background: rgba(9,16,25,0.42);
    font-size: 12px;
    color: #cce8ff;
  }

  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin: 14px 0 16px;
  }

  .metric {
    background: rgba(13,20,31,0.58);
    border: 1px solid rgba(120,196,255,0.14);
    border-radius: 12px;
    padding: 10px 10px 9px;
    min-width: 0;
  }

  .metricLabel {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(183,219,255,0.58);
    margin-bottom: 6px;
  }

  .metricValue {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .section {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(120,196,255,0.12);
  }

  .sectionTitle {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(183,219,255,0.62);
    margin-bottom: 10px;
  }

  .grid2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
  }

  .kv {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 12px;
  }

  .k {
    color: rgba(183,219,255,0.58);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 10px;
  }

  .v {
    color: #f3f8ff;
    text-align: right;
    word-break: break-word;
  }

  .path {
    margin-top: 10px;
    font-size: 11px;
    line-height: 1.45;
    color: rgba(206,227,248,0.76);
    word-break: break-all;
  }

  .footer {
    margin-top: 12px;
    font-size: 10px;
    color: rgba(183,219,255,0.46);
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .idleFrame {
    width: 300px;
  }

  .idleInner {
    padding: 14px 14px 12px;
  }

  .idleTitle {
    font-size: 15px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .idleMeta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .idleChip {
    padding: 5px 8px;
    border-radius: 999px;
    border: 1px solid rgba(120,196,255,0.14);
    background: rgba(13,20,31,0.42);
    font-size: 11px;
    color: rgba(220,236,255,0.9);
  }

  .runtimeCard {
    margin-top: 12px;
    border: 1px solid rgba(120,196,255,0.12);
    background: rgba(11,18,28,0.46);
    border-radius: 14px;
    padding: 12px;
  }

  .runtimeHead {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 8px;
  }

  .runtimeTitle {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .runtimeTag {
    font-size: 11px;
    color: rgba(183,219,255,0.58);
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .errorCard {
    background: rgba(9,14,22,0.82);
    border: 1px solid rgba(120,196,255,0.28);
    border-radius: 18px;
    box-shadow: 0 18px 48px rgba(0,0,0,0.32);
    padding: 18px;
  }

  .errorTitle {
    font-size: 22px;
    font-weight: 700;
  }

  .errorBody {
    margin-top: 10px;
    color: #ff9b9b;
  }

  .errorDetail {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.4;
    word-break: break-word;
  }
`;

export const render = ({ output }) => {
  let data;
  try {
    data = JSON.parse(output || '{}');
  } catch (err) {
    return (
      <div className="errorCard">
        <div className="errorTitle">Inference Scope</div>
        <div className="errorBody">Widget parse error</div>
        <div className="errorDetail">{String(err)}</div>
      </div>
    );
  }

  const host = data.host || {};
  const runtimes = data.runtimes || [];
  const primary = runtimes[0] || null;
  const summary = data.summary || {};
  const freeStateKey = host.memoryFreeStateShort || 'unknown';
  const statusColor = colors[freeStateKey] || colors.unknown;
  const freeStateLabel = host.memoryFreeState || 'unknown';
  const freePercentLabel =
    host.memoryFreePercent && host.memoryFreePercent !== 'unknown'
      ? `${host.memoryFreePercent}%`
      : '—';
  const isIdle = !primary;

  if (isIdle) {
    return (
      <div className="frame idleFrame">
        <div className="gridGlow" />
        <div className="inner idleInner">
          <div className="eyebrow">
            <span>Inference Scope</span>
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="titleRow">
            <div className="idleTitle">No active runtime</div>
            <div className="dotWrap">
              <span
                className="dot"
                style={{
                  background: statusColor,
                  boxShadow: `0 0 14px ${statusColor}`,
                }}
              />
              {freeStateLabel}
            </div>
          </div>

          <div className="idleMeta">
            <div className="idleChip">Used {host.memoryUsedGb ? `${host.memoryUsedGb}G` : '—'}</div>
            <div className="idleChip">Free {host.freeApproxGb ? `${host.freeApproxGb}G` : '—'}</div>
            <div className="idleChip">Free % {freePercentLabel}</div>
            <div className="idleChip">Swap {valueOrDash(host.swapUsed)}</div>
          </div>

          <div className="footer">{valueOrDash(summary.title || 'idle')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="frame">
      <div className="gridGlow" />
      <div className="inner">
        <div className="eyebrow">
          <span>Inference Scope</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="titleRow">
          <div className="title">{valueOrDash(primary ? primary.compactName : 'No active runtime')}</div>
          <div className="dotWrap">
            <span
              className="dot"
              style={{
                background: statusColor,
                boxShadow: `0 0 14px ${statusColor}`,
              }}
            />
            {freeStateLabel}
          </div>
        </div>

        <div className="metrics">
          <Metric label="Model RAM" value={primary ? `${primary.rssGb}G` : '—'} />
          <Metric label="Swap" value={host.swapUsed} />
          <Metric label="Free State" value={freeStateLabel} />
          <Metric label="Free %" value={freePercentLabel} />
          <Metric label="Comp" value={host.compressedGb ? `${host.compressedGb}G` : '—'} />
        </div>

        {primary ? (
          <div className="section">
            <div className="sectionTitle">Active Runtime</div>
            <div className="grid2">
              <KV label="Runtime" value={primary.runtime} />
              <KV label="Ports" value={primary.listeningPorts || primary.port} />
              <KV label="Context" value={primary.context} />
              <KV label="GPU layers" value={primary.gpuLayers} />
              <KV label="Flash" value={primary.flashAttention} />
              <KV label="CPU" value={primary.cpuPercent ? `${primary.cpuPercent}%` : '0%'} />
            </div>
            {primary.modelPath && primary.modelPath !== 'unknown' ? (
              <div className="path">{primary.modelPath}</div>
            ) : null}
          </div>
        ) : null}

        <div className="section">
          <div className="sectionTitle">Host</div>
          <div className="grid2">
            <KV label="Memory used" value={host.memoryUsedGb ? `${host.memoryUsedGb}G` : '—'} />
            <KV label="Compressed" value={host.compressedGb ? `${host.compressedGb}G` : '—'} />
            <KV label="Free approx" value={host.freeApproxGb ? `${host.freeApproxGb}G` : '—'} />
            <KV label="Wired" value={host.wiredGb ? `${host.wiredGb}G` : '—'} />
            <KV label="Free state" value={freeStateLabel} />
            <KV label="Free percent" value={freePercentLabel} />
          </div>
        </div>

        {runtimes.length > 1 ? (
          <div className="section">
            <div className="sectionTitle">Additional Runtimes</div>
            {runtimes.slice(1).map((rt) => (
              <RuntimeCard key={`${rt.pid}-${rt.runtime}`} rt={rt} />
            ))}
          </div>
        ) : null}

        <div className="footer">{valueOrDash(summary.title || 'idle')}</div>
      </div>
    </div>
  );
};
