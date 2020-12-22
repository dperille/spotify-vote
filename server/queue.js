class SongQueue {
    
    constructor(){
        // stores song objects, each with keys 'title', 'artist',
        // 'album', 'imageUrl', 'votes', and 'id'
        this.queue = [];

        // Used to assign id's to each song in the queue
        this.count = 0;
    }

    /* Add a song to the priority queue in its appropriate spot
       and return the list id associated with it */
    addSong(song, votes) {
        var i = 0;
        while(i < this.queue.length && votes <= this.queue[i]['votes']){
            i++;
        }

        var song = {
            'title': song['title'],
            'artist': song['artist'],
            'album': song['album'],
            'imageUrl': song['imageUrl'],
            'uri': song['uri'],
            'votes': votes,
            'id': this.count,
        };

        this.count++;

        this.queue.splice(i, 0, song);
    }

    // Votes up the list element matching id, and returns its new vote count
    voteUp(id) {
        var index = this.getIndexFromId(id);

        if(index == -1){
            // todo -- error checking
            return null;
        }

        var newVoteCount = this.queue[index]['votes'] += 1;

        // move the song up if now greater than those in front of it
        var i = index - 1;
        while(i >= 0 && this.queue[index]['votes'] > this.queue[i]['votes']) {
            i--;
        }

        if(i + 1 != index){
            var song = this.queue[index];
            this.queue.splice(index, 1);
            this.queue.splice(i+1, 0, song);
        }

        return newVoteCount;
    }

    // Votes down the list element matching id, and returns its new vote count
    voteDown(id) {
        var index = this.getIndexFromId(id);

        if(index == -1){
            // todo -- error checking
            return null;
        }

        var newVoteCount = this.queue[index]['votes'] -= 1;

        // move the song down if now less than those behind it
        var i = index + 1;
        while(i < this.queue.length && this.queue[index]['votes'] < this.queue[i]['votes']){
            i++;
        }

        if(i - 1 != index){
            var song = this.queue[index];
            this.queue.splice(i, 0, song);
            this.queue.splice(index, 1);
        }

        return newVoteCount;
    }

    // Returns the index of the song with listId id, or -1 if not present
    getIndexFromId(id) {
        var i;
        for(i = 0; i < this.queue.length; i++) {
            if(this.queue[i]['id'] == id){
                return i;
            }
        }

        return -1;
    }
}

module.exports = SongQueue
