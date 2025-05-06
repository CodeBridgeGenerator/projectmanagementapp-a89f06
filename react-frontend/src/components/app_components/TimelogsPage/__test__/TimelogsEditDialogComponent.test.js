import React from "react";
import { render, screen } from "@testing-library/react";

import TimelogsEditDialogComponent from "../TimelogsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders timelogs edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <TimelogsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("timelogs-edit-dialog-component")).toBeInTheDocument();
});
