import { useParams } from 'react-router-dom';

export function TaskRoute(): JSX.Element {
  const { id } = useParams();

  return (
    <div>
      <p>{id}</p>
    </div>
  );
}
