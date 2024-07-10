import {
  listRacersWithSummaryPoint,
  listTeamsWithPoint,
} from '../../(admin)/results/actions/actions';
import TeamView from './teamView';
import '../report.css';
import ReportHeader from '../components/reportHeader';

export default async function ReportPage() {
  const teams = await listTeamsWithPoint();
  const racers = await listRacersWithSummaryPoint();

  return (
    <div className="reportContainer">
      <ReportHeader />
      <h2>団体</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          borderStyle: 'solid',
          borderWidth: '1px',
        }}
      >
        <thead>
          <tr>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              種目
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              ビブ
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              シード
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              選手名
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              ふりがな
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              初
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              タイム１
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              タイム２
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              ベストタイム
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              順位
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              補正
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              ポイント
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              競技別Pt
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              特別Pt
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              団体Pt
            </th>
            <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
              団体順位
            </th>
          </tr>
        </thead>
        <tbody style={{ borderCollapse: 'collapse', border: 'solid' }}>
          {teams.map((team, index) => (
            <TeamView
              teamOrder={index + 1}
              team={team}
              racers={racers.filter((racer) => racer.teamId == team.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
