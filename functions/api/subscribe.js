// POST /api/subscribe  { email, source? }
// Single opt-in: the email is added to the Resend audience immediately.
// The recipient starts receiving the SITREP and can unsubscribe any time
// via the link in every send. No confirmation step, no second list.
//
// Source tagging (optional, non-breaking):
//   The front-end sends a `source` (hero, shift, band, sticky, pop, diagnostic).
//   If you set per-source audience env vars, the contact is routed to the
//   matching Resend audience so you can segment nurture by intent:
//       RESEND_AUD_DIAGNOSTIC   (highest intent, finished the Best-Fit tool)
//       RESEND_AUD_POP / _STICKY / _HERO / _SHIFT / _BAND
//   Fallback order: RESEND_AUD_<SOURCE>  ->  RESEND_AUDIENCE_ID  ->  legacy /contacts.
//   With no env vars set, behavior is identical to before.
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    let email = '', source = '';
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const b = await request.json();
      email = (b && b.email) || '';
      source = (b && b.source) || '';
    } else {
      const fd = await request.formData();
      email = fd.get('email') || '';
      source = fd.get('source') || '';
    }
    email = String(email).trim().toLowerCase();
    source = String(source).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResp({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }
    if (!env.RESEND_API_KEY) {
      return jsonResp({ ok: false, error: 'Signup is not fully configured yet.' }, 500);
    }

    // Route to a source-specific audience if configured, else a default audience,
    // else the legacy top-level contacts endpoint (original behavior).
    const audienceId =
      (source && env['RESEND_AUD_' + source.toUpperCase()]) ||
      env.RESEND_AUDIENCE_ID ||
      '';
    const url = audienceId
      ? 'https://api.resend.com/audiences/' + audienceId + '/contacts'
      : 'https://api.resend.com/contacts';

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, unsubscribed: false })
    });

    // 2xx = added. 409/422 = already a contact. All are success to the visitor.
    if (r.ok || r.status === 409 || r.status === 422) {
      return jsonResp({ ok: true, message: 'You are in. Your first SITREP arrives tomorrow morning.' });
    }
    return jsonResp({ ok: false, error: 'Something went wrong. Please try again shortly.' }, 502);
  } catch (err) {
    return jsonResp({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
  }
}

function jsonResp(o, s) {
  return new Response(JSON.stringify(o), {
    status: s || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
