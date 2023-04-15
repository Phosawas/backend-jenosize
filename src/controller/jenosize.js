import axios, { isCancel, AxiosError } from 'axios';

export const getRestaurant = async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.query.query}&type=restaurant&key=${process.env.GOOGLE_API_KEY}`
    )
    res.json(data)
  }
  catch (err) {
    next(err)
  }
}

export const game24 = async (req, res, next) => {
  try {
  const numberInputs = getPermutations(req.query.number.split(","));
  const operations = ["+", "-", "*", "/"]
  let is24 = false
  let ansExpression = ''
  for (let i = 0; i < numberInputs.length; i++) {
    let numberInput = numberInputs[i]
    operations.forEach((firstOperation) => {
      operations.forEach((secondOperation) => {
        operations.forEach((thirdOperation) => {
          const expression = `(${numberInput[0]}${firstOperation}${numberInput[1]})${secondOperation}(${numberInput[2]}${thirdOperation}${numberInput[3]})`;
          const result = eval(expression);
          console.log(`result of ${expression} is : `, result)
          if (result === 24) {
            ansExpression = expression
            is24 = true
          }
        })
      })
    })
    if (is24) break;
  }

    if (is24) {
      return res.send(`Yes`)
    }
    else {

      return res.send('No')
    }
  }
  catch (err) {
    console.log(err)
    res.send('invalied number query')
  }
}

// Initialize game board
const board = Array(9).fill(null);

export const botXOGameMove = (req, res) => {
  const { board, player } = req.body;

  // Make sure the request contains a valid game board and player
  if (!Array.isArray(board) || board.length !== 9 || !['X', 'O'].includes(player)) {
    res.status(400).send('Invalid request body');
    return;
  }

  // Check if the game has already ended
  const winner = calculateWinner(board);
  if (winner) {
    res.status(400).send('Game has already ended');
    return;
  }

  // Calculate bot's move
  const botMove = calculateBotMove(board);
  console.log(botMove)
  if (botMove === -1) {
    // If there are no more empty cells, the game ends in a tie
    res.send({ board: board, winner: null });
  } else {
    board[botMove] = 'O';
    // Check if the game has ended after the bot's move
    const winner = calculateWinner(board);
    console.log(board)
    if (winner) {
      res.send({ board: board, winner: winner });
    } else {
      res.send({ board: board, winner: null });
    }
  }
}

// Calculate bot's move based on current board state
const calculateBotMove = (currentBoardState) => {
  // Simple algorithm to choose the first available empty cell as the bot's move
  for (let i = 0; i < currentBoardState.length; i++) {
    if (currentBoardState[i] === null) {
      return i;
    }
  }
  // If all cells are filled, return -1 to indicate a tie
  return -1;
}

const calculateWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // If there are no winners and no empty cells, the game ends in a tie
  if (board.every(cell => cell !== null)) {
    return 'Tie';
  }

  // Otherwise, the game is still in progress
  return null;
}

// Helper function to generate all permutations of an array
const getPermutations = (arr) => {
  if (arr.length === 1) {
    return [arr];
  }

  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const permutations = getPermutations(rest);
    for (let j = 0; j < permutations.length; j++) {
      result.push([arr[i], ...permutations[j]]);
    }
  }

  return result;
}
