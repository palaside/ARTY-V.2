import { CraterAnalysisWorkspace } from './crater/CraterAnalysisWorkspace';
import { M17Workspace } from './m17/M17Workspace';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';

const howitzerCapabilities: CapabilityItem[] = [
  {
    title: 'การตั้งปืนตรงทิศ 5 วิธี',
    description: 'จัดลำดับ workflow การตั้งปืนและการตรวจทานทิศทางสำหรับการฝึก โดยเก็บเป็นขั้นตอนในหน้าจอเดียว.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: 'ตารางคำสั่งแยกปืน',
    description: 'พื้นที่แสดงสถานะปืนประจำหมู่และมุมมองรายกระบอก/ภาพรวม โดยไม่มีการส่งคำสั่งไปยังอุปกรณ์จริง.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: 'M.17 และการตรวจมุม',
    description: 'ใช้แผ่นวางแผน M.17 เป็นแกนแสดงตำแหน่งปืน ความสัมพันธ์กับ ศก.ร้อย และการตรวจทานค่าในโหมดฝึก.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: 'วิเคราะห์หลุมระเบิด / บขตป.',
    description: 'รวบรวมข้อมูลวิเคราะห์สนามและส่งต่อสู่แบบฟอร์ม บขตป. ในฐานะรายงานเบื้องต้น.',
    state: 'พร้อมแสดงผล',
  },
];

export function HowitzerWorkspace() {
  return (
    <section className="domain-workspace" aria-label="howitzer-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">ส่วนยิง</span>
        <h3>พื้นที่ทำงานส่วนยิง</h3>
      </header>
      <CapabilityCatalog title="ขั้นตอนส่วนยิง" items={howitzerCapabilities} />
      <div className="domain-stack">
        <M17Workspace />
        <CraterAnalysisWorkspace />
      </div>
    </section>
  );
}
