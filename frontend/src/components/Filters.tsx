import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";

interface FiltersProps {
    count: number;
    setCount: (value: number) => void;
    selectedTag: string | null;
    setSelectedTag: (value: string) => void;
    tags: string[];
    fetchQuotes: () => void;
}

const Filters: React.FC<FiltersProps> = ({ count, setCount, selectedTag, setSelectedTag, tags, fetchQuotes }) => {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={4}>
                <TextField
                    type="number"
                    label="Number of Quotes"
                    fullWidth
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    variant="outlined"
                />
            </Grid>

            <Grid item xs={4}>
                <FormControl fullWidth>
                    <InputLabel>Filter by Tag</InputLabel>
                    <Select
                        value={selectedTag ?? "All"}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        label="Filter by Tag"
                    >
                        {tags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={4}>
                <Button variant="contained" fullWidth onClick={fetchQuotes} sx={{ height: "100%" }}>
                    Get Quotes
                </Button>
            </Grid>
        </Grid>
    );
};

export default Filters;
