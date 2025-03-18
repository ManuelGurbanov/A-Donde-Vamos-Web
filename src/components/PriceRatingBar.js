import { useState, useEffect } from 'react';
import { collection, getDocs, query, updateDoc, where, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const RatingBar = ({ slug, category, options, dbField }) => {
  const [ratings, setRatings] = useState(
    options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {})
  );
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [docId, setDocId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryQuery = query(
          collection(db, 'cafeterias'),
          where('slugName', '==', slug)
        );
        const querySnapshot = await getDocs(categoryQuery);

        if (!querySnapshot.empty) {
          const id = querySnapshot.docs[0].id;
          const data = querySnapshot.docs[0].data();

          setDocId(id);
          if (data[dbField]) {
            setRatings(data[dbField]);
            setTotalVotes(Object.values(data[dbField]).reduce((a, b) => a + b, 0));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchCategoryData();
  }, [slug, dbField]);

  const handleVote = async (option) => {
    if (hasVoted || !docId) return;

    try {
      const updatedRatings = { ...ratings, [option]: ratings[option] + 1 };
      await updateDoc(doc(db, 'cafeterias', docId), { [dbField]: updatedRatings });
      setRatings(updatedRatings);
      setTotalVotes(totalVotes + 1);
      setHasVoted(true);
    } catch (err) {
      console.error('Error updating ratings:', err);
    }
  };

  const getMostVotedOption = () => {
    const sortedOptions = Object.entries(ratings).sort((a, b) => b[1] - a[1]);
    if (totalVotes === 0 || (sortedOptions.length > 1 && sortedOptions[0][1] === sortedOptions[1][1])) {
      return options[Math.floor(options.length / 2) + 1];
    }
    return sortedOptions[0][0];
  };

  const mostVotedOption = getMostVotedOption();

  const calculatePercentage = (votes) => {
    if (!votes || totalVotes === 0) return '0%';
    return ((votes / totalVotes) * 100).toFixed(1) + '%';
  };
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-sm font-medium">
        {category.split(' ')[1].charAt(0).toUpperCase() + category.split(' ')[1].slice(1).toLowerCase()}:  
        <span className='font-bold'> {mostVotedOption.charAt(0).toUpperCase() + mostVotedOption.slice(1)}</span>
      </h1>
      <button
        className="mt-1 px-3 py-1 bg-white text-c text-xs font-bold rounded hover:bg-zinc-200 transition-all ring-[1px] ring-c"
        onClick={() => setIsMenuOpen(true)}
      >
        Opinar
      </button>

      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 shadow-lg w-72 rounded-[48px]">
            <h2 className="text-lg font-bold mb-4">¿Cómo calificarías {category}?</h2>
            <div className="flex flex-col gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  className={`py-1 px-2 text-sm font-medium border rounded ${
                    hasVoted ? 'cursor-not-allowed opacity-70' : 'bg-b1 hover:bg-c hover:text-b1 text-c'
                  }`}
                  onClick={() => handleVote(option)}
                  disabled={hasVoted}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                  {hasVoted && <span className="ml-2 text-gray-700">{calculatePercentage(ratings[option])}</span>}
                </button>
              ))}
            </div>
            <button
              className="mt-4 py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingBar;
