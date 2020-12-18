class SongQueue {
    
    constructor(props){
        this.queue = [];
    }

    addSong(title, artist, votes) {
        var i = 0;
        while(i < this.queue.length && votes <= this.queue[i]['votes']){
            i++;
        }

        var song = {
            'title': title,
            'artist': artist,
            'votes': votes,
        };

        this.queue.splice(i, 0, song);
    }

    voteUp(index) {
        if(index >= this.queue.length || index < 0){
            // todo -- error checking
            return null;
        }

        this.queue[index]['votes'] += 1;

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
    }

    voteDown(index) {
        if(index >= this.queue.length || index < 0){
            // todo -- error checking
            return null;
        }

        this.queue[index]['votes'] -= 1;

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
    }
}

module.exports = SongQueue
