const Queue = require('./queue.js');

class RoomTracker {

  constructor(){
    this.roomsAvailable = ['0000', '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009'];
    this.roomsUsed = {};
  }

  // gets an empty room ID and sets up its queue
  getEmptyRoom() {
    if(this.roomsAvailable.length == 0){
      return null;
    }

    // get first ID in list and add to occupied rooms
    var roomId = this.roomsAvailable.splice(0, 1)[0];
    this.roomsUsed[roomId] = new Queue();

    return roomId;
  }

  // closes the room specified by id
  // returns true on success, false on failure
  closeRoom(id) {
    if(!this.isValidRoomId){
      return false;
    }

    delete this.roomsUsed[id];
  }

  // adds a song to the queue of room specified by roomId
  addSong(roomId, title, artist, votes){
    if(!this.isValidRoomId){
      return null;
    }

    this.roomsUsed[roomId].addSong(title, artist, votes);
  }

  // votes up song corresponding to listId in room specified by roomId
  // returns the new vote count of the song
  voteUpSong(roomId, listId){
    if(!this.isValidRoomId){
      return null;
    }

    return this.roomsUsed[roomId].voteUp(listId);
  }

  // votes down song corresponding to listId in room specified by roomId
  // returns the new vote count of the song
  voteDownSong(roomId, listId){
    if(!this.isValidRoomId){
      return null;
    }

    return this.roomsUsed[roomId].voteDown(listId);
  }

  // returns the queue array of the room specified by roomId
  getQueueAsArr(roomId){
    if(!this.isValidRoomId){
      return null;
    }

    return this.roomsUsed[roomId].queue;
  }

  // returns true if roomId matches a room currently running,
  // false otherwise
  isValidRoomId(roomId){
    return roomId in this.roomsUsed;
  }
}

module.exports = RoomTracker;
