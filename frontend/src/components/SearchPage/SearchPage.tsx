import React from 'react';
import Style from './SearchPage.module.css';
import SearchBar from './SearchBar/SearchBar'; // Correct import
import { LogInterface } from "../../interfaces/ILog";

interface SearchPageProps {
    setLogs: (logs: LogInterface[]) => void;
    keyword: string;
    setKeyword: (keyword: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ setLogs, keyword, setKeyword }) => {
    return (
        <div className={Style.SearchPage}>
            <SearchBar setLogs={setLogs} keyword={keyword} setKeyword={setKeyword} />
        </div>
    );
};

export default SearchPage;
