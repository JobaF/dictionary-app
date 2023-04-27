import { DictionaryResponseSchema } from "@/utils/DictionaryResponseSchema"
import axios from "axios"
import { GetServerSideProps } from "next"
import { FC } from "react"
import { useQuery } from "react-query"
import { z } from "zod"

type DictionaryResponse = z.infer<typeof DictionaryResponseSchema>

const getDictionaryEntry = async (word: string) => {
	const { data } = await axios.get<DictionaryResponse>(
		`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
	)
	return DictionaryResponseSchema.parse(data)
}

interface dictionaryEntryProps {
	data: DictionaryResponse | null
	searchValue: string
	isError: boolean
}

const DictionaryEntry: FC<dictionaryEntryProps> = (props) => {
	const { searchValue } = props
	const { isLoading, isError, isSuccess, data } = useQuery({
		queryKey: ["dictionaryEntry", searchValue],
		queryFn: () => getDictionaryEntry(searchValue),
		initialData: props.data,
		enabled: !props.isError,
	})

	const renderResult = () => {
		if (isLoading) {
			return <div className="search-message">Loading...</div>
		}
		if (isError) {
			return <div className="search-message">Something went wrong</div>
		}
		if (isSuccess) {
			return (
				<div className="flex flex-col shadow-md p-8 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-bold text-5xl mb-2">{data && data[0].word}</p>
							<p className="text-2xl text-purple-700">
								{data && data[0].phonetic && data[0].phonetic}
							</p>
						</div>
						<button className="w-16 h-16 rounded-full bg-purple-300 hover:bg-purple-900 focus:outline-none flex justify-center items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="#a445ed"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="#a445ed"
								className="w-1/2 h-3/4"
								//onClick={() => playSound()}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
								/>
							</svg>
						</button>
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
									<ul className="list-disc list-outside marker:text-purple-700 flex flex-col gap-3 text-justify text-md pl-7 sm:pr-10 mb-8">
										{meaning.definitions?.slice(0, 3).map((definition, i) => (
											<li key={i} className="pl-2">
												{definition.definition}
											</li>
										))}
									</ul>
									{meaning.synonyms[0] && (
										<div className="text-lg font-light">
											Synonyms{" "}
											<span className="text-purple-700 pl-5">
												{meaning.synonyms}
											</span>
										</div>
									)}
								</div>
							))}
					</div>
				</div>
			)
		}
		return <></>
	}

	return <div>{!props.isError && renderResult()}</div>
}

export default DictionaryEntry

export const getServerSideProps: GetServerSideProps = async (context) => {
	const searchValue = context.params?.searchValue as string
	try {
		const data = await getDictionaryEntry(searchValue)
		return {
			props: {
				data,
				searchValue,
				isError: false,
			},
		}
	} catch {
		return {
			props: {
				data: "",
				searchValue,
				isError: true,
			},
		}
	}
}
