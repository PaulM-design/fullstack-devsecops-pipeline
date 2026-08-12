const stages = [
  ["01", "Test", "Pytest · Vitest · TypeScript"],
  ["02", "Inspect", "CodeQL · dependencies · secrets"],
  ["03", "Scan", "Trivy image and filesystem gates"],
  ["04", "Ship", "Vercel · ECR · ECS Fargate"],
  ["05", "Recover", "Health checks · automatic rollback"],
];

async function getApiStatus() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  try {
    const response = await fetch(`${base}/health`, { cache: "no-store" });
    if (!response.ok) throw new Error("unhealthy");
    return "API HEALTHY";
  } catch {
    return "API OFFLINE";
  }
}

export default async function Home() {
  const status = await getApiStatus();
  return (
    <main>
      <nav><span>PIPELINE / 01</span><span className="status">● {status}</span></nav>
      <section className="hero">
        <p className="eyebrow">FULL-STACK DELIVERY, DEFENDED</p>
        <h1>Ship fast.<br /><em>Know why</em> it&apos;s safe.</h1>
        <p className="lede">A working FastAPI + Next.js system where every commit proves itself before production, and production can recover without heroics.</p>
      </section>
      <section className="pipeline" aria-label="Pipeline stages">
        {stages.map(([number, title, detail]) => (
          <article key={number}>
            <span>{number}</span><h2>{title}</h2><p>{detail}</p>
          </article>
        ))}
      </section>
      <footer><span>GITHUB ACTIONS</span><span>TERRAFORM</span><span>Built by Paul Musgrave 2026</span><span>VERCEL + AWS</span></footer>
    </main>
  );
}
