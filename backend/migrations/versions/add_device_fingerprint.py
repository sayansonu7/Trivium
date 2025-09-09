"""add_device_fingerprint_to_sessions

Revision ID: add_device_fingerprint
Revises: 64446727bbc0
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'add_device_fingerprint'
down_revision = '64446727bbc0'
branch_labels = None
depends_on = None

def upgrade():
    # Add device_fingerprint column to user_sessions table
    op.add_column('user_sessions', sa.Column('device_fingerprint', sa.String(), nullable=False, server_default=''))
    op.create_index('ix_user_sessions_device_fingerprint', 'user_sessions', ['device_fingerprint'])

def downgrade():
    # Remove device_fingerprint column
    op.drop_index('ix_user_sessions_device_fingerprint', 'user_sessions')
    op.drop_column('user_sessions', 'device_fingerprint')