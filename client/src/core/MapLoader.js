import Room from '../entities/Room';

const fetchMapData = async () => {
  const res = await fetch('/api/map');
  return res.json();
};

const loadMap = (stage, roomsData) => {
  return roomsData.map((roomData) => {
    const room = new Room(roomData);
    stage.addChildAt(room.container, 0);
    return room;
  });
};

export { fetchMapData, loadMap };
