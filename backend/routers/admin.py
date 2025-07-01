from fastapi import APIRouter
from ..auth import update_from_auth0, require_permissions

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/sync-users")
async def sync_auth0_users(auth_result: str = require_permissions(["admin"])):
    update_from_auth0()
    return {"message": "Auth0 users synced"}
