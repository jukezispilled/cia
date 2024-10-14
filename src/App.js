import React, { useState } from 'react';
import Dash from './Dash';

const App = () => {
  const [password, setPassword] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const correctPassword = 'secret';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAccessGranted(true);
    } else {
      alert('Access Denied. Try again.');
    }
  };

  if (!accessGranted) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center relative bg-black">        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="hint: secret"
            className="w-64 px-4 py-2 mb-4 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-64 px-4 py-2 bg-white font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Dash />
    </div>
  );
}

export default App;