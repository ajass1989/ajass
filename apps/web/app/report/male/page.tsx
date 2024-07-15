import { listRacers } from '../../actions/racer/listRacers';
import { MALE } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ gender: 'm' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{MALE}</h2>
      <ReportTable racers={racers} />
    </div>
  );
}
