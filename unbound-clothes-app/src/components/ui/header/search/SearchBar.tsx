import { useState } from "react"
import Styles from "./SearchBar.module.css"
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar = ({ isOpen, setIsOpen }: SearchBarProps) => {
    
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const toggleSearch = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(prev => !prev);
    };
    
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim() !== "") {
            navigate(`/products?q=${query.trim()}`);
            setIsOpen(false);
            setQuery("");
        }
    }

    return (
        <>
            <div 
                className={Styles.searchBarContainer}
                onClick={toggleSearch}
                aria-label="Search Products"
                title="Search Products"
            >
                <Search className={Styles.searchIcon}/>
                {isOpen && (
                    <input 
                        type="text" 
                        className={Styles.searchInput}
                        placeholder="Search..."
                        autoFocus
                        autoCorrect="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside input
                    />
                )}
            </div>
        </>
    )
}

export default SearchBar
