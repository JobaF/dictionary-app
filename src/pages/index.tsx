import useDebounce from "@/utils/debounce";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };

  return (
    <div className="h-screen bg-gray-300 flex flex-col items-center gap-10">
      <input
        className="w-1/5 h-8 mt-5"
        type="text"
        value={searchValue}
        onChange={handleChange}
      />

      <h2>Message: {debouncedSearchValue}</h2>
    </div>
  );
}
