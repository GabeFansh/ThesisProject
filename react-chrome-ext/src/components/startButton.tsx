function startButton() {
  const handleClick = () => {
    console.log("Button clicked!");
  };
  return (
    <div className="startButton">
      <button onClick={handleClick}>Start</button>
    </div>
  );
}

export default startButton;



