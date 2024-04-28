import ArrowLeftIcon from "@/icons/ArrowLeft";
import ArrowRightIcon from "@/icons/ArrowRight";
import CorrectIcon from "@/icons/Correct";
import WrongIcon from "@/icons/Wrong";

import { FC, useState } from "react";
import Dialog from "./Dialog";

interface Props {
  seedPhraseWords: string[];
  setIsSeedPhraseConfirmed: (valid: boolean) => void;
  onGoBack: () => void;
}

interface Question {
  seedPhraseIndex: number;
  correctAnswerPosition: number;
  answerList: number[];
  chosenIndex: number;
}

const ConfirmSeedPhrase: FC<Props> = ({ seedPhraseWords, setIsSeedPhraseConfirmed, onGoBack }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const questions: Question[] = [];
    for (let i = 0; i < 3; i++) {
      questions.push(newQuestion(questions.map((question) => question.seedPhraseIndex)));
    }
    return questions;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isChosen = currentQuestion.chosenIndex !== -1;
  const isCorrect = currentQuestion.chosenIndex === currentQuestion.correctAnswerPosition;

  function newQuestion(existedSeedPhraseIndexes: number[]): Question {
    let seedPhraseIndex;
    do {
      seedPhraseIndex = randomIndex(12);
    } while (existedSeedPhraseIndexes.includes(seedPhraseIndex));
    const correctAnswerPosition = randomIndex(4);
    const answerList = randomAnswerList(seedPhraseIndex, correctAnswerPosition);
    return {
      seedPhraseIndex,
      correctAnswerPosition,
      answerList,
      chosenIndex: -1,
    };
  }

  function randomIndex(n: number): number {
    return Math.floor(Math.random() * n);
  }

  function randomAnswerList(seedPhraseIndex: number, correctAnswerPosition: number): number[] {
    const numbers: number[] = [seedPhraseIndex];
    while (numbers.length < 4) {
      const anotherSeedPhraseIndex = randomIndex(12);
      if (!numbers.includes(anotherSeedPhraseIndex) && anotherSeedPhraseIndex !== seedPhraseIndex) {
        numbers.push(anotherSeedPhraseIndex);
      }
    }
    [numbers[correctAnswerPosition], numbers[0]] = [numbers[0], numbers[correctAnswerPosition]];
    return numbers;
  }

  // Function Hanlders
  function handleClickOption(chosenIndex: number): void {
    const newQuestions = [...questions];
    newQuestions[currentQuestionIndex].chosenIndex = chosenIndex;
    setQuestions(newQuestions);
    if (chosenIndex !== currentQuestion.correctAnswerPosition) {
      setTimeout(() => {
        setShowDialog(true);
      }, 2000);
    } else {
      // Check if all questions are correct in questions
      questions.every((question) => question.chosenIndex === question.correctAnswerPosition)
        ? setIsSeedPhraseConfirmed(true)
        : setIsSeedPhraseConfirmed(false);
    }
  }

  function handlePrevQuestion(): void {
    if ((!isChosen || isCorrect) && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }

  function handleNextQuestion(): void {
    if ((!isChosen || isCorrect) && currentQuestionIndex < 2) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 w-full mt-7 mb-4">
        <p className="font-semibold text-primary-400">
          {currentQuestionIndex + 1}. What is the {currentQuestion.seedPhraseIndex + 1}th word of your seed phrase?
        </p>
        {currentQuestion.answerList.map((anwer, index) => {
          return (
            <div className="option" key={index} onClick={!isChosen ? () => handleClickOption(index) : () => {}}>
              <span>{seedPhraseWords[anwer]}</span>
              <p
                className={`rounded-button ${
                  index === currentQuestion.correctAnswerPosition ? "bg-secondary-100" : "bg-primary-200"
                } ${currentQuestion.chosenIndex === index ? "visible" : "invisible"} 
            `}
              >
                {index === currentQuestion.correctAnswerPosition ? <CorrectIcon size={12} /> : <WrongIcon size={12} />}
              </p>
            </div>
          );
        })}
        <div className="flex justify-between">
          <button
            className={`rounded-button ${currentQuestionIndex === 0 ? "bg-gray-200" : "bg-primary-200"}`}
            onClick={handlePrevQuestion}
          >
            <ArrowLeftIcon size={18} />
          </button>
          <button
            className={`rounded-button ${currentQuestionIndex === 2 ? "bg-gray-200" : "bg-primary-200"}`}
            onClick={handleNextQuestion}
          >
            <ArrowRightIcon size={18} />
          </button>
        </div>
      </div>
      <div className={showDialog ? "visible" : "invisible"}>
        <Dialog
          onView={onGoBack}
          onCancel={() => {
            // Change the current question
            const newQuestions = [...questions];
            newQuestions[currentQuestionIndex] = newQuestion(newQuestions.map((question) => question.seedPhraseIndex));
            setQuestions(newQuestions);
            setShowDialog(false);
          }}
        />
      </div>
    </>
  );
};

export default ConfirmSeedPhrase;
