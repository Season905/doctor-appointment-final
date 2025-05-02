import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Button as={Link} to="/" variant="primary">
        Return to Home
      </Button>
    </div>
  );
};

export default NotFound;