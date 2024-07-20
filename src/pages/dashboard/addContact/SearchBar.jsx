import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ filterText, onFilterTextInput }) => (
  <TextField
    fullWidth
    variant="outlined"
    placeholder="Search..."
    value={filterText}
    onChange={e => onFilterTextInput(e.target.value)}
    className="search-bar"
    sx={{
      '& .MuiInputLabel-root': { color: '#1976d2' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: '#1976d2' },
        '&:hover fieldset': { borderColor: '#1976d2' },
        '&.Mui-focused fieldset': { borderColor: '#1976d2' },
      },
    }}
  />
);

export default SearchBar;
