import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { setSelectedCategory } from '../../stores/Slice/searchSlice';
import './Filter.css';

const CategoryFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategory } = useSelector((state: RootState) => state.search.data);

  return (
    <Box sx={{ width: "100%", padding: "1rem 0", margin: "0 auto" }}>
      <FormControl fullWidth size="small" className="filter-form">
        <InputLabel 
          id="category-select-label" 
          className="filter-label"
          sx={{
            fontSize: "1rem",
            color: "#384137",
            '&.Mui-focused': {
              color: "#384137",
            },
          }}
        >
          category
        </InputLabel>
        <Select
          labelId="category-select-label"
          value={selectedCategory ?? ''}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value as number | null))}
          label="Mood"
          className="filter-select"
          sx={{ color: "#fff" }}
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
          <MenuItem 
            value=""
            className="filter-menuitem"
            sx={{
              color: "#555",
              '& .MuiSelect-select': {
                color: "#555" // Font color of selected option
              }
            }}
          >
            <em>ทั้งหมด</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem 
              key={category.ID} 
              value={category.ID}
              className="filter-menuitem"
              sx={{
                color: "#555",
                '& .MuiSelect-select': {
                  color: "#555" // Font color of selected option
                }
              }}
            >
              {category.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategoryFilter;
