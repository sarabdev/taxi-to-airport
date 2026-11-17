import { useEffect, useState } from 'react';
import { accessRequest, useEmailAccess } from '../lib/emailAccess';

export default function DriverComplete() {
  const [token] = useEmailAccess('driverRideAccess');
  const [booking, setBooking] = useState(null);
  const [code, setCode] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!token) return;
    setBooking(null);
    setError('');
    setCode('');
    setNote('');
    let active = true;
    accessRequest('/api/bookings/driver-access', token).then((data) => { if (active) setBooking(data); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [token]);

  async function complete(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { setBooking(await accessRequest('/api/bookings/driver-access/complete', token, { completionCode: code, note })); setCode(''); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="px-4 py-12 sm:py-20"><div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-premium sm:p-8">
    <p className="text-sm font-bold uppercase tracking-widest text-accent-600">Zalt drivers</p>
    <h1 className="mt-3 text-3xl font-black text-primary-900">Complete your ride</h1>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {!token ? <p className="mt-5 text-gray-600">Open the private ride link in your assignment email. Contact the office if you need a new link.</p>
      : !booking ? !error && <p role="status" className="mt-5 text-gray-500">Loading ride…</p> : <>
        <div className="mt-6 space-y-2 rounded-2xl bg-gray-50 p-5 text-sm text-gray-700">
          <p className="font-bold text-primary-900">Reference {String(booking._id).slice(-8).toUpperCase()}</p>
          <p>{booking.pickupLocation}</p>
          {(booking.stops || []).map((stop, i) => <p key={i}>Stop {i + 1}: {stop.location}</p>)}
          <p>→ {booking.dropoffLocation}</p>
          <p>{booking.pickupDate} {booking.pickupTime}</p>
          <p>Passenger: {booking.customerName} {booking.customerPhone}</p>
          {booking.isReturnTrip && <p>Return: {booking.returnTrip?.pickupLocation} → {booking.returnTrip?.dropoffLocation}, {booking.returnTrip?.pickupDate} {booking.returnTrip?.pickupTime}</p>}
          {booking.flight?.meetAndGreet && <p className="font-bold">Meet &amp; Greet: meet the passenger inside arrivals.</p>}
          {booking.driverAmount != null && <p className="font-bold">Your amount: £{Number(booking.driverAmount).toFixed(2)}</p>}
        </div>
        {booking.status === 'COMPLETED' ? <p role="status" className="mt-6 rounded-xl bg-green-50 p-4 font-bold text-green-800">Ride completed. Thank you.</p>
          : booking.status !== 'ASSIGNED' ? <p className="mt-5 text-gray-600">This ride is {booking.status.toLowerCase()}. Contact the office for help.</p>
          : <form onSubmit={complete} className="mt-6 space-y-4">
            {booking.requiresCompletionCode && <div>
              <label htmlFor="completion-code" className="block text-sm font-bold text-primary-900">Customer’s 4-digit job-end code</label>
              <p className="mt-1 text-sm text-gray-500">Ask the customer for their code at drop-off.</p>
              <input id="completion-code" required pattern="[0-9]{4}" maxLength={4} inputMode="numeric" autoComplete="one-time-code" value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))} className="mt-3 w-44 rounded-xl border border-gray-200 p-4 text-center font-mono text-2xl tracking-[0.4em]" />
            </div>}
            <div><label htmlFor="completion-note" className="block text-sm font-bold">Note (optional)</label>
              <textarea id="completion-note" maxLength={2000} value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3" /></div>
            <button disabled={busy || (booking.requiresCompletionCode && code.length !== 4)} className="w-full rounded-xl bg-primary-900 p-4 font-bold text-white disabled:opacity-50">{busy ? 'Completing…' : 'Complete ride'}</button>
          </form>}
      </>}
  </div></section>;
}
