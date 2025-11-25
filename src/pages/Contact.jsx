import { Container, Form, Button } from 'react-bootstrap';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formularz został wysłany!');
  };

  return (
    <Container className="page-content">
      <h1 className="mb-4">Kontakt</h1>
      <p className="lead mb-4">
        Skontaktuj się z nami używając poniższego formularza.
      </p>
      
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group className="mb-3">
          <Form.Label>Imię i nazwisko</Form.Label>
          <Form.Control type="text" placeholder="Wprowadź imię i nazwisko" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="twoj@email.com" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Wiadomość</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder="Twoja wiadomość..." required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Wyślij
        </Button>
      </Form>
    </Container>
  );
}

export default Contact;
