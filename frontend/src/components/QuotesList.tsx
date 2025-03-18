import React from "react";
import { Grid } from "@mui/material";
import QuoteCard from "./QuoteCard";

interface Quote {
    id: number;
    author: string;
    content: string;
}

const QuotesList: React.FC<{ quotes: Quote[] }> = ({ quotes }) => {
    return (
        <Grid container spacing={2} sx={{ mt: 4 }}>
            {quotes.map((quote) => (
                <Grid item xs={12} sm={6} md={4} key={quote.id}>
                    <QuoteCard quote={quote} />
                </Grid>
            ))}
        </Grid>
    );
};

export default QuotesList;
