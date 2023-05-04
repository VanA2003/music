const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs : [
    {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video3.mp3",
        image: "../assets/img/76.jpg"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video1.mp3",
        image: "../assets/img/31.png"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video2.mp3",
        image: "../assets/img/36.png"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video4.mp3",
        image: "../assets/img/96.png"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video5.mp3",
        image: "../assets/img/2.png"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video6.mp3",
        image: "../assets/img/2.png"
      },
      {
        name: "Cô Gái Này Là Của Ai",
        singer: "Đoàn Quốc Vinh",
        path: "../assets/music/video7.mp3",
        image: "../assets/img/2.png"
      },
    ],
    render : function() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
            `
        })

        playlist.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get : function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents : function() {
        const this_ = this
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([{
            transform: "rotate(360deg)"
        }], {
            duration : 10000,
            interations : Infinity
        })

        cdThumbAnimate.pause()

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop 
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }

        playBtn.onclick = () =>{
            if(this_.isPlaying) {
                audio.pause()
            }else { 
                audio.play()
            }
        }

        audio.onplay = () => {
            this_.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = () => {
            this_.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.onchange = (e) => {
           const seekTime = audio.duration / 100 * e.target.value
           audio.currentTime = seekTime
        }

        nextBtn.addEventListener('click', () => {
            if(this_.isRandom) {
                this_.playRandomSong()
            }else {
                this_.nextSong()
            }
            audio.play()
            this_.render()
            this_.scrollActiveSong()
        })

        prevBtn.addEventListener('click',() => {
            if(this_.isRandom) {
                this_.playRandomSong()
            }else {
                this_.prevSong()
            }
            audio.play()
            this_.render()
            this_.scrollActiveSong()
        })

        randomBtn.addEventListener('click', () => {
            this_.isRandom = ! this_.isRandom
            randomBtn.classList.toggle('active',this_.isRandom)
        })

        audio.onended = () => {
            if(this_.isRepeat) {
                audio.play()
            }else {
                nextBtn.click()
            }
        }

        repeatBtn.addEventListener('click', () => {
            this_.isRepeat = !this_.isRepeat
            repeatBtn.classList.toggle('active',this_.isRepeat)
        })

        playlist.addEventListener('click',(e) => {
            const songNode = e.target.closest(".song:not(.active)");
            if(songNode || e.target.closest(".option")) {
                if(songNode) {
                    this_.currentIndex = Number(songNode.getAttribute('data-index'))
                    this.loadCurrentSong()
                    this_.render()
                    audio.play()
                }
            }
        })

    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(this.currentIndex === newIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        },300)
    },
    start: function() {
        this.defineProperties()
        this.render()
        this.handleEvents()

        this.loadCurrentSong()
        

    }
}

app.start()