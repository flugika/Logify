import React, { useMemo, useRef, useState } from 'react';
import { Box, FormControl, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import './Filter.css';
import { provinces } from "../../constants/Signup";

interface ProvinceFilterProps {
  Province: string;
  setProvince: (Province: string) => void;
}

const ProvinceFilter: React.FC<ProvinceFilterProps> = ({ Province, setProvince }) => {
  const [Keyword, setKeyword] = useState<string>("");

  const textFieldRef = useRef<HTMLInputElement>(null);

  // Filter provinces based on the keyword
  const filteredProvinces = useMemo(() => {
    return provinces.filter(province =>
      province.toLowerCase().includes(Keyword.toLowerCase())
    );
  }, [Keyword]);

  return (
    <Box sx={{ Width: "160px", padding: "1rem 0", margin: "0 auto" }}>
      <FormControl fullWidth size="small" className="filter-form">
        <Autocomplete
          className="filter-autocomplete"
          value={Province}
          onChange={(event, newValue) => {
            setProvince(newValue || "");
            if (textFieldRef.current) {
              textFieldRef.current.blur();
            }
          }}
          options={filteredProvinces}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="province"
              variant="outlined"
              onChange={e => setKeyword(e.target.value)}
              inputRef={textFieldRef}
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#384137', // Default label color
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    color: '#384137', // Color when focused
                  },
                },
                '& .MuiInputBase-root': {
                  color: '#384137', // Input text color
                  height: '100%', // Ensure input field matches height
                  borderRadius: '30px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 0, // No border for the outline
                },
                '& .MuiAutocomplete-popupIndicator': {
                  color: '#384137', // Dropdown indicator color
                },
                '& .MuiAutocomplete-option': {
                  color: '#384137', // Dropdown option text color
                },
                '& .MuiAutocomplete-option.Mui-focused': {
                  backgroundColor: '#f3f3f3', // Background color on hover
                },
              }}
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default ProvinceFilter;
