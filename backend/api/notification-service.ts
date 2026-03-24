import axios from 'axios';

export class NotificationService {
  async sendAnomalyAlert(anomaly: any, enterpriseId: string) {
    await Promise.all([
      this.sendEmail(anomaly, enterpriseId),
      this.sendSlack(anomaly, enterpriseId),
    ]);
  }

  private async sendEmail(anomaly: any, enterpriseId: string) {
    const key = process.env.SENDGRID_API_KEY;
    if (!key || key.startsWith('your-')) return;

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{
            to: [{ email: process.env.ALERT_EMAIL || 'alerts@proofmind.io' }],
            subject: `ProofMind Alert: ${anomaly.anomaly_class}`,
          }],
          from: { email: 'noreply@proofmind.io' },
          content: [{
            type: 'text/html',
            value: `
              <h2>Anomaly Detected</h2>
              <p><strong>Enterprise:</strong> ${enterpriseId}</p>
              <p><strong>Class:</strong> ${anomaly.anomaly_class}</p>
              <p><strong>Severity:</strong> ${anomaly.severity}</p>
              <p><strong>Details:</strong> ${JSON.stringify(anomaly.detail)}</p>
            `,
          }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }

  private async sendSlack(anomaly: any, enterpriseId: string) {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url || url.startsWith('your-')) return;

    try {
      await axios.post(url, {
        text: `🚨 *ProofMind Anomaly Alert*`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `Anomaly: ${anomaly.anomaly_class}`,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Enterprise:*\n${enterpriseId}` },
              { type: 'mrkdwn', text: `*Severity:*\n${anomaly.severity}` },
              { type: 'mrkdwn', text: `*Details:*\n\`\`\`${JSON.stringify(anomaly.detail, null, 2)}\`\`\`` },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Slack send failed:', error);
    }
  }

  async sendComplianceReport(report: any, enterpriseId: string) {
    const key = process.env.SENDGRID_API_KEY;
    if (!key || key.startsWith('your-')) return;

    try {
      await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{
            to: [{ email: process.env.COMPLIANCE_EMAIL || 'compliance@proofmind.io' }],
            subject: `Compliance Report: ${report.report_type}`,
          }],
          from: { email: 'reports@proofmind.io' },
          content: [{
            type: 'text/html',
            value: `
              <h2>Compliance Report Generated</h2>
              <p><strong>Enterprise:</strong> ${enterpriseId}</p>
              <p><strong>Period:</strong> ${report.period_from} to ${report.period_to}</p>
              <p><strong>Total Decisions:</strong> ${report.total_decisions}</p>
              <p><strong>Anomalies:</strong> ${report.anomaly_count}</p>
            `,
          }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Report email failed:', error);
    }
  }
}
