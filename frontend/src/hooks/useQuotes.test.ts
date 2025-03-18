import { renderHook, waitFor, act } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useQuotes } from "./useQuotes";

describe("useQuotes Hook", () => {
    let mock: MockAdapter;

    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.restore();
    });

    test("fetches tags correctly", async () => {
        mock.onGet("http://localhost:3001/v1/api/tags").reply(200, { tags: ["inspiration", "life"] });

        const { result } = renderHook(() => useQuotes());

        await waitFor(() => {
            expect(result.current.tags).toEqual(["All", "inspiration", "life"]);
        });
    });

    test("handles error when fetching tags fails", async () => {
        mock.onGet("http://localhost:3001/v1/api/tags").reply(500);

        const { result } = renderHook(() => useQuotes());

        await waitFor(() => {
            expect(result.current.error).not.toBeNull();
        });
    });

    test("fetches quotes correctly", async () => {
        const mockQuotes = [
            { id: 1, author: "Albert Einstein", content: "Imagination is more important than knowledge." },
        ];

        mock.onGet("http://localhost:3001/v1/api/quotes").reply(200, { quotes: mockQuotes });

        const { result } = renderHook(() => useQuotes());

        await act(async () => {
            await result.current.fetchQuotes();
        });

        expect(result.current.quotes).toEqual(mockQuotes);
        expect(result.current.loading).toBe(false);
    });

    test("handles error when fetching quotes fails", async () => {
        mock.onGet("http://localhost:3001/v1/api/quotes").reply(500);

        const { result } = renderHook(() => useQuotes());

        await act(async () => {
            await result.current.fetchQuotes();
        });

        await waitFor(() => {
            expect(result.current.error).not.toBeNull();
        });
    });
});
