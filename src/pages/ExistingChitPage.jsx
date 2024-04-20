import React from 'react';
import { useLocation } from 'react-router-dom';

const ExistingChitPage = () => {
    const location = useLocation();
    const title = new URLSearchParams(location.search).get('title');
    
    return (
        <div>
            <h2>{title}</h2>
            {/* Add your content for existing chit here */}
        </div>
    );
};

export default ExistingChitPage;
