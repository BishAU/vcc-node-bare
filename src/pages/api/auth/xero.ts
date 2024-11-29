import { XeroService } from '../../../lib/services/xero';
import { getDb } from '../../../lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Verify state to prevent CSRF attacks
  if (!state || state !== sessionStorage.getItem('xero_state')) {
    return new Response('Invalid state parameter', { status: 400 });
  }

  if (!code) {
    return new Response('No code parameter', { status: 400 });
  }

  try {
    const xeroService = XeroService.getInstance();
    const tokens = await xeroService.exchangeCodeForTokens(code);

    // Store tokens securely
    const db = await getDb();
    await db.settings.put({
      id: 'xero_tokens',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });

    // Redirect to admin dashboard
    return Response.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return new Response('Error authenticating with Xero', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const xeroService = XeroService.getInstance();
    const authUrl = await xeroService.getAuthorizationUrl();
    
    // Store state in session for CSRF protection
    const state = new URL(authUrl).searchParams.get('state');
    if (state) {
      sessionStorage.setItem('xero_state', state);
    }

    return new Response(JSON.stringify({ url: authUrl }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return new Response('Error initiating Xero authentication', { status: 500 });
  }
}
