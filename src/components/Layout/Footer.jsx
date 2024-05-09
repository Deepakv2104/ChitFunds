import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <div  style={{ backgroundColor: '#0f172a', color: '#fff', padding:'20px' }}>
 <MDBFooter  className='text-center text-lg-start'>
      {/* <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section> */}

      <section className=''>
  <MDBContainer className='text-center text-md-start mt-5'>
    <MDBRow className='mt-3'>
      <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
        <h6 className='text-uppercase fw-bold mb-4'>
          <MDBIcon icon="gem" className="me-0" />
          ChitFunds
        </h6>
        <p>
          ChitFunds is your trusted partner in financial growth through chit funds. Lorem ipsum dolor sit amet,
          consectetur adipisicing elit.
        </p>
      </MDBCol>

      <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
        <h6 className='text-uppercase fw-bold mb-4'>Services</h6>
        <p>
          <a href='#!' className='text-reset'>
         Investments
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
         Management
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
         Consultancy
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
             Platforms
          </a>
        </p>
      </MDBCol>

      <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
        <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
        <p>
          <a href='#!' className='text-reset'>
            About Us
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
            Contact Us
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
            Terms & Conditions
          </a>
        </p>
        <p>
          <a href='#!' className='text-reset'>
            Privacy Policy
          </a>
        </p>
      </MDBCol>

      <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
        <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
        <p>
          <MDBIcon icon="home" className="me-0" />
         Bodduppal, Hyderabad.
        </p>
        <p>
          <MDBIcon icon="envelope" className="me-0" />
          info@chitfunds.com
        </p>
        <p>
          <MDBIcon icon="phone" className="me-0" /> +1 123 456 7890
        </p>
        <p>
          <MDBIcon icon="print" className="me-0" /> +1 234 567 8901
        </p>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</section>

<div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
  © 2024 ChitFunds. All rights reserved.
  <a className='text-reset fw-bold' href='https://chitfunds.com/'>
    ChitFunds.com
  </a>
</div>

    </MDBFooter>
    </div>
   
  );
}