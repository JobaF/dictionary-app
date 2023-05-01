import { FC } from "react";

interface SearchIconProps {
  styling: string;
  isDarkMode: boolean;
}

const SearchIcon: FC<SearchIconProps> = ({ styling, isDarkMode }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke={isDarkMode ? "rgb(192, 132, 252)" : "rgb(126,34,206)"}
      className={styling}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

export default SearchIcon;
