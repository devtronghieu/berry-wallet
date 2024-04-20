import { ChangeEvent, FC, useEffect, useState } from "react";

interface Props {
  seedPhraseWords: string[];
  setIsSeedPhraseConfirmed: (valid: boolean) => void;
}

const ConfirmSeedPhrase: FC<Props> = ({ seedPhraseWords, setIsSeedPhraseConfirmed }) => {
  const [errorText, setErrorText] = useState<string>("");
  const [words, setWords] = useState<Map<number, string>>(
    new Map([
      [1, ""],
      [4, ""],
      [7, ""],
    ]),
  );

  const handleInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const newWords = new Map(words);
    newWords.set(index, e.target.value.toLowerCase());
    setWords(newWords);
  };

  useEffect(() => {
    const invalidWords: string[] = [];
    words.forEach((word, index) => {
      if (word === "") return;

      if (seedPhraseWords[index] !== word) {
        invalidWords.push(word);
      }
    });

    if (invalidWords.length > 0) {
      setErrorText("Invalid words: " + invalidWords.join(", "));
      setIsSeedPhraseConfirmed(false);
      return;
    }

    const hasEmptyWords = Array.from(words.values()).some((word) => word === "");
    if (!hasEmptyWords) {
      setErrorText("");
      setIsSeedPhraseConfirmed(true);
    } else {
      setErrorText("Please fill in all the words");
      setIsSeedPhraseConfirmed(false);
    }
  }, [seedPhraseWords, setIsSeedPhraseConfirmed, words]);

  return (
    <div className="flex flex-col gap-5 w-full mt-8">
      <input className="input" placeholder="2nd word" value={words.get(1)} onChange={handleInputChange(1)} />
      <input className="input" placeholder="5th word" value={words.get(4)} onChange={handleInputChange(4)} />
      <input className="input" placeholder="8th word" value={words.get(7)} onChange={handleInputChange(7)} />
      {errorText && <p className="text-error text-xs">{errorText}</p>}
    </div>
  );
};

export default ConfirmSeedPhrase;
