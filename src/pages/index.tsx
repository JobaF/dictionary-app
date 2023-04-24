import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");

  const fetchDictionaryWord = async (word: string) => {
    const searchURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await axios.get(searchURL);
    return response.data;
  };

  const getWord = () => {};

  const { data, isLoading, isFetching, error, isError } = useQuery({
    queryKey: ["dictionaryEntry"], // query key that will help to cache data, you can set it whatever you like
    queryFn: getWord, // the function that will be executed to actually fetch the data
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value);
  };

  return (
    <div className="h-screen bg-gray-300 flex flex-col items-center gap-2 pt-5">
      <h1 className="text-xl">Search for a word: </h1>
      <input
        className="w-1/5 h-8"
        type="text"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
}
