export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Main Server - API Gateway</h1>
      <p>Running on port 3000</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/transactions">GET /api/transactions</a></li>
        <li>POST /api/transactions/sync</li>
        <li><a href="/api/workflow/pending">GET /api/workflow/pending</a></li>
      </ul>
    </div>
  )
}