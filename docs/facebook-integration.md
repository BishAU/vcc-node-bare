# Facebook Integration Setup

This guide explains how to set up the Facebook integration for the VCC Platform.

## Prerequisites

1. A Facebook Page (currently using: [VCC Facebook Page](https://www.facebook.com/VirtualContactCentreLimited))
2. Facebook Developer Account
3. Facebook App with the following permissions:
   - `pages_read_engagement`
   - `pages_read_user_content`

## Setup Instructions

1. Create a Facebook App:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Add the "Facebook Login" product
   - Configure the app settings

2. Get Access Token:
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your app
   - Get a User Access Token with the required permissions
   - Convert it to a Page Access Token
   - Generate a long-lived access token

3. Configure Environment Variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Facebook access token
   FACEBOOK_ACCESS_TOKEN=your_long_lived_access_token
   ```

4. Test the Integration:
   - Start the development server
   - Visit the homepage
   - Check that the Facebook feed loads correctly
   - Verify that posts and photos are displayed

## Troubleshooting

If the Facebook feed doesn't load:

1. Check the browser console for errors
2. Verify your access token is valid
3. Ensure the Facebook page ID is correct
4. Check server logs for API errors

## Security Considerations

- Never commit the `.env` file
- Keep your access token secure
- Regularly rotate access tokens
- Monitor API usage

## Maintenance

The Facebook integration requires:

1. Valid access token (renew every 60 days)
2. Active Facebook page
3. Regular monitoring of API usage
4. Updates to comply with Facebook's platform policies
