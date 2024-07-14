import { listRacers } from '../../(admin)/results/actions/actions';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ special: 'junior' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>ジュニア</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
