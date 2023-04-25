import { DictionaryResponseSchema } from "@/utils/DictionaryResponseSchema";
import useDebounce from "@/utils/useDebounce";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";

type DictionaryResponse = z.infer<typeof DictionaryResponseSchema>;

const getDictionaryEntry = async (word: string) => {
  const { data } = await axios.get<DictionaryResponse>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return DictionaryResponseSchema.parse(data);
};

export default function Home() {
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce<string>(searchValue);

  const { isLoading, isError, isSuccess, data } = useQuery(
    ["dictionaryEntry", debouncedSearchValue],
    () => getDictionaryEntry(debouncedSearchValue),
    {
      enabled: debouncedSearchValue.length > 0,
    }
  );
  console.log(data);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value.toLowerCase());
  };

  const renderResult = () => {
    if (isLoading) {
      return <div className="search-message">Loading...</div>;
    }
    if (isError) {
      return <div className="search-message">Something went wrong</div>;
    }
    if (isSuccess) {
      return (
        <div className="flex flex-col text-xl gap-5 pl-5">
          <p className="font-bold text-3xl">{data && data[0].word}</p>
          <p className="font-bold text-3xl">
            {data[0].phonetic && data[0].phonetic}
          </p>
          {data.map((entry, i) => (
            <div key={i} className="mt-4">
              {entry.meanings.map((meaning, i) => (
                <div key={meaning.partOfSpeech + i}>
                  <p className="text-2xl font-bold my-4">
                    {meaning.partOfSpeech}
                  </p>
                  <ul className="list-disc list-inside flex flex-col gap-3 text-justify pr-10">
                    {meaning.definitions?.slice(0, 3).map((definition, i) => (
                      <li key={i}>{definition.definition}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }
    return <></>;
  };

  return (
    <div className="flex flex-col items-center gap-2 pt-5">
      <h1 className="text-xl">Search for a word: </h1>
      <input
        className="w-1/5 h-8 shadow-lg border rounded-lg border-gray-400 px-3"
        type="text"
        value={searchValue}
        onChange={handleChange}
      />
      {renderResult()}
    </div>
  );
}
