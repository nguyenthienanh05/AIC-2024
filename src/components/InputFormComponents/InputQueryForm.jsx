import React, { useState, useEffect } from 'react';
import InputBar from './InputBar';
import QueryButton from './QueryButton';

const InputQueryForm = () => {
  const [currentSceneQuery, setCurrentSceneQuery] = useState('');
  const [nextScenesQuery, setNextScenesQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCurrentSceneQueryValid, setIsCurrentSceneQueryValid] = useState(false);
  const [isQuestionValid, setIsQuestionValid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCurrentSceneQueryChange = (e) => {
    setCurrentSceneQuery(e.target.value);
    setIsCurrentSceneQueryValid(e.target.value.trim() !== '');
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
    setIsQuestionValid(e.target.value.trim() !== '');
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (isCurrentSceneQueryValid) {
      console.log('Query submitted:', { currentSceneQuery, nextScenesQuery, question });
    
    } else {
      alert('Please input the query for the current scene.');
    }
  };

  const handleQueryAndQnA = (e) => {
    e.preventDefault();
    if (isCurrentSceneQueryValid && isQuestionValid) {
      console.log('Query and QnA submitted:', { currentSceneQuery, nextScenesQuery, question });
    } else {
      alert('Please input both the query for the current scene and the question.');
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className={`transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
      {isFormVisible && (
        <form className={`max-w-[1342px] mx-auto p-4 bg-white shadow-md ${isScrolled ? 'rounded-b-lg' : ''}`}>
          <div className="flex flex-col space-y-1">
            <InputBar 
              placeholder="Input the query for the current scene (required)" 
              bgColor="bg-[#FFFED8]" 
              value={currentSceneQuery}
              onChange={handleCurrentSceneQueryChange}
              required
            />
            <InputBar 
              placeholder="Input the query for the next scenes (optional)" 
              bgColor="bg-[#D3F2FF]" 
              value={nextScenesQuery}
              onChange={(e) => setNextScenesQuery(e.target.value)}
            />
            <InputBar 
              placeholder="Input the question (required for Query and QnA)" 
              bgColor="bg-[#FFDDBB]" 
              value={question}
              onChange={handleQuestionChange}
            />
            <div className="flex justify-center space-x-4 mt-2">
              <QueryButton 
                text="Query" 
                bgColor="bg-[#8CFF84]" 
                onClick={handleQuery} 
                disabled={!isCurrentSceneQueryValid}
              />
              <QueryButton 
                text="Query and QnA" 
                bgColor="bg-[#FF7375]" 
                onClick={handleQueryAndQnA} 
                disabled={!isCurrentSceneQueryValid || !isQuestionValid}
              />
            </div>
          </div>
        </form>
      )}
      <button
        onClick={toggleFormVisibility}
        className={`fixed top-2 right-2 cursor-pointer bg-blue-500 text-white px-2 py-1 text-sm rounded-full shadow-lg hover:bg-blue-600 transition-colors`}
      >
        {isFormVisible ? '−' : '+'}
      </button>
    </div>
  );
};

export default InputQueryForm;