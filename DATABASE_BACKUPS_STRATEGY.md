/**
 * Database Backup & Recovery Strategy
 * 
 * This document outlines the backup and recovery procedures for Amanuel Travel
 */

# Database Backup Strategy

## 1. Backup Methods

### 1.1 Automated Daily Backups (PostgreSQL)
```bash
# Schedule with cron (runs daily at 2 AM)
0 2 * * * pg_dump postgresql://user:password@localhost:5432/amanuel_travel | gzip > /backups/amanuel_travel_$(date +\%Y\%m\%d_\%H\%M\%S).sql.gz
```

### 1.2 Automated Vercel Backups
- Vercel provides daily backups for PostgreSQL
- Retention: 30 days
- Access through Vercel dashboard or CLI

### 1.3 Manual Weekly Backups
```bash
# Run manually before major deployments
npm run db:backup
```

## 2. Backup Storage

### Primary: Cloud Storage
- **AWS S3** or **Google Cloud Storage**
- Encrypted backups with AES-256
- Lifecycle policy: 30-day retention

### Secondary: Local Storage
- Keep 7-day rolling backups locally
- Location: `/backups/` directory
- Compressed format: `.sql.gz`

## 3. Recovery Procedures

### Quick Recovery (Last 24 Hours)
```bash
# Restore from latest backup
psql postgresql://user:password@localhost:5432/amanuel_travel < /backups/latest.sql
```

### Full Database Recovery
```bash
# 1. Create new database
createdb amanuel_travel_restored

# 2. Restore from backup
psql -U postgres amanuel_travel_restored < /backups/backup_20250116.sql.gz

# 3. Verify integrity
psql -d amanuel_travel_restored -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"

# 4. Swap databases
ALTER DATABASE amanuel_travel RENAME TO amanuel_travel_old;
ALTER DATABASE amanuel_travel_restored RENAME TO amanuel_travel;
```

### Point-in-Time Recovery (PITR)
```bash
# Enable WAL archiving in PostgreSQL config
wal_level = archive
archive_mode = on
archive_command = 'cp %p /archive/%f'

# Recover to specific timestamp
pg_ctl recover -D /data/postgresql -t '2025-01-16 10:00:00'
```

## 4. Backup Monitoring

### Health Checks
- [ ] Daily backup completion verification
- [ ] Weekly restore test on staging
- [ ] Monthly full backup integrity check
- [ ] Quarterly disaster recovery drill

### Alerts
- Failed backup notification (Slack/Email)
- Backup size anomalies
- Storage quota warnings

## 5. Disaster Recovery Plan

### RTO (Recovery Time Objective): 1 hour
### RPO (Recovery Point Objective): 15 minutes

### Recovery Steps
1. **Detection** (5 min): Identify data loss
2. **Preparation** (10 min): Access backup storage
3. **Restoration** (30 min): Restore database
4. **Verification** (10 min): Verify data integrity
5. **Cutover** (5 min): Switch to restored database

### Fallback Plan
- Keep hot standby database in different region
- Use read replicas for failover
- Auto-failover after 5-minute detection delay

## 6. Compliance & Testing

### Backup Schedule
| Frequency | Retention | Storage |
|-----------|-----------|---------|
| Hourly | 48 hours | Local |
| Daily | 30 days | Cloud |
| Weekly | 90 days | Cloud |
| Monthly | 1 year | Archive |

### Testing Schedule
- **Weekly**: Automated restore test to staging
- **Monthly**: Manual recovery drill
- **Quarterly**: Full disaster recovery simulation

## 7. Implementation

### Setup Automated Backups
```bash
# Install pg-dump
apt-get install postgresql-client

# Create backup script
cat > /usr/local/bin/backup-amanuel.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_URL="postgresql://user:password@localhost:5432/amanuel_travel"

pg_dump $DB_URL | gzip > $BACKUP_DIR/amanuel_travel_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/amanuel_travel_$DATE.sql.gz s3://amanuel-backups/

# Clean old local backups (keep 7 days)
find $BACKUP_DIR -name "amanuel_travel_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-amanuel.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-amanuel.sh") | crontab -
```

### S3 Backup Configuration
```bash
# AWS CLI command
aws s3api put-bucket-lifecycle-configuration \
  --bucket amanuel-backups \
  --lifecycle-configuration '{
    "Rules": [
      {
        "Id": "DeleteOldBackups",
        "Filter": {"Prefix": ""},
        "Expiration": {"Days": 90},
        "Status": "Enabled"
      }
    ]
  }'
```

## 8. Contacts & Escalation

| Role | Contact | Priority |
|------|---------|----------|
| Database Admin | DBA Team | P1 |
| DevOps Lead | ops@amanueltravel.com | P1 |
| Security Lead | security@amanueltravel.com | P2 |

---

**Last Updated:** 2025-01-16  
**Next Review:** 2025-04-16  
**Reviewed By:** DevOps Team
