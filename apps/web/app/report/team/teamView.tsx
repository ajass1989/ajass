import {
  RacerWithSummaryPoint,
  TeamWithPoint,
} from '../../(admin)/results/actions/actions';
import {
  renderResult,
  renderTime,
  summaryWithoutSpecial,
} from '../../common/racerUtil';
import { CategoryType, GenderType } from '../../common/types';
import '../report.css';

type Props = {
  teamOrder: number;
  team: TeamWithPoint;
  racers: RacerWithSummaryPoint[];
};

export default async function TeamView(props: Props) {
  /**
   * 種目列
   * @param racer
   * @returns
   */
  const tdSummary = (racer: RacerWithSummaryPoint) => {
    if (racer.rowSpanSummary === 0) {
      return <></>;
    }
    return (
      <td className="text cell" rowSpan={racer.rowSpanSummary}>
        {summaryWithoutSpecial(
          racer.gender as GenderType,
          racer.category as CategoryType,
        )}
      </td>
    );
  };

  const tdSummaryPoint = (racer: RacerWithSummaryPoint) => {
    if (racer.rowSpanSummary === 0) {
      return <></>;
    }
    return (
      <td className="number cell" rowSpan={racer.rowSpanSummary}>
        {racer.summaryPoint}
      </td>
    );
  };

  const tdTeamOrder = (
    index: number,
    teamOrder: number,
    racersNumber: number,
  ) => {
    if (index === 0) {
      return (
        <td className="number cell" rowSpan={racersNumber}>
          <div className="bold">{teamOrder}</div>
        </td>
      );
    }
    return <></>;
  };

  const tdTeamPoint = (
    index: number,
    teamPoint: number,
    racersNumber: number,
  ) => {
    if (index === 0) {
      return (
        <td className="number cell" rowSpan={racersNumber}>
          <div className="bold">{teamPoint}</div>
        </td>
      );
    }
    return <></>;
  };

  const addNotPointGetterClass = (
    racer: RacerWithSummaryPoint,
    className: string,
  ) => {
    if (racer.pointGetter) {
      return className;
    }
    return `${className} disabled`;
  };

  return (
    <>
      <tr>
        <td style={{ border: 'solid' }} colSpan={17}>
          <h2>{props.team.fullname}</h2>
        </td>
      </tr>
      {props.racers.map((racer, index) => {
        return (
          <tr key={racer.id}>
            {tdSummary(racer)}
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {racer.bib ?? ''}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {racer.seed}
            </td>
            <td className={addNotPointGetterClass(racer, 'cell')}>
              <span className="text">{racer.name}</span>
            </td>
            <td className={addNotPointGetterClass(racer, 'cell')}>
              {racer.kana}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {racer.isFirstTime ? '◆' : ''}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {renderResult(racer.status1, racer.time1)}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {renderResult(racer.status2, racer.time2)}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {renderTime(racer.bestTime)}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {racer.totalOrder}
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              補正
            </td>
            <td className={addNotPointGetterClass(racer, 'number cell')}>
              {racer.point}
            </td>
            {tdSummaryPoint(racer)}
            <td className="number cell">{racer.specialPoint}</td>
            {tdTeamPoint(index, props.team.point, props.racers.length)}
            {tdTeamOrder(index, props.teamOrder, props.racers.length)}
          </tr>
        );
      })}
    </>
  );
}
