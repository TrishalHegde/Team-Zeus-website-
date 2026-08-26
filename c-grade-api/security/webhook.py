import hmac
import hashlib
import os
from fastapi import Request, HTTPException, Header, status

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "supersecretwebhookkeyforverification123!")

async def verify_webhook_signature(
    request: Request,
    x_hub_signature_256: str = Header(None)
):
    if not x_hub_signature_256:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing webhook signature header."
        )
        
    payload = await request.body()
    
    # Calculate signature
    # Signature is typically 'sha256=hash_bytes'
    parts = x_hub_signature_256.split("=")
    if len(parts) != 2 or parts[0] != "sha256":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature format. Must be sha256=signature."
        )
        
    signature = parts[1]
    mac = hmac.new(
        WEBHOOK_SECRET.encode(),
        msg=payload,
        digestmod=hashlib.sha256
    )
    expected_signature = mac.hexdigest()
    
    if not hmac.compare_digest(expected_signature, signature):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Signature validation failed. Request untrusted."
        )
        
    return True
