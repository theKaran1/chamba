import React from 'react'
import { Link } from 'react-router'
import dashboard from '../../assets/img/dashboard.png'
import userImg from '../../assets/img/userImg.png'
import interviewImg from '../../assets/img/interview.png'
import add from '../../assets/img/plus.png'
import qualification from '../../assets/img/qualification.png'
import techArea from '../../assets/img/tech.png'
import logo from '../../assets/img/logo.png'
import Button from '../utils/Button'
import settingImg from '../../assets/img/settings.png'
import domainOfInterest from '../../assets/img/domain.png';
import candidateIcon from '../../assets/img/candidateact.png'
import lessIcon from '../../assets/img/up-arrow.png'

import { useState } from 'react'
export const SideBar = () => {

  const [isDropDownOpen, setDropDownStatus] = useState(false)

  const handleDropDown = () => {
    setDropDownStatus(!isDropDownOpen);
  }
  return (
    <div className='sidebar-container'>
      <div id="logo"><img src={logo} alt="" /></div>
      <div className='sidebar-menu'>
        {/* <div className='heading'>
          <span>Dashboard</span>
        </div> */}
        < div className='sidebar-menu-items'>
          <div className='sidebar-content'><img src={dashboard} alt="" /><Link to="/dashboard">Dashboard</Link></div>
          <div className='sidebar-content' onClick={handleDropDown}><img src={candidateIcon} alt="" /> <Link>Candidate</Link></div>
          {isDropDownOpen ? (
            <div className='candidate-sub-menu'>
                <div className='sidebar-sub-menu-content'>
               <Link to='/add-candidate'>Add Candidate</Link>
             </div>
            <div className='sidebar-sub-menu-content'>
              <Link to='/candidates'>Candidate List</Link>
            </div>
            </div>
             
          ) : null}

          <div className='sidebar-content'><img src={interviewImg} alt="" /> <Link>Interview</Link></div>
          <div className='sidebar-content'><img src={domainOfInterest} alt="/doaminOfIntrest" /> <Link to="/add-domainOfIntrest/">Domain</Link> </div>
          <div className='sidebar-content'><img src={qualification} alt="" /> <Link to="/add-qualifications">Qualification</Link></div>
          <div className='sidebar-content'> <img src={techArea} alt="" /> <Link to="/add-techarea">Tech area</Link></div>
        </div>
        <div className="sidebar-menu-items">
          <div className='sidebar-content'><Button id=""><img src={settingImg} alt="" /><span>Settings</span></Button></div>
        </div>
      </div>
    </div>
  )
}
