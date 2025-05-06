import React from "react";
import { render, screen } from "@testing-library/react";

import TimelogsCreateDialogComponent from "../TimelogsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders timelogs create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TimelogsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("timelogs-create-dialog-component")).toBeInTheDocument();
});
