import { listRacers } from '../../actions/racer/listRacers';
import { SNOWBOARD_FEMALE } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'f', category: 'snowboard' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{SNOWBOARD_FEMALE}</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
