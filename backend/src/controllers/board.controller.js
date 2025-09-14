import Board from "../models/Board.js";

// @desc Create new board
// @route POST /api/boards
export const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const board = await Board.create({
      name,
      description,
      user: req.user.id, // from auth middleware
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get board by ID
// @route GET /api/boards/:id
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate(
      "user",
      "username email"
    );
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update board
// @route PUT /api/boards/:id
export const updateBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // user can update only own board
      { name, description },
      { new: true }
    );
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete board
// @route DELETE /api/boards/:id
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
