'use strict' 

class Squere {
    constructor(elem) {
        this.__player = false;
        this.__DOM_element = elem;
    }

    get squereStatus() {
        return this._player
    }

    squereStatus(value) {
        if (this.__player) {
            return
        };

        if (value == 'first') {
            this.__player = value;
            this.__DOM_element.innerHTML = '<i class="ph-x game-icon"></i>';
            return true;
        } else if (value == 'second') {
            this.__player = value;
            this.__DOM_element.innerHTML = '<i class="ph-circle game-icon"></i>';
            return true;
        } else {
            console.log(TypeError);
            return false;
        }
    }

    get elem() {
        return this.__DOM_element;
    }
}

let game = {
    __resultWindow: document.querySelector('.result-container'),
    __resultMesege: document.querySelector('.result-area span'),
    __resultText: document.querySelector('.result-area'),
    __stepCount: document.querySelector('.game-status'),
    __area: [],
    __actualyStep: 0,

    createArea() {
        this.__area = [];
        let tableStrings = document.querySelectorAll('.game-area table tr');
        for (let i = 0; i < 3; i++) {
            let td = tableStrings[i].querySelectorAll('td');
            this.__area.push([])
            for (let j = 0; j < 3; j++) {
                this.__area[i].push(new Squere(td[j]))
                this.__area[i][j].elem.addEventListener('click', this.eventFunc.bind(this, this.__area[i][j]))
            }
        }
    },

    eventFunc(target) {
        if (this.__actualyStep % 2) {
            if(!target.squereStatus('first')) return;
            this.__actualyStep++;
            this.__stepCount.innerHTML = '<i class="ph-circle"></i> players step';
        } else {
            if(!target.squereStatus('second')) return;
            this.__actualyStep++;
            this.__stepCount.innerHTML = '<i class="ph-x"></i> players step';
        }

        if (this.checkGameStatus()) this.endGame(this.__actualyStep % 2)
        if (this.__actualyStep == 9) this.endGame(Infinity);
    },

    checkGameStatus() {
        for (let i = 0; i < this.__area.length; i++) {
            if (this.__area[i][0].__player == this.__area[i][1].__player && this.__area[i][2].__player == this.__area[i][0].__player 
                && this.__area[i][0].__player && this.__area[i][1].__player && this.__area[i][2].__player  )  
                return true;            
            for (let j = 0; j < 3; j++) {
                if (this.__area[1][j].__player == this.__area[2][j].__player && this.__area[2][j].__player == this.__area[0][j].__player && 
                    this.__area[0][j].__player && this.__area[1][j].__player && this.__area[2][j].__player )
                    return true;
            }
        }

        if ((this.__area[0][0].__player == this.__area[1][1].__player && this.__area[0][0].__player == this.__area[2][2].__player) && 
        (this.__area[0][0].__player && this.__area[1][1].__player && this.__area[2][2].__player)) {
            return true;
        } 

        if ((this.__area[0][2].__player == this.__area[1][1].__player && this.__area[1][1].__player == this.__area[2][0].__player) &&
        (this.__area[1][1].__player && this.__area[0][2].__player && this.__area[2][0].__player)) {
            return true;
        }
        
        return false;
    },

    endGame(num) {
        setTimeout(() => {
            if (!isFinite(num)) {
                this.__resultMesege.textContent = 'draw!';    
            } else {
                this.__resultMesege.innerHTML = (num) ? ('<i class="ph-circle game-icon"></i><span>win</span>') : (`<i class="ph-x game-icon"></i><span>win</span>`)
            }
            this.__resultWindow.style.display = 'flex'; 
        }, 0);
        this.__area.forEach(item => {
            item.forEach(element => {
                console.log(element)
                element.elem.innerHTML = '';
                element.__player = false;
            })
        })
        this.__actualyStep = 0;

        this.__stepCount.innerHTML = '<i class="ph-circle"></i> players step';
    },
}

let click = (function() {
    let win = document.querySelector('.result-container'),
        click = win.querySelector('.close');

    click.addEventListener('click', () => {
        win.style.display = 'none';    
    })
})();

game.createArea();