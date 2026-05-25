import { Router, Request, Response } from "express";
import { Book } from "../models/Book";
import { ALL_BOOKS } from "../lib/bookCatalog";

const router = Router();

// GET all books (with search & category filter support)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, limit } = req.query;
    const queryCond: any = {};

    if (category) {
      queryCond.category = String(category);
    }

    if (search) {
      queryCond.$or = [
        { name: { $regex: String(search), $options: "i" } },
        { author: { $regex: String(search), $options: "i" } },
        { description: { $regex: String(search), $options: "i" } },
      ];
    }

    let q = Book.find(queryCond);
    if (limit) {
      q = q.limit(Number(limit));
    }

    const books = await q.exec();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET single book
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// POST create book
router.post("/", async (req: Request, res: Response) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// PUT update book
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE book
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// POST seed catalog books (seeds from bookCatalog.ts if DB is empty or force is specified)
router.post("/seed", async (req: Request, res: Response) => {
  try {
    const { force } = req.body;
    const count = await Book.countDocuments();

    if (count > 0 && !force) {
      return res.json({
        success: false,
        alreadySeeded: true,
        count,
        message: "Database already contains books. Use force: true to re-seed.",
      });
    }

    if (force) {
      await Book.deleteMany({});
      console.log("Cleared existing books collection for force re-seeding.");
    }

    // Prepare catalog books data
    // Map them to remove preset string IDs so MongoDB generates ObjectId,
    // which aligns better with typical Mongoose patterns.
    const booksToInsert = ALL_BOOKS.map((b) => {
      const { id, ...rest } = b;
      return rest;
    });

    const inserted = await Book.insertMany(booksToInsert as any[]);
    res.json({
      success: true,
      seededCount: inserted.length,
      message: `Successfully seeded ${inserted.length} publications into the MongoDB catalog!`,
    });
  } catch (error) {
    console.error("Seeding catalog failed:", error);
    res.status(500).json({ error: "Seeding catalog failed" });
  }
});

export default router;
