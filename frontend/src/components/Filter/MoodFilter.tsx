import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { setSelectedMood } from '../../stores/Slice/searchSlice';
import './Filter.css';

const MoodFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { moods, selectedMood } = useSelector((state: RootState) => state.search.data);

  return (
    <Box sx={{ width: "100%", padding: "1rem 0", margin: "0 auto" }}>
      <FormControl fullWidth size="small" className="filter-form">
        <InputLabel id="mood-select-label" className="filter-label"
          sx={{
            fontSize: "1rem",
            color: "#384137",
            '&.Mui-focused': {
              color: "#384137",
            },
          }}>
          mood
        </InputLabel>
        <Select
          labelId="mood-select-label"
          value={selectedMood ?? ''}
          onChange={(e) => dispatch(setSelectedMood(e.target.value as number | null))}
          label="Mood"
          className="filter-select"
          fullWidth
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                overflowY: 'auto',
              }
            }
          }}
        >
          <MenuItem value="" className="filter-menuitem"
            sx={{
              color: "#555",
              '& .MuiSelect-select': {
                color: "#555" // Font color of the selected option
              }
            }}>
            <em>ทั้งหมด</em>
          </MenuItem>
          {moods.map((mood) => (
            <MenuItem key={mood.ID} value={mood.ID}
              className="filter-menuitem"
              sx={{
                color: "#555",
                '& .MuiSelect-select': {
                  color: "#555" // Font color of the selected option
                }
              }}>
              {mood.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MoodFilter;
