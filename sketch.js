let board = [];
let boardHash = [];
let aniIMG = [];
let imgSize = {};
let back = [];
let tempInp = [];
const pairToFind = 8;


function preload() {
	let url = "https://api.giphy.com/v1/stickers/search?api_key=IEUNt3CuP3xFJFEno66g9Dq8QUmUO0uZ&q=animal&limit=8&offset=0&rating=G&lang=en";
	loadJSON(url, gotData);
}

function setup() {
	noCanvas();
	makeBoard(pairToFind);
	setBoard(); 
	
}

function gotData(data) {
	for (i=0; i < 8; i++){
		aniIMG[2*i] = createImg(data.data[i].images.original.url);
		aniIMG[2*i+1] = createImg(data.data[i].images.original.url);
	}
}

function setBoard () {
	let bdcon = select(".bdcon");
	bdcon.style("width", `${windowWidth*0.95}px`);
	if (windowWidth >= 1000) {
		let w = Math.min(windowWidth,windowHeight);
		bdcon.style("width", `${w*0.7}px`).style("height", `${w*0.8}px`);
	}
	let cardRow = [];
	let card = [];
	let front = [];
	back = [];
	for (let i=0; i < 4; i++){
		cardRow[i] = createDiv('').class("cardRow").id(`cardRow${i}`).parent(bdcon);
		for (let j=0; j < 4; j++){
			let ci = i*4+j; 
			card[ci] = createDiv('').class("card").id(`card${ci}`).parent(cardRow[i]);
			front[ci] = createDiv('').class("front").parent(card[ci]);
			back[ci] = createDiv('').class("back").parent(card[ci]);
			createButton(``).class("invButton").id(`button${ci}`).parent(front[ci]).mousePressed(()=> {
				if (tempInp.length !== 2) flipCard(card[ci]);});
		}
	}
	if (windowWidth < 1000) {
	imgSize.w = card[1].width - 10;
	imgSize.h = (bdcon.height - 14)/4;
	} else {
	let w = Math.min(windowWidth,windowHeight);
	imgSize.w = w*0.7/4 - 10;
	imgSize.h = (w*0.8 - 14)/4;
	}
	for (i=0; i<8; i++){
		 setCardPair(i);
	}
}

function setCardPair (imgIndex) {
	aniIMG[imgIndex*2].size(imgSize.w, imgSize.h).parent(back[board[imgIndex][0]]);
	aniIMG[imgIndex*2+1].size(imgSize.w, imgSize.h).parent(back[board[imgIndex][1]]); 
}

function flipCard (card) {
	card.style('transform','rotateY(180deg)');
	select(`#button${card.id().slice(4)}`).removeClass('invButton').addClass('hideButton');
	tempInp.push(Number(card.id().slice(4)));
	if (tempInp.length === 2) {
		tempInp = tempInp.sort((a, b) => {return a-b});
		if (boardHash.hasOwnProperty(tempInp)){
			console.log("Correct!!!");
			board[boardHash[tempInp]] = 0;
			if (board.every(each => {return each === 0})) allClear(); 
			tempInp = [];
		} else {
			setTimeout(resetCards, 800);
		}
	} 
}

function allClear () {
	button = createButton("PLAY AGAIN").class('button').parent('buttoncon').mousePressed(replay);
	if (windowWidth > 1000) {
	button.style("font-size","35px").style("padding", "10px 10px");
	}
	select('#buttoncon').style("height", `${windowHeight*0.10}px`);
}

function replay() {
	select('.button').remove();
	board = [];
	let row = selectAll('.cardRow');
	for (r of row){
		r.remove();
	}
	makeBoard(pairToFind);
	setBoard();
}

function resetCards () {
	for (i=0; i<2; i++) { 
	select(`#card${tempInp[i]}`).style("transform","rotateY(0deg)");
	select(`#button${tempInp[i]}`).addClass('invButton').removeClass('hideButton');
	}
	tempInp = [];
}

function boardToHash (bd) {
	let retHash = {};
	for(let i = 0; i < board.length; i++) {
        retHash[board[i]] = i;
	}
	return retHash;
}

function range (from, to, interval = 1) {
	let retArr = [];
	for (let i = from; i <= to; i += interval) {
		retArr.push(i);
	}
	return retArr;
}

function makeBoard (n) {
	let set = range(0, 2*n - 1);
	let tempPair = [];
	for (let i = 0; i < n; i++) {
		let randomPick = Math.floor(Math.random()*16);
		if (!set.includes(randomPick)) {
			i--;
		} else {
			tempPair.push(randomPick);
			indexToRemove = set.indexOf(randomPick);
			set.splice(indexToRemove, 1);
			if (tempPair.length === 2) {
				board.push(tempPair);
				tempPair = [];
			} else {
				i--;
			}
		}
	}
	board.map(each => {
		each.sort((a,b) => {return a-b});
	});
	boardHash = boardToHash(board);
}

