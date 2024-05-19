import React from 'react';
import { Link } from 'react-router-dom';

const OneLakhChit = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', marginTop: '30px'}}>
            <h2>1 Lakh Chit Page</h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link
                    to="/existingchit?title=Your existing's chit"
                    style={{
                        display: 'inline-block',    
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        marginTop: '30px',
                        marginBottom: '10px',
                    }}
                >
                    Existing Chit
                </Link>
                <Link
                    to="NewChitPage"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        marginTop: '20px',
                        marginBottom: '10px',
                    }}
                >
                    New Chit
                </Link>
            </div>
        </div>
    );
};

export default OneLakhChit;
