const TurfCard = ({ turf, onClick }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl hover:shadow-xl transition-shadow duration-300">
      <img
        src={turf.turfThumbnail || "/placeholder.jpg"}
        alt={turf.turfName}
        onClick={() => onClick(turf)}
        className="w-full h-48 object-cover rounded-lg cursor-pointer"
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold">{turf.turfName}</h2>
        <p className="text-lg text-green-400 mt-1">${turf.turfPrice} / hr</p>
      </div>
    </div>
  );
};

export default TurfCard;
