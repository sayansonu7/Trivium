import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['openid', 'profile', 'email'],
      audience: 'http://localhost:8000'
    });
    
    console.log('Generated access token:', accessToken?.substring(0, 50) + '...');
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Token error:', error);
    res.status(500).json({ error: 'Unable to get access token' });
  }
});