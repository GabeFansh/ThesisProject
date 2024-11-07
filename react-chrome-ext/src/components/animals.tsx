import { useState, useEffect } from 'react';

declare const chrome: any;

type Animal = {
  name: string;
  imageUrl: string;
  cost: number;
};

const availableAnimals: Animal[] = [
  { name: 'Cat', imageUrl: 'https://cdn.pixabay.com/photo/2024/04/12/21/18/cat-8692654_1280.png', cost: 50 },
  { name: 'Dog', imageUrl: 'https://cdn.pixabay.com/photo/2021/09/29/01/02/golden-retriever-6665919_1280.png', cost: 70 },
  { name: 'Rabbit', imageUrl: 'https://cdn.pixabay.com/photo/2022/12/14/21/46/rabbit-7656358_1280.png', cost: 100 },
  { name: 'Bird', imageUrl: 'https://cdn.pixabay.com/photo/2020/12/28/15/09/bird-5867469_1280.png', cost: 40 },
  { name: 'Dinosaur', imageUrl: 'https://cdn.pixabay.com/photo/2021/05/26/18/28/dinosaur-6286030_1280.png', cost: 200 },
  { name: 'Mole Rat', imageUrl: 'https://cdn.pixabay.com/photo/2022/07/11/12/15/naked-mole-rat-7314787_960_720.png', cost: 1000 },
];

function AnimalRedeemer() {
  const [points, setPoints] = useState(0);
  const [redeemedAnimals, setRedeemedAnimals] = useState<Animal[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    // Load initial points and redeemed animals from chrome.storage.local
    chrome.storage.local.get(['points', 'redeemedAnimals'], (result: { points: any; redeemedAnimals: string; }) => {
      const storedPoints = parseInt(result.points || '0', 10);
      const storedAnimals = result.redeemedAnimals ? JSON.parse(result.redeemedAnimals) : [];
      setPoints(storedPoints);
      setRedeemedAnimals(storedAnimals);
    });
  }, []);

  useEffect(() => {
    // Listen for storage changes and update points in real-time
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, namespace: string) => {
      if (namespace === 'local') {
        if (changes.points) {
          setPoints(parseInt(changes.points.newValue || '0', 10));
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleRedeem = (animal: Animal) => {
    if (points >= animal.cost) {
      const updatedPoints = points - animal.cost;
      const updatedAnimals = [...redeemedAnimals, animal];
      
      chrome.storage.local.set({ 
        points: updatedPoints, 
        redeemedAnimals: JSON.stringify(updatedAnimals) 
      }, () => {
        setPoints(updatedPoints);
        setRedeemedAnimals(updatedAnimals);
      });
    } else {
      alert('Not enough points to redeem this animal.');
    }
  };

  const handleStop = (trackedTime: number) => {
    const pointsEarned = Math.floor(trackedTime / 10); // Earn 1 point for every 10 seconds
    const newPoints = points + pointsEarned;

    chrome.storage.local.set({ points: newPoints }, () => {
      setPoints(newPoints);
      alert(`You earned ${pointsEarned} points!`);
    });
  };

  const availableForRedemption = availableAnimals.filter(animal => !redeemedAnimals.some(redeemed => redeemed.name === animal.name));

  // Manual carousel logic
  const handleNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % availableForRedemption.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + availableForRedemption.length) % availableForRedemption.length);
  };

  // Slideshow logic
  useEffect(() => {
    if (redeemedAnimals.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % redeemedAnimals.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [redeemedAnimals]);

  return (
    <div>
      <h2>Redeem Animals</h2>
      <p>Points Available: {points}</p>
      <div className="animal-carousel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {availableForRedemption.length > 0 ? (
          <>
            <button onClick={handlePrev}>&lt;</button>
            <div className="animal-item" style={{ textAlign: 'center', margin: '0 20px' }}>
              <img src={availableForRedemption[carouselIndex].imageUrl} alt={availableForRedemption[carouselIndex].name} width={100} height={100} />
              <p>{availableForRedemption[carouselIndex].name}</p>
              <p>Cost: {availableForRedemption[carouselIndex].cost} points</p>
              <button onClick={() => handleRedeem(availableForRedemption[carouselIndex])}>Redeem {availableForRedemption[carouselIndex].name}</button>
            </div>
            <button onClick={handleNext}>&gt;</button>
          </>
        ) : (
          <p>All animals have been redeemed or not available.</p>
        )}
      </div>
      <h3>Redeemed Animals</h3>
      {redeemedAnimals.length > 0 ? (
        <div className="slideshow-container" style={{ textAlign: 'center' }}>
          <div className="slideshow-item">
            <img
              src={redeemedAnimals[currentSlide].imageUrl}
              alt={redeemedAnimals[currentSlide].name}
              width={150}
              height={150}
              style={{ display: 'block', margin: '0 auto', marginBottom: '5px' }}
            />
            <p>{redeemedAnimals[currentSlide].name}</p>
          </div>
        </div>
      ) : (
        <p>No animals redeemed yet.</p>
      )}
    </div>
  );
}

export default AnimalRedeemer;
