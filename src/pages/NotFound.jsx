import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className="page-content text-center">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Strona nie znaleziona</h2>
      <p className="lead mb-4">
        Przepraszamy, strona której szukasz nie istnieje.
      </p>
      <Button as={Link} to="/" variant="primary">
        Powrót do strony głównej
      </Button>
    </Container>
  );
}

export default NotFound;
