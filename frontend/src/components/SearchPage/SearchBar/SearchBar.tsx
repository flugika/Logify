import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import Style from './SearchBar.module.css';
import { BsSearch, BsArrowRight } from 'react-icons/bs';
import { SearchLogs } from "../../../services/HttpClientService";
import { LogInterface } from "../../../interfaces/ILog";

interface SearchBarProps {
    setLogs: (logs: LogInterface[]) => void;
    keyword: string;
    setKeyword: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setLogs, keyword, setKeyword }) => {
    const { selectedUser, selectedMood, selectedCategory } = useSelector((state: RootState) => state.search.data);

    const fetchData = async () => {
        try {
            const res = await SearchLogs({
                userID: selectedUser,
                keyword,
                moodID: selectedMood,
                categoryID: selectedCategory
            });

            if (res) {
                setLogs(res);
            } else {
                setLogs([]);
            }
        } catch (error) {
            console.error("Error fetching logs", error);
        }
    };

    const handleSearch = () => {
        fetchData();
    };

    const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            fetchData();
        }
    };

    return (
        <div className={Style.SearchBar}>
            <div className={Style.SearchBarBox}>
                <BsSearch className={Style.SearchBarBoxIcon} onClick={handleSearch} />
                <input
                    type="text"
                    placeholder="Search logs..."
                    style={{ color: "#384137", fontSize: "1.2rem" }}
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={handleKeyDown}
                />
                <BsArrowRight className={Style.SearchBarBoxIcon} onClick={handleSearch} />
            </div>
        </div>
    );
};

export default SearchBar;
