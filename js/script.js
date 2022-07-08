const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const repeatButton = document.querySelector("#repeat");
const shuffleButton = document.querySelector("#shuffle");
const audio = document.querySelector("#audio");
const songImage = document.querySelector("#song-image");
const songName = document.querySelector("#song-name");
const songArtist = document.querySelector("#song-artist");
const pauseButton = document.querySelector("#pause");
const playButton = document.querySelector("#play");
const playlistButton = document.querySelector("#playlist");
const currentTimeRef = document.querySelector("#current-time");
const maxDuration = document.querySelector("#max-duration");
const progressBar = document.querySelector("#progress-bar");
const currentProgress = document.querySelector("#current-progress");
const playlistContainer = document.querySelector("#playlist-container");
const closeButton = document.querySelector("#close-button");
const playlistSongs = document.querySelector("#playlist-songs");

// index for songs
let index;

// initial loop=true
let loop = true;

// array of song information
const songsList = [
  {
    name: "Make Me Move",
    link: "../utils/make-me-move.mp3",
    artist: "Culture Code",
    image: "../img/make-me-move.jpg",
  },
  {
    name: "Where We Started",
    link: "../utils/where-we-started.mp3",
    artist: "Lost Sky",
    image: "../img/where-we-started.jpg",
  },
  {
    name: "On & On",
    link: "../utils/on-on.mp3",
    artist: "Cartoon",
    image: "../img/on-on.jpg",
  },
  {
    name: "Throne",
    link: "../utils/throne.mp3",
    artist: "Rival",
    image: "../img/throne.jpg",
  },
  {
    name: "Need You Now",
    link: "../utils/need-you-now.mp3",
    artist: "Venemy",
    image: "../img/need-you-now.jpg",
  },
];

// detect if touch device - events object
let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touch",
  },
};

let deviceType = "";

// Detect touch device
const isTouchDevice = () => {
  try {
    // create TouchEvent(would fail for desktops and throw and error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};

// console.log(isTouchDevice());

// Format time - convert ms to seconds, minutes and add 0 if less than 10)
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;

  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// Function to Set Song
const setSong = (arrayIndex) => {
  // destructure all the values from the song objec
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;
  // display duration when metadata loads
  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };
};

// Function to play song - invoked when play buttton is clicked
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};

// Function to pause song
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// Function to play next song
const nextSong = () => {
  // if loop is true then continue in normal order
  if (loop) {
    if (index == songsList.length - 1) {
      // if last song is being played
      index = 0;
    } else {
      index += 1;
    }
    setSong(index);
    playAudio();
  } else {
    // else find a random index and play that song
    let randomIndex = Math.floor(Math.random() * songsList.length);
    console.log(randomIndex);
    setSong(randomIndex);
    playAudio();
  }
};

// Function to play previous song (can't go back with a randomly played song)
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index -= 1;
  } else {
    // if first song is being played, then jump to last long
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

// next song when current ends
audio.onended = () => {
  nextSong();
};

const shuffleSongs = () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    loop = true;
    console.log("shuffle off");
  } else {
    shuffleButton.classList.add("active");
    loop = false;
    console.log("shuffle on");
  }
};

// Function to toggle repeat mode
const repeatAudio = () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    console.log("repeat off");
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    console.log("repeat on");
  }
};

// Player options event listeners
playButton.addEventListener("click", playAudio);
pauseButton.addEventListener("click", pauseAudio);
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", previousSong);

// shuffle songs
shuffleButton.addEventListener("click", shuffleSongs);
// repeat song
repeatButton.addEventListener("click", repeatAudio);

// open playlist container
playlistButton.addEventListener("click", () => {
  playlistContainer.classList.remove("hide");
});
// close playlist container
closeButton.addEventListener("click", () => {
  playlistContainer.classList.add("hide");
});

// if user clicks on progress bar
// determine if have a touch device or mouse - sets deviceType variable
isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {
  // start of progressBar
  let coordStart = progressBar.getBoundingClientRect().left;
  // mouse click position
  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  // set width to progress
  currentProgress.style.width = progress * 100 + "%";

  // set time
  audio.currentTime = progress * audio.duration;

  // play
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

// update progress bar every second
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(2)) * 100 + "%";
});

// update time
audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

window.onload = () => {
  // initialize first song
  index = 0;
  setSong(index);
};
