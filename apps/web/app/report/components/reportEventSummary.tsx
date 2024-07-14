import { getEvent } from '../../actions/event/getEvent';

export default async function ReportEventSummary() {
  const event = await getEvent();
  return (
    <>
      <h2>{event.name}</h2>
      <table>
        <tbody>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              日程
            </th>
            <td>
              {event.date.getFullYear()}年{event.date.getMonth()}月
              {event.date.getDate()}日（{event.date.getDate()}）
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              場所
            </th>
            <td> {event.location}</td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              種目
            </th>
            <td>{event.race}</td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              ポールセッター
            </th>
            <td>{event.setter}</td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              幹事会社
            </th>
            <td> {event.management}</td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: 'left' }}>
              主催
            </th>
            <td>全国設計事務所スキー会</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
