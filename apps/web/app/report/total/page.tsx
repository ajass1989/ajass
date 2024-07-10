import { listRacersWithSummaryPoint } from '../../(admin)/results/actions/actions';
import '../report.css';
import ReportHeader from '../components/reportHeader';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacersWithSummaryPoint();

  return (
    <div className="reportContainer">
      <ReportHeader />
      <h2>個人総合</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
