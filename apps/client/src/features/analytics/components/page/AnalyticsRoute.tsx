import { useParams } from 'react-router-dom';

export function AnalyticsRoute(): JSX.Element {
  const { id } = useParams();
  return (
    <div>
      <p>Much Graphs for {id}</p>
    </div>
  );
}
