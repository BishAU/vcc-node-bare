import express from 'express';
import { XeroClient } from 'xero-node';
import { xeroConfig } from './config.js';
import logger from '../src/utils/logger.js';

const app = express();
const port = 8080;

// Create Xero client
const xeroClient = new XeroClient({
  clientId: xeroConfig.clientId,
  clientSecret: xeroConfig.clientSecret,
  redirectUris: ['http://localhost:8080/callback'],
  scopes: ['openid', 'profile', 'email', 'accounting.transactions', 'accounting.contacts', 'accounting.settings']
});

app.get('/', async (req, res) => {
  try {
    const consentUrl = await xeroClient.buildConsentUrl();
    res.redirect(consentUrl);
  } catch (err) {
    logger.error('Error building consent URL:', err);
    res.status(500).send('Error starting authentication');
  }
});

app.get('/callback', async (req, res) => {
  try {
    const tokenSet = await xeroClient.apiCallback(req.url);
    await xeroClient.updateTenants();
    
    // Save the token set
    await xeroClient.writeTokenSet(tokenSet);
    
    logger.info('Successfully authenticated with Xero');
    res.send('Authentication successful! You can close this window and run the test script again.');
  } catch (err) {
    logger.error('Error in callback:', err);
    res.status(500).send('Error completing authentication');
  }
});

app.listen(port, () => {
  logger.info(`Auth server running at http://localhost:${port}`);
  logger.info('Please visit http://localhost:8080 to start the authentication process');
});
