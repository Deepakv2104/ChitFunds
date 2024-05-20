import React from 'react';
import { Link } from 'react-router-dom';

const TwoLakhChit = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100vh', marginTop: '30px'}}>
            <br></br>
            <br></br>
            <h2>2 Lakh Chit Page</h2>
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
                    to="/newchit?title=Create a new chit"
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

export default TwoLakhChit;
