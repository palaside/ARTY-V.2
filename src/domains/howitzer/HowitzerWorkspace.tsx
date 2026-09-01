import { useState } from 'react';
import { CraterAnalysisWorkspace } from './crater/CraterAnalysisWorkspace';
import { M17Workspace } from './m17/M17Workspace';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';

type HowitzerModule = 'overview' | 'm17' | 'guns' | 'crater' | 'report';

const howitzerCapabilities: CapabilityItem[] = [
  { title: '๑. การตั้งกล้องกองร้อย ๕ วิธี', description: 'แสดงขั้นตอนการตั้งทิศทางทั้ง ๕ วิธีในโหมดฝึก พร้อมจุดตรวจทาน.', state: 'พร้อมแสดงผล' },
  { title: '๒. การยิงฉุกเฉิน', description: 'แสดงลำดับสถานะฉุกเฉินสำหรับการฝึก โดยไม่ส่งคำสั่งไปยังอุปกรณ์จริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๓. วิเคราะห์หลุมระเบิด ๗ ขั้นตอน', description: 'บันทึกข้อมูลสนามตัวอย่างตั้งแต่รักษาพื้นที่จนถึงรายงานเบื้องต้น.', state: 'พร้อมแสดงผล' },
  { title: '๔. การดักเป้าหมายเคลื่อนที่', description: 'แสดงแบบจำลองข้อมูลเป้าหมายเคลื่อนที่และสถานะ TOF โดยไม่ให้คำแนะนำยิงจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๕. การหาระยะกำบัง', description: 'แสดงข้อมูลสิ่งกีดขวางและสถานะตรวจทานในชุดข้อมูลฝึก.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๖. ฐานสามเหลี่ยมคงที่', description: 'แสดงโครงสร้างการสำรวจฐานและข้อมูลตัวอย่างสำหรับการฝึก.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๗. เครื่องตั้งมุมยิงประณีต M1/M1A1', description: 'แสดงช่องตรวจทานเครื่องมือและสถานะยืนยันแบบกดค้าง.', state: 'พร้อมแสดงผล' },
  { title: '๘. การยิงกวาดและยิงเป็นเขต', description: 'แสดงรูปแบบพื้นที่จำลองและลำดับการทบทวน โดยไม่มีคำสั่งยิงจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๙. แผ่นกรุย M.17', description: 'แสดงจุดอ้างอิง ปืนตัวอย่าง ๖ กระบอก และมุมมองรายกระบอก/ภาพรวม.', state: 'พร้อมแสดงผล' },
  { title: '๑๐. มุมยิงต่ำสุด', description: 'แสดงประตูความปลอดภัยและสถานะตรวจทานข้อมูลฝึก โดยไม่คำนวณใช้งานจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๑๑. ตรรกะชนวน PD / VT', description: 'แสดงสถานะชนวนและ safety gate ในโหมดฝึก โดยไม่ควบคุมชนวนจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๑๒. ความต่างทิศและต่างระยะของปืน', description: 'แสดงค่าออฟเซ็ตตัวอย่างเทียบกับจุดอ้างอิงของชุดฝึก.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๑๓. การวัดมุมดิ่งด้วย M.2', description: 'แสดงการเชื่อมโยงเครื่องมือ M.2 และข้อมูลมุมในโหมดฝึก.', state: 'พร้อมแสดงผล' },
  { title: '๑๔. รายงานรอง ผบ.ร้อย ป. ๕ ตอน', description: 'จัดกลุ่มข้อมูลฝึกสำหรับพรีวิวรายงานและ Event Log โดยไม่ส่งคำสั่งภายนอก.', state: 'พร้อมแสดงผล' },
];

const moduleItems: Array<{ id: HowitzerModule; label: string }> = [
  { id: 'overview', label: 'ภาพรวมส่วนยิง' },
  { id: 'm17', label: 'M.17 / วางแผนตำแหน่ง' },
  { id: 'guns', label: 'ตารางสถานะปืน' },
  { id: 'crater', label: 'วิเคราะห์หลุมระเบิด' },
  { id: 'report', label: 'บขตป. ตอนที่ ๑' },
];

export function HowitzerWorkspace() {
  const [activeModule, setActiveModule] = useState<HowitzerModule>('overview');

  return (
    <section className="domain-workspace howitzer-workspace" aria-label="พื้นที่ทำงานส่วนยิง">
      <header className="domain-workspace__header">
        <span className="route-kicker">ส่วนยิง / โหมดฝึก</span>
        <h3>พื้นที่ทำงานส่วนยิง</h3>
        <span className="state-chip state-warning">ไม่เชื่อมอุปกรณ์จริง</span>
      </header>
      <nav className="howitzer-module-nav" aria-label="โมดูลส่วนยิง">
        {moduleItems.map((item) => <button key={item.id} type="button" className={activeModule === item.id ? 'is-active' : ''} onClick={() => setActiveModule(item.id)}>{item.label}</button>)}
      </nav>
      {activeModule === 'overview' ? <CapabilityCatalog title="คลังความสามารถส่วนยิง · ๑๔ โมดูล" items={howitzerCapabilities} /> : null}
      {activeModule === 'm17' ? <M17Workspace /> : null}
      {activeModule === 'guns' ? <M17Workspace initialView="battery" focus="guns" /> : null}
      {activeModule === 'crater' ? <CraterAnalysisWorkspace /> : null}
      {activeModule === 'report' ? <CraterAnalysisWorkspace reportOnly /> : null}
    </section>
  );
}
