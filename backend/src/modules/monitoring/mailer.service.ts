// backend/src/modules/monitoring/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { RenderedReport } from './monitoring-report.util';

@Injectable()
export class MailerService {
  constructor(private readonly config: ConfigService) {}

  /** 发送报告；未配置或失败返回 {sent:false,error}，不抛出 */
  async send(report: RenderedReport): Promise<{ sent: boolean; error?: string }> {
    const host = this.config.get<string>('SMTP_HOST') || '';
    const port = Number(this.config.get<string>('SMTP_PORT') || 465);
    const user = this.config.get<string>('SMTP_USER') || '';
    const pass = this.config.get<string>('SMTP_PASS') || '';
    const to = this.config.get<string>('MONITOR_MAIL_TO') || '';
    if (!host || !user || !pass || !to) {
      return { sent: false, error: 'SMTP 未配置（需 SMTP_HOST/SMTP_USER/SMTP_PASS/MONITOR_MAIL_TO）' };
    }
    try {
      const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
      await transport.sendMail({
        from: `"星契集监控" <${user}>`,
        to,
        subject: report.subject,
        html: report.html,
        text: report.text,
      });
      return { sent: true };
    } catch (e: any) {
      return { sent: false, error: `SMTP 发送失败: ${String(e?.message || e).slice(0, 200)}` };
    }
  }
}
