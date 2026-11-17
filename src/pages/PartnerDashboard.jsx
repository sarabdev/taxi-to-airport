import { useEffect, useState } from 'react';
import { accessRequest, useEmailAccess } from '../lib/emailAccess';

export default function PartnerDashboard() {
  const [token, setToken] = useEmailAccess('partnerDashboardAccess');
  const [dashboard, setDashboard] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!token) return;
    setDashboard(null);
    setError('');
    let active = true;
    accessRequest('/api/partners/dashboard', token)
      .then((data) => { if (active) setDashboard(data); })
      .catch((err) => {
        if (active) {
          try { sessionStorage.removeItem('partnerDashboardAccess'); } catch { /* Storage may be disabled. */ }
          setToken('');
          setError(err.message);
        }
      });
    return () => { active = false; };
  }, [token, setToken]);

  async function requestLink(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = await accessRequest('/api/partners/dashboard-link', '', { email });
      setMessage(result.message);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <section className="bg-gray-50 px-4 py-12 sm:py-20">
    <div className="mx-auto max-w-5xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-widest text-accent-600">Zalt partners</p>
      <h1 className="text-3xl font-black text-primary-900 sm:text-4xl">{dashboard?.companyName || 'Your partner dashboard'}</h1>
      <p className="mt-3 text-gray-600">Your earnings and referred ride statuses in one place.</p>
      {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-red-700">{error}</p>}
      {dashboard ? <>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['Total earnings', `£${Number(dashboard.totalEarnings).toFixed(2)}`],
            ['Total rides', dashboard.totalRides], ['Completed rides', dashboard.completedRides],
          ].map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-black text-primary-900">{value}</p>
          </div>)}
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-xl font-bold text-primary-900">Ride status</h2>
          {dashboard.rides.length ? <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-gray-500"><th className="p-3">Reference</th><th className="p-3">Journey date</th><th className="p-3">Status</th></tr></thead>
            <tbody>{dashboard.rides.map((ride) => <tr key={ride.reference} className="border-b last:border-0">
              <td className="p-3 font-semibold">{ride.reference}</td><td className="p-3">{ride.pickupDate || 'To be confirmed'} {ride.pickupTime}</td>
              <td className="p-3"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">{ride.status}</span></td>
            </tr>)}</tbody>
          </table> : <p className="py-6 text-gray-500">No rides have been booked with your code yet.</p>}
          {dashboard.totalRides > 200 && <p className="mt-4 text-xs text-gray-500">Showing your latest 200 rides. Earnings include all completed rides.</p>}
        </div>
        <button className="mt-6 text-sm font-semibold text-gray-600 underline" onClick={() => {
          try { sessionStorage.removeItem('partnerDashboardAccess'); } catch { /* Storage may be disabled. */ }
          setToken(''); setDashboard(null); setError('');
        }}>Close dashboard</button>
      </> : (!token || error) ? <form onSubmit={requestLink} className="mt-8 max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-primary-900">Email me a dashboard link</h2>
        <p className="mt-2 text-sm text-gray-600">Use your approved partner email. No password needed.</p>
        <label htmlFor="partner-email" className="mt-5 block text-sm font-semibold">Email address</label>
        <input id="partner-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3" />
        <button disabled={busy} className="mt-4 w-full rounded-xl bg-primary-900 p-3 font-bold text-white disabled:opacity-50">{busy ? 'Sending…' : 'Send dashboard link'}</button>
        {message && <p role="status" className="mt-4 text-sm text-green-700">{message}</p>}
      </form> : <p role="status" className="mt-8 text-gray-500">Loading your dashboard…</p>}
    </div>
  </section>;
}
