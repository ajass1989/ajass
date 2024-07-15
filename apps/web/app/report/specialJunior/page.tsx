import { listRacers } from '../../actions/racer/listRacers';
import { JUNIOR } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ special: 'junior' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{JUNIOR}</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
