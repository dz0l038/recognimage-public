import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Routing from './struct/pages/Routing';

Amplify.configure(awsconfig);

function App() {
  return (
    <Router><Routing></Routing></Router>
  );
}

export default App;
