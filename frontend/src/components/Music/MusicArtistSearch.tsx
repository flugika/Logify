import { Box, FormControl, InputAdornment, TextField } from '@mui/material';
import { setArtist } from "../../stores/Slice/musicSlice";
import '../Filter/Filter.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../stores/store";
import { BsArrowRight } from "react-icons/bs";
import React from "react";

interface MusicArtistSearchProps {
  searchData: () => void; // Expect a function with no arguments
}

const MusicArtistSearch: React.FC<MusicArtistSearchProps> = ({ searchData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { artist } = useSelector((state: RootState) => state.music.data);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchData();
    }
  };

  return (
    <Box
      sx={{
        minWidth: "200px",
        width: { xs: "100%", md: "320px" },
        padding: "1rem 0",
        margin: "0 auto"
      }}
    >
      <FormControl fullWidth size="small" className="filter-form">
        <TextField
          className="filter-select"
          label="artist"
          value={artist}
          onChange={(e) => dispatch(setArtist(e.target.value))}
          onKeyDown={handleKeyDown}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <BsArrowRight
                  onClick={searchData}
                  style={{ cursor: 'pointer', fontSize: '1.5rem' }} // Adjust icon size as needed
                />
              </InputAdornment>
            ),
            sx: {
              textAlign: 'center',
              input: {
                padding: "6px 12px",  // Adjust padding for better appearance
              },
            },
          }}
          InputLabelProps={{
            sx: {
              mt: '-5px',  // Adjust margin-top if label overlaps
              ml: '0px',  // Adjust margin-left for label positioning
              fontSize: "1rem",  // Font size of the label
              color: "#384137",   // Color of the label
              '&.Mui-focused': {
                color: "#384137",  // Label color when input is focused
              },
              '&.MuiInputLabel-shrink': {
                transform: 'translate(12px, -8px) scale(0.75)',  // Custom label shrink behavior
              },
            },
          }}
          sx={{
            height: "40px",  // Height of the text field
            fontSize: "1rem",
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',  // Round the input field
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default MusicArtistSearch;
