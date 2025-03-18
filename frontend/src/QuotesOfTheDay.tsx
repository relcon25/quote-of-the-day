import React from "react";
import { Container, Typography, CircularProgress, Grid } from "@mui/material";
import Filters from "./components/Filters";
import QuotesList from "./components/QuotesList";
import { useQuotes } from "./hooks/useQuotes";

const QuotesOfTheDay: React.FC = () => {
    const { quotes, tags, selectedTag, setSelectedTag, count, setCount, loading, error, fetchQuotes } = useQuotes();

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Quotes of the Day
            </Typography>

            {/* Filters (Dropdown + Count Input) */}
            <Filters
                count={count}
                setCount={setCount}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                tags={tags}
                fetchQuotes={fetchQuotes}
            />

            {/* Loading Spinner */}
            {loading && (
                <Grid container justifyContent="center" sx={{ mt: 4 }}>
                    <CircularProgress />
                </Grid>
            )}

            {/* Error Message */}
            {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {/* Quotes List */}
            <QuotesList quotes={quotes} />
        </Container>
    );
};

export default QuotesOfTheDay;
