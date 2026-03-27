const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Book = require('./models/Book');

const books = [
    {
        title: "Eloquent JavaScript, 3rd Edition",
        author: "Marijn Haverbeke",
        category: "Technology",
        description: "A modern introduction to programming. Eloquent JavaScript goes beyond the basics to teach you how to write code that's beautiful and effective.",
        price: 29.99,
        isFree: false,
        coverImage: "https://th.bing.com/th/id/OIP.ZABCCkJRtCHBW9zMKTa4SwAAAA?w=164&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        pdfUrl: "https://eloquentjavascript.net/Eloquent_JavaScript.pdf"
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Literature",
        description: "A classic of American literature, exploring themes of wealth, love, and the elusive American Dream in the Roaring Twenties.",
        price: 0,
        isFree: true,
        coverImage: "https://www.bing.com/th/id/OIP.Fpp7Z1TegGmLmB5v8WsFMQHaHa?w=204&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf"
    },
    {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "Science",
        description: "Stephen Hawking's landmark book explaining the most complex concepts of cosmology to the general public.",
        price: 15.50,
        isFree: false,
        coverImage: "https://www.bing.com/th/id/OIP.hEStWDRuV1l_kqi5UUuGeAHaJu?w=162&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.docdroid.net/GCQI1Ns/a-brief-history-of-time-pdf"
    },
    {
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Management",
        description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
        price: 19.99,
        isFree: false,
        coverImage: "https://www.bing.com/th/id/OIP.gSBoU2dQ1-EfZL4kdC5nHAHaHa?w=211&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.docdroid.net/7FVKQAM/the-lean-startup-pdf"
    },
    {
        title: "Beyond Good and Evil",
        author: "Friedrich Nietzsche",
        category: "Philosophy",
        description: "Nietzsche's profound critique of traditional Western philosophy and morality.",
        price: 0,
        isFree: true,
        coverImage: "https://www.bing.com/th/id/OIP.4u6Eot2-2bVQACfy4qqQEgAAAA?w=165&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.holybooks.com/wp-content/uploads/Beyond-Good-and-Evil-by-Friedrich-Nietzsche.pdf"
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Development",
        description: "An easy and proven way to build good habits and break bad ones. Transform your life one tiny change at a time.",
        price: 22.00,
        isFree: false,
        coverImage: "https://www.bing.com/th/id/OIP.bAR_NUW86Wv_xCd973ljAwHaFj?w=241&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.docdroid.net/h1Ob9NQ/atomic-habits-pdf"
    },
    {
        title: "Deep Learning",
        author: "Ian Goodfellow",
        category: "Technology",
        description: "The definitive textbook on Deep Learning, used by researchers and practitioners worldwide.",
        price: 45.00,
        isFree: false,
        coverImage: "https://www.bing.com/th/id/OIP.bTh3Tx-eL73qk-3S48RzPQHaKL?w=161&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.deeplearningbook.org/front_matter.pdf"
    },
    {
        title: "The Selfish Gene",
        author: "Richard Dawkins",
        category: "Science",
        description: "An incredibly influential work that shifted the focus of evolutionary biology to the gene.",
        price: 0,
        isFree: true,
        coverImage: "https://www.bing.com/th/id/OIP.yEzQgS_WwBYD1FP_UQd8eAHaLh?w=138&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.docdroid.net/1D1i4Jk/the-selfish-gene-pdf"
    },
    {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "Psychology",
        description: "A tour of the mind and an explanation of the two systems that drive the way we think.",
        price: 18.00,
        isFree: false,
        coverImage: "https://libraze.co.ke/wp-content/uploads/2024/10/Thinking-Fast-and-Slow-by-Daniel-Kahneman.png",
        pdfUrl: "https://www.docdroid.net/FmhQBDt/thinking-fast-and-slow-pdf"
    },
    {
        title: "Meditations",
        author: "Marcus Aurelius",
        category: "Philosophy",
        description: "The personal reflections of the Roman Emperor on Stoic philosophy and living a virtuous life.",
        price: 0,
        isFree: true,
        coverImage: "https://www.bing.com/th/id/OIP.nAjo1WM8ghgaTM4Mt00kXgHaKZ?w=158&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
        pdfUrl: "https://www.docdroid.net/wS0Pvlq/meditations-marcus-aurelius-pdf"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        await Book.deleteMany({});
        console.log("Cleared existing books.");

        const inserted = await Book.insertMany(books);
        console.log(`Successfully seeded ${inserted.length} volumes into the Bookflix repository!`);

        // Verify
        const count = await Book.countDocuments();
        console.log(`Verified: ${count} books in database`);

        process.exit(0);
    } catch (err) {
        console.error("Seeding Failure:", err);
        process.exit(1);
    }
};

seedDB();
