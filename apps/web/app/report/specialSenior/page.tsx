import { listRacers } from '../../actions/racer/listRacers';
import { SENIOR } from '../../common/constant';
import ReportEventSummary from '../components/reportEventSummary';
import ReportTable from '../components/reportTable';

export default async function ReportPage() {
  const racers = await listRacers({ special: 'senior' });

  return (
    <div className="reportContainer">
      <ReportEventSummary />
      <h2>{SENIOR}</h2>
      <ReportTable racers={racers} showAge={true} />
    </div>
  );
}
