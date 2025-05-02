import { Spinner } from 'react-bootstrap';

const Loader = ({ fullScreen }) => (
  <div className={`d-flex justify-content-center align-items-center ${fullScreen ? 'vh-100' : ''}`}>
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;