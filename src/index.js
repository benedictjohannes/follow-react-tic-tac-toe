import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Square extends React.Component {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()} style={this.props.highlightSquare}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let highlightSquare = (this.props.winningSquares && this.props.winningSquares.includes(i)) ? {color: '#f22'} : undefined
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            highlightSquare={highlightSquare}
        />;
    }



    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    highlightStyle = {fontWeight: 'bold',color:'#cc2222'}
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null), 
                change: null,
                winner: null
            }],
            xIsNext: true,
            stepNumber: 0
        }
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()

        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                change: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        

        const moves = history.map((step, move) => {
            const highlightCurrent = this.state.stepNumber === move ? this.highlightStyle : undefined
            const desc = move ?
                'Go to move ' + move :
                'Go to Game Start'
            const player = (move % 2) === 0 ? 'O' : 'X' 
            const column = Number.parseInt( step.change / 3 ) + 1
            const row = (step.change%3) + 1
            const movedesc = move ? 
                "Player " + player + " on " + column + ',' + row
                : 
                undefined
            return (
                <li key={move} style={highlightCurrent}>
                    <button onClick={() => this.jumpTo(move)} style={highlightCurrent}>
                        {desc}
                    </button>
                    <span style={ {paddingLeft: '1em'} }> {movedesc} </span> 
                </li>
            )
        })

        let status, winningSquares
        if (winner) {
            status = 'Winner: ' + winner.player
            winningSquares = winner.cause
        } else {
            if (history.length === 10) {
                status = "The Players Draw"
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
            }
        }


        return (
            <div className="game">
                <div className="game-board" >
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={winningSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                player: squares[a],
                cause: [a,b,c]
            }
        }
    }
    return null;
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
