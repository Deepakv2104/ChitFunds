import React from 'react';
import './styles/ExistingChitPage.css';

const ExistingChits = () => {
  return (
    <div className='existing-chit-page'>
      <div className='existing-sidebar'>
        <button className='option'>1 lakh</button>
        <button className='option'>2 lakh</button>
        <button className='option'>5 lakh</button>
        <button className='option'>10 lakh</button>
      </div>
      <div className='main-content-existing-page'>
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Date of Creation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Example Group 1</td>
              <td>01/01/2023</td>
            </tr>
            <tr>
              <td>Example Group 2</td>
              <td>02/02/2023</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExistingChits;
