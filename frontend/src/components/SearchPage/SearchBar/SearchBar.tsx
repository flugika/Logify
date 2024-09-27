import React from 'react';
import Style from './SearchBar.module.css';
import { BsSearch, BsArrowRight } from 'react-icons/bs';

interface SearchBarProps {
    keyword: string;
    setKeyword: (keyword: string) => void;
    searchData: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchData, keyword, setKeyword }) => {

    const handleSearch = () => {
        searchData();
    };

    const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            searchData();
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
