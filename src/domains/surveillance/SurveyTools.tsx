import { useMemo, useState } from 'react';

const toNumber = (value: string) => Number(value) || 0;
const normalizeMils = (degrees: number) => ((degrees / 360) * 6400 + 6400) % 6400;

export function SurveyTools() {
  const [slopeDistance, setSlopeDistance] = useState('1000');
  const [verticalAngle, setVerticalAngle] = useState('5');
  const [stationElevation, setStationElevation] = useState('120');
  const [instrumentHeight, setInstrumentHeight] = useState('1.5');
  const [reflectorHeight, setReflectorHeight] = useState('2');
  const [stationEasting, setStationEasting] = useState('482000');
  const [stationNorthing, setStationNorthing] = useState('1562000');
  const [gridAzimuth, setGridAzimuth] = useState('1200');
  const [operation, setOperation] = useState<'intersection' | 'resection'>('intersection');
  const [temperature, setTemperature] = useState('30');
  const [pressure, setPressure] = useState('1013');
  const [ppm, setPpm] = useState('0');
  const [closureError, setClosureError] = useState('0.8');
  const [traverseLength, setTraverseLength] = useState('2400');
  const [accuracyOrder, setAccuracyOrder] = useState<'4' | '5'>('5');
  const [angularError, setAngularError] = useState('1.2');
  const [coordinateError, setCoordinateError] = useState('6');
  const [shiftEasting, setShiftEasting] = useState('0');
  const [shiftNorthing, setShiftNorthing] = useState('0');
  const [rotationMils, setRotationMils] = useState('0');

  const result = useMemo(() => {
    const slope = toNumber(slopeDistance);
    const angleRad = (toNumber(verticalAngle) * Math.PI) / 180;
    const horizontal = slope * Math.cos(angleRad);
    const deltaElevation = slope * Math.sin(angleRad) + toNumber(instrumentHeight) - toNumber(reflectorHeight);
    const azimuthRad = (toNumber(gridAzimuth) * 2 * Math.PI) / 6400;
    const easting = toNumber(stationEasting) + horizontal * Math.sin(azimuthRad);
    const northing = toNumber(stationNorthing) + horizontal * Math.cos(azimuthRad);
    const correctedDistance = horizontal * (1 + toNumber(ppm) / 1_000_000);
    const closureRatio = toNumber(closureError) > 0 ? toNumber(traverseLength) / toNumber(closureError) : Infinity;
    const limit = accuracyOrder === '4' ? 3000 : 1000;
    const closureValid = toNumber(angularError) <= 2 && toNumber(coordinateError) <= 10;
    const rotatedAngle = (toNumber(gridAzimuth) + toNumber(rotationMils)) % 6400;
    const rotationRad = (toNumber(rotationMils) * 2 * Math.PI) / 6400;
    const shiftedEasting = toNumber(stationEasting) + toNumber(shiftEasting);
    const shiftedNorthing = toNumber(stationNorthing) + toNumber(shiftNorthing);
    const transformedEasting = shiftedEasting * Math.cos(rotationRad) - shiftedNorthing * Math.sin(rotationRad);
    const transformedNorthing = shiftedEasting * Math.sin(rotationRad) + shiftedNorthing * Math.cos(rotationRad);
    return { horizontal, deltaElevation, easting, northing, correctedDistance, closureRatio, limit, rotatedAngle, transformedEasting, transformedNorthing, closureValid };
  }, [accuracyOrder, angularError, closureError, coordinateError, gridAzimuth, instrumentHeight, ppm, reflectorHeight, rotationMils, slopeDistance, stationEasting, stationNorthing, shiftEasting, shiftNorthing, traverseLength, verticalAngle]);

  return (
    <section className="survey-tools" aria-label="เครื่องมือสำรวจแบบฝึก">
      <header className="survey-tools__header">
        <div>
          <span className="route-kicker">SURVEILLANCE / เครื่องมือสำรวจ</span>
          <h3>เครื่องคำนวณงานแผนที่และสำรวจ</h3>
        </div>
        <span className="state-chip state-warning">โหมดฝึก / ตรวจทานก่อนใช้จริง</span>
      </header>

      <div className="survey-tools__grid">
        <article className="survey-tool-card">
          <span className="route-kicker">๑ · งานสำรวจพื้นฐาน</span>
          <h4>ระยะราบ / พิกัด / ผลต่างทางสูง</h4>
          <div className="survey-input-grid">
            <label>ระยะลาด S<input type="number" value={slopeDistance} onChange={(event) => setSlopeDistance(event.target.value)} /></label>
            <label>มุมดิ่ง α (องศา)<input type="number" value={verticalAngle} onChange={(event) => setVerticalAngle(event.target.value)} /></label>
            <label>ระดับสถานี<input type="number" value={stationElevation} onChange={(event) => setStationElevation(event.target.value)} /></label>
            <label>ความสูงเครื่องมือ<input type="number" step="0.1" value={instrumentHeight} onChange={(event) => setInstrumentHeight(event.target.value)} /></label>
            <label>ความสูงเป้าปริซึม<input type="number" step="0.1" value={reflectorHeight} onChange={(event) => setReflectorHeight(event.target.value)} /></label>
            <label>มุมภาคตาราง (มิล)<input type="number" min="0" max="6400" value={gridAzimuth} onChange={(event) => setGridAzimuth(event.target.value)} /></label>
          </div>
          <div className="survey-result-grid">
            <strong>ระยะราบ <b>{result.horizontal.toFixed(2)} ม.</b></strong>
            <strong>ผลต่างทางสูง <b>{result.deltaElevation.toFixed(2)} ม.</b></strong>
            <strong>ระดับปลายทาง <b>{(toNumber(stationElevation) + result.deltaElevation).toFixed(2)} ม.</b></strong>
          </div>
        </article>

        <article className="survey-tool-card">
          <span className="route-kicker">๒ · พิกัดตาราง UTM</span>
          <h4>คำนวณพิกัดฉากและมุมภาคตาราง</h4>
          <div className="survey-input-grid">
            <label>E0 / ตะวันออก<input value={stationEasting} onChange={(event) => setStationEasting(event.target.value)} /></label>
            <label>N0 / เหนือ<input value={stationNorthing} onChange={(event) => setStationNorthing(event.target.value)} /></label>
          </div>
          <div className="survey-result-grid">
            <strong>E ปลายทาง <b>{result.easting.toFixed(2)}</b></strong>
            <strong>N ปลายทาง <b>{result.northing.toFixed(2)}</b></strong>
            <strong>มุมภาค <b>{normalizeMils((toNumber(gridAzimuth) / 6400) * 360).toFixed(0)} มิล</b></strong>
          </div>
          <p className="survey-tool-note">ระยะราบ = S × cos(α) · พิกัดคำนวณจากสถานีตั้งต้นและมุมภาคตาราง</p>
        </article>

        <article className="survey-tool-card">
          <span className="route-kicker">๓ · การสกัดหาตำบลที่ตั้ง</span>
          <h4>การสกัดตรง / การสกัดกลับ</h4>
          <label>รูปแบบงาน
            <select value={operation} onChange={(event) => setOperation(event.target.value as typeof operation)}>
              <option value="intersection">การสกัดตรง · จุดตัดจากสถานีทราบที่ตั้ง</option>
              <option value="resection">การสกัดกลับ · หาสถานีจากหมุดอ้างอิง</option>
            </select>
          </label>
          <div className="survey-operation-readout">
            <strong>{operation === 'intersection' ? 'ต้องมีสถานีทราบที่ตั้งอย่างน้อย ๒ แห่ง และแนวเล็งไปจุดเดียวกัน' : 'ต้องมีหมุดอ้างอิงอย่างน้อย ๒–๓ จุด และมุมที่วัดจากสถานีไม่ทราบที่ตั้ง'}</strong>
            <span>สถานะ: เตรียมข้อมูลจุดอ้างอิงในโหมดฝึก</span>
          </div>
        </article>

        <article className="survey-tool-card">
          <span className="route-kicker">๔ · ค่าแก้บรรยากาศ</span>
          <h4>ATM. PPM / ระยะที่แก้แล้ว</h4>
          <div className="survey-input-grid">
            <label>อุณหภูมิ °C<input type="number" value={temperature} onChange={(event) => setTemperature(event.target.value)} /></label>
            <label>ความกดอากาศ hPa<input type="number" value={pressure} onChange={(event) => setPressure(event.target.value)} /></label>
            <label>ค่าแก้ PPM<input type="number" value={ppm} onChange={(event) => setPpm(event.target.value)} /></label>
          </div>
          <div className="survey-result-grid"><strong>ระยะหลังแก้ PPM <b>{result.correctedDistance.toFixed(3)} ม.</b></strong></div>
          <p className="survey-tool-note">อุณหภูมิ/ความกดอากาศถูกบันทึกประกอบการตรวจทาน ค่า PPM ต้องมาจากคู่มือหรือเครื่องมือที่ได้รับอนุมัติ</p>
        </article>

        <article className="survey-tool-card">
          <span className="route-kicker">๕ · ชั้นความถูกต้อง</span>
          <h4>ตรวจสอบ closure error</h4>
          <div className="survey-input-grid">
            <label>ความคลาดปิดวงรอบ (ม.)<input type="number" step="0.1" value={closureError} onChange={(event) => setClosureError(event.target.value)} /></label>
            <label>ความยาววงรอบรวม (ม.)<input type="number" value={traverseLength} onChange={(event) => setTraverseLength(event.target.value)} /></label>
            <label>ชั้นงาน<select value={accuracyOrder} onChange={(event) => setAccuracyOrder(event.target.value as typeof accuracyOrder)}><option value="4">ขั้น ๔ · ๑:๓,๐๐๐</option><option value="5">ขั้น ๕ · ๑:๑,๐๐๐</option></select></label>
          </div>
          <div className={`survey-accuracy ${result.closureRatio >= result.limit ? 'is-pass' : 'is-fail'}`}>
            อัตราส่วนที่ได้: ๑:{Number.isFinite(result.closureRatio) ? Math.round(result.closureRatio).toLocaleString('th-TH') : '∞'} · {result.closureRatio >= result.limit ? 'ผ่านเกณฑ์ฝึก' : 'ไม่ผ่านเกณฑ์ฝึก'}
          </div>
          <div className="survey-input-grid">
            <label>คลาดเคลื่อนทางมุม (มิล)<input type="number" step="0.1" value={angularError} onChange={(event) => setAngularError(event.target.value)} /></label>
            <label>คลาดเคลื่อนทางพิกัด (ม.)<input type="number" step="0.1" value={coordinateError} onChange={(event) => setCoordinateError(event.target.value)} /></label>
          </div>
          <div className={`survey-accuracy ${result.closureValid ? 'is-pass' : 'is-fail'}`} aria-live="polite">
            {result.closureValid ? 'ผ่านประตูตรวจสอบ: พร้อมส่งค่าฝึก' : 'ไม่ผ่านประตูตรวจสอบ: ล็อกการส่งค่า'}
            <small>เกณฑ์ล็อก: มุมไม่เกิน ๒ มิล และพิกัดไม่เกิน ๑๐ ม.</small>
          </div>
          <button type="button" className="primary-button" disabled={!result.closureValid}>ยืนยันชุดข้อมูลฝึก</button>
        </article>

        <article className="survey-tool-card">
          <span className="route-kicker">๖ · ระบบตาราง</span>
          <h4>การเลื่อนตาราง / การหมุนตาราง</h4>
          <div className="survey-input-grid">
            <label>เลื่อน E (ม.)<input type="number" value={shiftEasting} onChange={(event) => setShiftEasting(event.target.value)} /></label>
            <label>เลื่อน N (ม.)<input type="number" value={shiftNorthing} onChange={(event) => setShiftNorthing(event.target.value)} /></label>
            <label>หมุนตาราง (มิล)<input type="number" value={rotationMils} onChange={(event) => setRotationMils(event.target.value)} /></label>
          </div>
          <div className="survey-result-grid">
            <strong>มุมภาคหลังหมุน <b>{result.rotatedAngle.toFixed(0)} มิล</b></strong>
            <strong>จุดหลังแปลง E <b>{result.transformedEasting.toFixed(2)}</b></strong>
            <strong>จุดหลังแปลง N <b>{result.transformedNorthing.toFixed(2)}</b></strong>
          </div>
          <p className="survey-tool-note">การแปลงพิกัดเป็นผลฝึกเบื้องต้น ต้องตรวจระบบแกนและจุดหมุนตามเอกสารอ้างอิงก่อนใช้จริง</p>
        </article>
      </div>
      <p className="survey-tools__footer">ผลลัพธ์ทั้งหมดเป็นข้อมูลฝึกและต้องผ่านการตรวจทานจากแหล่งอ้างอิงก่อนนำไปใช้งานภาคสนาม</p>
    </section>
  );
}
