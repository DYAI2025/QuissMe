import { useEffect, useState } from 'react';
import { useQuizzes } from '../api/hooks/useQuizzes';
import { useQuizStore } from '../store/quizStore';

export const QuizPage = () => {
  const { listQuizzes, getQuiz, submitQuiz } = useQuizzes();
  const { quizzes, currentQuiz } = useQuizStore();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    listQuizzes();
  }, []);

  const handleSelectQuiz = async (quizId: string) => {
    await getQuiz(quizId);
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (currentQuiz) {
      await submitQuiz(currentQuiz.id, selectedAnswers);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05060A] to-[#0a0b12] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🎯 Quizzes</h1>

        {!currentQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handleSelectQuiz(quiz.id)}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 cursor-pointer hover:border-[#D6B25E] transition"
              >
                <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{quiz.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#D6B25E] text-sm">{quiz.category}</span>
                  <span className="text-gray-500 text-sm">{quiz.question_count} Fragen</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuiz.title}</h2>
            <div className="space-y-6">
              {currentQuiz.questions?.map((question: any, idx: number) => (
                <div key={idx} className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white font-semibold mb-4">{question.text}</p>
                  <div className="space-y-2">
                    {question.options?.map((option: string, optIdx: number) => (
                      <label key={optIdx} className="flex items-center p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          checked={selectedAnswers[`question-${idx}`] === option}
                          onChange={(e) => handleAnswerChange(`question-${idx}`, e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentQuiz(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl border border-white/20 transition"
              >
                Zurück
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="flex-1 bg-gradient-to-r from-[#D6B25E] to-[#e8c76f] text-black font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#D6B25E]/50 transition disabled:opacity-50"
              >
                {submitted ? '✓ Eingereicht' : 'Absenden'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
