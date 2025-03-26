import React from 'react'
import AddCandidate from './components/candidate/AddCandidate'
import { BrowserRouter,Route,Routes } from 'react-router'
import Login from './components/Auth/Login';
import DomainIntrest from './components/Miscellaneous/DomainIntrest';
import Title from './components/PageSections/Title';
import ProtectedRoute from './components/Auth/ProtectedRoutes'
import Qualifications from './components/Miscellaneous/Qualifications';
import TechArea from './components/Miscellaneous/TechArea';
import { createContext  } from 'react';
import Candidates from './components/candidate/Candidates'; 
import Dashboard from './components/dashboard/dashboard';
const App = () => {
  return (
    <div>
       <BrowserRouter>
     <div className="title-container">
        <Title/>
        </div>
    
      <div style={{display: "flex"}} className='main'>
 
          <Routes>
          <Route element={<ProtectedRoute />}>
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/dashboard" element ={<Dashboard/>}/>
          </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path='/add-domainOfIntrest' element={<DomainIntrest/>}/>
            <Route path='/add-qualifications' element={<Qualifications/>}/>
            <Route path='/add-techarea' element={<TechArea/>}/> 
            <Route path='/candidates' element={<Candidates/>}/> 
          </Routes>
          </div>
        
      </BrowserRouter>
    </div>
  )
}

export default App
