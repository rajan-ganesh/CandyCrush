document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const width = 8;
    const squares = [];
    let score = 0;
    let moveCount = 0;

    const candyColors = [
        'red',
        'yellow',
        'orange',
        'purple',
        'green',
        'blue'
    ]

    const scoreDisplay = document.querySelector('.score-display');
    const moveDisplay = document.querySelector('.move-display');
        

    function createBoard() {
        for(let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundColor = candyColors[randomColor];
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart(){
        console.log(this.id, ' dragstart');
        colorBeingDragged = this.style.backgroundColor;
        squareIdBeingDragged = parseInt(this.id);
    }
    function dragEnd(){
        console.log(this.id, ' drag end');

        let validMoves = [squareIdBeingDragged -1, 
            squareIdBeingDragged -width, 
            squareIdBeingDragged +1, 
            squareIdBeingDragged +width];

        let validMove = validMoves.includes(squareIdBeingReplaced);
        if(validMove){
            moveCount++;
        }
        if(squareIdBeingReplaced && validMove){
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove){
            squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
        };
    }
    function dragOver(e){
        e.preventDefault();
        console.log(this.id, ' drag over');
    }
    function dragEnter(e){
        e.preventDefault();
        console.log(this.id, ' drag enter');
    
    }
    function dragLeave(e){
        e.preventDefault();
        console.log(this.id, ' drag leave'); 
    }
    function dragDrop(){
        console.log(this.id, ' drag drop');
        colorBeingReplaced = this.style.backgroundColor;
        squareIdBeingReplaced = parseInt(this.id);
        squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
    }

    function checkRowForThree(){
        for(let i = 0; i < 62; i++){
            if(i%8 == 7 || i%8 == 6){
                continue;
            }
            let rowOfThree = [i, i+1, i+2];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if(rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
                score += 3;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundColor = 'white';
                })
            }
        }
    }


    function checkColumnForThree(){
        // Ania made a  mistake here, not including number 47
        for(let i = 0; i < 48; i++){
            let colOfThree = [i, i+8, i+16];
            let decidedColor = squares[i].style.backgroundColor;
            const isBlank = squares[i].style.backgroundColor === '';

            if(colOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
                score += 3;
                colOfThree.forEach(index => {
                    squares[index].style.backgroundColor = 'white';
                })
            }
        }
    }



    //drop candies once some have been cleared
    function moveDown(){
        for(var i = 55; i>=0; i--){
            if(squares[i+8].style.backgroundColor === 'white'){
                squares[i+8].style.backgroundColor = squares[i].style.backgroundColor;
                squares[i].style.backgroundColor = 'white';
            }
        }
    }

    function addNewCandy(){
        for(let i = 0; i < 8; i++){
            if(squares[i].style.backgroundColor === 'white'){
                squares[i].style.backgroundColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            }
        }
    }

    window.setInterval(function(){
        moveDown();
        addNewCandy();
        checkRowForThree();
        checkColumnForThree();
        scoreDisplay.innerHTML = score;
        moveDisplay.innerHTML = moveCount;
    }, 100)

})