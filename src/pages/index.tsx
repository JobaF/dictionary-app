import { ChangeEvent, FormEvent, useState } from "react";
import SearchIcon from "@/components/SearchIcon";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.currentTarget.value.toLowerCase());
  };

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    searchValue: string
  ): void {
    event.preventDefault();
    router.push("/dictionary/" + searchValue);
  }

  return (
    <div className="flex flex-col items-center gap-2 pt-5 bg-gray-100 min-h-screen h-full">
      <h1 className="text-xl">Search for a word: </h1>
      <form
        action="submit"
        onSubmit={(e) => handleSubmit(e, searchValue)}
        className="min-w-min w-2/3 md:w-1/2 xl:w-1/4"
      >
        <div className="relative flex items-center h-10">
          <input
            className="w-full h-full shadow-sm border rounded-lg border-gray-200 px-3"
            type="text"
            value={searchValue}
            onChange={handleChange}
          />
          <button type="submit" className="flex items-center">
            <SearchIcon
              styling={"absolute w-5 h-5 right-0 mr-3 cursor-pointer"}
            />
          </button>
        </div>
      </form>
      <div className="xs:w-max sm:w-3/4 md:w-1/2 2xl:w-1/3 m-3">{}</div>
    </div>
  );
}
