import jwt
import requests
from typing import Optional
from app.config import settings
from app.schemas.auth import TokenPayload
import logging

logger = logging.getLogger(__name__)

class Auth0Validator:
    def __init__(self):
        self.domain = settings.auth0_domain
        self.audience = settings.auth0_audience
        self._jwks_cache = None
        logger.info(f"Auth0Validator initialized with domain: {self.domain}, audience: {self.audience}")
    
    def get_jwks(self):
        """Fetch Auth0 public keys for token validation"""
        if not self._jwks_cache:
            try:
                jwks_url = f"https://{self.domain}/.well-known/jwks.json"
                logger.info(f"Fetching JWKS from: {jwks_url}")
                response = requests.get(jwks_url, timeout=10)
                response.raise_for_status()
                self._jwks_cache = response.json()
                logger.info("JWKS fetched successfully", extra={"key_count": len(self._jwks_cache.get('keys', []))})

            except Exception as e:
                logger.error(f"Failed to fetch JWKS: {e}")
                raise
        return self._jwks_cache
    
    def verify_token(self, token: str) -> Optional[TokenPayload]:
        """Validate JWT token and return payload"""
        try:
            logger.info("Starting token verification")
            
            # Get signing key
            unverified_header = jwt.get_unverified_header(token)
            logger.info("Token header received", extra={"algorithm": unverified_header.get('alg'), "type": unverified_header.get('typ')})

            
            jwks = self.get_jwks()
            
            # Find the correct key
            key = None
            for jwk in jwks["keys"]:
                if jwk["kid"] == unverified_header["kid"]:
                    key = jwt.algorithms.RSAAlgorithm.from_jwk(jwk)
                    break
            
            if not key:
                logger.error(f"No matching key found for kid: {str(unverified_header.get('kid', 'None'))[:50]}")

            
            # Verify and decode token
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                audience=self.audience,
                issuer=f"https://{self.domain}/"
            )
            
            logger.info("Token verified successfully", extra={"user_id": payload.get('sub')})
            return TokenPayload(**payload)

        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {e}")
            return None
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None

auth_validator = Auth0Validator()