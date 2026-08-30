import type { UserRole } from '@/app/auth/auth-types';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'ผู้ดูแลระบบ / เจ้าของระบบ',
  FO: 'ผู้ตรวจการณ์หน้า (FO)',
  FDC: 'ศูนย์ตัดสินใจ (FDC)',
  SURVEILLANCE: 'แผนที่ / สำรวจ',
  HOWITZER: 'ส่วนยิง',
  WEAPONS: 'กระสุน',
};

const missionStatusLabels: Record<string, string> = {
  idle: 'ว่าง',
  active: 'กำลังปฏิบัติการ',
  complete: 'เสร็จสิ้น',
};

const fireMissionStatusLabels: Record<string, string> = {
  no_target: 'ยังไม่มีเป้าหมาย',
  target_ready: 'เป้าหมายพร้อม',
  fire_solution_review: 'ทบทวนผลยิง',
  fire_locked: 'ล็อกการยิง',
  complete: 'เสร็จสิ้น',
};

const severityLabels: Record<string, string> = {
  INFO: 'ข้อมูล',
  WARNING: 'คำเตือน',
  CRITICAL: 'วิกฤต',
};

const documentLabels: Record<string, string> = {
  FORM_344_201: 'ทบ.344-201',
  FORM_344_202: 'ทบ.344-202',
  DEPUTY_REPORT: 'รายงานรอง ผบ.ร้อย',
  COUNTER_BATTERY: 'บขตป.',
};

const queueStatusLabels: Record<string, string> = {
  queued: 'รอพรีวิว',
  preview: 'พรีวิวแล้ว',
};

export function formatRoleLabel(role: UserRole | null | undefined) {
  if (!role) {
    return 'ไม่ระบุบทบาท';
  }

  return roleLabels[role] ?? role;
}

export function formatMissionStatus(status: string | null | undefined) {
  if (!status) {
    return 'ไม่มีสถานะภารกิจ';
  }

  return missionStatusLabels[status] ?? status;
}

export function formatFireMissionStatus(status: string | null | undefined) {
  if (!status) {
    return 'ไม่มีสถานะการยิง';
  }

  return fireMissionStatusLabels[status] ?? status;
}

export function formatSeverityLabel(severity: string | null | undefined) {
  if (!severity) {
    return 'ไม่มี';
  }

  return severityLabels[severity] ?? severity;
}

export function formatDocumentLabel(document: string | null | undefined) {
  if (!document) {
    return 'ไม่มีเอกสาร';
  }

  return documentLabels[document] ?? document;
}

export function formatQueueStatus(status: string | null | undefined) {
  if (!status) {
    return 'ไม่มีสถานะ';
  }

  return queueStatusLabels[status] ?? status;
}
