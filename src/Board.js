import React from 'react'
import config from './config.json'
import './style.css'

export class Board extends React.Component {
    constructor(props) {
        super(props);

        const grid = []
        for (let y = 0; y < config.y; y++) {
            const rows = []
            for (let x = 0; x < config.x; x++) {
                rows[x] = Math.random() > 0.8;
            }
            grid.push(rows)
        }

        this.state = { grid }

    }

    componentDidMount() {
        setInterval(() => this.nextStep(), 120)
    }

    getXY(y, x) {
        if (x >= config.x) x = 0;
        if (x < 0) x = config.x - 1;
        if (y >= config.y) y = 0;
        if (y < 0) y = config.y - 1;
        return [y, x]
    }

    getAliveCells(grid, y, x) {
        let alive = 0;
        for (let yy = -1; yy <= 1; yy++) {
            for (let xx = -1; xx <= 1; xx++) {
                if ((xx === 0) && (yy === 0)) continue;
                const [ix, iy] = this.getXY(x + xx, y + yy)
                alive += grid[iy][ix] ? 1 : 0
            }
        }
        return alive
    }


    /*
    ** alive => 2 or 3 neighboors => alive, else dead
    ** dead => 3 neighboors => alive
    */
    getCellNewStatus(grid, y, x) {
        const currentStatus = grid[y][x];
        const aliveCells = this.getAliveCells(grid, y, x)
        if (currentStatus) {
            return ((aliveCells === 2) || (aliveCells === 3));
        }
        else {
            return (aliveCells === 3);
        }
    }

    nextStep() {
        const { grid } = this.state
        const next = []
        for (let y = 0; y < config.y; y++) {
            next[y] = []
            for (let x = 0; x < config.x; x++) {
                next[y][x] = this.getCellNewStatus(grid, y, x)
            }
        }
        this.setState({ grid: next })
        console.log('rendering')
    }

    render() {
        const { grid } = this.state
        const cells = []
        for (let y = 0; y < config.y; y++) {
            for (let x = 0; x < config.x; x++) {
                const status = grid[y][x];
                if (status) {
                    const cell = <Cell {...{ x, y, key: (x + '-' + y) }} />
                    cells.push(cell)
                }
            }
        }
        return <div className="gol-board">{cells}</div>
    }

}

const Cell = ({ x, y }) => <div className="gol-cell" style={{ top: (x * config.size) + 'px', left: (y * config.size) + 'px' }} />