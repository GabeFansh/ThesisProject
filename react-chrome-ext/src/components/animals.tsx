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

// Component to add random movement to each redeemed animal
function RandomMovement({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const moveRandomly = () => {
      const top = Math.random() * 90; // Generate random top position (within container limits)
      const left = Math.random() * 90; // Generate random left position (within container limits)
      setPosition({ top, left });
    };

    const intervalId = setInterval(moveRandomly, 1000); // Change position every second

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        transition: 'top 0.8s ease, left 0.8s ease',
      }}
    >
      {children}
    </div>
  );
}

function AnimalRedeemer() {
  const [points, setPoints] = useState(0);
  const [redeemedAnimals, setRedeemedAnimals] = useState<Animal[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    chrome.storage.local.get(['points', 'redeemedAnimals'], (result: { points: any; redeemedAnimals: string; }) => {
      const storedPoints = parseInt(result.points || '0', 10);
      const storedAnimals = result.redeemedAnimals ? JSON.parse(result.redeemedAnimals) : [];
      setPoints(storedPoints);
      setRedeemedAnimals(storedAnimals);
    });
  }, []);

  useEffect(() => {
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

  const availableForRedemption = availableAnimals.filter(animal => !redeemedAnimals.some(redeemed => redeemed.name === animal.name));

  const handleNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % availableForRedemption.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + availableForRedemption.length) % availableForRedemption.length);
  };

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
        <div
          className="redeemed-animals-container"
          style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            border: '1px solid black',
            overflow: 'hidden',
            margin: '20px auto',
          }}
        >
          {redeemedAnimals.map((animal, index) => (
            <RandomMovement key={index}>
              <img
                src={animal.imageUrl}
                alt={animal.name}
                width={50}
                height={50}
              />
            </RandomMovement>
          ))}
        </div>
      ) : (
        <p>No animals redeemed yet.</p>
      )}
    </div>
  );
}

export default AnimalRedeemer;
