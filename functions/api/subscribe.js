// POST /api/subscribe  { email }
// Single opt-in: the email is added to the Resend audience immediately.
// The recipient starts receiving the SITREP and can unsubscribe any time
// via the link in every send. No confirmation step, no second list.
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    let email = '';
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const b = await request.json();
      email = (b && b.email) || '';
    } else {
      const fd = await request.formData();
      email = fd.get('email') || '';
    }
    email = String(email).trim().toLowerCase();

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResp({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }
    if (!env.RESEND_API_KEY) {
      return jsonResp({ ok: false, error: 'Signup is not fully configured yet.' }, 500);
    }

    const r = await fetch('https://api.resend.com/contacts', {
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
