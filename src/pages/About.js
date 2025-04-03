import { useState } from "react";

function About() {
  const [showDetails, setShowDetails] = useState(false);
  const [showDetails1, setShowDetails1] = useState(false);

  return (
    <div className="page">
      <h1>About Us</h1>
      <p><strong>Name</strong> - Pratham Raval </p>
      <p><strong>Registration Number</strong> - 23BCI0147 </p>
      <p><strong>Course Code:</strong> BCSE203E</p> 
        <p><strong>Course Title:</strong> Web Programming</p>
        <p><strong>Faculty:</strong> SIVAKUMAR V</p>
        <p><strong>Slot:</strong> L37+L38+L53+L54</p>
      <p></p>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Project Details" : "More About Project"}
      </button>
      <p></p>
      <button onClick={() => setShowDetails1(!showDetails1)}>
        {showDetails1 ? "Hide Developer Details" : "More About Developer"}
      </button>

      {showDetails && (
        <>
        <h2>About the Project</h2>
        <p>Welcome to the <strong>Monopoly Bank Management System</strong>, a modern solution designed to digitalize the banking experience in the classic Monopoly game. Managing cash transactions manually can be slow and error-prone, so we created an intuitive and efficient system to handle all your banking needs seamlessly.  
          Our web app, built with <strong>HTML, CSS, JavaScript, and React.js</strong>, automates the Monopoly banking process, ensuring smooth transactions, accurate calculations, and a hassle-free gaming experience. Whether you're transferring money, collecting rent, or handling fines, our system makes every financial move effortless.  
          With a user-friendly interface and all the essential banking features, our goal is to enhance your Monopoly sessions—making them faster, fairer, and more enjoyable. Say goodbye to misplaced cash and math mistakes; let our digital banker take care of everything while you focus on strategy and fun!  
          Enjoy a smarter, faster, and more engaging Monopoly experience with our digital banking solution!
        </p>
        </>
      )}
      {showDetails1 && (
        <>
        <h2>About the Developer</h2>
        <p>
        Meet the mind behind the magic! <strong>Pratham Raval 23BCI0147</strong>. A passionate front-end developer who transforms lines of code into stunning, interactive, and futuristic web experiences. From crafting pixel-perfect designs to ensuring seamless user interactions, every project is an art piece in the making.  
        Armed with <strong>HTML, CSS, JavaScript, and React.js</strong>, they breathe life into ideas, making websites not just functional but visually mesmerizing. Whether it's building sleek UI components, optimizing performance, or adding those subtle animations that make a website feel alive—this developer does it all.  
        Fueled by caffeine and creativity, they are always exploring the latest trends in web development, pushing boundaries, and making the web a more beautiful place. When not coding, you’ll find them geeking out over futuristic UI concepts, testing new design trends, or contributing to open-source projects.  
        If you love innovation, speed, and an eye for detail—this is the developer you’d want on your team!
        </p>
        </>
      )}
    </div>
  );
}

export default About;
