import React from 'react';
import Style from './SearchPage.module.css';
import SearchBar from './SearchBar/SearchBar';

interface SearchPageProps {
    keyword: string;
    setKeyword: (keyword: string) => void;
    searchData: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ searchData, keyword, setKeyword }) => {
    return (
        <div className={Style.SearchPage}>
            <SearchBar searchData={searchData} keyword={keyword} setKeyword={setKeyword}/>
        </div>
    );
};

export default SearchPage;
