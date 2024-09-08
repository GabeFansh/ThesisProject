function startButton() {
  const handleClick = () => {
    console.log("Button clicked!");
    // open index.html in a new tab
    //window.open("index.html");
  };

  return (
    <div className="startButton">
      <button onClick={handleClick}>Start</button>
    </div>
  );
}

export default startButton;



