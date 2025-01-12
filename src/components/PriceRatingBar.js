import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';

const RatingBar = ({ slug, category, options, dbField, imageSrc }) => {
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
            const votes = Object.values(data[dbField]).reduce((a, b) => a + b, 0);
            setTotalVotes(votes);
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

      await updateDoc(doc(db, 'cafeterias', docId), {
        [dbField]: updatedRatings,
      });

      setRatings(updatedRatings);
      setTotalVotes(totalVotes + 1);
      setHasVoted(true);
    } catch (err) {
      console.error('Error updating ratings:', err);
    }
  };

  const calculatePercentage = (votes) => {
    const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
    return isNaN(percentage) ? "0" : percentage;
  };

  const getMostVotedOption = () => {
    return Object.entries(ratings).reduce(
      (max, [key, value]) => (value > max.value ? { option: key, value } : max),
      { option: options[0], value: 0 }
    ).option;
  };

  const mostVotedOption = getMostVotedOption();

  return (
    <div className="flex flex-col items-center w-32">
      {!isMenuOpen ? (
        <button
          className="flex items-center justify-center py-2 px-4 bg-b1 text-c font-bold rounded shadow hover:bg-c hover:text-b1 w-full h-full transition-all text-xs"
          onClick={() => setIsMenuOpen(true)}
        >
          {/* <img src={imageSrc} alt="Most voted option" className="w-6 h-6 mr-2" /> */}
          {mostVotedOption.charAt(0).toUpperCase() + mostVotedOption.slice(1)}
        </button>
      ) : (
        <div className="absolute top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-72">
            <h2 className="text-lg font-bold mb-4">{`¿Cómo calificarías ${category}?`}</h2>
            <div className="flex flex-col gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  className={`flex items-center py-1 px-2 text-sm font-medium border rounded ${
                    hasVoted ? 'cursor-not-allowed opacity-70' : 'bg-b1 hover:bg-c hover:text-b1'
                  }`}
                  onClick={() => handleVote(option)}
                  disabled={hasVoted}
                >
                  <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  {hasVoted && (
                    <span className="ml-auto text-blue-500 font-bold">
                      {calculatePercentage(ratings[option])}%
                    </span>
                  )}
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
