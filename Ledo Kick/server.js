const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));

const SUPABASE_URL = "https://zzguillmxjngmtedbjvt.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
    console.error("SUPABASE_KEY is missing.");
    process.exit(1);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// جلب البيانات من جدول bots
app.get("/api/data", async (req, res) => {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bots?select=*`, {
            headers: {
                apikey: sb_publishable_c92ouwkc2uJxqs9JpY9w0w_ixDmLZvT,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// حفظ البيانات
app.post("/api/save", async (req, res) => {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bots`, {
            method: "POST",
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=representation"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});