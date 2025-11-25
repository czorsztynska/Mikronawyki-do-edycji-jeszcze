import { Container } from 'react-bootstrap';

function About() {
  return (
    <Container className="page-content">
      <h1 className="mb-4">O nas</h1>
      <p className="lead">
        To jest przykładowa strona "O nas" stworzona z wykorzystaniem React Router.
      </p>
      <p>
        Ten projekt wykorzystuje następujące technologie:
      </p>
      <ul>
        <li>Vite - szybki build tool</li>
        <li>React - biblioteka do budowy UI</li>
        <li>React Router - routing w aplikacji</li>
        <li>Bootstrap - framework CSS</li>
        <li>SCSS - preprocessor CSS</li>
      </ul>
    </Container>
  );
}

export default About;
