import { useParams } from "react-router-dom";

const RequestsScreen = () => {
  const { event } = useParams();

  return (
    <div>
      <h1>Requests</h1>
      <p>Event: {event}</p>
    </div>
  );
};

export default RequestsScreen;
