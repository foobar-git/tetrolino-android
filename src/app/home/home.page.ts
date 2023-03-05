import { Component } from '@angular/core';
import { AdMob, AdMobRewardItem, AdOptions, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob/dist/esm/banner';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Google AdMob variables
  bannerAdId = 'ca-app-pub-3940256099942544/6300978111';  // testing id
  interstitialAdId = 'ca-app-pub-3940256099942544/1033173712';  // testing id
  rewardedAdId = 'ca-app-pub-3940256099942544/5224354917';  // testing id

  // Tetrolino variables
  tetrolinoes: any;
  previewTetrolinos: any;
  startingPosition: any;
  currentPosition: number;
  randomTetrolino: number;
  nextRandomTetrolino: number;
  selectedTetrolino: any;
  randomRotation: number;
  nextRandomRotation: number;
  currentRotation: number;
  currentTetrolino: any;
  randomColor: string;
  nextRandomColor: string;
  timerId: any;
  timer = 500;                // set time interval (1000 = 1 second)
  score = 0;
  gamePaused = true;
  gameIsOver = false;
  blockWidth = "20px";
  blockHeight = "20px";
  width_squareGrid = 10;
  width_mainWindow = 200;
  width_squarePreviewGrid = 4;
  width_previewWindow = 16;
  squares_grid: any;
  squares_previewGrid: any;
  grid: any;
  previewGrid: any;
  index_previewGrid: number;
  scoreDisplay: any;
  colors = ['yellow', 'yellowgreen', 'cyan', 'blue', 'green', 'red', 'purple'];

  startPauseButton: any;
  rotateButton: any;
  moveDownButton: any;
  moveLeftButton: any;
  moveRightButton: any;
  handleClick_startPause = () => {
    if (!this.gameIsOver) {
      this.gamePaused = !this.gamePaused;
        this.pauseGame(this.gamePaused);
        console.log("GAME PAUSED");
    }
  }
  handleClick_rotate = () => {
    if (!this.gamePaused || this.gameIsOver) this.rotate();
  };
  handleClick_moveDown = () => {
    if (!this.gamePaused || this.gameIsOver) this.moveDown();
  };
  handleClick_moveLeft = () => {
    if (!this.gamePaused || this.gameIsOver) this.moveLeft();
  };
  handleClick_moveRight = () => {
    if (!this.gamePaused || this.gameIsOver) this.moveRight();
  };


  constructor() {
    this.initialize();
  }

  ngOnInit() {
    // init grid
    this.setUpGrid(this.width_mainWindow);
    this.tetrolinoes = this.initTetrolinos(this.width_squareGrid);
    this.previewTetrolinos = this.initTetrolinos(this.width_squarePreviewGrid);
    
    // init ui
    this.previewGrid = document.querySelector('.preview-grid');
    this.setUpPreviewGrid(this.width_previewWindow);
    this.squares_previewGrid = document.querySelectorAll('.preview-grid div');
    this.index_previewGrid = 0;
    this.scoreDisplay = document.querySelector('#score-int');
    this.initStartPauseButton();
    this.initMoveButtons();

    this.startingPosition = 4;   // set tetrolino starting position
    this.currentPosition = this.startingPosition;
    this.nextRandomTetrolino = Math.floor(Math.random() * this.tetrolinoes.length);
    this.nextRandomRotation = 0;
    this.selectRandomTetrolino();
    this.draw();
    this.displayNextTetrolino();

    this.addButtonListeners();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // FUNCTIONS
  initTetrolinos(width: number) {
    const j_tetrolino = [
        //[20, 01, 11, 21],
        [2 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        //[10, 20, 21, 22],
        [1 * width + 0, 2 * width + 0, 2 * width + 1, 2 * width + 2],
        //[01, 11, 21, 02],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 0 * width + 2],
        //[10, 11, 12, 22]
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 2 * width + 2]
    ];

    const l_tetrolino = [
        [0 * width + 0, 1 * width + 0, 2 * width + 0, 2 * width + 1],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 1 * width + 2],
        [0 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        [2 * width + 0, 2 * width + 1, 1 * width + 2, 2 * width + 2]
    ];

    const s_tetrolino = [
        [2 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [0 * width + 0, 1 * width + 0, 1 * width + 1, 2 * width + 1],
        [2 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [0 * width + 0, 1 * width + 0, 1 * width + 1, 2 * width + 1]
    ];

    const z_tetrolino = [
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 2 * width + 2],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 0 * width + 1],
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 2 * width + 2],
        [1 * width + 0, 2 * width + 0, 1 * width + 1, 0 * width + 1]
    ];

    const t_tetrolino = [
        [1 * width + 0, 1 * width + 1, 2 * width + 1, 1 * width + 2],
        [1 * width + 0, 0 * width + 1, 1 * width + 1, 2 * width + 1],
        [1 * width + 0, 0 * width + 1, 1 * width + 1, 1 * width + 2],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 1 * width + 2]
    ];

    const o_tetrolino = [
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1],
        [0 * width + 0, 1 * width + 0, 0 * width + 1, 1 * width + 1]
    ];

    const i_tetrolino = [
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 3 * width + 1],
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 1 * width + 3],
        [0 * width + 1, 1 * width + 1, 2 * width + 1, 3 * width + 1],
        [1 * width + 0, 1 * width + 1, 1 * width + 2, 1 * width + 3]
    ];

    return [l_tetrolino, j_tetrolino, z_tetrolino, s_tetrolino, t_tetrolino, o_tetrolino, i_tetrolino];
  }

  setUpPreviewGrid(wp) {  // set up the preview grid (next tetrolino box)
    for (let i = 0; i < wp; i++) {
      let element = document.createElement('div');
      element.style.width = this.blockWidth;
      element.style.height = this.blockHeight;
      this.previewGrid?.appendChild(element);
    }
  }

  setUpGrid(w) {  // setting up the grid
    this.grid = document.querySelector('.grid');
    for (let i = 0; i < w; i++) {
      let element = document.createElement('div');
      element.style.width = this.blockWidth;
      element.style.height = this.blockHeight;
      this.grid?.appendChild(element);
    }
    for (let i = 0; i < 10; i++) {
      let element = document.createElement('div');
      element.classList.add('solid');
      this.grid?.appendChild(element);
    }
    this.squares_grid = Array.from(document.querySelectorAll('.grid div'));
  }

  isAtRight() { // check if a tetrolino is at the right edge
    return this.currentTetrolino.some(index => (this.currentPosition + index + 1) % this.width_squareGrid === 0)  
  }

  isAtLeft() {  // check if a tetrolino is at the left edge
    return this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === 0)
  }

  checkRotatedPosition(P?) {
    P = P || this.currentPosition                // get current position and check if the piece is near the left side
    if ((P + 1) % this.width_squareGrid < 4) {   // add 1 because the position index can be 1 less than where the block is (with how they are indexed)
      if (this.isAtRight()) {                    // use actual position to check if it's flipped over to right side
        this.currentPosition += 1                // if so, add one to wrap it back around
        this.checkRotatedPosition(P)             // check again;  pass position from start, since long block might need to move more
      }
    }
    else if (P % this.width_squareGrid > 5) {
      if (this.isAtLeft()) {
        this.currentPosition -= 1
        this.checkRotatedPosition(P)
      }
    }
  }

  draw() {  // draw the tetrolino
    this.currentTetrolino.forEach(index => {
      this.squares_grid[this.currentPosition + index].classList.add('tetrolino');
      (this.squares_grid[this.currentPosition + index] as HTMLElement).style.backgroundColor = "grey";
      // apply a random color
      this.squares_grid[this.currentPosition + index].style.backgroundColor = this.randomColor;
    });
  }

  undraw() {  // undraw the tetrolino
    this.currentTetrolino.forEach(index => {
      this.squares_grid[this.currentPosition + index].classList.remove('tetrolino');
      this.squares_grid[this.currentPosition + index].style.backgroundColor = '';   // remove the color
    })
  }

  displayNextTetrolino() {
    // remove any trace of a tetromino form the entire grid
    this.squares_previewGrid.forEach(square => {
      square.classList.remove('tetrolino');
      square.style.backgroundColor = '';   // remove the color
    })
    let selectedPreviewTetrolino = this.previewTetrolinos[this.nextRandomTetrolino];
    let currentPreview = selectedPreviewTetrolino[this.nextRandomRotation];
    currentPreview.forEach( index => {
      this.squares_previewGrid[this.index_previewGrid + index].classList.add('tetrolino');
      this.squares_previewGrid[this.index_previewGrid + index].style.backgroundColor = this.nextRandomColor;
    })
  }

  advanceTetrolinoDownward() {  // move tetrolino down
    // enabling "last second change"
    if (!this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index + this.width_squareGrid].classList.contains('solid'))) {
      this.undraw();
      this.currentPosition += this.width_squareGrid;
      this.draw();
    } else {
      this.solidify();
    }
  }

  selectRandomTetrolino() {
    // randomly select a new color
    this.randomColor = this.nextRandomColor;
    this.nextRandomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    
    // randomly select a tetrolino
    this.randomTetrolino = this.nextRandomTetrolino;
    this.nextRandomTetrolino = Math.floor(Math.random() * this.tetrolinoes.length);
    this.selectedTetrolino = this.tetrolinoes[this.randomTetrolino];

    // randomly apply a rotation
    this.randomRotation = this.nextRandomRotation;
    this.nextRandomRotation = Math.floor(Math.random() * this.selectedTetrolino.length);
    this.currentRotation = this.randomRotation;
    this.currentTetrolino = this.selectedTetrolino[this.currentRotation];
  }

  solidify() { // solidify the tetrolino into place
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index + this.width_squareGrid].classList.contains('solid'))) {
      this.currentTetrolino.forEach(index => this.squares_grid[this.currentPosition + index].classList.add('solid'));
      this.selectRandomTetrolino();
      this.currentPosition = this.startingPosition;     // set the new tetrolino at the top
      this.displayNextTetrolino();
      this.addScore();
      this.draw();
      this.gameOver();
    }
  }

  addScore() { // add score
    for (let i = 0; i < (this.width_mainWindow - 1); i += this.width_squareGrid) {
      const row = [i+0, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
      if (row.every(index => this.squares_grid[index].classList.contains('solid'))) {
        this.score += 10;
        this.scoreDisplay.innerHTML = this.score;
        row.forEach(index => {
          this.squares_grid[index].classList.remove('solid');
          this.squares_grid[index].classList.remove('tetrolino');
          this.squares_grid[index].style.backgroundColor = '';   // remove the color
        })
        const squaresRemoved = this.squares_grid.splice(i, this.width_squareGrid);
        this.squares_grid = squaresRemoved.concat(this.squares_grid);
        this.squares_grid.forEach(block => this.grid.appendChild(block));
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  // BUTTONS
  initStartPauseButton() {
    this.startPauseButton = document.querySelector('#start-pause-button');
  }

  initMoveButtons() {
    this.rotateButton = document.querySelector('#rotate-button');
    this.moveDownButton = document.querySelector('#move-down-button');
    this.moveLeftButton = document.querySelector('#move-left-button');
    this.moveRightButton = document.querySelector('#move-right-button');
  }

  addButtonListeners() {
    //document.addEventListener('keydown', this.getUserInput); // former keyboard input
    this.startPauseButton.addEventListener('click', this.handleClick_startPause);
    this.rotateButton.addEventListener('click', this.handleClick_rotate);
    this.moveDownButton.addEventListener('click', this.handleClick_moveDown);
    this.moveLeftButton.addEventListener('click', this.handleClick_moveLeft);
    this.moveRightButton.addEventListener('click', this.handleClick_moveRight);
  }

  removeButtonListeners() {
    this.rotateButton.removeEventListener('click', this.handleClick_rotate);
    this.moveDownButton.removeEventListener('click', this.handleClick_moveDown);
    this.moveLeftButton.removeEventListener('click', this.handleClick_moveLeft);
    this.moveRightButton.removeEventListener('click', this.handleClick_moveRight);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // FUNCTIONS - USER INPUT
  /*getUserInput(e) { // assign functions to key codes
    if (!this.gamePaused || this.gameIsOver) {
      if (e.keyCode === 37) {         // left arrow
        this.moveLeft();
      } else if (e.keyCode === 39) {  // right arrow
        this.moveRight();
      } else if (e.keyCode === 38) {  // up arrow
        this.rotate();
      } else if (e.keyCode === 40) {  // down arrow
        this.moveDown();
      }
    }
  }*/

  moveLeft() { // move tetrolino left until edge of screen
    this.undraw();
    const isAtLeftEdge = this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === 0);
    if (!isAtLeftEdge) {
      this.currentPosition -= 1;
    }
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.currentPosition += 1;
    }
    this.draw();
  }

  moveRight() { // move tetrolino right until edge of screen
  this.undraw();
    const isAtRightEdge = this.currentTetrolino.some(index => (this.currentPosition + index) % this.width_squareGrid === this.width_squareGrid - 1);
    if (!isAtRightEdge) {
      this.currentPosition += 1;
    }
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.currentPosition -= 1;
    }
    this.draw();
  }

  moveDown() {  // move tetrolino down faster
    this.advanceTetrolinoDownward();
  }

  rotate() { // rotate the tetrolino
    this.undraw();
    this.currentRotation++;            // advance to the next rotation
    if (this.currentRotation === this.currentTetrolino.length) {
      this.currentRotation = 0;        // reset index to zero (first rotation)
    }
    this.currentTetrolino = this.selectedTetrolino[this.currentRotation];
    this.checkRotatedPosition()
    this.draw();
  }

  /////////////////////////////////////////////////////////////////////////////////
  // MAIN GAME LOOP
  mainGameLoop() {
    this.advanceTetrolinoDownward();
  }

  pauseGame(b) {
    console.log("gamePaused: " + b);
    if (!b) this.timerId = window.setInterval(this.mainGameLoop.bind(this), this.timer);
    else clearInterval(this.timerId);
  }

  gameOver() {
    if (this.currentTetrolino.some(index => this.squares_grid[this.currentPosition + index].classList.contains('solid'))) {
      this.scoreDisplay.innerHTML = this.score + " - Game Over";
      clearInterval(this.timerId);
      this.gameIsOver = true;
      this.removeButtonListeners();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Google AdMob
  async initialize() {
    const { status } = await AdMob.trackingAuthorizationStatus();
    console.log(status);

    if (status === 'notDetermined') {
      console.log('Display information before ads load first time.');
    }

    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['test_device_code_here'],
      initializeForTesting: true
    })
  }

  async showBanner(adId) {
    
    const options: BannerAdOptions = {
      adId,  
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };

    await AdMob.showBanner(options);
  }

  async hideBanner() {
    // hide banner, still available
    await AdMob.hideBanner();

    // completely remove banner
    await AdMob.removeBanner();
  }

  async showInterstitial(adId) {
    const options: AdOptions = {
      adId,
      isTesting: true
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  async showRewardVideo(adId) {
    AdMob.addListener(
      RewardAdPluginEvents.Rewarded,
      (reward: AdMobRewardItem) => {
        // Give the reward
        console.log('Reward: ', reward);
      }
    );

    const options: RewardAdOptions = {
      adId,
      isTesting: true
      //ssv: { ... }
    };
    await AdMob.prepareRewardVideoAd(options);
    await AdMob.showRewardVideoAd();
  }

}
