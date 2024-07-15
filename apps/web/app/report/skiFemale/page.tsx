import { listRacers } from '../../actions/racer/listRacers';
import { SKI_FEMALE } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'f', category: 'ski' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{SKI_FEMALE}</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
