import CounterButton from './CounterButton';

export default function Footer() {
  return (
    <footer
      className="footer"
      style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid #e0e0e0',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <p className="footer-text" style={{ margin: '0 0 0.5rem 0' }}>
        Static footer content &bull; &copy; 2026 FleetPulse. Fleet Dashboard &amp; Analytics.
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSf5l-IV1kYlZ6qyIbToGAoPGTorR_fMonOO1-SaUtpEZ-wN7Q/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Give us feedback
        </a>
        {/* Use another Client Component leaf here */}
        <CounterButton />
      </div>
    </footer>
  );
}
