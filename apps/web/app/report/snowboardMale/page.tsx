import { listRacers } from '../../actions/racer/listRacers';
import { SNOWBOARD_MALE } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'm', category: 'snowboard' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{SNOWBOARD_MALE}</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
