export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>✅ Backend A is Running!</h1>
      <p>Your API endpoints are available at:</p>
      <ul>
        <li><code>GET /api/health</code> - Check server status</li>
        <li><code>POST /api/transactions/sync</code> - Sync mock transactions</li>
        <li><code>GET /api/transactions</code> - Get all transactions</li>
        <li><code>GET /api/workflow/pending</code> - Get pending reviews</li>
      </ul>
      <hr />
      <p>Use Postman or curl to test the endpoints.</p>
    </div>
  )
}