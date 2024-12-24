import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';

const RatingBar = ({ slug, category, options, dbField }) => {
  const [ratings, setRatings] = useState(
    options.reduce((acc, option) => ({ ...acc, [option]: 0 }), {})
  );
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [docId, setDocId] = useState(null);

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
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
  };

  return (
    <div className="flex flex-col items-center mt-4 ">
      <h2 className="text-lg font-bold h-8 w-full text-center">{`¿Cómo calificarías ${category}?`}</h2>
      <div className="flex w-full justify-center">
        {options.map((option) => (
          <button
            key={option}
            className={`flex-1 py-1 px-1 text-sm font-medium border ${
              hasVoted ? 'cursor-not-allowed opacity-70 bg-c' : 'bg-b1 hover:scale-105 transition-all ease-in-out'
            }`}
            onClick={() => handleVote(option)}
            disabled={hasVoted}
          >
            <div className="flex flex-col items-center"> 
              <span
              className={` w-12 h-10 flex items-center justify-center text-xs
              ${hasVoted ? 'text-b1' : 'text-c' }`}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </span>
              {hasVoted && (
                <span className="text-white font-bold">
                  {calculatePercentage(ratings[option])}%
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingBar;
