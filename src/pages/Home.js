function Home() {
  return (
    <div className="page">
      <h1>Welcome to Monopoly Bank Management</h1>
      <p className="intro">Dive deep into the world of Monopoly with our digital banking system designed specifically for the Indian edition.</p>
      
      <section className="overview">
        <h2>Why Use This App?</h2>
        <ul>
          <li>Digitize all financial transactions - no more physical cash handling</li>
          <li>Automate calculations for rents, taxes, and fines to prevent errors</li>
          <li>Track property ownership with visual indicators</li>
          <li>Manage player balances in real-time</li>
          <li>Access transaction history through local storage persistence</li>
          <li>Streamline complex operations like property management and rent payments</li>
        </ul>
      </section>
      
      <section className="modules">
        <h2>Key Features</h2>
        
        <div className="module">
          <h3>Player Management</h3>
          <ul>
            <li>Add/Remove Players with unique IDs</li>
            <li>Real-time balance tracking in ₹ currency</li>
          </ul>
        </div>
        
        <div className="module">
          <h3>Property Management</h3>
          <ul>
            <li>Complete Indian-themed property database (28 properties)</li>
            <li>Color-coded property groups</li>
            <li>Clear ownership tracking</li>
            <li>Integrated buy/sell functionality</li>
            <li>Automatic rent calculation</li>
          </ul>
        </div>
        
        <div className="module">
          <h3>Banking Operations</h3>
          <ul>
            <li>Player-to-player transactions</li>
            <li>Bank payments for taxes, fines, and fees</li>
            <li>Bulk payment options</li>
            <li>Transaction verification</li>
          </ul>
        </div>
        
        <div className="module">
          <h3>Game Management</h3>
          <ul>
            <li>Data persistence with localStorage</li>
            <li>Secure game reset functionality</li>
            <li>Detailed rule reference</li>
            <li>Responsive design for desktop and mobile</li>
          </ul>
        </div>
      </section>
      
      <p className="footer-note">This web app is designed to manage the bank while playing Monopoly live on a physical board.</p>
    </div>
  );
}

export default Home;