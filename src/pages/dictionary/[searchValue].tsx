import SearchIcon from "@/components/SearchIcon";
import { DictionaryResponseSchema } from "@/utils/DictionaryResponseSchema";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import useSound from "use-sound";
import { PlayIcon } from "@/components/PlayIcon";
import { PauseIcon } from "@/components/PauseIcon";
import { BookIcon } from "@/components/BookIcon";
import { SunIcon } from "@/components/SunIcon";
import { MoonIcon } from "@/components/MoonIcon";
import { useTheme } from "next-themes";

type DictionaryResponse = z.infer<typeof DictionaryResponseSchema>;

const getDictionaryEntry = async (word: string) => {
  const { data } = await axios.get<DictionaryResponse>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return DictionaryResponseSchema.parse(data);
};

interface dictionaryEntryProps {
  data: DictionaryResponse | null;
  searchValue: string;
  isError: boolean;
  soundURL?: string | null;
}

type Font = "font-serif" | "font-sans" | "font-mono";

const DictionaryEntry: FC<dictionaryEntryProps> = (props) => {
  const [inputSearchValue, setInputSearchValue] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const [fontSelectValue, setFontSelectValue] = useState<Font>("font-sans");
  const router = useRouter();
  const { searchValue } = props;
  const [soundIsPlaying, setSoundIsPlaying] = useState<boolean>(false);
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ["dictionaryEntry", searchValue],
    queryFn: () => getDictionaryEntry(searchValue),
    initialData: props.data,
    enabled: !props.isError,
  });
  const [mounted, setMounted] = useState(false);

  const [play, { duration }] = useSound(props.soundURL as string);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputSearchValue(event.currentTarget.value.toLowerCase());
  };
  const handleFontChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFontSelectValue(event.target.value as Font);
    console.log(event.target.value as Font);
  };
  const toggleDarkMode = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (soundIsPlaying) {
      play();
      const playingSoundInterval = setInterval(() => {
        setSoundIsPlaying(false);
      }, duration!);
      return () => clearInterval(playingSoundInterval);
    }
  }, [soundIsPlaying]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    inputSearchValue: string
  ): void => {
    event.preventDefault();
    if (inputSearchValue !== searchValue && inputSearchValue.length > 0)
      router.push("/dictionary/" + inputSearchValue);
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
        <div className="flex flex-col sm:shadow-md p-8 sm:rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-5xl mb-2">{data && data[0].word}</p>
              <p className="text-2xl text-purple-700 dark:text-purple-400">
                {data && data[0].phonetic && data[0].phonetic}
              </p>
            </div>
            {props.soundURL && (
              <button
                disabled={soundIsPlaying}
                onClick={() => setSoundIsPlaying(true)}
                className="w-16 h-16 rounded-full bg-purple-300 hover:bg-purple-900 focus:outline-none flex justify-center items-center"
              >
                {soundIsPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
          </div>
          <div className="mt-4 mb-4">
            {data &&
              data[0]?.meanings.map((meaning, i) => (
                <div key={meaning.partOfSpeech + i} className="mt-4 mb-10">
                  <div className="flex w-full items-center justify-between mb-8">
                    <p className="text-2xl italic pr-6">
                      {meaning.partOfSpeech}
                    </p>
                    <hr className="bg-gray-300 opacity-100 dark:opacity-50 w-full h-0.5" />
                  </div>
                  <p className="text-lg font-light mb-4">Meaning</p>
                  <ul className="list-disc list-outside marker:text-purple-700 dark:marker:text-purple-500 flex flex-col gap-3 text-justify text-md pl-7 sm:pr-10 mb-4">
                    {meaning.definitions?.slice(0, 3).map((definition, i) => (
                      <div key={i}>
                        <li className="pl-2">{definition.definition}</li>
                        {definition.example && (
                          <div className="mt-3 mb-3 text-gray-500">
                            {`"` + definition.example + `"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                  {meaning.synonyms[0] && (
                    <div className="text-lg font-light">
                      Synonyms:{" "}
                      <span className="text-purple-700 dark:text-purple-400 pl-5">
                        {meaning.synonyms.slice(0, 4).map((synonym, i) => (
                          <span key={"synonym" + i} className="mr-2">
                            {synonym}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
          <hr className="bg-gray-300 opacity-100 dark:opacity-50 w-full h-0.5" />
          <div className=" h-8 mt-8">
            <span className="text-gray-500 mr-4"> Source </span>
            {data && (
              <a className="underline" href={data[0].sourceUrls[0]}>
                {data[0].sourceUrls[0]}
              </a>
            )}{" "}
          </div>
        </div>
      );
    }
    return <></>;
  };
  if (!mounted) return null;
  return (
    <div
      className={`${fontSelectValue} flex flex-col items-center gap-2 bg-gray-100 min-h-screen h-full dark:bg-gray-800 pt-4 gap-4`}
    >
      <div className="text-xl min-w-min w-3/4 md:w-1/2 xl:w-1/4  h-14 flex items-center justify-between">
        <BookIcon isDarkMode={theme === "dark"} />
        <select
          value={fontSelectValue}
          onChange={handleFontChange}
          className="bg-gray-50 text-sm md:text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 p-2.5 dark:bg-gray-700 border shadow-md mr-2"
        >
          <option value="font-serif">Serif</option>
          <option value="font-sans">Sans</option>
          <option value="font-mono">Monospace</option>
        </select>
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 p-1 rounded-full flex justify-center items-center border shadow-md"
        >
          {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
      <form
        action="submit"
        onSubmit={(e) => handleSubmit(e, inputSearchValue)}
        className="min-w-min w-3/4 md:w-1/2 xl:w-1/4 dark:bg-gray-600 rounded-full "
      >
        <div className="relative flex items-center h-10 ">
          <input
            className="w-full h-full shadow-lg border rounded-lg border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            type="text"
            value={inputSearchValue}
            onChange={handleChange}
          />
          <button type="submit" className="flex items-center">
            <SearchIcon
              isDarkMode={theme === "dark"}
              styling={"absolute w-5 h-5 right-0 mr-3 cursor-pointer"}
            />
          </button>
        </div>
      </form>

      {props.isError ? (
        <p className="text-xl mt-5">
          <span className="dark:text-purple-400 text-purple-700">
            {searchValue}
          </span>{" "}
          was not found.
        </p>
      ) : (
        <div className="shadow-lg xs:w-max sm:w-3/4 lg:w-1/2 2xl:w-1/3 m-3 sm:border sm:border-purple-200 sm:rounded-md dark:bg-gray-700">
          {renderResult()}
        </div>
      )}
    </div>
  );
};

export default DictionaryEntry;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const searchValue = context.params?.searchValue as string;
  try {
    const data = await getDictionaryEntry(searchValue);
    const firstDataEntry = data && data[0];
    const soundURL = firstDataEntry.phonetics.find(
      (o) => o["audio"] !== undefined && o["audio"].length > 1
    )?.audio
      ? firstDataEntry.phonetics.find(
          (o) => o["audio"] !== undefined && o["audio"].length > 1
        )?.audio
      : null;
    return {
      props: {
        data,
        searchValue,
        isError: false,
        soundURL,
      },
    };
  } catch {
    return {
      props: {
        data: null,
        searchValue,
        isError: true,
      },
    };
  }
};
