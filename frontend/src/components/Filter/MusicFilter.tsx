import React, { useEffect, useRef, useState } from 'react';
import { Box, FormControl, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { setSelectedMusic } from '../../stores/Slice/searchSlice';
import './Filter.css';
import { MusicInterface } from "../../interfaces/IMusic";
import { ListMusics } from "../../services/HttpClientService";

interface MusicFilterProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
}

const MusicFilter: React.FC<MusicFilterProps> = ({ keyword, setKeyword }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMusic } = useSelector((state: RootState) => state.search.data);
  const [musics, setMusics] = useState<MusicInterface[]>([]);

  const listMusics = async () => {
    const res = await ListMusics();
    if (res) {
      setMusics(res);
    }
  };

  const filteredOptions = musics.filter((music: MusicInterface) =>
    (music.Name + "").toLowerCase().includes(keyword.toLowerCase())
  );

  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleSelectChange = (event: any, newValue: MusicInterface | null) => {
    dispatch(setSelectedMusic(newValue ? newValue.ID || 0 : null));
    if (textFieldRef.current) {
      textFieldRef.current.blur();
    }
  };

  useEffect(() => {
    listMusics();
  }, []);

  return (
    <Box sx={{ Width: "160px", padding: "1rem 0", margin: "0 auto" }}>
      <FormControl fullWidth size="small" className="filter-form">
        <Autocomplete
          className="filter-autocomplete"
          value={musics.find((music: MusicInterface) => music.ID === selectedMusic) || null}
          onChange={handleSelectChange}
          options={filteredOptions}
          getOptionLabel={(option) => {
            const name = option.Name || "";
            const artist = option.Artist || "";

            return `${name} | ${artist}`;
          }}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="music"
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

export default MusicFilter;
