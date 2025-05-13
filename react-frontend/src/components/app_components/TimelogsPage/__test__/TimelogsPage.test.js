import React from "react";
import { render, screen } from "@testing-library/react";

import TimelogsPage from "../TimelogsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders timelogs page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TimelogsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("timelogs-datatable")).toBeInTheDocument();
    expect(screen.getByRole("timelogs-add-button")).toBeInTheDocument();
});
