import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface Quote {
    id: number;
    author: string;
    content: string;
}

const QuoteCard: React.FC<{ quote: Quote }> = ({ quote }) => {
    return (
        <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
                <Typography variant="body1">"{quote.content}"</Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                    - {quote.author}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default QuoteCard;
