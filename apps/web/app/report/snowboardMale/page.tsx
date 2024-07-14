import { listRacers } from '../../(admin)/results/actions/actions';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'm', category: 'snowboard' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>スノボ男子</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
