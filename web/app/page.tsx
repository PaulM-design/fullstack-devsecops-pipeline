import SafeRequestButton from "./safe-request-button";

const repository = "PaulM-design/fullstack-devsecops-pipeline";
const githubApi = `https://api.github.com/repos/${repository}`;
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Health = { status: string; environment: string };
type WorkflowRun = {
  id: number;
  name: string;
  conclusion: string | null;
  status: string;
  html_url: string;
  head_sha: string;
  created_at: string;
};
type Job = { id: number; name: string; conclusion: string | null; status: string };

async function readJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: url.startsWith(githubApi) ? { Accept: "application/vnd.github+json" } : undefined,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function resultLabel(status: string, conclusion: string | null) {
  if (status !== "completed") return status;
  return conclusion ?? "unknown";
}

function relativeTime(value: string) {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  if (Math.abs(seconds) < 3600) return formatter.format(Math.round(seconds / 60), "minute");
  if (Math.abs(seconds) < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
  return formatter.format(Math.round(seconds / 86400), "day");
}

export default async function Home() {
  const [health, runsResult] = await Promise.all([
    readJson<Health>(`${apiBase}/health`),
    readJson<{ workflow_runs: WorkflowRun[] }>(`${githubApi}/actions/runs?branch=main&per_page=8`),
  ]);
  const runs = runsResult?.workflow_runs ?? [];
  const latestCi = runs.find((run) => run.name === "CI and security");
  const jobsResult = latestCi
    ? await readJson<{ jobs: Job[] }>(`${githubApi}/actions/runs/${latestCi.id}/jobs?per_page=20`)
    : null;
  const jobs = jobsResult?.jobs ?? [];

  return (
    <main>
      <nav>
        <a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer">PIPELINE CONTROL / MAIN</a>
        <span className={`status ${health ? "healthy" : "offline"}`}>● API {health ? "HEALTHY" : "OFFLINE"}</span>
      </nav>

      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">LIVE DEVSECOPS DASHBOARD</p>
          <h1>Proof over<br /><em>promises.</em></h1>
        </div>
        <p className="lede">Live backend telemetry, security gates and deployment activity from the production system.</p>
      </header>

      <section className="metric-grid" aria-label="Backend details">
        <article className="metric accent">
          <span>BACKEND</span><strong>{health?.status.toUpperCase() ?? "UNREACHABLE"}</strong>
          <small>FastAPI production health</small>
        </article>
        <article className="metric">
          <span>ENVIRONMENT</span><strong>{health?.environment.toUpperCase() ?? "UNKNOWN"}</strong>
          <small>Reported by /health</small>
        </article>
        <article className="metric wide">
          <span>SAFE API REQUEST</span>
          <SafeRequestButton />
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-title">
            <div><span>01</span><h2>Security checks</h2></div>
            {latestCi && <a href={latestCi.html_url} target="_blank" rel="noreferrer">VIEW RUN ↗</a>}
          </div>
          {jobs.length ? (
            <ul className="check-list">
              {jobs.map((job) => {
                const result = resultLabel(job.status, job.conclusion);
                return <li key={job.id}><span className={`dot ${result}`} /> <b>{job.name}</b><em>{result}</em></li>;
              })}
            </ul>
          ) : <p className="empty">GitHub check data is temporarily unavailable.</p>}
        </div>

        <div className="panel">
          <div className="panel-title"><div><span>02</span><h2>Deployment history</h2></div></div>
          {runs.length ? (
            <ol className="history-list">
              {runs.slice(0, 6).map((run) => {
                const result = resultLabel(run.status, run.conclusion);
                return (
                  <li key={run.id}>
                    <a href={run.html_url} target="_blank" rel="noreferrer">
                      <span className={`dot ${result}`} />
                      <div><b>{run.name}</b><small>{run.head_sha.slice(0, 7)} · {relativeTime(run.created_at)}</small></div>
                      <em>{result}</em>
                    </a>
                  </li>
                );
              })}
            </ol>
          ) : <p className="empty">GitHub deployment data is temporarily unavailable.</p>}
        </div>
      </section>

      <footer>
        <a href={`https://github.com/${repository}/actions`} target="_blank" rel="noreferrer">GITHUB ACTIONS ↗</a>
        <a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer">SOURCE CODE ↗</a>
        <span>BUILT BY PAUL MUSGRAVE 2026</span>
        <span>VERCEL + FASTAPI</span>
      </footer>
    </main>
  );
}
