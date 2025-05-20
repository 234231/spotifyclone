console.log("lets write some  javascript")
let plays = document.querySelector("#play");
function secondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


let currentsong = new Audio();
async function get_songs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}
const playMusic = (track) => {
    currentsong.src = ("/songs/" + track)
    currentsong.play();
    plays.src = "pause.svg";

    document.querySelector(".songinfo").textContent = track;
    document.querySelector(".songtime").innerHTML = "00:00"
}

async function main() {

    let songs = await get_songs()

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="flex playnow">
                      <img class="invert size-3 pa" src="music.svg" alt="" srcset="">
                                     <div class="info">
                                    <div>${song.replaceAll('%20', ' ')}</div>

                                        <div>Harry</div>
                                    </div>
                                    <span>play now</span>
                                    <img src="playnow.svg" class="invert size-3" alt="" srcset="">          </li>`


    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach
        (e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML);

            }
            )

        })


    plays.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            plays.src = "pause.svg"

        }
        else {
            currentsong.pause()
            plays.src = "playicon.svg"

        }
    })


    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })


    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration * percent) / 100;
    });
    // Add an event listener to previous 
    let previous = document.querySelector("#previous");
    let next = document.querySelector("#next");
    next.addEventListener("click", () => {
        currentsong.pause();

        console.log(currentsong.src);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);

        }
    });

    previous.addEventListener("click", () => {
        currentsong.pause();

        console.log(currentsong.src);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) > 0) {
            playMusic(songs[index - 1]);

        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e)=>
        {
            console.log(e, e.target ,e.target.value)
            currentsong.volume= parseInt(e.target.value)/100;
        }
    )
}


main()

