import { listRacers } from '../../actions/racer/listRacers';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'f', category: 'snowboard' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>スノボ女子</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
