import { RacerWithTeam } from '../../actions/racer/listRacers';
import {
  renderResult,
  renderTime,
  summaryWithoutSpecial,
} from '../../common/racerUtil';
import { CategoryType, GenderType } from '../../common/types';
import '../report.css';

type Props = {
  racers: RacerWithTeam[];
  showPoint?: boolean;
  showAge?: boolean;
  showTotalOrder?: boolean;
};

export default async function ReportTable(props: Props) {
  const { racers } = props;

  const addNoBestTimeClass = (racer: RacerWithTeam, className: string) => {
    if (racer.bestTime) {
      return className;
    }
    return `${className} disabled`;
  };

  return (
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
            所属
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
          <th
            hidden={!props.showAge}
            style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}
          >
            年齢
          </th>
          <th
            hidden={!props.showAge}
            style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}
          >
            年齢補正
          </th>
          <th
            hidden={!props.showAge}
            style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}
          >
            採用タイム
          </th>
          <th style={{ borderStyle: 'solid', padding: '4px', margin: '4px' }}>
            順位
          </th>
        </tr>
      </thead>
      <tbody style={{ borderCollapse: 'collapse', border: 'solid' }}>
        {racers.map((racer, index) => (
          <tr key={racer.id} className={addNoBestTimeClass(racer, '')}>
            <td className="text cell">
              {summaryWithoutSpecial(
                racer.gender as GenderType,
                racer.category as CategoryType,
              )}
            </td>
            <td className="text cell">{racer.bib ?? ''}</td>
            <td className="number cell">{racer.seed}</td>
            <td className="cell">
              <span className="text">{racer.name}</span>
            </td>
            <td className="cell">{racer.kana}</td>
            <td className="text cell">{racer.team.fullname}</td>
            <td className="number cell">{racer.isFirstTime ? '◆' : ''}</td>
            <td className="number cell">
              {renderResult(racer.status1, racer.time1)}
            </td>
            <td className="number cell">
              {renderResult(racer.status2, racer.time2)}
            </td>
            <td className="number cell">{renderTime(racer.bestTime)}</td>
            <td className="number cell" hidden={!props.showAge}>
              {racer.age}
            </td>
            <td className="number cell" hidden={!props.showAge}>
              {renderTime(racer.ageHandicap)}
            </td>
            <td className="number cell" hidden={!props.showAge}>
              {renderTime(racer.adoptTime)}
            </td>
            <td className="number cell">{racer.bestTime ? index + 1 : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
