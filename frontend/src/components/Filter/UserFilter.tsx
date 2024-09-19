import React, { useEffect, useRef, useState } from 'react';
import { Box, FormControl, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../stores/store';
import { setSelectedUser } from '../../stores/Slice/searchSlice';
import './Filter.css';
import { UserInterface } from "../../interfaces/IUser";
import { ListUsers } from "../../services/HttpClientService";

interface UserFilterProps {
  userLog: string;
  setUserLog: (userLog: string) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ userLog, setUserLog }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser } = useSelector((state: RootState) => state.search.data);
  const [users, setUsers] = useState<UserInterface[]>([]);

  const listUsers = async () => {
    const res = await ListUsers();
    if (res) {
      setUsers(res);
    }
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserLog(event.target.value);
  };

  const filteredOptions = users.filter((user: UserInterface) =>
    (user.Username + "" || user.Firstname + "" || user.Lastname + "").toLowerCase().includes(userLog.toLowerCase())
  );

  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleSelectChange = (event: any, newValue: UserInterface | null) => {
    dispatch(setSelectedUser(newValue ? newValue.ID || 0 : null));
    if (textFieldRef.current) {
      textFieldRef.current.blur();
    }
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <Box sx={{ Width: "160px", padding: "1rem 0", margin: "0 auto" }}>
      <FormControl fullWidth size="small" className="filter-form">
        <Autocomplete
          className="filter-autocomplete"
          value={users.find((user: UserInterface) => user.ID === selectedUser) || null}
          onChange={handleSelectChange}
          options={filteredOptions}
          getOptionLabel={(option) => {
            const username = option.Username || "";
            const firstname = option.Firstname || "";
            const lastname = option.Lastname || "";

            const fullname = [firstname, lastname].filter(Boolean).join(" ");
            return `${username} (${fullname})`;
          }}

          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              label="user"
              variant="outlined"
              onChange={handleKeywordChange}
              inputRef={textFieldRef}
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#384137',
                  fontSize: '1rem',
                  '&.Mui-focused': {
                    color: '#384137',
                  },
                },
                '& .MuiInputBase-root': {
                  color: '#384137',
                  borderRadius: '30px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                '& .MuiAutocomplete-popupIndicator': {
                  color: '#384137',
                },
                '& .MuiAutocomplete-option': {
                  color: '#384137',
                },
                '& .MuiAutocomplete-option.Mui-focused': {
                  backgroundColor: '#f3f3f3',
                },
              }}
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export default UserFilter;
